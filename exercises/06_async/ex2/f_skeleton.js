/**
 * Async function that returns the value of a parameter inside a Promise
 * @param {number} value, must be a number
 * @throws an error if the parameter 'value' is not a number
 * @returns a new Promise, which resolves to the parameter value
 */
const f = async (value) => {
  if (isNaN(value)) {
    throw ('Parameter is not a number!');
  }
  return Promise.resolve(value);
}

/**
 * Async function that calls function 'f' and returns the natural logarithm of f's value
 * @param {number} value
 * @returns {Promise<number>} Promise that resolves to the natural logarithm of the value
 */
const g = async (value) => {
  try {
    const result = await f(value);
    return Math.log(result);
  } catch (error) {
    return error.message;
  }
}

/**
 * Async function that checks if the parameter is a function
 * @param {*} param the value to be checked
 * @returns {Promise<boolean>} Resolved Promise with true if parameter is a function,
 * or a rejected Promise with an error message otherwise
 */
const checkIfFunction = async (param) => {
  if (typeof param === 'function') {
    return Promise.resolve(true);
  } else {
    return Promise.reject('Not a function!');
  }
}

/**
 * Function that returns a resolved Promise after a given time
 * @param {number} time
 * @returns {Promise} An empty Promise after a given time, if time is acceptable
 */
const p = (time) => {
  return new Promise((resolve, reject) => {
    if (typeof time !== 'number') {
      reject('Not a number!');
    } else if (time > 2000) {
      reject('Too long time!');
    } else {
      setTimeout(resolve, time);
    }
  });
}

exports.f = f;
exports.g = g;
exports.checkIfFunction = checkIfFunction;
exports.p = p;