const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const db = require("./config/mongoose");
const env = require("dotenv");
const cors = require("cors");
env.config();
// const bodyParser = require("body-parser");
// const https = require("https");
// const csrf = require('csurf');


// app.use(bodyParser());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));

// Set up the view engine to EJS.
// app.set("view engine", "ejs");
// app.set("views", "./views");

// app.use(session({
//     secret: require("crypto").randomBytes(20).toString("hex"),
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false // set it true while production
//     },
// }));


app.use(express.static("./assets"));
app.use(express.json());
app.use(expressLayouts);



const corsConfig = {
    origin: true,
    credentials: true,
  };
  
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
// app.use(cors({
//     origin: [`http://localhost:3000`, `https://localhost:8000`],
//     credentials: 'true'
// }));

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// app.use(csrf({}));

// To show an error message on the UI.
function unauth401(res, message) {
    console.log("Error Message = ", message);
    return res.status(401).send(message);
    // res.render('unauth401', {
    //     message: message
    // });
};

// app.use((err, req, res, next) => {
//     if (err.code !== 'EBADCSRFTOKEN') return next(err);
//     // Handle CSRF token errors here.
//     res.status(403);
//     console.log('csrf token invalid', req.body._csrf);
//     return unauth401(res, 'Request is tampered... You might be under attack :(');
//     // return unauth401(res, "request is tampered with... u might be under attack");
// });

// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.errorFlag = false;
//     next();
// });

// Use express router
app.use("/", require("./routes"));

/* The below commented code is for http and not https */
app.listen(process.env.PORT, (err) => {
    if (err) console.log(`Error in running the server: ${err}`);
    console.log(`Server is running on port: ${process.env.PORT}`);
});