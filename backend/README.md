# How to setup backend locally?

You know what? It is a super easy thing! Just follow below steps one by one 😇

## Steps

**1.** Clone the repository if you havn't done it yet.

```bash
  git clone https://github.com/ShaneyWaris/PlegBloc-Anveshan
```

**2.** Open terminal and go to the backend directory.

```bash
  cd ./PlegBloc/backend
```

**3.** Make sure you have Node.js installed in your system. Now Install all the dependencies.

```bash
  npm install
```

**4.** Create a .env file in the backend folder, and include the variables mentioned in the Environment variables section.

```bash
  touch .env
```

**5.** Start the server in the backend directory.

```bash
  npm start
```

**6.** Go to the browser & paste this URL

```bash
  http://localhost:8000/
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### `PORT` : Port at which backend is running.

#### `mongodbURL` : URL for the MongoDB Atlas.

#### `ACCESS_TOKEN_SECRET` : Secret token for JWT.

#### `JWTtokenExpiryTime` : JWT token expiry time.

#### `initVector` : initial Vector for encryption algorithm.

#### `security_key` : security key for encryption algorithm.

#### `mailID` : PlegBloc email ID.

#### `mailPassword` : Email ID Password for PlegBloc.

#### `shaneyEmail` : Shaney Waris Email ID.

#### `abhinavEmail` : Abhinav Sharma Email ID.

#### `adityaEmail` : Aditya Singh Rathore Email ID.

#### `frontendBaseURL` : Base URL of frontend.

## Authors

-   Abhinav Sharma - B.Tech CSE 4th year student at IIIT Delhi
-   Aditya Singh Rathore - B.Tech CSE 4th year student at IIIT Delhi
-   Shaney Waris - B.Tech CSD 4th year student at IIIT Delhi
