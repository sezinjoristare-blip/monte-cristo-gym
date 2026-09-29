import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import {
  useAdminAuth,
} from "../context/AdminAuthContext";


function AdminRoute() {
  const {
    session,
    isAdmin,
    loading,
  } =
    useAdminAuth();

  const location =
    useLocation();


  if (loading) {
    return (
      <div
        style={{
          display:
            "grid",

          placeItems:
            "center",

          minHeight:
            "100dvh",

          background:
            "#171716",

          color:
            "#ffffff",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          fontSize:
            "11px",

          fontWeight:
            900,

          letterSpacing:
            "0.12em",

          textTransform:
            "uppercase",
        }}
      >
        Provera pristupa...
      </div>
    );
  }


  if (
    !session ||
    !isAdmin
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }


  return <Outlet />;
}


export default AdminRoute;