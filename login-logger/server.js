// server.js
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// Enable CORS for frontend
app.use(cors());

// Parse JSON body
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "192.168.23.32",     // 👉 แก้เป็น IP/hostname ของ DB
    user: "pos_system",          // 👉 user ของ MySQL
    password: "Es3Z3CWRLLs6BbMD", // 👉 password
    database: "nodered"     // 👉 ชื่อ database
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");
});

// Route: Save login log
app.post("/saveLogin", (req, res) => {
  const { user, name, login_time } = req.body;

  if (!user || !name || !login_time) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบ" });
  }

  const query = "INSERT INTO login_logs (user, name, login_time) VALUES (?, ?, ?)";
  db.query(query, [user, name, login_time], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }
    res.json({ success: true, message: "บันทึกสำเร็จ" });
  });
});

// Route: Get login logs
app.get("/getLoginLogs", (req, res) => {
  const query = "SELECT * FROM login_logs ORDER BY login_time DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }
    res.json(results);
  });
});

// Start server
app.listen(3301, "0.0.0.0", () =>
  console.log("🚀 Server running at http://192.168.23.32:3301")
);
