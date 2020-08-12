var params = new URLSearchParams(window.location.search);

var usuario = params.get("nombre");
var sala = params.get("sala");

//Referencias de JQuery
var divUsuarios = $("#divUsuarios");
var divChatbox = $("#divChatbox");
var formEnviar = $("#formEnviar");
var txtMensaje = $("#txtMensaje");

//Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
	// console.log(personas);

	var html = "";

	html += "<li>";
	html += '<a href="javascript:void(0)" class="active">';
	html += "Chat de <span> " + params.get("sala") + "</span>";
	html += "</a>";
	html += "</li>;";

	for (var i = 0; i < personas.length; i++) {
		html += "<li>";
		html += "<a data-id=" + personas[i].id + " href='javascript:void(0)'>";
		html +=
			"<img src='assets/images/users/1.jpg' alt='user-img' class='img-circle' />";
		html += "<span>";
		html += personas[i].nombre;
		html += "<small class='text-success'>online</small>";
		html += "</span>";
		html += "</a>";
		html += "</li>";
	}
	divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
	var html = "";
	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours() + ":" + fecha.getMinutes();

	if (mensaje.nombre === "Administrador") {
		html += "<li><strong>" + mensaje.mensaje + "</strong><li>";
	} else {
		if (yo) {
			html += "<li class='reverse'>";
			html += "<div class='chat-content'>";
			html += "<h5>" + mensaje.nombre + "</h5>";
			html += "<div class='box bg-light-inverse'>" + mensaje.mensaje + "</div>";
			html += "</div>";
			html += "<div class='chat-img'>";
			html += "<img src='assets/images/users/5.jpg' alt='user' />";
			html += "</div>";
			html += "<div class='chat-time'>" + hora + "</div>";
			html += "</li>";
		} else {
			html += "<li class='animated fadeIn'>";
			html += '<div class="chat-img">';
			html += '<img src="assets/images/users/1.jpg" alt="user" />';
			html += "</div>";
			html += '<div class="chat-content">';
			html += "<h5>" + mensaje.nombre + "</h5>";
			html += '<div class="box bg-light-info">';
			html += mensaje.mensaje;
			html += "</div>";
			html += "</div>";
			html += '<div class="chat-time">' + hora + "</div>";
			html += "</li>";
		}
	}
	divChatbox.append(html);
}

//Listeners
divUsuarios.on("click", "a", function () {
	var id = $(this).data("id");
	if (id) {
		console.log(id);
	}
});

formEnviar.on("submit", function (e) {
	e.preventDefault();
	if (txtMensaje.val().trim().length === 0) {
		return;
	}

	// Enviar información
	socket.emit(
		"enviarMensaje",
		{
			nombre: usuario,
			mensaje: txtMensaje.val(),
		},
		function (mensaje) {
			txtMensaje.val("").focus();
			renderizarMensajes(mensaje, true);
			scrollBottom();
		}
	);
});

function scrollBottom() {
	// selectors
	var newMessage = divChatbox.children("li:last-child");

	// heights
	var clientHeight = divChatbox.prop("clientHeight");
	var scrollTop = divChatbox.prop("scrollTop");
	var scrollHeight = divChatbox.prop("scrollHeight");
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (
		clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
		scrollHeight
	) {
		divChatbox.scrollTop(scrollHeight);
	}
}
