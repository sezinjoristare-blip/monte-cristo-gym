import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router";

import {
  useAdminAuth,
} from "../context/AdminAuthContext";

import "./AdminLayout.css";


const adminLinks = [
  {
    to:
      "/admin",
    label:
      "Pregled",
    end:
      true,
  },

  {
    to:
      "/admin/clanarine",
    label:
      "Članarine",
  },

  {
    to:
      "/admin/programi",
    label:
      "Programi",
  },

  {
    to:
      "/admin/treneri",
    label:
      "Treneri",
  },

  {
    to:
      "/admin/o-nama",
    label:
      "O nama",
  },

  {
    to:
      "/admin/transformacije",
    label:
      "Transformacije",
  },

  {
    to:
      "/admin/galerija",
    label:
      "Galerija",
  },

  {
    to:
      "/admin/iskustva",
    label:
      "Iskustva članova",
  },

  {
    to:
      "/admin/faq",
    label:
      "FAQ",
  },

  {
    to:
      "/admin/kontakt",
    label:
      "Kontakt",
  },
];


function AdminLayout() {
  const {
    user,
    signOut,
  } =
    useAdminAuth();

  const navigate =
    useNavigate();


  async function handleLogout() {
    const {
      error,
    } =
      await signOut();


    if (error) {
      window.alert(
        "Odjava trenutno nije uspela."
      );

      return;
    }


    navigate(
      "/admin/login",
      {
        replace:
          true,
      }
    );
  }


  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">

          {/* LOGO → ADMIN DASHBOARD */}

          <Link
            className="admin-sidebar__brand"
            to="/admin"
          >
            <strong>
              Monte Cristo
            </strong>

            <span>
              Admin
            </span>
          </Link>


          <nav
            className="admin-sidebar__nav"
            aria-label="Administracija"
          >
            {adminLinks.map(
              (
                item,
                index
              ) => (
                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  end={
                    item.end
                  }
                  className={({
                    isActive,
                  }) =>
                    [
                      "admin-sidebar__link",

                      isActive
                        ? "is-active"
                        : "",
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " "
                      )
                  }
                >
                  <span>
                    {String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {
                    item.label
                  }
                </NavLink>
              )
            )}
          </nav>
        </div>


        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__user">
            <small>
              Prijavljen kao
            </small>

            <strong>
              {
                user?.email
              }
            </strong>
          </div>


          {/* OVO I DALJE NAMERNO VODI NA JAVNI SAJT */}

          <a
            className="admin-sidebar__public"
            href="/"
          >
            Otvori sajt

            <span>
              ↗
            </span>
          </a>


          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={
              handleLogout
            }
          >
            Odjavi se
          </button>
        </div>
      </aside>


      <div className="admin-main">
        <header className="admin-topbar">
          <span>
            Monte Cristo Gym
          </span>

          <strong>
            Administracija
          </strong>
        </header>


        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default AdminLayout;