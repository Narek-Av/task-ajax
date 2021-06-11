function ajax(url, { type = "GET", headers = {}, data = null } = {}) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        let status = this.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(this.responseText);
        } else {
          reject(this.statusText);
        }
      }
    };

    xhttp.open(type, url, true);

    xhttp.onerror = function () {
      reject(new Error("Internet Error!"));
    };

    for (let header in headers) {
      xhttp.setRequestHeader(header, headers[header]);
    }

    xhttp.send(data);
  });
}

Promise.all = (...args) => {
  return new Promise((resolve, reject) => {
    let arr = Array.isArray(...args) ? Array.from(...args) : args;
    let count = arr.length;
    let results = [];

    arr.map((item, i) => {
      Promise.resolve(item)
        .then(res => {
          results[i] = res;
          if (--count === 0) resolve(results);
        })
        .catch(err => reject(err));
    });
  });
};
