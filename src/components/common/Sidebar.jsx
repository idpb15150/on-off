import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, LogOut } from "lucide-react";
import Cookies from "js-cookie";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
  // { name: "Users", icon: BarChart2, color: "#6366f1", href: "/users" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [visitorCount, setVisitorCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://192.168.23.32:1880/log200")
      .then(() => fetch("http://192.168.23.32:1880/count"))
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch((err) => {
        console.error("Error fetching visitor count:", err);
        setVisitorCount("ผิดพลาด");
      });
  }, []);

  // ⏳ ตรวจคุกกี้ทุกๆ 1 นาที ถ้าหมดอายุให้ logout อัตโนมัติ
  useEffect(() => {
    const interval = setInterval(() => {
      if (!Cookies.get("token")) {
        navigate("/login");
      }
    }, 60000); // 1 นาที
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-48" : "w-16"
      }`}
      animate={{ width: isSidebarOpen ? 132 : 64 }}
    >
      <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col justify-between border-r border-gray-700'>
        <div>
          <div className="flex justify-center mb-2">
            <motion.img
              src="http://192.168.23.32:9000/images/2025/07/24/logovenine-1.jpg"
              alt="Logo"
              className="rounded-full object-cover cursor-pointer shadow-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                width: isSidebarOpen ? 64 : 32,
                height: isSidebarOpen ? 64 : 32,
                transition: "width 0.3s, height 0.3s",
              }}
            />
          </div>

          <nav>
            {SIDEBAR_ITEMS.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className='flex items-center p-2 pl-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
                  initial={false}
                  animate={{ justifyContent: isSidebarOpen ? "flex-start" : "center" }}
                >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className='ml-2 whitespace-nowrap'
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className='text-gray-400 text-xs text-center p-2 border-t border-gray-700'>
            {isSidebarOpen ? (
              <span>
                👁️ ผู้เข้าชม:{" "}
                <span className='font-semibold text-green-400'>
                  {visitorCount !== null ? visitorCount : "…"}
                </span>
              </span>
            ) : (
              <span title='จำนวนผู้เข้าชม'>
                👁️ {visitorCount !== null ? visitorCount : "…"}
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className='mt-2 w-full flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors'
          >
            <LogOut size={16} />
            {isSidebarOpen && "Logout"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

