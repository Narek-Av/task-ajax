class CustomPromise {
  state = {
    status: "pending",
    reason: undefined,
    value: undefined,
    thenQueue: [],
  };

  constructor(executor) {
    try {
      executor(this.onFulfilled.bind(this), this.onRejected.bind(this));
    } catch (error) {
      this.onRejected(error);
    }
  }

  onFulfilled(value) {
    if (this.state.status === "pending") {
      this.state.status = "fulfilled";
      this.state.value = value;
      this.propagateFulfilled();
    }
  }

  onRejected(reason) {
    if (this.state.status === "pending") {
      this.state.status = "rejected";
      this.state.reason = reason;
      this.propagateRejected();
    }
  }

  then(fulfilledFn, catchFn) {
    const controlledPromise = new CustomPromise(() => {});
    this.state.thenQueue.push([controlledPromise, fulfilledFn, catchFn]);

    if (this.state.status === "fulfilled") {
      this.propagateFulfilled();
    } else if (this.state.status === "rejected") {
      this.propagateRejected();
    }

    return controlledPromise;
  }

  catch(catchFn) {
    return this.then(undefined, catchFn);
  }

  propagateFulfilled() {
    this.state.thenQueue.forEach(([controlledPromise, fulfilledFn]) => {
      if (typeof fulfilledFn === "function") {
        let valueOrPromise;

        if (this.state.value instanceof CustomPromise) {
          this.state.value
            .then(res => {
              valueOrPromise = fulfilledFn(res);
            })
            .catch(err => {
              return controlledPromise.onRejected(err);
            });
        } else {
          valueOrPromise = fulfilledFn(this.state.value);
        }

        if (valueOrPromise instanceof CustomPromise) {
          valueOrPromise.then(
            value => controlledPromise.onFulfilled(value),
            reason => controlledPromise.onRejected(reason)
          );
        } else {
          controlledPromise.onFulfilled(valueOrPromise);
        }
      } else {
        return controlledPromise.onFulfilled(this.state.value);
      }
    });

    this.state.thenQueue = [];
  }

  propagateRejected() {
    this.state.thenQueue.forEach(([controlledPromise, _, catchFn]) => {
      if (typeof catchFn === "function") {
        const valueOrPromise = catchFn(this.state.reason);

        if (valueOrPromise instanceof CustomPromise) {
          valueOrPromise.then(
            value => controlledPromise.onFulfilled(value),
            reason => controlledPromise.onRejected(reason)
          );
        } else {
          controlledPromise.onFulfilled(valueOrPromise);
        }
      } else {
        return controlledPromise.onRejected(this.state.reason);
      }
    });

    this.state.thenQueue = [];
  }

  static resolve(value) {
    return new CustomPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new CustomPromise((_, reject) => reject(reason));
  }

  static all(...args) {
    return new CustomPromise((resolve, reject) => {
      let arr = Array.isArray(...args) ? Array.from(...args) : args;
      let results = [];

      arr.forEach((item, i) => {
        CustomPromise.resolve(item)
          .then(res => {
            results[i] = res;
            if (results.length === arr.length) resolve(results);
          })
          .catch(err => reject(err));
      });
    });
  }
}
