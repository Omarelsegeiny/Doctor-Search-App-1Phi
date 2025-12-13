const express = require("express");
const cors = require("cors");
const searchRouter = require("./routes/search");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
app.use("/api/search", searchRouter);
