// Test setup file for mocking database
const pool = require("../src/db");

// Mock the database pool for testing
jest.mock("../src/db", () => {
  const mockQuery = jest.fn();
  return {
    query: mockQuery,
  };
});

module.exports = {
  pool,
};
