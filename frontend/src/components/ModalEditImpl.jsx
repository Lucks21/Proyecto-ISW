import React, { useState, useEffect } from 'react';
import { partialUpdateImplemento } from '../services/implementos.services';
import { toast } from 'react-toastify';
import { Modal, Box, TextField, Button, Checkbox, FormControlLabel, FormGroup, Grid, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';

const ModalEditImpl = ({ implemento, setShowModalEditar, fetchImplementos }) => {
  const [nombre, setNombre] = useState(implemento.nombre || '');
  const [descripcion, setDescripcion] = useState(implemento.descripcion || '');
  const [cantidad, setCantidad] = useState(implemento.cantidad || '');
  const [estado, setEstado] = useState(implemento.estado || '');
  const [diasDisponibilidad, setDiasDisponibilidad] = useState(implemento.horarioDisponibilidad.map(h => h.dia.toLowerCase()));
  const [horario, setHorario] = useState(implemento.horarioDisponibilidad);

  useEffect(() => {
    setHorario(implemento.horarioDisponibilidad);
  }, [implemento]);

  const handleDiaChange = (e) => {
    const { value, checked } = e.target;
    setDiasDisponibilidad(prevState =>
      checked ? [...prevState, value.toLowerCase()] : prevState.filter(dia => dia !== value.toLowerCase())
    );
  };

  const handleHorarioChange = (dia, field, value) => {
    setHorario(prevHorario => {
      const newHorario = prevHorario.map(h => 
        h.dia.toLowerCase() === dia.toLowerCase() ? { ...h, [field]: value } : h
      );
      if (!newHorario.find(h => h.dia.toLowerCase() === dia.toLowerCase())) {
        newHorario.push({ dia: dia.toLowerCase(), [field]: value });
      }
      return newHorario;
    });
  };

  const handleSubmit = async () => {
    const updatedFields = {};

    // Añadir los campos actuales si no han sido modificados
    updatedFields.nombre = nombre || implemento.nombre;
    updatedFields.descripcion = descripcion || implemento.descripcion;
    updatedFields.cantidad = cantidad || implemento.cantidad;
    updatedFields.estado = estado || implemento.estado;

    const updatedHorario = diasDisponibilidad.map(dia => {
      const diaHorario = horario.find(h => h.dia.toLowerCase() === dia.toLowerCase()) || {};
      return {
        dia,
        inicio: diaHorario.inicio || '',
        fin: diaHorario.fin || ''
      };
    });

    // Solo añadir el horario si ha sido modificado
    if (JSON.stringify(updatedHorario) !== JSON.stringify(implemento.horarioDisponibilidad)) {
      updatedFields.horarioDisponibilidad = updatedHorario;
    }

    // Validar que todos los días tengan horas de inicio y fin válidas
    const horariosValidos = updatedFields.horarioDisponibilidad
      ? updatedFields.horarioDisponibilidad.every(h => h.inicio && h.fin)
      : true;

    if (!horariosValidos) {
      toast.error('Por favor, asegúrese de que todos los días tengan horas de inicio y fin válidas');
      return;
    }

    try {
      const response = await partialUpdateImplemento(implemento._id, updatedFields);
      console.log('Respuesta del servidor:', response.data);
      fetchImplementos();
      setShowModalEditar(false);
      toast.success('Implemento actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar implemento:', error.response.data.message);
      toast.error(`Error al actualizar implemento: ${error.response.data.message}`);
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => setShowModalEditar(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Editar Implemento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="no disponible">No Disponible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Días de Disponibilidad:</Typography>
            <FormGroup row>
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
                <FormControlLabel
                  key={dia}
                  control={
                    <Checkbox
                      value={dia}
                      checked={diasDisponibilidad.includes(dia)}
                      onChange={handleDiaChange}
                    />
                  }
                  label={dia.charAt(0).toUpperCase() + dia.slice(1)}
                />
              ))}
            </FormGroup>
          </Grid>
          {diasDisponibilidad.map(dia => (
            <Grid container spacing={2} key={dia}>
              <Grid item xs={6}>
                <TextField
                  label={`${dia.charAt(0).toUpperCase() + dia.slice(1)} - Inicio`}
                  type="time"
                  fullWidth
                  value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.inicio || ''}
                  onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 3600, // 1 hora
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={`${dia.charAt(0).toUpperCase() + dia.slice(1)} - Fin`}
                  type="time"
                  fullWidth
                  value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.fin || ''}
                  onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 3600, // 1 hora
                  }}
                />
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Guardar</Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowModalEditar(false)} style={{ marginLeft: 10 }}>Cancelar</Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default ModalEditImpl;
