# How to setup backend locally?

You know what? It is a super easy thing! Just follow below steps one by one :D

## Steps

**1.** Clone the repo if you havn't done it yet!

```bash
  git clone https://github.com/AbhinavS99/PlegBloc
```

**2.** Go to the backend directory.

```bash
  cd ./PlegBloc/backend
```

**3.** Make sure you have node.js installed in your system. Now Install all the dependencies:

```bash
  npm install
```

**4.** Create a .env file in the backend folder, and include the variables mentioned in the next section.

```bash
  touch .env
```

**5.** Start the server

```bash
  npm start
```

**6.** Go to the browser & paste below's URL

```bash
  http://localhost:8000/
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`ACCESS_TOKEN_SECRET`

`mongodbURL`

`JWTtokenExpiryTime`

## Authors

-   Abhinav Sharma (2018002)
-   Aditya Singh Rathore (2018007)
-   Shaney Waris (2018308)
