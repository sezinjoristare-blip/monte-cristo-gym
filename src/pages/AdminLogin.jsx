import {
  useState,
} from "react";

import {
  Navigate,
} from "react-router";

import {
  useAdminAuth,
} from "../context/AdminAuthContext";

import "./AdminLogin.css";


function AdminLogin() {
  const {
    session,
    isAdmin,
    loading,
    signIn,
  } =
    useAdminAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  if (
    !loading &&
    session &&
    isAdmin
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    setErrorMessage("");

    setSubmitting(true);


    const {
      error,
    } =
      await signIn(
        email.trim(),
        password
      );


    if (error) {
      setErrorMessage(
        "Prijava nije uspela. Proveri email, lozinku i administratorski pristup."
      );

      setSubmitting(false);

      return;
    }


    setSubmitting(false);
  }


  return (
    <main className="admin-login">
      <section className="admin-login__panel">
        <a
          className="admin-login__brand"
          href="/"
        >
          <strong>
            Monte Cristo
          </strong>

          <span>
            Gym
          </span>
        </a>


        <div className="admin-login__heading">
          <p>
            Administracija
          </p>

          <h1>
            Prijavi se.
          </h1>

          <span>
            Upravljanje sadržajem
            Monte Cristo sajta.
          </span>
        </div>


        <form
          className="admin-login__form"
          onSubmit={
            handleSubmit
          }
        >
          <label>
            <span>
              Email
            </span>

            <input
              type="email"
              value={
                email
              }
              onChange={(
                event
              ) =>
                setEmail(
                  event.target
                    .value
                )
              }
              autoComplete="email"
              required
            />
          </label>


          <label>
            <span>
              Lozinka
            </span>

            <input
              type="password"
              value={
                password
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event.target
                    .value
                )
              }
              autoComplete="current-password"
              required
            />
          </label>


          {errorMessage && (
            <p
              className="admin-login__error"
              role="alert"
            >
              {
                errorMessage
              }
            </p>
          )}


          <button
            type="submit"
            disabled={
              submitting ||
              loading
            }
          >
            {submitting
              ? "Prijava..."
              : "Uđi u admin"}

            <span
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </form>


        <a
          className="admin-login__back"
          href="/"
        >
          ← Nazad na sajt
        </a>
      </section>


      <div
        className="admin-login__visual"
        aria-hidden="true"
      >
        <span>
          MC
        </span>
      </div>
    </main>
  );
}


export default AdminLogin;