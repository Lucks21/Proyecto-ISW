import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEditImpl = ({ isOpen, onClose, implemento }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    estado: 'disponible',
    fechaAdquisicion: '',
    horarioDisponibilidad: [{ dia: 'Lunes', inicio: '00:00', fin: '00:00' }],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (implemento) {
      setFormData(implemento);
    }
  }, [implemento]);

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
      const response = await axios.put(`/implementos/${implemento._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error('Error al editar implemento:', error);
      setError('Error al conectar con el servidor');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Implemento</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </label>
          <label>
            Descripción:
            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </label>
          <label>
            Cantidad:
            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
          </label>
          <label>
            Estado:
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="no disponible">No disponible</option>
            </select>
          </label>
          <label>
            Fecha de Adquisición:
            <input type="date" name="fechaAdquisicion" value={formData.fechaAdquisicion} onChange={handleChange} required />
          </label>
          <label>
            Horarios de Disponibilidad:
            {formData.horarioDisponibilidad.map((horario, index) => (
              <div key={index}>
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
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditImpl;
