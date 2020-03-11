import React, { Fragment, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";
import { css } from "@emotion/core";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  ErrorFormulario
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";

import Error404 from "../components/layout/404";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INITIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: ""
};

const NuevoProducto = () => {
  const [error, guardarError] = useState(false);

  // state de las imagenes
  const [nombreimagen, guardarNombre] = useState("");
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState("");

  const {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleOnBlur
  } = useValidacion(STATE_INITIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  // Hook de routing
  const router = useRouter();

  // context con las operaciones CRUD de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {
    // si el usuario no está autenticado
    if (!usuario) {
      return router.push("/login");
    }

    // crear el objeto del nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    };
    // insertarlo en la base de datos
    firebase.db.collection("productos").add(producto);
    return router.push("/");
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = progreso => guardarProgreso({ progreso });

  const handleUploadError = error => {
    guardarSubiendo(error);
    console.log(error);
  };

  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        guardarUrlImagen(url);
        console.log(url);
      });
  };

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <Fragment>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                  />
                </Campo>
                {errores.nombre && (
                  <ErrorFormulario>{errores.nombre}</ErrorFormulario>
                )}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Empresa o Compañía"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                  />
                </Campo>
                {errores.empresa && (
                  <ErrorFormulario>{errores.empresa}</ErrorFormulario>
                )}
                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>
                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="URL de tu producto"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                  />
                </Campo>
                {errores.url && (
                  <ErrorFormulario>{errores.url}</ErrorFormulario>
                )}
              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                  />
                </Campo>
                {errores.descripcion && (
                  <ErrorFormulario>{errores.descripcion}</ErrorFormulario>
                )}
              </fieldset>

              <InputSubmit type="submit" value="Crear Producto" />
              {error && <ErrorFormulario>{error}</ErrorFormulario>}
            </Formulario>
          </Fragment>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
