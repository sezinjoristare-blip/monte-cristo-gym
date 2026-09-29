import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import AdminRoute
  from "./components/AdminRoute";

import AdminLayout
  from "./layouts/AdminLayout";

import Home
  from "./pages/Home";

import AdminLogin
  from "./pages/AdminLogin";

import AdminDashboard
  from "./pages/AdminDashboard";

import AdminPricing
  from "./pages/AdminPricing";

import AdminPrograms
  from "./pages/AdminPrograms";

import AdminTrainers
  from "./pages/AdminTrainers";

import AdminAbout
  from "./pages/AdminAbout";

import AdminTransformations
  from "./pages/AdminTransformations";

import AdminGallery
  from "./pages/AdminGallery";

import AdminTestimonials
  from "./pages/AdminTestimonials";

import AdminFAQ
  from "./pages/AdminFAQ";

import AdminContact
  from "./pages/AdminContact";


function App() {
  return (
    <Routes>
      {/* PUBLIC */}

      <Route
        path="/"
        element={
          <Home />
        }
      />


      {/* LOGIN */}

      <Route
        path="/admin/login"
        element={
          <AdminLogin />
        }
      />


      {/* ADMIN */}

      <Route
        element={
          <AdminRoute />
        }
      >
        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        >
          <Route
            index
            element={
              <AdminDashboard />
            }
          />


          <Route
            path="clanarine"
            element={
              <AdminPricing />
            }
          />


          <Route
            path="programi"
            element={
              <AdminPrograms />
            }
          />


          <Route
            path="treneri"
            element={
              <AdminTrainers />
            }
          />


          <Route
            path="o-nama"
            element={
              <AdminAbout />
            }
          />


          <Route
            path="transformacije"
            element={
              <AdminTransformations />
            }
          />


          <Route
            path="galerija"
            element={
              <AdminGallery />
            }
          />


          <Route
            path="iskustva"
            element={
              <AdminTestimonials />
            }
          />


          <Route
            path="faq"
            element={
              <AdminFAQ />
            }
          />


          <Route
            path="kontakt"
            element={
              <AdminContact />
            }
          />
        </Route>
      </Route>


      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}


export default App;