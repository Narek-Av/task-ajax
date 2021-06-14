const button = document.getElementById("button");
const result = document.getElementById("result");

button.addEventListener("click", getDataHandler);

function getDataHandler() {
  result.innerHTML = `<p>Loading...</p>`;

  const newUser = ajax("https://jsonplaceholder.typicode.com/posts", {
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      id: "1",
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
    }),
  });

  newUser.then(res => {
    const user = JSON.parse(res);
    result.innerHTML = `
              <p>${user.name}</p>
              <p>${user.username}</p>
              <p>${user.email}</p>
          `;
  });
  const p1 = new CustomPromise(resolve => {
    resolve("result1");
  });

  const p2 = new CustomPromise(resolve => {
    resolve("result2");
  });

  const p3 = new CustomPromise((_, reject) => {
    setTimeout(() => {
      reject(new Error("throw error"));
    }, 3000);
  });

  p3.then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });

  CustomPromise.all(p1, p2, newUser)
    .then(res => {
      console.log(res);
      return res[2];
    })
    .then(res => {
      console.log(JSON.parse(res));
    })
    .catch(err => console.log(err));
}
