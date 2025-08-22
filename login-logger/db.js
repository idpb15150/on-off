import mysql from "mysql2";

const db = mysql.createConnection({
  host: "192.168.23.32",     // 👉 แก้เป็น IP/hostname ของ DB
  user: "pos_system",          // 👉 user ของ MySQL
  password: "Es3Z3CWRLLs6BbMD", // 👉 password
  database: "nodered"     // 👉 ชื่อ database
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");
});

export default db;
