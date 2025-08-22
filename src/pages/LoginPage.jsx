import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🚀 เริ่ม Login");

      // โหลดข้อมูลผู้ใช้
      const res = await fetch("http://192.168.23.32:1880/userr", { cache: "no-store" });
      if (!res.ok) throw new Error("เชื่อมต่อ API ไม่สำเร็จ");

      const users = await res.json();
      const foundUser = users.find(
        (u) => u.user === userInput && u.password === passwordInput
      );

      if (!foundUser) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      // ตั้ง cookie ให้ session อยู่ได้ 15 นาที
      const expireTime = Date.now() + 15 * 60 * 1000;
      Cookies.set("token", foundUser.id, { expires: 1 / 96 }); // 15 นาที
      Cookies.set("expireTime", expireTime.toString(), { expires: 1 / 96 });

      // ✅ บันทึก log การ login ไปที่ Express API
      const payload = {
        user: foundUser.user,
        name: foundUser.name,
        login_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      const saveLoginUrl = "http://192.168.23.32:5899/saveLogin";

      fetch(saveLoginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const text = await res.text(); // อ่าน response เป็น text ก่อน
          try {
            const data = JSON.parse(text); // แปลงเป็น JSON
            console.log("✅ บันทึก log สำเร็จ:", data);
          } catch {
            console.error("❌ Response ไม่ใช่ JSON:", text);
          }
        })
        .catch((err) => console.error("❌ บันทึก log ไม่สำเร็จ:", err));

      // ไปหน้า Dashboard
      navigate("/");
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <img
        src="http://192.168.23.32:9000/images/2025/07/24/logovenine-1.jpg"
        alt="Logo"
        className="w-48 h-auto mb-8"
      />
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">เข้าสู่ระบบ</h2>

        {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
