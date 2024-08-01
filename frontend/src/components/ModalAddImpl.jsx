import React, { useState } from 'react';
import axios from 'axios';

const ModalAddImpl = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    estado: 'disponible',
    fechaAdquisicion: '',
    horarioDisponibilidad: [{ dia: 'Lunes', inicio: '00:00', fin: '00:00' }],
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...formData.horarioDisponibilidad];
    newHorarios[index][field] = value;
    setFormData({ ...formData, horarioDisponibilidad: newHorarios });
  };

  const addHorario = () => {
    setFormData({
      ...formData,
      horarioDisponibilidad: [...formData.horarioDisponibilidad, { dia: 'Lunes', inicio: '00:00', fin: '00:00' }],
    });
  };

  const removeHorario = (index) => {
    const newHorarios = formData.horarioDisponibilidad.filter((_, i) => i !== index);
    setFormData({ ...formData, horarioDisponibilidad: newHorarios });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accestkn');
      const response = await axios.post('/implementos/crear', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error('Error al agregar implemento:', error);
      setError('Error al conectar con el servidor');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Añadir Implemento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="no disponible">No disponible</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha de Adquisición:</label>
            <input type="date" name="fechaAdquisicion" value={formData.fechaAdquisicion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Horarios de Disponibilidad:</label>
            {formData.horarioDisponibilidad.map((horario, index) => (
              <div key={index} className="horario-group">
                <select name="dia" value={horario.dia} onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                </select>
                <input type="time" name="inicio" value={horario.inicio} onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)} />
                <input type="time" name="fin" value={horario.fin} onChange={(e) => handleHorarioChange(index, 'fin', e.target.value)} />
                <button type="button" onClick={() => removeHorario(index)}>Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={addHorario}>Añadir horario</button>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddImpl;
