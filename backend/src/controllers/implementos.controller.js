import implementosSchema from '../models/implementos.model.js';

// Obtener todos los implementos deportivos
export async function obtenerImplementos(req, res) {
    try {
        const implementos = await ImplementoDeportivo.find();
        res.json(implementos);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Añadir un nuevo implemento deportivo
export async function añadirImplemento(req, res) {
    const { nombre, descripcion, cantidad } = req.body;
    try {
        const nuevoImplemento = new ImplementoDeportivo({ nombre, descripcion, cantidad, disponible: true });
        await nuevoImplemento.save();
        res.status(201).json(nuevoImplemento);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Actualizar la cantidad de un implemento deportivo
export async function actualizarCantidadImplemento(req, res) {
    const { id } = req.params;
    const { cantidadAdicional } = req.body;

    if (cantidadAdicional <= 0) {
        return res.status(400).send("La cantidad adicional debe ser mayor que cero.");
    }

    try {
        const implemento = await ImplementoDeportivo.findById(id);
        if (!implemento) {
            return res.status(404).send("Implemento no encontrado.");
        }

        implemento.cantidad += cantidadAdicional;
        await implemento.save();
        res.status(200).json(implemento);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Eliminar un implemento deportivo
export async function eliminarImplemento(req, res) {
    const { id } = req.params;

    try {
        const implemento = await ImplementoDeportivo.findByIdAndDelete(id);
        if (!implemento) {
            return res.status(404).send("Implemento no encontrado.");
        }

        res.status(200).json({ message: "Implemento eliminado correctamente." });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Otras funciones para manejar otros aspectos de los implementos pueden ser añadidas aquí
