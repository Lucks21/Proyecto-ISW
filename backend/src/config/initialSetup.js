"use strict";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import ROLES from "../constants/roles.constants.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    const roles = ["user", "admin", "encargado", "alumno"];
    
    for (const roleName of roles) {
      const roleExists = await Role.findOne({ name: roleName });
      if (!roleExists) {
        await new Role({ name: roleName }).save();
      }
    }

    const existingRoles = await Role.find({});
  } catch (error) {
    console.error("Error creando roles:", error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    // Asegurarse de que los roles se han creado
    await createRoles();

    // Verificar y crear cada usuario individualmente
    const usersToCreate = [
      {
        username: "user",
        email: "user@email.com",
        rut: "12345678-9",
        password: "user123",
        roleName: "user"
      },
      {
        username: "admin",
        email: "admin@email.com",
        rut: "12345678-0",
        password: "admin123",
        roleName: "admin"
      },
      {
        username: "encargado",
        email: "encargado@example.com",
        rut: "22345673-1",
        password: "encargado123",
        roleName: "encargado"
      }
    ];

    for (const userData of usersToCreate) {
      const userExists = await User.findOne({ username: userData.username });
      if (!userExists) {
        const role = await Role.findOne({ name: userData.roleName });
        if (role) {
          const newUser = await User.create({
            username: userData.username,
            email: userData.email,
            rut: userData.rut,
            password: await User.encryptPassword(userData.password),
            roles: [role._id]
          });
          console.log(`Usuario '${userData.username}' creado:`, newUser);
        } else {
          console.error(`Error: Rol '${userData.roleName}' no encontrado`);
        }
      } else {
        //console.log(`* => Usuario '${userData.username}' ya existe`);
      }
    }

    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error creando usuarios:", error);
  }
}

export { createRoles, createUsers };
