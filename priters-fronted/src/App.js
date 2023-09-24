import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Auth from "./Componets/Auth";
import RegistrationForm from "./Componets/Registro"; 
import Printers from './Componets/Printers'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/registro" element={<RegistrationForm />} />
      <Route path="/printers" element={<Printers />} />
    </Routes>
  );
}

export default App;
