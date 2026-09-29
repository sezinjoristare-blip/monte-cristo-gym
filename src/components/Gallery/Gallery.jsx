import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  supabase,
} from "../../lib/supabaseClient";

import "./Gallery.css";


const fallbackGalleryItems = [
  {
    id:
      "fallback-1",

    src:
      "/images/hero/monte-cristo-hero.png",

    alt:
      "Monte Cristo teretana",
  },

  {
    id:
      "fallback-2",

    src:
      "",

    alt:
      "Trening u Monte Cristu",
  },

  {
    id:
      "fallback-3",

    src:
      "",

    alt:
      "Oprema u Monte Cristu",
  },

  {
    id:
      "fallback-4",

    src:
      "",

    alt:
      "Monte Cristo prostor",
  },

  {
    id:
      "fallback-5",

    src:
      "",

    alt:
      "Monte Cristo trening",
  },
];


const ease = [
  0.16,
  1,
  0.3,
  1,
];


const cardMovement = [
  {
    x: -28,
    y: 20,
  },

  {
    x: 24,
    y: -16,
  },

  {
    x: 24,
    y: 18,
  },

  {
    x: -20,
    y: 20,
  },

  {
    x: 25,
    y: 16,
  },
];


function createGallerySlots(
  rows
) {
  const mapped =
    rows.map(
      (
        row
      ) => ({
        id:
          row.id,

        src:
          row.image_url,

        alt:
          row.alt ||
          "Monte Cristo teretana",
      })
    );


  while (
    mapped.length < 5
  ) {
    mapped.push({
      id:
        `empty-${mapped.length + 1}`,

      src:
        "",

      alt:
        "Monte Cristo teretana",
    });
  }


  return mapped.slice(
    0,
    5
  );
}


function Gallery() {
  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    galleryItems,
    setGalleryItems,
  ] = useState(
    fallbackGalleryItems
  );

  const shouldReduceMotion =
    useReducedMotion();


  useEffect(() => {
    let cancelled =
      false;


    async function loadGallery() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_gallery"
          )
          .select(
            "id, image_url, alt"
          )
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
          )
          .limit(
            5
          );


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "Galerija nije učitana iz Supabase-a:",
          error
        );

        return;
      }


      if (
        !data ||
        data.length ===
          0
      ) {
        return;
      }


      setGalleryItems(
        createGallerySlots(
          data
        )
      );
    }


    loadGallery();


    return () => {
      cancelled =
        true;
    };
  }, []);


  useEffect(() => {
    function handleKeyDown(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSelected(
          null
        );
      }
    }


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  useEffect(() => {
    if (!selected) {
      document.body.style.overflow =
        "";

      return;
    }


    const previousOverflow =
      document.body.style
        .overflow;


    document.body.style.overflow =
      "hidden";


    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    selected,
  ]);


  return (
    <>
      <section
        className="gallery"
        id="galerija"
      >
        <div className="gallery__inner">
          <header className="gallery__header">
            <motion.div
              initial={{
                opacity: 0,

                x:
                  shouldReduceMotion
                    ? 0
                    : -38,
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
                    : 0.7,

                ease,
              }}
            >
              <p className="gallery__eyebrow">
                Prostor
              </p>

              <h2>
                Pogledaj gde

                <span>
                  treniraš.
                </span>
              </h2>
            </motion.div>
          </header>


          <div className="gallery__grid">
            {galleryItems.map(
              (
                item,
                index
              ) => {
                const movement =
                  cardMovement[
                    index
                  ];


                return (
                  <motion.button
                    className={[
                      "gallery-card",

                      `gallery-card--${index + 1}`,
                    ].join(" ")}
                    key={
                      item.id
                    }
                    type="button"
                    disabled={
                      !item.src
                    }
                    onClick={() => {
                      if (
                        item.src
                      ) {
                        setSelected(
                          item
                        );
                      }
                    }}
                    initial={{
                      opacity:
                        shouldReduceMotion
                          ? 1
                          : 0.48,

                      x:
                        shouldReduceMotion
                          ? 0
                          : movement.x,

                      y:
                        shouldReduceMotion
                          ? 0
                          : movement.y,

                      scale:
                        shouldReduceMotion
                          ? 1
                          : 0.985,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
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
                          : 0.62,

                      delay:
                        shouldReduceMotion
                          ? 0
                          : index *
                            0.055,

                      ease,
                    }}
                    whileHover={
                      shouldReduceMotion ||
                      !item.src
                        ? undefined
                        : {
                            scale:
                              0.992,
                          }
                    }
                    whileTap={
                      shouldReduceMotion ||
                      !item.src
                        ? undefined
                        : {
                            scale:
                              0.975,
                          }
                    }
                  >
                    {item.src ? (
                      <motion.img
                        src={
                          item.src
                        }
                        alt={
                          item.alt
                        }
                        initial={{
                          scale:
                            shouldReduceMotion
                              ? 1
                              : 1.055,
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
                              : 0.95,

                          delay:
                            shouldReduceMotion
                              ? 0
                              : index *
                                0.055,

                          ease,
                        }}
                      />
                    ) : (
                      <div className="gallery-card__placeholder">
                        <span>
                          0{index + 1}
                        </span>

                        <small>
                          fotografija
                          uskoro
                        </small>
                      </div>
                    )}
                  </motion.button>
                );
              }
            )}
          </div>
        </div>
      </section>


      <AnimatePresence>
        {selected && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Galerija"
            onClick={() =>
              setSelected(
                null
              )
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.15
                  : 0.25,
            }}
          >
            <motion.button
              type="button"
              className="gallery-lightbox__close"
              onClick={() =>
                setSelected(
                  null
                )
              }
              aria-label="Zatvori fotografiju"
              initial={{
                opacity: 0,

                scale:
                  shouldReduceMotion
                    ? 1
                    : 0.85,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration:
                  0.3,

                ease,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale:
                        1.05,
                    }
              }
            >
              ×
            </motion.button>


            <motion.img
              src={
                selected.src
              }
              alt={
                selected.alt
              }
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              initial={{
                opacity: 0,

                scale:
                  shouldReduceMotion
                    ? 1
                    : 0.94,

                y:
                  shouldReduceMotion
                    ? 0
                    : 18,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,

                scale:
                  shouldReduceMotion
                    ? 1
                    : 0.97,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0.15
                    : 0.4,

                ease,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


export default Gallery;