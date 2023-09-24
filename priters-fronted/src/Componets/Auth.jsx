import React, { useState } from "react";
import Header from './header'; 
import { useNavigate, Link } from 'react-router-dom';
import Printers from './Printers';

export default function AuthForm(props) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "clave") {
        setClave(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          clave
        })
      });

      if (response.ok) {
        const token = await response.text(); // Obtén el token como texto
        console.log('Login successful!', token);

        // Almacena el token en el almacenamiento local del navegador
        localStorage.setItem('token', token);

        // Redirige a la página de impresoras
        navigate('/printers');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Inicio de sesión</h3>
            <div className="form-group mt-3">
              <label>Correo</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-control mt-1"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mt-3">
              <label>clave</label>
              <input
                type="password"
                name="clave"
                value={clave}
                onChange={handleChange}
                className="form-control mt-1"
                placeholder="Enter password"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <Link to="/registro" className="btn btn-link">Registrarse</Link>
            </div>
            <p className="forgot-password text-right mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
