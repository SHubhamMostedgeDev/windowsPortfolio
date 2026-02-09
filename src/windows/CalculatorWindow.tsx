import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

type Operation = '+' | '-' | '×' | '÷' | null;

export default function CalculatorWindow() {
    const { accentColor } = useTheme();
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<Operation>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const clearEntry = () => {
        setDisplay('0');
    };

    const toggleSign = () => {
        const value = parseFloat(display);
        setDisplay(String(-value));
    };

    const inputPercent = () => {
        const value = parseFloat(display);
        setDisplay(String(value / 100));
    };

    const performOperation = (nextOperation: Operation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue;
            let result = 0;

            switch (operation) {
                case '+':
                    result = currentValue + inputValue;
                    break;
                case '-':
                    result = currentValue - inputValue;
                    break;
                case '×':
                    result = currentValue * inputValue;
                    break;
                case '÷':
                    if (inputValue === 0) {
                        setDisplay('Cannot divide by zero');
                        setPreviousValue(null);
                        setOperation(null);
                        setWaitingForOperand(true);
                        return;
                    }
                    result = currentValue / inputValue;
                    break;
            }

            setDisplay(String(result));
            setPreviousValue(result);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = () => {
        if (operation === null || previousValue === null) return;

        const inputValue = parseFloat(display);
        let result = 0;

        switch (operation) {
            case '+':
                result = previousValue + inputValue;
                break;
            case '-':
                result = previousValue - inputValue;
                break;
            case '×':
                result = previousValue * inputValue;
                break;
            case '÷':
                if (inputValue === 0) {
                    setDisplay('Cannot divide by zero');
                    setPreviousValue(null);
                    setOperation(null);
                    setWaitingForOperand(true);
                    return;
                }
                result = previousValue / inputValue;
                break;
        }

        setDisplay(String(result));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
    };

    const buttonClass = (type: 'number' | 'operator' | 'function' | 'equals') => {
        const base = 'h-14 rounded-md text-lg font-medium transition-all active:scale-95 ';
        switch (type) {
            case 'number':
                return base + 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white';
            case 'operator':
                return base + 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white';
            case 'function':
                return base + 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200';
            case 'equals':
                return base + 'text-white';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1f1f1f] -m-4 p-4">
            {/* Display */}
            <div className="flex-shrink-0 mb-4">
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 h-5 overflow-hidden">
                    {previousValue !== null && operation && `${previousValue} ${operation}`}
                </div>
                <div className="text-right text-4xl font-light text-gray-800 dark:text-white truncate">
                    {display}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex-1 grid grid-cols-4 gap-1">
                {/* Row 1 */}
                <button onClick={inputPercent} className={buttonClass('function')}>%</button>
                <button onClick={clearEntry} className={buttonClass('function')}>CE</button>
                <button onClick={clear} className={buttonClass('function')}>C</button>
                <button onClick={() => setDisplay(display.slice(0, -1) || '0')} className={buttonClass('function')}>⌫</button>

                {/* Row 2 */}
                <button onClick={() => {
                    const val = parseFloat(display);
                    if (val === 0) { setDisplay('Cannot divide by zero'); setWaitingForOperand(true); return; }
                    setDisplay(String(1 / val));
                }} className={buttonClass('function')}>1/x</button>
                <button onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))} className={buttonClass('function')}>x²</button>
                <button onClick={() => {
                    const val = parseFloat(display);
                    if (val < 0) { setDisplay('Invalid input'); setWaitingForOperand(true); return; }
                    setDisplay(String(Math.sqrt(val)));
                }} className={buttonClass('function')}>√x</button>
                <button onClick={() => performOperation('÷')} className={buttonClass('operator')}>÷</button>

                {/* Row 3 */}
                <button onClick={() => inputDigit('7')} className={buttonClass('number')}>7</button>
                <button onClick={() => inputDigit('8')} className={buttonClass('number')}>8</button>
                <button onClick={() => inputDigit('9')} className={buttonClass('number')}>9</button>
                <button onClick={() => performOperation('×')} className={buttonClass('operator')}>×</button>

                {/* Row 4 */}
                <button onClick={() => inputDigit('4')} className={buttonClass('number')}>4</button>
                <button onClick={() => inputDigit('5')} className={buttonClass('number')}>5</button>
                <button onClick={() => inputDigit('6')} className={buttonClass('number')}>6</button>
                <button onClick={() => performOperation('-')} className={buttonClass('operator')}>−</button>

                {/* Row 5 */}
                <button onClick={() => inputDigit('1')} className={buttonClass('number')}>1</button>
                <button onClick={() => inputDigit('2')} className={buttonClass('number')}>2</button>
                <button onClick={() => inputDigit('3')} className={buttonClass('number')}>3</button>
                <button onClick={() => performOperation('+')} className={buttonClass('operator')}>+</button>

                {/* Row 6 */}
                <button onClick={toggleSign} className={buttonClass('number')}>±</button>
                <button onClick={() => inputDigit('0')} className={buttonClass('number')}>0</button>
                <button onClick={inputDecimal} className={buttonClass('number')}>.</button>
                <button
                    onClick={calculate}
                    className={buttonClass('equals')}
                    style={{ backgroundColor: accentColor.color }}
                >=</button>
            </div>
        </div>
    );
}
