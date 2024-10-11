

/**
 *Async function that returns the value of a parameter 
 inside a Promise
 * @param {number} value, must be a number, isNaN() is useful here
 * @throws an error, if the parameter 'value' is not a number. The thrown error message must
 * be 'Parameter is not a number!'
 * @returns a new Promise, which resolves to the parameter value
 */
const f = async(value) => {
  if (isNaN(value)) {
    throw new Error('Parameter is not a number')
  }
  return Promise.resolve(value);
}

/**
 * TODO: Implement an async function 'g' that calls the previously made async function 'f'.
 * With then() function g waits for the result of f and returns the natural logarithm (Math.log()) of f's value.
 * Handle exceptions gracefully by returning the thrown error message with catch().
 * @param {number} value
 */
const g = async(value) => {
  try {
    const result = await f( value);
    return Math.log(result);
  } catch (error){
    return error.message;
  }
}

/**
 * TODO: Implement an async function 'checkIfFunction'.
 * The function checks the type of a parameter. typeof is useful here.
 * However, since we are now practicing
 * Promises, the value is returned as a "promisified" value
 * @param {*} param the value is checked to be a function
 * @returns resolved Promise with value true if parameter is a function or 
 * a rejected Promise with message "Not a function!" otherwise
 */
const checkIfFunction = async(param) => {
  if (typeof param == 'function'){
    return Promise.resolve(true);
  }else{
    return Promise.reject('Not a function')
  }
}

/**
 * TODO: Implement a function 'p' that returns a resolved Promise after a given time.
 * If time > 2000 milliseconds, the Promise must be rejected with message "Too long time!".
 * If time is not a number the Promise must be rejected with message "Not a number!".
 * @param {number} time
 * @returns {an empty Promise after a given time}, if time is acceptable
 */
const p = (time) => {
  return new Promise(resolve, reject) =>{
    if (typeof time !== 'number') {
    reject('Not a number!');
  } else if (time > 200){
    reject('Too long time!');
  } else {
    setTimeout(resolve, time);
  }
};

//TODO: verify that all functions exported below are available for tests (they should be)
exports.f = f;
exports.g = g;
exports.checkIfFunction = checkIfFunction;
exports.p = p;


// TODO: Run the tests with npm test