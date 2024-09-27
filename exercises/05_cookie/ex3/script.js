// TODO: Copy the setCookies function from the previous exercise
function setCookies() {
  
}

// TODO: Implement the getCookie function. It should take a cookie name as an argument and return the cookie value.
function getCookie(name) {

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