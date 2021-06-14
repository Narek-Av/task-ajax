function ajax(url, { type = "GET", headers = {}, data = null } = {}) {
  return new CustomPromise((resolve, reject) => {
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
