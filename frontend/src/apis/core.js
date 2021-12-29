import axios from "axios";

async function signup(name, username, email, phone, password) {
  const data = {
    name: name,
    username: username,
    email: email,
    phone: phone,
    password: password,
  };
  // sending POST request.
  await axios
    .post("http://localhost:8000/signup", data, { withCredentials: true })
    .then((response) => {
      console.log("line 15", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      alert("Error fetching data: ", error);
    })
    .finally(() => {
      console.log("Done");
    });
}

function signin(email, password) {
  const data = {
    email: email,
    password: password,
  };
  // sending POST request.
  axios
    .post("http://localhost:8000/signin", data, { withCredentials: true })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      alert(error);
    })
    .finally(() => {
      console.log("Done");
    });
}

export { signup, signin };
