import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import FactorydetailPage from "./pages/FactorydetailPage";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {!isLoginPage && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex w-full">
                <Sidebar />
                <div className="flex flex-col w-full">
                  <Routes>
                    <Route path="/" element={<FactorydetailPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
