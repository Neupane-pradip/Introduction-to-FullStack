// Listen for clicks on the roll button and trigger the dice roll
document.getElementById('roll-button').addEventListener('click', () => {
  rollDice(); // Call the provided rollDice function
});

// Listen for the custom "rollDice" event
document.addEventListener('rollDice', (event) => {
  const rolledValue = event.detail.value;

  // Update the appropriate dice counter
  updateDiceCounter(rolledValue);

  // Update the roll button with the correct dice face
  updateRollButton(rolledValue);

  // Update the total roll count
  updateTotalRolls();
});

// Function to update the dice counter based on the rolled value
function updateDiceCounter(rolledValue) {
  const diceCounters = {
      1: document.querySelector('#ones p'),
      2: document.querySelector('#twos p'),
      3: document.querySelector('#threes p'),
      4: document.querySelector('#fours p'),
      5: document.querySelector('#fives p'),
      6: document.querySelector('#sixes p')
  };

  // Get the current count from the DOM and increment it
  const currentCount = parseInt(diceCounters[rolledValue].textContent) || 0;
  diceCounters[rolledValue].textContent = currentCount + 1;
}

// Function to update the roll button's face based on the rolled value
function updateRollButton(rolledValue) {
  const button = document.getElementById('roll-button');
  const template = document.getElementById(`template${rolledValue}`);
  
  // Clear the button's current content
  button.innerHTML = '';
  
  // Append the new content from the template
  const newContent = template.content.cloneNode(true);
  button.appendChild(newContent);
}

// Function to update the total number of rolls
function updateTotalRolls() {
  const totalRollsElement = document.querySelector('#totals span');
  
  // Get the current total and increment it
  const currentTotal = parseInt(totalRollsElement.textContent) || 0;
  totalRollsElement.textContent = currentTotal + 1;
}
