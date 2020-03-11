import React, { Fragment, useState } from "react";
import Router from "next/router";
import { css } from "@emotion/core";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  ErrorFormulario
} from "../components/ui/Formulario";

import firebase from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INITIAL = {
  nombre: "",
  email: "",
  password: ""
};

const CrearCuenta = () => {
  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleOnBlur
  } = useValidacion(STATE_INITIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/");
    } catch (error) {
      console.error("Hubo un error al crear el usuario", error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <Fragment>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Crear Cuenta
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleOnBlur}
              />
            </Campo>
            {errores.email && (
              <ErrorFormulario>{errores.email}</ErrorFormulario>
            )}
            <Campo>
              <label htmlFor="password">password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleOnBlur}
              />
            </Campo>
            {errores.password && (
              <ErrorFormulario>{errores.password}</ErrorFormulario>
            )}
            <InputSubmit type="submit" value="Crear Cuenta" />
            {error && <ErrorFormulario>{error}</ErrorFormulario>}
          </Formulario>
        </Fragment>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
