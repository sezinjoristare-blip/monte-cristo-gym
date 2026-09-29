import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabaseClient";

import "./Pricing.css";


const fallbackPlans = [
  {
    id: "monthly",
    label: "Najčešći izbor",
    badge: "Preporučeno",
    title: "Mesečna članarina",
    price: "Cena uskoro",
    description:
      "Za samostalno korišćenje teretane tokom meseca.",
    features: [
      "Korišćenje teretane",
      "Kardio zona",
      "Prostor za trening snage",
    ],
    featured: true,
  },

  {
    id: "guided",
    label: "Uz stručnu podršku",
    badge: "",
    title: "Trening uz trenera",
    price: "Cena uskoro",
    description:
      "Za vežbače kojima odgovara dodatno usmeravanje i podrška.",
    features: [
      "Dogovor sa trenerom",
      "Pristup prilagođen cilju",
      "Praćenje napretka",
    ],
    featured: false,
  },

  {
    id: "pilates",
    label: "Kontrolisan trening",
    badge: "",
    title: "Pilates",
    price: "Cena uskoro",
    description:
      "Program usmeren na stabilnost, pokretljivost i kontrolu tela.",
    features: [
      "Stručna podrška",
      "Rad na pokretljivosti",
      "Prilagođen nivo treninga",
    ],
    featured: false,
  },
];


function Pricing() {
  const [
    plans,
    setPlans,
  ] = useState(
    fallbackPlans
  );


  useEffect(() => {
    let active =
      true;


    async function loadPlans() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_pricing_plans"
          )
          .select("*")
          .eq(
            "published",
            true
          )
          .order(
            "sort_order",
            {
              ascending:
                true,
            }
          );


      if (
        !active ||
        error
      ) {
        if (error) {
          console.error(
            "Pricing:",
            error
          );
        }

        return;
      }


      if (
        data &&
        data.length >
          0
      ) {
        setPlans(
          data
        );
      }
    }


    loadPlans();


    return () => {
      active =
        false;
    };
  }, []);


  return (
    <section
      className="pricing"
      id="clanarine"
    >
      <div className="pricing__inner">
        <header className="pricing__header">
          <div className="pricing__heading">
            <p className="pricing__eyebrow">
              Članarine
            </p>

            <h2>
              Izaberi način koji
              <span>
                ti odgovara.
              </span>
            </h2>
          </div>

          <p className="pricing__intro">
            Jednostavno i jasno.
            Izaberi opciju koja
            odgovara tvom tempu,
            a za detalje i tačne
            uslove kontaktiraj
            Monte Cristo tim.
          </p>
        </header>


        <div className="pricing__grid">
          {plans.map(
            (
              plan
            ) => (
              <article
                className={[
                  "pricing-card",

                  plan.featured
                    ? "pricing-card--featured"
                    : "",
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
                key={
                  plan.id
                }
              >
                <div className="pricing-card__top">
                  <span className="pricing-card__label">
                    {
                      plan.label
                    }
                  </span>

                  {plan.featured && (
                    <span className="pricing-card__badge">
                      {plan.badge ||
                        "Preporučeno"}
                    </span>
                  )}
                </div>


                <div className="pricing-card__main">
                  <h3>
                    {plan.title}
                  </h3>

                  <p className="pricing-card__price">
                    {plan.price}
                  </p>

                  <p className="pricing-card__description">
                    {
                      plan.description
                    }
                  </p>
                </div>


                <ul className="pricing-card__features">
                  {(
                    plan.features ??
                    []
                  ).map(
                    (
                      feature
                    ) => (
                      <li
                        key={
                          feature
                        }
                      >
                        <span
                          aria-hidden="true"
                        >
                          ✓
                        </span>

                        {
                          feature
                        }
                      </li>
                    )
                  )}
                </ul>


                <a
                  href="#kontakt"
                  className={[
                    "mc-button",

                    plan.featured
                      ? "mc-button--primary"
                      : "pricing-card__button",
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    )}
                >
                  Saznaj više

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </article>
            )
          )}
        </div>


        <div className="pricing__note">
          <span>
            Napomena
          </span>

          <p>
            Za aktuelne uslove
            članarine kontaktiraj
            Monte Cristo tim.
          </p>
        </div>
      </div>
    </section>
  );
}


export default Pricing;