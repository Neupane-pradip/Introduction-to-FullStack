// Function to count all descendant <li> elements for a given <li>
function countDescendantLis(liElement) {
  // Get all descendant <li> elements
  const descendants = liElement.getElementsByTagName('li');
  
  // If there are descendants, append the count to the li's text content
  if (descendants.length > 0) {
    // Add the count to the current <li>'s text
    liElement.firstChild.nodeValue = liElement.firstChild.nodeValue.trim() + ` (${descendants.length})`;
  }
}

// Function to traverse all <li> elements and apply the count
function addDescendantCounts() {
  // Select all <li> elements within the main <ul>
  const allListItems = document.querySelectorAll('ul li');
  
  // Iterate through each <li> and count its descendants
  allListItems.forEach(countDescendantLis);
}

// Call the function to start the counting process
addDescendantCounts();
