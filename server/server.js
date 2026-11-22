require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const userDataRoutes = require("./routes/userDataRoutes");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireUser, requireMember } = require("./middlewares/identity");
const basicAuth = require("express-basic-auth");
const User = require("./models/userModel");
const Comments = require("./models/comments");
const memoryRoutes = require("./routes/memoriesRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const pollRoutes = require("./routes/pollRoutes");
const previousYrBookRoute = require("./routes/previousYrBook")

const app = express();

const port = process.env.PORT || 5000;

// ADDING ENVIRENMENT VARIABLES
const mongodbLink = process.env.MONGODB_LINK;
const clientLink = process.env.CLIENT_LINK;

//Middlewares

app.use(
  cors({
    origin: [clientLink],
    methods: ["GET", "POST","PATCH", "UPDATE", "PUT","DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Yearbook-Request", "X-Yearbook-OTP"],
    credentials: true,
  })
);

app.use(cookieParser());

// log in development environment

const morgan = require("morgan");

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from server");
});

const adminMount = express.Router();
app.use("/admin", adminMount);
async function configureAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    adminMount.use((req,res) => res.sendStatus(503));
    return;
  }
  const [{default:AdminJS}, {buildRouter}, adapter] = await Promise.all([
    import("adminjs"), import("@adminjs/express"), import("@adminjs/mongoose")
  ]);
  AdminJS.registerAdapter(adapter);
  const admin = new AdminJS({rootPath:"/admin", resources:[User,Comments],branding:{companyName:"YearBook Portal Administration"}});

  adminMount.use((req,res,next) => {
    res.set("Cache-Control","no-store");
    if (!["GET","HEAD","OPTIONS"].includes(req.method) && req.headers.origin !== new URL(process.env.SERVER_LINK).origin) return res.sendStatus(403);
    next();
  }, basicAuth({users:{[username]:password},challenge:true}), buildRouter(admin));
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next) => {
  if (!["GET","HEAD","OPTIONS"].includes(req.method) &&
      (req.headers.origin !== clientLink || req.get("X-Yearbook-Request") !== "1")) return res.sendStatus(403);
  next();
});
// JSON identities and selectors must be scalars. The reorder contract is the only
// structured mutation besides the array of poll option labels.
app.use((req,res,next) => {
  const body = req.body || {};
  if (Array.isArray(body)) return res.sendStatus(400);
  for (const [key,value] of Object.entries(body)) {
    if (value === null) return res.sendStatus(400);
    if (typeof value !== "object") continue;
    if (key === "options" && Array.isArray(value) && value.every(v => typeof v === "string")) continue;
    if (key === "updatedOrder" && Array.isArray(value) && value.every(v =>
      v && typeof v._id === "string" && /^[a-f0-9]{24}$/i.test(v._id))) continue;
    return res.status(400).json({message:"Invalid request field"});
  }
  if (Object.values(req.query).some(v => typeof v !== "string")) return res.sendStatus(400);
  next();
});
app.use('/check', (req, res) => {
  res.send('hi');
});
app.use(authRoutes);
app.use(previousYrBookRoute);
app.use(userDataRoutes);
app.use(memoryRoutes);
app.use(requireUser, requireMember);
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
  const message = status >= 500 ? "Internal server error" : err.message;
  const data = null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

async function start() {
  await mongoose.connect(mongodbLink);
  await Promise.all([User.init(), require("./models/authModel").init()]);
  await configureAdmin();
  return app.listen(port);
}
if (require.main === module) start().catch(err => {
  console.error("Yearbook startup failed:", err.name);
  process.exit(1);
});
module.exports = {app, configureAdmin};
