/**
 * A thenable object that simulates Promise's resolve functionality.
 * It resolves with onFulfilled() and the value `👍` after a timeout of 10ms.
 */
const thenable = {
  then: function(onFulfilled) {
    setTimeout(() => {
      onFulfilled("👍");
    }, 10);
  }
};

/**
 * A rejectable object, similar to thenable above.
 * It calls onRejected with "👎".
 */
const rejectable = {
  then: function(onFulfilled, onRejected) {
    onRejected("👎");
  },
};

exports.thenable = thenable;
exports.rejectable = rejectable;