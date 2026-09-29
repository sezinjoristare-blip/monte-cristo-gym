import {
  useEffect,
  useMemo,
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
  ABOUT_DETAIL_ID,
  getGymDetail,
} from "../../data/gymDetails";

import "./About.css";


const fallbackFacts = [
  {
    number:
      "01",

    title:
      "Svetao prostor",

    text:
      "Veliki prozori i prirodno svetlo daju prostoru otvoren i prijatan karakter.",
  },

  {
    number:
      "02",

    title:
      "Pogled na terene",

    text:
      "Teretana se nalazi uz sportski kompleks i gleda direktno ka teniskim terenima.",
  },

  {
    number:
      "03",

    title:
      "Za različite ciljeve",

    text:
      "Fitnes, kardio, pilates, zatezanje, mršavljenje i rad na mišićnoj masi.",
  },

  {
    number:
      "04",

    title:
      "Stručna podrška",

    text:
      "Licencirani treneri dostupni su članovima kojima je potrebna dodatna pomoć.",
  },
];


const fallbackAbout = {
  source:
    "fallback",

  eyebrow:
    "Monte Cristo",

  title:
    "Mesto na koje želiš da se vratiš.",

  lead:
    "Dobar trening nije samo spisak vežbi. Važni su prostor, atmosfera, kontinuitet i osećaj da možeš da napreduješ svojim tempom.",

  image_url:
    "/images/hero/monte-cristo-hero.png",

  image_alt:
    "Monte Cristo teretana i pogled ka teniskim terenima",

  facts:
    fallbackFacts,

  detail_blocks:
    [],
};


const ease = [
  0.16,
  1,
  0.3,
  1,
];


function normalizeFacts(
  value
) {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  return value.map(
    (
      fact,
      index
    ) => {
      const number =
        fact.number ||
        fact.label ||
        String(
          index + 1
        ).padStart(
          2,
          "0"
        );


      return {
        number,

        label:
          number,

        title:
          fact.title ||
          "",

        text:
          fact.text ||
          "",
      };
    }
  );
}


function splitHeading(
  title
) {
  const words =
    String(
      title || ""
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (
    words.length <= 1
  ) {
    return {
      first:
        title,

      second:
        "",
    };
  }


  const splitAt =
    Math.max(
      1,
      Math.floor(
        words.length / 2
      )
    );


  return {
    first:
      words
        .slice(
          0,
          splitAt
        )
        .join(" "),

    second:
      words
        .slice(
          splitAt
        )
        .join(" "),
  };
}


function buildAboutDetail(
  about,
  facts
) {
  if (
    about.source ===
    "fallback"
  ) {
    return getGymDetail(
      ABOUT_DETAIL_ID
    );
  }


  const detailBlocks =
    Array.isArray(
      about.detail_blocks
    )
      ? [
          ...about.detail_blocks,
        ]
      : [];


  const alreadyHasFacts =
    detailBlocks.some(
      (block) =>
        block?.type ===
        "facts"
    );


  if (
    facts.length > 0 &&
    !alreadyHasFacts
  ) {
    const factsBlock = {
      type:
        "facts",

      items:
        facts.map(
          (fact) => ({
            label:
              fact.number,

            title:
              fact.title,

            text:
              fact.text,
          })
        ),
    };


    if (
      detailBlocks.length > 0
    ) {
      detailBlocks.splice(
        1,
        0,
        factsBlock
      );
    } else {
      detailBlocks.push(
        factsBlock
      );
    }
  }


  return {
    id:
      ABOUT_DETAIL_ID,

    type:
      "about",

    eyebrow:
      about.eyebrow ||
      "Monte Cristo",

    title:
      about.title ||
      "",

    summary:
      about.lead ||
      "",

    heroImage:
      about.image_url ||
      undefined,

    heroAlt:
      about.image_alt ||
      "",

    blocks:
      detailBlocks,

    cta: {
      label:
        "Kontakt",

      href:
        "#kontakt",
    },
  };
}


function About() {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    openDetail,
  } =
    useDetailReader();

  const [
    about,
    setAbout,
  ] =
    useState(
      fallbackAbout
    );


  useEffect(() => {
    let cancelled =
      false;


    async function loadAbout() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_about"
          )
          .select("*")
          .eq(
            "id",
            1
          )
          .maybeSingle();


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "O nama nije učitano iz Supabase-a:",
          error
        );

        return;
      }


      if (!data) {
        return;
      }


      setAbout({
        ...data,

        source:
          "supabase",
      });
    }


    loadAbout();


    return () => {
      cancelled =
        true;
    };
  }, []);


  const facts =
    useMemo(
      () => {
        const normalized =
          normalizeFacts(
            about.facts
          );


        return normalized.length >
          0
          ? normalized
          : fallbackFacts;
      },
      [
        about.facts,
      ]
    );


  const heading =
    useMemo(
      () =>
        splitHeading(
          about.title
        ),
      [
        about.title,
      ]
    );


  const detail =
    useMemo(
      () =>
        buildAboutDetail(
          about,
          facts
        ),
      [
        about,
        facts,
      ]
    );


  return (
    <section
      className="about"
      id="o-nama"
    >
      <div className="about__inner">
        <motion.div
          className="about__visual"
          initial={{
            opacity:
              shouldReduceMotion
                ? 1
                : 0.55,

            x:
              shouldReduceMotion
                ? 0
                : -32,

            scale:
              shouldReduceMotion
                ? 1
                : 0.985,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0.2
                : 0.82,

            ease,
          }}
        >
          <motion.img
            src={
              about.image_url ||
              "/images/hero/monte-cristo-hero.png"
            }
            alt={
              about.image_alt ||
              "Monte Cristo teretana"
            }
            initial={{
              scale:
                shouldReduceMotion
                  ? 1
                  : 1.07,
            }}
            whileInView={{
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.08,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 1.2,

              ease,
            }}
          />


          <motion.div
            className="about__visual-label"
            initial={{
              opacity:
                shouldReduceMotion
                  ? 1
                  : 0.35,

              y:
                shouldReduceMotion
                  ? 0
                  : 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.08,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.55,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.22,

              ease,
            }}
          >
            <span>
              Monte Cristo
            </span>

            <span>
              Gornji Milanovac
            </span>
          </motion.div>
        </motion.div>


        <div className="about__content">
          <motion.p
            className="about__eyebrow"
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
                0.48,

              ease,
            }}
          >
            {
              about.eyebrow ||
              "Monte Cristo"
            }
          </motion.p>


          <motion.h2
            initial={{
              opacity: 0,

              y:
                shouldReduceMotion
                  ? 0
                  : 34,
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
                  : 0.72,

              ease,
            }}
          >
            {
              heading.first
            }

            {heading.second && (
              <span>
                {
                  heading.second
                }
              </span>
            )}
          </motion.h2>


          <motion.p
            className="about__lead"
            initial={{
              opacity: 0,

              y:
                shouldReduceMotion
                  ? 0
                  : 22,
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
                  : 0.58,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.08,

              ease,
            }}
          >
            {
              about.lead
            }
          </motion.p>


          <div className="about__facts">
            {facts.map(
              (
                fact,
                index
              ) => (
                <motion.article
                  key={
                    `${fact.number}-${index}`
                  }
                  className="about-fact"
                  initial={{
                    opacity: 0,

                    x:
                      shouldReduceMotion
                        ? 0
                        : 24,
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
                        : 0.5,

                    delay:
                      shouldReduceMotion
                        ? 0
                        : index *
                          0.055,

                    ease,
                  }}
                >
                  <span>
                    {
                      fact.number
                    }
                  </span>

                  <div>
                    <h3>
                      {
                        fact.title
                      }
                    </h3>

                    <p>
                      {
                        fact.text
                      }
                    </p>
                  </div>
                </motion.article>
              )
            )}
          </div>


          <motion.button
            type="button"
            className="
              mc-button
              mc-button--primary
            "
            onClick={() =>
              openDetail(
                detail
              )
            }
            style={{
              marginTop:
                "32px",

              cursor:
                "pointer",
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -2,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale:
                      0.985,
                  }
            }
          >
            O Monte Cristu

            <span
              aria-hidden="true"
            >
              →
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}


export default About;