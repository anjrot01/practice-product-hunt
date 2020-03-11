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
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INITIAL = {
  email: "",
  password: ""
};

const Login = () => {
  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleOnBlur
  } = useValidacion(STATE_INITIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);

      Router.push("/");
    } catch (error) {
      console.error("Hubo un error al autenticar al usuario", error.message);
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
            Iniciar Sesión
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
            <InputSubmit type="submit" value="Iniciar Sesión" />
            {error && <ErrorFormulario>{error}</ErrorFormulario>}
          </Formulario>
        </Fragment>
      </Layout>
    </div>
  );
};

export default Login;
