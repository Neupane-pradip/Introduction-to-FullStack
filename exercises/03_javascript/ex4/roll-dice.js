/**
 * DO NOT EDIT THIS FILE!
 *
 * Grader will use its own special and different version of this file
 * and your changes to this file are not used in the grading process.
 * All your code should go into the file "custom-events.js"
 */

const rollDice = () => {
    document.dispatchEvent(
        new CustomEvent('rollDice', {
        detail: { value: Math.floor(Math.random() * 6) + 1 },
        bubbles: true,
        cancelable: false
        })
    );
};