import React, { useState } from 'react';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import './style.css';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '' // Añadido campo de teléfono
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      email: formData.email,
      clave: formData.password,
      telefono: formData.telefono, // Incluido el campo de teléfono
      nombre: `${formData.firstName} ${formData.lastName}`
    };

    try {
      const response = await fetch('http://localhost:3000/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        console.log('Registro exitoso');
        navigate('/');
      } else {
        console.error('Error al registrar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form">
      <Header />
      <div className="form-body">
        <div className="username">
          <label className="form__label" htmlFor="firstName">
            First Name
          </label>
          <input
            className="form__input"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>
        <div className="lastname">
          <label className="form__label" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="form__input"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>
        <div className="email">
          <label className="form__label" htmlFor="email">
            Email
          </label>
          <input
            className="form__input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        <div className="password">
          <label className="form__label" htmlFor="password">
            Password
          </label>
          <input
            className="form__input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>
        <div className="confirm-password">
          <label className="form__label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="form__input"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
        </div>
        <div className="telefono"> {/* Campo de Teléfono */}
          <label className="form__label" htmlFor="telefono">
            Teléfono
          </label>
          <input
            className="form__input"
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </div>
      </div>
      <div className="footer">
        <button type="submit" className="btn" onClick={handleSubmit}>
          Register
        </button>
      </div>
    </div>
  );
}

export default RegistrationForm;
