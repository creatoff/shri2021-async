module.exports = function (Homework) {

  const promisify = function (f) {
    return function (...args) {
      return new Promise((resolve) => {
        const callback = function (result) {
          resolve(result);
        }
        args.push(callback);
        f.call(this, ...args);
      });
    };
  }

  const {add, less} = Homework;

  return async (array, fn, initialValue, cb) => {
    const getPromise = promisify(array.get);
    const lengthPromise = promisify(array.length);
    const reducerPromise = promisify(fn);
    const addPromise = promisify(add);
    const lessPromise = promisify(less);

    const length = await lengthPromise();

    let result = initialValue;

    for (let i = 0; await lessPromise(i, length); i = await addPromise(i, 1)) {
      const current = await getPromise(i);
      result = await reducerPromise(result, current, i, array);
    }

    cb(result);
  }
}