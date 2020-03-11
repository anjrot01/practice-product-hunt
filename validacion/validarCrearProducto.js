export default function validarCrearProducto(valores) {
  let errores = {};

  if (!valores.nombre) {
    errores.nombre = "El Nombre es Obligatorio";
  }

  if (!valores.empresa) {
    errores.empresa = "El nombre de la empresa es obligatorio";
  }

  if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL mal formateada o no Válida";
  }

  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripción de tu producto";
  }

  return errores;
}
