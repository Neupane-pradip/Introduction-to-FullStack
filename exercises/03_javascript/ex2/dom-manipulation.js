/**
 * Sort table rows alphabetically based on the values in a column
 *
 * @param {Number} col column index (zero based)
 * @param {HTMLTableElement} table the table to be sorted
 */
function sortTableByColumn(col, table) {
  // Get the table body element
  const tbody = table.querySelector('tbody');

  // Convert the rows NodeList to an array
  const rowsArray = Array.from(tbody.querySelectorAll('tr'));

  // Sort the array of rows based on the text in the specified column
  rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[col].textContent.trim();
    const cellB = rowB.cells[col].textContent.trim();

    // Use localeCompare to sort the strings
    return cellA.localeCompare(cellB);
  });

  // Remove all existing rows from tbody
  tbody.innerHTML = '';

  // Append the sorted rows back to the table body
  rowsArray.forEach(row => tbody.appendChild(row));
}

/**
 * DO NOT EDIT THE CODE BELOW!
 *
 * The code below is there just to make it easier to test the code.
 *
 * If your function works correctly you should be able to sort the table
 * simply by clicking any column heading and the table should be immediately
 * sorted by values in that column.
 */

// find the table element
const table = document.getElementById('sortable');

// attach an event listener to each th element's click event
table.querySelectorAll('thead th').forEach((th, i) =>
  th.addEventListener('click', () => {
    sortTableByColumn(i, table);
  })
);
