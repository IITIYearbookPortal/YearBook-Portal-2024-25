const express = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

// log in development environment
app.listen(port, (err) => {
  if (err) {
  } else {
  }
});
