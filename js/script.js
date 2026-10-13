// ---------- Navegación entre formularios ----------
const paneles = document.querySelectorAll(".panel");
const enlaces = document.querySelectorAll("#nav a");

function mostrar() {
  const id = location.hash.slice(1) || "registro";
  paneles.forEach(p => p.classList.toggle("visible", p.id === id));
  enlaces.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + id));
  document.getElementById("resultado").hidden = true;
}
window.addEventListener("hashchange", mostrar);
mostrar();

// ---------- Validación y envío ----------
const resultado = document.getElementById("resultado");

function limpiarErrores(form) {
  form.querySelectorAll(".error").forEach(e => e.remove());
  form.querySelectorAll(".invalido").forEach(e => e.classList.remove("invalido"));
}

function marcarError(campo, mensaje) {
  campo.classList.add("invalido");
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = mensaje;
  (campo.closest("label, fieldset") || campo).appendChild(span);
}

function validar(form) {
  limpiarErrores(form);
  let valido = true;
  form.querySelectorAll("input, select, textarea").forEach(campo => {
    if (campo.type === "radio" || campo.type === "checkbox") return;
    if (!campo.checkValidity()) {
      valido = false;
      marcarError(campo, campo.validationMessage);
    }
  });
  // Los radios obligatorios se revisan por grupo
  const radio = form.querySelector('input[type="radio"][required]');
  if (radio && !form.querySelector(`input[name="${radio.name}"]:checked`)) {
    valido = false;
    marcarError(radio, "Elige una opción.");
  }
  return valido;
}

document.querySelectorAll("form[data-form]").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validar(form)) return;

    const datos = {};
    new FormData(form).forEach((valor, clave) => {
      if (clave === "clave") valor = "******"; // nunca mostrar contraseñas
      datos[clave] = clave in datos ? [].concat(datos[clave], valor) : valor;
    });

    document.getElementById("resultadoTitulo").textContent =
      "Formulario «" + form.dataset.form + "» enviado";
    document.getElementById("resultadoDatos").textContent = JSON.stringify(datos, null, 2);
    resultado.hidden = false;
    form.reset();
    actualizarExtras();
  });
});

// ---------- Extras: rango de la encuesta y total del pedido ----------
const rango = document.querySelector('input[name="nota"]');
const notaOut = document.getElementById("notaOut");
const producto = document.querySelector('select[name="producto"]');
const cantidad = document.querySelector('input[name="cantidad"]');
const total = document.getElementById("total");

function actualizarExtras() {
  notaOut.textContent = rango.value;
  total.textContent = (Number(producto.value) || 0) * (Number(cantidad.value) || 0);
}
rango.addEventListener("input", actualizarExtras);
producto.addEventListener("change", actualizarExtras);
cantidad.addEventListener("input", actualizarExtras);
actualizarExtras();
