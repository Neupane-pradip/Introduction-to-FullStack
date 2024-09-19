// Listen for the userDataReady event on the document
document.addEventListener('userDataReady', (event) => {
  // Parse the JSON data from event.detail.jsonText
  const users = JSON.parse(event.detail.jsonText);
  
  // Get the contacts div where user cards will be appended
  const contactsDiv = document.getElementById('contacts');
  
  // Get the user card template
  const template = document.getElementById('user-card-template');

  // Loop through each user and populate the template
  users.forEach(user => {
      // Clone the template content
      const clone = template.content.cloneNode(true);

      // Populate the cloned template with user data
      clone.querySelector('img').src = user.avatar;
      clone.querySelector('img').alt = `${user.firstName} ${user.lastName}`;
      clone.querySelector('h1').textContent = `${user.firstName} ${user.lastName}`;
      clone.querySelector('.email').textContent = user.email;
      clone.querySelector('.phone span').textContent = user.phoneNumber;
      clone.querySelector('.address p:nth-child(1)').textContent = user.address.streetAddress;
      clone.querySelector('.address p:nth-child(2)').textContent = `${user.address.zipCode} ${user.address.city}`;
      clone.querySelector('.address p:nth-child(3)').textContent = user.address.country;
      clone.querySelector('.homepage a').href = user.homepage;
      clone.querySelector('.homepage a').textContent = user.homepage;

      // Append the populated clone to the contacts div
      contactsDiv.appendChild(clone);
  });
});

// Call fetchUserData to initiate fetching the data
fetchUserData();
