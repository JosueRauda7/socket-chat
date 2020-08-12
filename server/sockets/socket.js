const { io } = require("../server");

const { Usuarios } = require("../classes/usuarios");
const usuarios = new Usuarios();
const { crearMensaje } = require("../utils/utilidades");

io.on("connection", (client) => {
	client.on("entrarChat", (data, callback) => {
		if (!data.nombre || !data.sala) {
			return callback({
				error: true,
				mensaje: "El nombre/sala es necesario",
			});
		}

		client.join(data.sala);

		let users = usuarios.agregarPersona(client.id, data.nombre, data.sala);

		client.broadcast
			.to(data.sala)
			.emit("listaPersona", usuarios.getPersonasPorSala(data.sala));

		client.broadcast
			.to(data.sala)
			.emit(
				"crearMensaje",
				crearMensaje("Administrador", `${data.nombre} se unió`)
			);

		callback(users);
	});

	client.on("enviarMensaje", (data, callback) => {
		let persona = usuarios.obtenerPersona(client.id);
		let mensaje = crearMensaje(persona.nombre, data.mensaje);
		client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
		callback(mensaje);
	});

	client.on("mensajePrivado", (data) => {
		let persona = usuarios.obtenerPersona(client.id);
		client.broadcast
			.to(data.to)
			.emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
	});

	client.on("disconnect", () => {
		let personaBorrada = usuarios.borrarPersona(client.id);

		client.broadcast
			.to(personaBorrada.sala)
			.emit(
				"crearMensaje",
				crearMensaje("Administrador", `${personaBorrada.nombre} salió`)
			);

		client.broadcast
			.to(personaBorrada.sala)
			.emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
	});
});
