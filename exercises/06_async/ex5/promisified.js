/**
 * TODO: drawArrows uses recursion, but this time
 * with Promise, resolve() and setTimeout()
 * 
 * @param {*} actors the actors (labels on vertical lines) to be drawn
 * @param {*} timeout time for setTimeot
 * @param {*} drawArrow the callback for drawing a single array
 * @param {*} i the index of an array
 */
async function drawArrows(actors, timeout, drawArrow, i = 0) {
  // Termination condition using a conditional operator
  return i < actors.length * 2 - 2 
    ? new Promise((resolve) => {
        let sourceIndex, destIndex;
        let isForward = i < actors.length - 1; // Determine if it's a forward arrow

        if (isForward) {
          // Forward arrows
          sourceIndex = i;
          destIndex = i + 1;
        } else {
          // Return arrows (dashed lines)
          sourceIndex = actors.length + (i - (actors.length));
           // Adjust destination index for return arrows
        }

        // Determine if the arrow should be solid or dashed
        const isDashed = !isForward;

        // Call drawArrow with the appropriate parameters
        drawArrow(sourceIndex, destIndex, actors.length - 1, isDashed);

        // Use setTimeout to create a delay
        setTimeout(() => {
          resolve(drawArrows(actors, timeout, drawArrow, i + 1)); // Call the function recursively
        }, timeout);
      }) 
    : null; // Return null when done
}





/**
 * DO NOT TOUCH THIS: drawArrowSync is the utility function for sync.test.js
 * The test just checks the accuracy of drawing, this is done synchronously,
 * the functionality is just partial, do not use as a model above.
 * @param {*} actors the actors for the sequence diagram
 * @param {*} drawArrow a callback to draw an arrow
 */
const drawArrowsSync = (actors, drawArrow) => {
  actors.forEach((actor, index) => drawArrow(index, -1, actors.length - 1));
}



/**
 * DO NOT TOUCH THIS:  Draws all, both actors and arrows, this function is for a browser use.
 * Makes UML seq diagram based on actors
 * @param {*} actors 
 * @param {*} timeout 
 */
const drawAll = (actors = ["mobile client", "router", "controller", "model", "mongoDB"], timeout = 200) => {
  draw = getCanvasInBrowser();
  drawActors(actors);
  drawArrows(actors, timeout, drawArrow);
}

exports.drawArrows = drawArrows; //needed for testing, 'exports' causes "Uncaught ReferenceError: exports is not defined" that can be ignored
exports.drawArrowsSync = drawArrowsSync; //needed for testing, 'exports' causes "Uncaught ReferenceError: exports is not defined" that can be ignored