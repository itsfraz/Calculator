const display = document.getElementById('display');
let currentExpression = '';
let waitingForNumber = false;
let currentFunction = '';
let calculationHistory = [];
let isDarkTheme = false;

function calc(val) {
    try {
        switch(val) {
            case '=':
                if (currentExpression) {
                    let result;
                    if (waitingForNumber && currentFunction) {
                        let numberStr = currentExpression.substring(currentFunction.length);
                        numberStr = numberStr.replace(/[^\d.]/g, '');
                        let number = parseFloat(numberStr);
                        if (!isNaN(number)) {
                            result = applyFunction(currentFunction, number);
                        } else {
                            throw new Error('Invalid number');
                        }
                    } else {
                        result = evaluateExpression(currentExpression);
                    }
                    
                    // Add to history
                    addToHistory(currentExpression, result);
                    
                    display.value = result;
                    currentExpression = result.toString();
                    waitingForNumber = false;
                    currentFunction = '';
                }
                break;
            case 'C':
                display.value = '';
                currentExpression = '';
                waitingForNumber = false;
                currentFunction = '';
                break;
            case '←':
                currentExpression = currentExpression.slice(0, -1);
                display.value = currentExpression;
                break;
            case '%':
                if (currentExpression) {
                    let result = parseFloat(evaluateExpression(currentExpression)) / 100;
                    currentExpression = result.toString();
                    display.value = currentExpression;
                }
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'sqrt':
                currentFunction = val;
                currentExpression = val;
                waitingForNumber = true;
                display.value = currentExpression;
                break;
            case 'pi':
                currentExpression += Math.PI;
                display.value = currentExpression;
                break;
            case 'e':
                currentExpression += Math.E;
                display.value = currentExpression;
                break;
            case '^':
                if (currentExpression) {
                    currentExpression += '^';
                    display.value = currentExpression;
                }
                break;
            default:
                if (waitingForNumber && /[0-9.]/.test(val)) {
                    currentExpression += val;
                } else {
                    currentExpression += val;
                }
                display.value = currentExpression;
        }
    } catch (error) {
        console.error('Calculator error:', error);
        display.value = 'Error';
        setTimeout(() => {
            display.value = currentExpression || '';
        }, 1500);
    }
}

function applyFunction(func, number) {
    if (isNaN(number)) {
        throw new Error('Invalid number');
    }
    
    switch(func) {
        case 'sin':
            return parseFloat((Math.sin(number * Math.PI / 180)).toFixed(8));
        case 'cos':
            return parseFloat((Math.cos(number * Math.PI / 180)).toFixed(8));
        case 'tan':
            return parseFloat((Math.tan(number * Math.PI / 180)).toFixed(8));
        case 'sqrt':
            if (number < 0) {
                throw new Error('Cannot calculate square root of negative number');
            }
            return parseFloat(Math.sqrt(number).toFixed(8));
        default:
            return number;
    }
}

function evaluateExpression(expr) {
    // Check if the expression starts with a function
    if (['sin', 'cos', 'tan', 'sqrt'].some(func => expr.startsWith(func))) {
        let func = expr.match(/^(sin|cos|tan|sqrt)/)[0];
        let numberStr = expr.substring(func.length);
        numberStr = numberStr.replace(/[^\d.]/g, '');
        let number = parseFloat(numberStr);
        if (isNaN(number)) {
            throw new Error('Invalid number');
        }
        return applyFunction(func, number);
    }

    // Handle power operation
    expr = expr.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, (match, base, power) => {
        return Math.pow(parseFloat(base), parseFloat(power)).toString();
    });
    
    // Evaluate the final expression
    let result = Function('"use strict";return (' + expr + ')')();
    
    // Round to 8 decimal places to avoid floating point issues
    return parseFloat(parseFloat(result).toFixed(8));
}

// History Management
function toggleHistory() {
    const historyPanel = document.getElementById('history-panel');
    const historyBtn = document.getElementById('history-btn');
    historyPanel.classList.toggle('active');
    historyBtn.classList.toggle('active');
}

function addToHistory(expression, result) {
    calculationHistory.unshift({
        expression: expression,
        result: result
    });
    
    // Keep only last 10 calculations
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `${item.expression} = ${item.result}`;
        historyItem.onclick = () => {
            currentExpression = item.result.toString();
            display.value = currentExpression;
        };
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
}

// Theme Management
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    const themeIcon = document.querySelector('#theme-btn i');
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Handle numbers and basic operators
    if (/^[0-9+\-*/.%^]$/.test(key)) {
        event.preventDefault();
        calc(key);
    }
    // Handle special keys
    else {
        switch(key) {
            case 'Enter':
                event.preventDefault();
                calc('=');
                break;
            case 'Escape':
                event.preventDefault();
                calc('C');
                break;
            case 'Backspace':
                event.preventDefault();
                calc('←');
                break;
        }
    }
});

// Initialize
display.readOnly = true;
display.focus();
