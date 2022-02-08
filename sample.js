const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "Localhost",
  database: "project4",
  password: "rojas2382",
  port: 5432,
});

module.exports = pool;
