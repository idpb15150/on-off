import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ตั้ง interval ตรวจสอบคุกกี้ทุกๆ 1 วินาที
    const interval = setInterval(() => {
      const t = Cookies.get("token");
      if (!t) {
        clearInterval(interval);
        navigate("/login", { state: { message: "หมดเวลาล็อคอิน" } });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // ถ้าไม่มี token เลยตั้งแต่แรก → เด้งไป login
  if (!token) {
    return <Navigate to="/login" state={{ message: "กรุณาล็อกอิน" }} />;
  }

  return children;
};

export default ProtectedRoute;
