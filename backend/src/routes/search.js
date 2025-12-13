const express = require("express");
const router = express.Router();
const { searchDoctors } = require("../controllers/searchController");

router.post("/", searchDoctors);

module.exports = router;
