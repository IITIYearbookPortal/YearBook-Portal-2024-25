require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const userDataRoutes = require("./routes/userDataRoutes");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const basicAuth = require("express-basic-auth");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const User = require("./models/userModel");
const Comments = require("./models/comments");
const memoryRoutes = require("./routes/memoriesRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const pollRoutes = require("./routes/pollRoutes");

// Add this middleware to use the routes


AdminBro.registerAdapter(AdminBroMongoose);

const app = express();

const port = process.env.PORT || 5000;

// ADDING ENVIRENMENT VARIABLES
mongodbLink = process.env.MONGODB_LINK;
clientLink = process.env.CLIENT_LINK;

//Middlewares

app.use(
  cors({
    origin: [clientLink],
    methods: ["GET", "POST", "UPDATE", "PUT","DELETE"],
    credentials: true,
  })
);

// Middleware function to check request origin
const checkOrigin = (req, res, next) => {
  console.log(process.env.ALLOWED_ORIGIN);
  
  const allowedOrigin = process.env.ALLOWED_ORIGIN; // Specify the allowed origin here

  const requestOrigin = req.headers.origin;
  console.log(requestOrigin);
  

  if (requestOrigin === allowedOrigin) {
      next(); // Proceed to the next middleware or route handler
  } else {
    next();
      // res.status(401).json({ error: 'Unauthorized Access' });
  }
};

app.use((req, res, next) => {
  checkOrigin(req, res, next);
})

app.use(express.json());

app.use(cookieParser());

// log in development environment

const morgan = require("morgan");
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, (err) => {
  if (err) {
  } else {
  }
});

app.use(
  session({
    secret: "your_secret_key", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect(mongodbLink)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


const AdminBroOptions = {
  resources: [User, Comments],
  branding: {
    companyName: "YearBook Portal Administration",
  },
};
const adminBro = new AdminBro(AdminBroOptions);
const adminRouter = AdminBroExpress.buildRouter(adminBro);
const adminAuth = basicAuth({
  users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
  challenge: true, // Sends authentication headers on a failed login attempt
  unauthorizedResponse: "Authentication required!", // Response on unauthorized access
});

const noStore = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  next();
};
app.use(adminBro.options.rootPath, noStore, adminAuth, adminRouter);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(userDataRoutes);
app.use(memoryRoutes);
app.use(commentRoutes);
app.use(pollRoutes);

// page not found error handling  middleware

app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "API Endpoint does not found",
  };
  next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});
