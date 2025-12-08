const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const pool = require("./db");

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM providers LIMIT 1"
    );
    res.json({ success: true, count: rows[0].cnt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const searchRouter = require("./routes/search");
app.use("/api/search", searchRouter);

app.get("/debug/providers-schema", async (req, res) => {
  try {
    const [rows] = await pool.query("DESCRIBE providers;");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
