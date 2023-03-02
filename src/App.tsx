import "./App.css";
import LateralNavbar from "./components/navbar/LateralNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./components/profile/ProfilePage";
import LogIn from "./components/login/LogIn";
import Register from "./components/login/Register";
import Home from "./components/home/Home";
import ProtectedRoute from "./components/helpers/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <LateralNavbar />
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
