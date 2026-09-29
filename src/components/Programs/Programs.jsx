import {
  useEffect,
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  supabase,
} from "../../lib/supabaseClient";

import {
  useDetailReader,
} from "../DetailReader/DetailReaderContext";

import {
  getGymDetail,
  PROGRAM_DETAIL_IDS,
} from "../../data/gymDetails";

import "./Programs.css";


const fallbackPrograms = [
  {
    id:
      "fitnes",

    number:
      "01",

    title:
      "Fitnes",

    description:
      "Trening za razvoj snage, forme i opšte kondicije, prilagođen različitim nivoima iskustva.",

    source:
      "fallback",
  },

  {
    id:
      "kardio",

    number:
      "02",

    title:
      "Kardio",

    description:
      "Rad na izdržljivosti i kondiciji kroz trening koji može da se prilagodi tempu i cilju vežbača.",

    source:
      "fallback",
  },

  {
    id:
      "pilates",

    number:
      "03",

    title:
      "Pilates",

    description:
      "Kontrolisan trening usmeren na pokretljivost, stabilnost, držanje i osećaj u sopstvenom telu.",

    source:
      "fallback",
  },

  {
    id:
      "mrsavljenje",

    number:
      "04",

    title:
      "Mršavljenje",

    description:
      "Trening usmeren ka većoj potrošnji energije, boljoj kondiciji i postepenom napretku.",

    source:
      "fallback",
  },

  {
    id:
      "zatezanje",

    number:
      "05",

    title:
      "Zatezanje",

    description:
      "Rad na čvrstini, funkcionalnosti i oblikovanju tela kroz pažljivo odabrane vežbe.",

    source:
      "fallback",
  },

  {
    id:
      "misici",

    number:
      "06",

    title:
      "Izgradnja mišića",

    description:
      "Trening snage i progresivno opterećenje za one kojima je cilj razvoj mišićne mase.",

    source:
      "fallback",
  },
];


const ease = [
  0.16,
  1,
  0.3,
  1,
];


function buildProgramDetail(
  program
) {
  if (
    program.source ===
    "fallback"
  ) {
    return getGymDetail(
      PROGRAM_DETAIL_IDS[
        program.id
      ]
    );
  }


  return {
    id:
      `program-${program.slug}`,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      program.title,

    summary:
      program.detail_summary ||
      program.description ||
      "",

    blocks:
      Array.isArray(
        program.detail_blocks
      )
        ? program.detail_blocks
        : [],

    cta: {
      label:
        "Kontaktiraj nas",

      href:
        "#kontakt",
    },
  };
}


function Programs() {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    openDetail,
  } =
    useDetailReader();

  const [
    programs,
    setPrograms,
  ] =
    useState(
      fallbackPrograms
    );


  useEffect(() => {
    let cancelled =
      false;


    async function loadPrograms() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_programs"
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


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "Programi nisu učitani iz Supabase-a:",
          error
        );

        return;
      }


      setPrograms(
        (data ?? []).map(
          (
            row,
            index
          ) => ({
            ...row,

            id:
              row.slug,

            number:
              String(
                index + 1
              ).padStart(
                2,
                "0"
              ),

            source:
              "supabase",
          })
        )
      );
    }


    loadPrograms();


    return () => {
      cancelled =
        true;
    };
  }, []);


  function handleCardKeyDown(
    event,
    detail
  ) {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }


    event.preventDefault();

    openDetail(
      detail
    );
  }


  return (
    <section
      className="programs"
      id="programi"
    >
      <motion.div
        className="programs__graffiti"
        aria-hidden="true"
        initial={{
          opacity: 0.04,

          scale:
            shouldReduceMotion
              ? 1
              : 0.9,
        }}
        whileInView={{
          opacity: 0.12,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration:
            shouldReduceMotion
              ? 0.2
              : 0.9,

          ease,
        }}
      >
        <span />
        <span />
        <span />
      </motion.div>


      <div className="programs__inner">
        <header className="programs__header">
          <motion.div
            className="programs__heading"
            initial={{
              opacity: 0,

              x:
                shouldReduceMotion
                  ? 0
                  : -45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.72,

              ease,
            }}
          >
            <p className="programs__eyebrow">
              Programi
            </p>

            <h2>
              Izaberi svoj

              <span>
                način treninga.
              </span>
            </h2>
          </motion.div>


          <motion.div
            className="programs__intro"
            initial={{
              opacity: 0,

              x:
                shouldReduceMotion
                  ? 0
                  : 45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.7,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.08,

              ease,
            }}
          >
            <p>
              Različiti ciljevi traže
              različit pristup. Izaberi
              pravac koji ti najviše
              odgovara, a za dodatne
              informacije možeš da se
              obratiš trenerima.
            </p>

            <a
              href="#kontakt"
              className="programs__intro-link"
            >
              Kontaktiraj nas

              <span
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </motion.div>
        </header>


        <div className="programs__grid">
          {programs.map(
            (
              program,
              index
            ) => {
              const comesFromLeft =
                index % 2 === 0;

              const detail =
                buildProgramDetail(
                  program
                );


              return (
                <motion.article
                  className="program-card"
                  key={
                    program.id
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={
                    `Otvori detalje programa ${program.title}`
                  }
                  onClick={() =>
                    openDetail(
                      detail
                    )
                  }
                  onKeyDown={
                    (
                      event
                    ) =>
                      handleCardKeyDown(
                        event,
                        detail
                      )
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                  initial={{
                    opacity: 0.15,

                    x:
                      shouldReduceMotion
                        ? 0
                        : comesFromLeft
                          ? -32
                          : 32,

                    y:
                      shouldReduceMotion
                        ? 0
                        : 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration:
                      shouldReduceMotion
                        ? 0.2
                        : 0.6,

                    delay:
                      shouldReduceMotion
                        ? 0
                        : (index % 3) *
                          0.06,

                    ease,
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -5,
                        }
                  }
                >
                  <div className="program-card__top">
                    <span className="program-card__number">
                      {
                        program.number
                      }
                    </span>

                    <span
                      className="program-card__arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>


                  <div className="program-card__body">
                    <h3>
                      {
                        program.title
                      }
                    </h3>

                    <p>
                      {
                        program.description
                      }
                    </p>
                  </div>
                </motion.article>
              );
            }
          )}
        </div>


        <div className="programs__support">
          <motion.div
            className="programs__support-mark"
            aria-hidden="true"
            initial={{
              opacity: 0.04,

              scale:
                shouldReduceMotion
                  ? 1
                  : 0.78,

              rotate:
                shouldReduceMotion
                  ? 0
                  : -8,
            }}
            whileInView={{
              opacity: 0.12,
              scale: 1,
              rotate: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.85,

              ease,
            }}
          >
            <span />
            <span />
          </motion.div>


          <motion.div
            initial={{
              opacity: 0,

              y:
                shouldReduceMotion
                  ? 0
                  : 28,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.65,

              ease,
            }}
          >
            <p>
              Nisi siguran šta ti
              najviše odgovara?
            </p>

            <h3>
              Razgovaraj sa trenerom
              i pronađi pravi način
              treninga.
            </h3>
          </motion.div>


          <motion.a
            className="
              mc-button
              mc-button--primary
            "
            href="#kontakt"
            initial={{
              opacity: 0,

              x:
                shouldReduceMotion
                  ? 0
                  : 22,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.52,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.12,

              ease,
            }}
          >
            Kontakt

            <span
              aria-hidden="true"
            >
              →
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}


export default Programs;