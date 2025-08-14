        // Calculator state
        const display = document.getElementById('display');
        const expressionDisplay = document.getElementById('expression-display');
        let currentExpression = '';
        let calculationHistory = [];
        let memory = [0, 0, 0]; // 3 memory slots
        let angleMode = 'deg'; // 'deg' or 'rad'
        let isDarkTheme = true;

        // Update display
        function updateDisplay() {
            display.value = currentExpression || '0';
        }

        // Update expression display
        function updateExpression(expr) {
            expressionDisplay.textContent = expr;
        }

        // Calculate factorial
        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        // Main calculation function
        function calc(val) {
            try {
                switch(val) {
                    case '=':
                        if (currentExpression) {
                            // Save to history
                            const result = evaluateExpression(currentExpression);
                            addToHistory(currentExpression, result);
                            
                            // Update display
                            currentExpression = result.toString();
                            updateDisplay();
                            updateExpression('');
                        }
                        break;
                    case 'C':
                        currentExpression = '';
                        updateDisplay();
                        updateExpression('');
                        break;
                    case '←':
                        currentExpression = currentExpression.slice(0, -1);
                        updateDisplay();
                        break;
                    case '±':
                        if (currentExpression) {
                            if (currentExpression.startsWith('-')) {
                                currentExpression = currentExpression.substring(1);
                            } else {
                                currentExpression = '-' + currentExpression;
                            }
                            updateDisplay();
                        }
                        break;
                    case '%':
                        if (currentExpression) {
                            const result = parseFloat(currentExpression) / 100;
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case '!':
                        if (currentExpression) {
                            const num = parseFloat(currentExpression);
                            const result = factorial(num);
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case '1/x':
                        if (currentExpression) {
                            const num = parseFloat(currentExpression);
                            if (num === 0) throw new Error('Division by zero');
                            const result = 1 / num;
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case 'x²':
                        if (currentExpression) {
                            const num = parseFloat(currentExpression);
                            const result = Math.pow(num, 2);
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case 'x³':
                        if (currentExpression) {
                            const num = parseFloat(currentExpression);
                            const result = Math.pow(num, 3);
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case '√':
                        if (currentExpression) {
                            const num = parseFloat(currentExpression);
                            if (num < 0) throw new Error('Negative square root');
                            const result = Math.sqrt(num);
                            currentExpression = result.toString();
                            updateDisplay();
                        }
                        break;
                    case 'π':
                        currentExpression += Math.PI.toString();
                        updateDisplay();
                        break;
                    case 'e':
                        currentExpression += Math.E.toString();
                        updateDisplay();
                        break;
                    case '^':
                        currentExpression += '^';
                        updateDisplay();
                        break;
                    case 'log':
                        currentExpression = 'log(';
                        updateDisplay();
                        break;
                    case 'ln':
                        currentExpression = 'ln(';
                        updateDisplay();
                        break;
                    case '10^x':
                        currentExpression = '10^';
                        updateDisplay();
                        break;
                    case '2^x':
                        currentExpression = '2^';
                        updateDisplay();
                        break;
                    case 'e^x':
                        currentExpression = 'e^';
                        updateDisplay();
                        break;
                    case 'sin':
                        currentExpression = angleMode === 'deg' ? 'sin(' : 'sin(';
                        updateDisplay();
                        break;
                    case 'cos':
                        currentExpression = angleMode === 'deg' ? 'cos(' : 'cos(';
                        updateDisplay();
                        break;
                    case 'tan':
                        currentExpression = angleMode === 'deg' ? 'tan(' : 'tan(';
                        updateDisplay();
                        break;
                    case 'sinh':
                        currentExpression = 'sinh(';
                        updateDisplay();
                        break;
                    case 'cosh':
                        currentExpression = 'cosh(';
                        updateDisplay();
                        break;
                    case 'tanh':
                        currentExpression = 'tanh(';
                        updateDisplay();
                        break;
                    case 'Rand':
                        currentExpression = Math.random().toString();
                        updateDisplay();
                        break;
                    case 'Deg':
                        angleMode = 'deg';
                        document.getElementById('angle-mode').textContent = 'Deg';
                        break;
                    case 'Rad':
                        angleMode = 'rad';
                        document.getElementById('angle-mode').textContent = 'Rad';
                        break;
                    case 'mod':
                        currentExpression += ' mod ';
                        updateDisplay();
                        break;
                    default:
                        currentExpression += val;
                        updateDisplay();
                }
            } catch (error) {
                display.value = 'Error';
                setTimeout(() => {
                    currentExpression = '';
                    updateDisplay();
                }, 1500);
            }
        }

        // Evaluate expression
        function evaluateExpression(expr) {
            // Replace constants
            expr = expr.replace(/π/g, Math.PI.toString());
            expr = expr.replace(/e/g, Math.E.toString());
            
            // Handle trigonometric functions
            expr = expr.replace(/sin\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return angleMode === 'deg' ? 
                    Math.sin(val * Math.PI / 180).toString() : 
                    Math.sin(val).toString();
            });
            
            expr = expr.replace(/cos\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return angleMode === 'deg' ? 
                    Math.cos(val * Math.PI / 180).toString() : 
                    Math.cos(val).toString();
            });
            
            expr = expr.replace(/tan\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return angleMode === 'deg' ? 
                    Math.tan(val * Math.PI / 180).toString() : 
                    Math.tan(val).toString();
            });
            
            // Handle hyperbolic functions
            expr = expr.replace(/sinh\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.sinh(val).toString();
            });
            
            expr = expr.replace(/cosh\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.cosh(val).toString();
            });
            
            expr = expr.replace(/tanh\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.tanh(val).toString();
            });
            
            // Handle logarithms
            expr = expr.replace(/log\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.log10(val).toString();
            });
            
            expr = expr.replace(/ln\(([^)]+)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.log(val).toString();
            });
            
            // Handle exponents
            expr = expr.replace(/10\^([^+\-*/]+)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.pow(10, val).toString();
            });
            
            expr = expr.replace(/2\^([^+\-*/]+)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.pow(2, val).toString();
            });
            
            expr = expr.replace(/e\^([^+\-*/]+)/g, (match, p1) => {
                const val = parseFloat(p1);
                return Math.exp(val).toString();
            });
            
            // Handle power operation
            expr = expr.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, (match, base, power) => {
                return Math.pow(parseFloat(base), parseFloat(power)).toString();
            });
            
            // Handle modulus
            expr = expr.replace(/(\d+\.?\d*)\s*mod\s*(\d+\.?\d*)/g, (match, a, b) => {
                return (parseFloat(a) % parseFloat(b)).toString();
            });
            
            // Evaluate the final expression
            try {
                // Use Function constructor for safe evaluation
                const result = Function('"use strict";return (' + expr + ')')();
                return parseFloat(result.toFixed(10));
            } catch (error) {
                throw new Error('Invalid expression');
            }
        }

        // Memory operations
        function memoryOperation(op) {
            const memDisplay = document.getElementById('memory-display');
            
            switch(op) {
                case 'MC': // Memory Clear
                    memory = [0, 0, 0];
                    break;
                case 'MR': // Memory Recall
                    currentExpression = memory[0].toString();
                    updateDisplay();
                    break;
                case 'M+': // Memory Add
                    if (currentExpression) {
                        memory[0] += parseFloat(currentExpression);
                    }
                    break;
                case 'M-': // Memory Subtract
                    if (currentExpression) {
                        memory[0] -= parseFloat(currentExpression);
                    }
                    break;
                case 'MS': // Memory Store
                    if (currentExpression) {
                        memory[0] = parseFloat(currentExpression);
                    }
                    break;
                case 'M': // Memory Slot Toggle
                    // Cycle through memory slots
                    const currentMem = memory[0];
                    memory = [memory[1], memory[2], currentMem];
                    break;
            }
            
            // Update memory display
            const memItems = memDisplay.querySelectorAll('.memory-item');
            memItems.forEach((item, index) => {
                item.textContent = `M${index+1}: ${memory[index]}`;
                if (index === 0) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
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
            
            // Keep only last 20 calculations
            if (calculationHistory.length > 20) {
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
                historyItem.innerHTML = `
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">${item.result}</div>
                `;
                historyItem.onclick = () => {
                    currentExpression = item.result.toString();
                    updateDisplay();
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
            const theme = isDarkTheme ? 'dark' : 'light';
            document.body.setAttribute('data-theme', theme);
            const themeIcon = document.querySelector('#theme-btn i');
            themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Keyboard Shortcuts
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Handle numbers and basic operators
            if (/^[0-9+\-*/.%^!()eπ]$/.test(key)) {
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
                    case 'h':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            toggleHistory();
                        }
                        break;
                }
            }
        });

        // Initialize
        updateDisplay();
        updateExpression('');
        
        // Add blinking cursor effect
        setInterval(() => {
            display.classList.toggle('blink');
        }, 500);
