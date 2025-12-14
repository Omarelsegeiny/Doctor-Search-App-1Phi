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

// Routes
app.use("/api/search", searchRouter);

// Only start server if this file is run directly (not in tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
