import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";


const AdminAuthContext =
  createContext(null);


export function AdminAuthProvider({
  children,
}) {
  const [
    session,
    setSession,
  ] = useState(null);

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    authError,
    setAuthError,
  ] = useState("");


  /* =====================================================
     INITIAL SESSION + AUTH CHANGES
     ===================================================== */

  useEffect(() => {
    let active =
      true;


    async function loadSession() {
      const {
        data,
        error,
      } =
        await supabase.auth
          .getSession();


      if (!active) {
        return;
      }


      if (error) {
        setSession(null);

        setIsAdmin(false);

        setAuthError(
          "Nije moguće proveriti prijavu."
        );

        setLoading(false);

        return;
      }


      const currentSession =
        data.session ??
        null;


      setSession(
        currentSession
      );


      if (!currentSession) {
        setIsAdmin(false);

        setLoading(false);
      }
    }


    loadSession();


    const {
      data: {
        subscription,
      },
    } =
      supabase.auth
        .onAuthStateChange(
          (
            _event,
            nextSession
          ) => {
            if (!active) {
              return;
            }


            setSession(
              nextSession ??
                null
            );
          }
        );


    return () => {
      active =
        false;

      subscription.unsubscribe();
    };
  }, []);


  /* =====================================================
     ADMIN CHECK

     Ne verujemo samo tome da je korisnik
     ulogovan.

     Supabase RPC proverava da li njegov
     auth.uid() postoji u gym_admins.
     ===================================================== */

  useEffect(() => {
    let cancelled =
      false;


    async function checkAdmin() {
      if (!session) {
        setIsAdmin(false);

        setLoading(false);

        return;
      }


      setLoading(true);


      const {
        data,
        error,
      } =
        await supabase.rpc(
          "is_gym_admin"
        );


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "Admin check error:",
          error
        );

        setIsAdmin(false);

        setAuthError(
          "Nije moguće proveriti administratorski pristup."
        );

        setLoading(false);

        return;
      }


      setIsAdmin(
        data === true
      );

      setAuthError("");

      setLoading(false);
    }


    checkAdmin();


    return () => {
      cancelled =
        true;
    };
  }, [
    session,
  ]);


  /* =====================================================
     LOGIN
     ===================================================== */

  async function signIn(
    email,
    password
  ) {
    setAuthError("");

    setLoading(true);


    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
        });


    if (error) {
      setLoading(false);

      return {
        error,
      };
    }


    /*
      Login je uspeo, ali sada proveravamo
      da li je korisnik STVARNO gym admin.
    */

    const {
      data: adminResult,
      error:
        adminError,
    } =
      await supabase.rpc(
        "is_gym_admin"
      );


    if (
      adminError ||
      adminResult !== true
    ) {
      await supabase.auth
        .signOut();


      setSession(null);

      setIsAdmin(false);

      setLoading(false);


      return {
        error:
          new Error(
            "Nalog nema administratorski pristup."
          ),
      };
    }


    setSession(
      data.session
    );

    setIsAdmin(true);

    setLoading(false);


    return {
      error:
        null,
    };
  }


  /* =====================================================
     LOGOUT
     ===================================================== */

  async function signOut() {
    const {
      error,
    } =
      await supabase.auth
        .signOut();


    if (error) {
      return {
        error,
      };
    }


    setSession(null);

    setIsAdmin(false);

    setAuthError("");


    return {
      error:
        null,
    };
  }


  return (
    <AdminAuthContext.Provider
      value={{
        session,

        user:
          session?.user ??
          null,

        isAdmin,

        loading,

        authError,

        signIn,

        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}


export function useAdminAuth() {
  const context =
    useContext(
      AdminAuthContext
    );


  if (!context) {
    throw new Error(
      "useAdminAuth mora biti unutar AdminAuthProvider-a."
    );
  }


  return context;
}