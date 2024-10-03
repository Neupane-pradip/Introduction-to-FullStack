// TODO: Copy the setCookies function from the previous exercise
function setCookies() {
  const text1Value = document.getElementById('text1').value;
  const text2Value = document.getElementById('text2').value;
  const checkboxValue = document.getElementById('checkbox').checked;

  document.cookie = `text1=${text1Value}; path=/`;
  document.cookie = `text2=${text2Value}; path=/`;
  document.cookie = `checkbox=${checkboxValue}; path=/`;
}

// TODO: Implement the getCookie function. It should take a cookie name as an argument and return the cookie value.
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


// DO NOT MODIFY BELOW THIS LINE
document.getElementById('submitButton').addEventListener('click', function() {
  setCookies();
  displayCookies();
});

function displayCookies() {
  document.getElementById('text1Cookie').textContent = "Text1: " + getCookie('text1');
  document.getElementById('text2Cookie').textContent = "Text2: " + getCookie('text2');
  document.getElementById('checkboxCookie').textContent = "Checkbox: " + getCookie('checkbox');
}