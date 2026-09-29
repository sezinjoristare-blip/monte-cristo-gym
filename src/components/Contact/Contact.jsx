import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabaseClient";

import "./Contact.css";


const fallbackSettings = {
  phone_relja:
    "064 2377 400",

  phone_nole:
    "060 0890 908",

  instagram_url:
    "https://www.instagram.com/teretana.montecristo/",

  map_url:
    "https://www.google.com/maps/search/?api=1&query=Monte+Cristo+teretana+Gornji+Milanovac",

  location_text:
    "Sportski kompleks / kod teniskih terena.",

  working_hours:
    "06:00 — 00:00",

  contact_heading:
    "Vidimo se na treningu.",

  contact_lead:
    "Imaš pitanje o članarini, treningu ili želiš da dogovoriš prvi dolazak? Javi se direktno.",
};


function phoneHref(
  value
) {
  return `tel:${String(
    value ??
    ""
  ).replace(
    /[^\d+]/g,
    ""
  )}`;
}


function ContactHeading({
  value,
}) {
  if (
    value ===
    "Vidimo se na treningu."
  ) {
    return (
      <>
        Vidimo se
        <span>
          na treningu.
        </span>
      </>
    );
  }


  const lines =
    String(
      value ??
      ""
    )
      .split(
        "\n"
      )
      .filter(
        Boolean
      );


  return (
    <>
      {lines.map(
        (
          line,
          index
        ) =>
          index ===
          0 ? (
            line
          ) : (
            <span
              key={
                `${line}-${index}`
              }
            >
              {line}
            </span>
          )
      )}
    </>
  );
}


function Contact() {
  const [
    settings,
    setSettings,
  ] = useState(
    fallbackSettings
  );


  useEffect(() => {
    let active =
      true;


    async function loadSettings() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_settings"
          )
          .select("*")
          .eq(
            "id",
            1
          )
          .single();


      if (
        !active ||
        error
      ) {
        if (error) {
          console.error(
            "Contact:",
            error
          );
        }

        return;
      }


      if (data) {
        setSettings(
          (
            current
          ) => ({
            ...current,
            ...data,
          })
        );
      }
    }


    loadSettings();


    return () => {
      active =
        false;
    };
  }, []);


  const reljaHref =
    useMemo(
      () =>
        phoneHref(
          settings
            .phone_relja
        ),
      [
        settings
          .phone_relja,
      ]
    );


  const noleHref =
    useMemo(
      () =>
        phoneHref(
          settings
            .phone_nole
        ),
      [
        settings
          .phone_nole,
      ]
    );


  return (
    <section
      className="contact"
      id="kontakt"
    >
      <div className="contact__inner">
        <div className="contact__content">
          <p className="contact__eyebrow">
            Kontakt
          </p>


          <h2>
            <ContactHeading
              value={
                settings
                  .contact_heading
              }
            />
          </h2>


          <p className="contact__lead">
            {
              settings
                .contact_lead
            }
          </p>


          <div className="contact__people">
            <a
              href={
                reljaHref
              }
            >
              <small>
                Relja
              </small>

              <strong>
                {
                  settings
                    .phone_relja
                }
              </strong>
            </a>


            <a
              href={
                noleHref
              }
            >
              <small>
                Nole
              </small>

              <strong>
                {
                  settings
                    .phone_nole
                }
              </strong>
            </a>
          </div>


          <div className="contact__actions">
            <a
              className="
                mc-button
                mc-button--primary
              "
              href={
                reljaHref
              }
            >
              Pozovi
            </a>


            <a
              className="contact__instagram"
              href={
                settings
                  .instagram_url
              }
              target="_blank"
              rel="noreferrer"
            >
              Instagram

              <span>
                ↗
              </span>
            </a>
          </div>
        </div>


        <div className="contact__info">
          <article>
            <span>
              01
            </span>

            <div>
              <small>
                Lokacija
              </small>

              <h3>
                Gornji Milanovac
              </h3>

              <p>
                {
                  settings
                    .location_text
                }
              </p>
            </div>
          </article>


          <article>
            <span>
              02
            </span>

            <div>
              <small>
                Radno vreme
              </small>

              <h3>
                {
                  settings
                    .working_hours
                }
              </h3>

              <p>
                Svaki dan.
              </p>
            </div>
          </article>


          <a
            className="contact__map"
            href={
              settings
                .map_url
            }
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Otvori lokaciju
            </span>

            <strong>
              ↗
            </strong>
          </a>
        </div>
      </div>
    </section>
  );
}


export default Contact;