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
  TRAINER_DETAIL_IDS,
} from "../../data/gymDetails";

import "./Trainers.css";


const fallbackTrainers = [
  {
    id:
      "relja",

    name:
      "Relja",

    role:
      "Licencirani trener",

    phone:
      "064 2377 400",

    image:
      "",

    source:
      "fallback",
  },

  {
    id:
      "nole",

    name:
      "Nole",

    role:
      "Licencirani trener",

    phone:
      "060 0890 908",

    image:
      "",

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


function phoneHref(
  phone
) {
  return String(
    phone || ""
  ).replace(
    /[^\d+]/g,
    ""
  );
}


function buildTrainerDetail(
  trainer
) {
  if (
    trainer.source ===
    "fallback"
  ) {
    return getGymDetail(
      TRAINER_DETAIL_IDS[
        trainer.id
      ]
    );
  }


  const detail = {
    id:
      `trainer-${trainer.slug}`,

    type:
      "trainer",

    eyebrow:
      "Monte Cristo tim",

    title:
      trainer.name,

    summary:
      trainer.summary ||
      trainer.role ||
      "",

    blocks:
      Array.isArray(
        trainer.detail_blocks
      )
        ? trainer.detail_blocks
        : [],
  };


  if (
    trainer.image
  ) {
    detail.heroImage =
      trainer.image;

    detail.heroAlt =
      `${trainer.name} — Monte Cristo trener`;
  } else {
    detail.placeholderInitial =
      trainer.name
        ?.charAt(0)
        ?.toUpperCase() ||
      "?";
  }


  if (
    trainer.phone
  ) {
    detail.cta = {
      label:
        `Pozovi ${trainer.name}`,

      href:
        `tel:${phoneHref(
          trainer.phone
        )}`,
    };
  }


  return detail;
}


function TrainerImage({
  trainer,
  shouldReduceMotion,
  index,
}) {
  if (
    trainer.image
  ) {
    return (
      <motion.img
        src={
          trainer.image
        }
        alt={`${trainer.name} — Monte Cristo trener`}
        initial={{
          scale:
            shouldReduceMotion
              ? 1
              : 1.06,
        }}
        whileInView={{
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
              : 1,

          delay:
            shouldReduceMotion
              ? 0
              : index *
                0.08,

          ease,
        }}
      />
    );
  }


  return (
    <motion.div
      className="trainer-card__placeholder"
      aria-hidden="true"
      initial={{
        opacity: 0.55,

        scale:
          shouldReduceMotion
            ? 1
            : 0.97,
      }}
      whileInView={{
        opacity: 1,
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
            : 0.65,

        delay:
          shouldReduceMotion
            ? 0
            : index *
              0.08,

        ease,
      }}
    >
      <span>
        {
          trainer.name.charAt(
            0
          )
        }
      </span>

      <small>
        fotografija
        <br />
        uskoro
      </small>
    </motion.div>
  );
}


function Trainers() {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    openDetail,
  } =
    useDetailReader();

  const [
    trainers,
    setTrainers,
  ] =
    useState(
      fallbackTrainers
    );


  useEffect(() => {
    let cancelled =
      false;


    async function loadTrainers() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_trainers"
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
          "Treneri nisu učitani iz Supabase-a:",
          error
        );

        return;
      }


      setTrainers(
        (data ?? []).map(
          (row) => ({
            ...row,

            id:
              row.slug,

            image:
              row.image_url ||
              "",

            source:
              "supabase",
          })
        )
      );
    }


    loadTrainers();


    return () => {
      cancelled =
        true;
    };
  }, []);


  function handleKeyDown(
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
      className="trainers"
      id="treneri"
    >
      <div className="trainers__inner">
        <header className="trainers__header">
          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.68,

              ease,
            }}
          >
            <p className="trainers__eyebrow">
              Naš tim
            </p>

            <h2>
              Podrška kada

              <span>
                ti je potrebna.
              </span>
            </h2>
          </motion.div>


          <motion.p
            className="trainers__intro"
            initial={{
              opacity: 0,

              x:
                shouldReduceMotion
                  ? 0
                  : 28,
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
                  : 0.65,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.1,

              ease,
            }}
          >
            Trening ne mora da bude
            komplikovan. Monte Cristo
            tim je tu da pomogne oko
            izbora treninga, pravilnog
            izvođenja i kontinuiteta.
          </motion.p>
        </header>


        <div className="trainers__grid">
          {trainers.map(
            (
              trainer,
              index
            ) => {
              const detail =
                buildTrainerDetail(
                  trainer
                );


              return (
                <article
                  className="trainer-card"
                  key={
                    trainer.id
                  }
                >
                  <div
                    className="trainer-card__media"
                    role="button"
                    tabIndex={0}
                    aria-label={
                      `Otvori profil trenera ${trainer.name}`
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
                        handleKeyDown(
                          event,
                          detail
                        )
                    }
                    style={{
                      cursor:
                        "pointer",
                    }}
                  >
                    <TrainerImage
                      trainer={
                        trainer
                      }
                      shouldReduceMotion={
                        shouldReduceMotion
                      }
                      index={
                        index
                      }
                    />


                    <motion.span
                      className="trainer-card__index"
                      initial={{
                        opacity: 0.35,

                        scale:
                          shouldReduceMotion
                            ? 1
                            : 0.8,
                      }}
                      whileInView={{
                        opacity: 1,
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
                            : 0.48,

                        delay:
                          shouldReduceMotion
                            ? 0
                            : 0.18 +
                              index *
                                0.08,

                        ease,
                      }}
                    >
                      0{index + 1}
                    </motion.span>
                  </div>


                  <motion.div
                    className="trainer-card__content"
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
                      amount: 0.2,
                    }}
                    transition={{
                      duration:
                        shouldReduceMotion
                          ? 0.2
                          : 0.58,

                      delay:
                        shouldReduceMotion
                          ? 0
                          : index *
                            0.07,

                      ease,
                    }}
                  >
                    <div>
                      <p>
                        {
                          trainer.role
                        }
                      </p>

                      <h3>
                        {
                          trainer.name
                        }
                      </h3>
                    </div>


                    {trainer.phone && (
                      <motion.a
                        href={
                          `tel:${phoneHref(
                            trainer.phone
                          )}`
                        }
                        className="trainer-card__contact"
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : {
                                x: 3,
                              }
                        }
                      >
                        Pozovi

                        <span
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </motion.a>
                    )}
                  </motion.div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}


export default Trainers;