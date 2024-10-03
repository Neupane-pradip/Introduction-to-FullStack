function setCookies() {
  // Get values from the form
  const text1Value = document.getElementById('text1').value;
  const text2Value = document.getElementById('text2').value;
  const checkboxValue = document.getElementById('checkbox').checked;

  // Set cookies for the values
  document.cookie = `text1=${text1Value}; path=/`;
  document.cookie = `text2=${text2Value}; path=/`;
  document.cookie = `checkbox=${checkboxValue}; path=/`; // true if checked, false if not
}
