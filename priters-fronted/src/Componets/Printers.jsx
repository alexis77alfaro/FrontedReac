import React, { useEffect, useState, useRef } from 'react';
import Header from './header'; 
import './style.css';
import jwtDecode from 'jwt-decode';

function PrinterUpdateForm({ printer, onSubmit }) {
  const [formData, setFormData] = useState({
    modelo: printer.modelo,
    serie: printer.serie,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="printer-form">
      <div className="form-group">
        <label htmlFor="modelo" className="form-label">Modelo:</label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="serie" className="form-label">Serie:</label>
        <input
          type="text"
          id="serie"
          name="serie"
          value={formData.serie}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      <button type="submit" className="form-btn-update">Actualizar Impresora</button>
    </form>
  );
}

function Printers() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [printersData, setPrintersData] = useState([]);
  const [formData, setFormData] = useState({
    modelo: '',
    serie: '',
    empleadoId_FK: '' 
  });

  const modeloRef = useRef(null);
  const serieRef = useRef(null);
  const [editingPrinterId, setEditingPrinterId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUserId(decodedToken.id);
    
      fetch(`http://localhost:3000/printers/employee/${decodedToken.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(response => response.json())
      .then(data => setPrintersData(data))
      .catch(error => console.error('Error:', error));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleEditPrinter = (printerId) => {
    setEditingPrinterId(printerId);
    const printerToEdit = printersData.find(printer => printer.printerId === printerId);
    setFormData({
      modelo: printerToEdit.modelo,
      serie: printerToEdit.serie,
      empleadoId_FK: printerToEdit.empleadoId_FK
    });
  };

  const handleDeletePrinter = (printerId) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta impresora?');
    if (!confirmed) {
      window.location.reload();
      return;
    }

    fetch(`http://localhost:3000/printers/delete/${printerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al eliminar la impresora');
      }
      return response.json();
    })
    .then(data => {
      console.log('Impresora eliminada:', data);
      setPrintersData(prevPrinters => prevPrinters.filter(printer => printer.printerId !== printerId));
    })
    .catch(error => console.error('Error:', error));
  }

  const handleCreatePrinter = (requestBody) => {
    fetch('http://localhost:3000/printers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Impresora registrada:', data);
      window.location.reload(); 
    })
    .catch(error => console.error('Error:', error));
  }

  const handleUpdatePrinter = (printerId, requestBody) => {
    fetch(`http://localhost:3000/printers/update/${printerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar la impresora');
      }
      return response.json();
    })
    .then(data => {
      console.log('Impresora actualizada:', data);
      // Actualiza el estado de la lista de impresoras si es necesario
    })
    .catch(error => console.error('Error:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.modelo || !formData.serie) {
      console.error('Modelo y Serie son campos obligatorios');
      return;
    }

    const serie = formData.serie.toString();

    const requestBody = {
      modelo: formData.modelo,
      serie,
      empleadoId_FK: userId
    };

    if (editingPrinterId) {
      handleUpdatePrinter(editingPrinterId, requestBody);
    } else {
      handleCreatePrinter(requestBody);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserId(null);
    setPrintersData([]);
    window.location.href = 'http://localhost:3001/'; // Redirigir al usuario
  }

  return (
    <div className="printers-container">
      <Header />
      <h1 className='printer'>Bienvenido</h1>
      <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesión</button>
      <p>UserID: {userId}</p>

      <h1 className='printer'>Impresoras Asociadas:</h1>
      
      
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Serie</th>
            <th>Empleado ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {printersData.map(printer => (
            <tr key={printer.printerId}>
              <td>{printer.printerId}</td>
              <td>{printer.modelo}</td>
              <td>{printer.serie}</td>
              <td>{printer.empleadoId_FK}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEditPrinter(printer.printerId)}>Actualizar</button>
                <button className="btn btn-danger" onClick={() => handleDeletePrinter(printer.printerId)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className='printer'>Registros Nuevo</h1>
      <form onSubmit={handleSubmit} className="printer-form">
        <div className="form-group">
          <label htmlFor="modelo" className="form-label">Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="serie" className="form-label">Serie:</label>
          <input
            type="text"
            id="serie"
            name="serie"
            value={formData.serie}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-btn">Registrar Impresora</button>
      </form>

      {editingPrinterId && (
        <PrinterUpdateForm
          printer={printersData.find(printer => printer.printerId === editingPrinterId)}
          onSubmit={(formData) => handleUpdatePrinter(editingPrinterId, formData)}
        />
      )}
    </div>
  );
}

export default Printers;
