import React from "react";
import logo from "./logo.svg";
import "./App.css";
import LateralNavbar from "./components/navbar/LateralNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import ProfilePage from "./components/profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <LateralNavbar />
      <Routes>
        <Route path="/me/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
