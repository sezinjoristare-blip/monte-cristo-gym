import {
  Link,
} from "react-router";

import "./AdminDashboard.css";


const sections = [
  {
    number: "01",
    title: "Članarine",
    text:
      "Cene, nazivi, pogodnosti i preporučeni plan.",
    to: "/admin/clanarine",
  },

  {
    number: "02",
    title: "Programi",
    text:
      "Programi treninga i sadržaj detaljnog readera.",
    to: "/admin/programi",
  },

  {
    number: "03",
    title: "Treneri",
    text:
      "Profili, fotografije, telefoni i biografije.",
    to: "/admin/treneri",
  },

  {
    number: "04",
    title: "O nama",
    text:
      "Glavni tekstovi, činjenice i detaljna priča teretane.",
    to: "/admin/o-nama",
  },

  {
    number: "05",
    title: "Transformacije",
    text:
      "PRE/POSLE fotografije i cele priče članova.",
    to: "/admin/transformacije",
  },

  {
    number: "06",
    title: "Galerija",
    text:
      "Fotografije prostora, opreme i atmosfere.",
    to: "/admin/galerija",
  },

  {
    number: "07",
    title: "Iskustva članova",
    text:
      "Citati i iskustva koja se prikazuju na sajtu.",
    to: "/admin/iskustva",
  },

  {
    number: "08",
    title: "FAQ",
    text:
      "Pitanja, odgovori i njihov redosled.",
    to: "/admin/faq",
  },

  {
    number: "09",
    title: "Kontakt",
    text:
      "Telefoni, Instagram, lokacija i radno vreme.",
    to: "/admin/kontakt",
  },
];


function AdminDashboard() {
  return (
    <section className="admin-dashboard">
      <header className="admin-page-header">
        <p>
          Kontrolna tabla
        </p>

        <h1>
          Upravljanje
          <span>
            Monte Cristom.
          </span>
        </h1>

        <div className="admin-page-header__line">
          <p>
            Ovde upravljaš sadržajem
            koji se prikazuje na
            javnom sajtu.
          </p>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Otvori javni sajt

            <span>
              ↗
            </span>
          </a>
        </div>
      </header>


      <div className="admin-dashboard__grid">
        {sections.map(
          (section) => (
            <Link
              className="admin-dashboard-card"
              to={section.to}
              key={section.to}
            >
              <div className="admin-dashboard-card__top">
                <span>
                  {section.number}
                </span>

                <strong>
                  ↗
                </strong>
              </div>

              <div>
                <h2>
                  {section.title}
                </h2>

                <p>
                  {section.text}
                </p>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}


export default AdminDashboard;