const display = document.getElementById('display');

function calc(val) {
    try {
        switch(val) {
            case '=':
                display.value = eval(display.value);
                break;
            case 'C':
                display.value = '';
                break;
            case '←':
                display.value = display.value.slice(0, -1);
                break;
            case '%':
                display.value = eval(display.value) / 100;
                break;
            default:
                display.value += val;
        }
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => display.value = '', 1000);
    }
}

// Keyboard input handling
window.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Handle numbers and basic operators
    if (/^[0-9+\-*/.%]$/.test(key)) {
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

// Make display read-only but focused
display.readOnly = true;
display.focus();
