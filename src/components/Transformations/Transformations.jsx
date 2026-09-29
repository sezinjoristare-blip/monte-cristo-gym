import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabaseClient";

import {
  useDetailReader,
} from "../DetailReader/DetailReaderContext";

import {
  getGymDetail,
  transformationEntries,
} from "../../data/gymDetails";

import "./Transformations.css";


const fallbackEntries =
  transformationEntries.map(
    (entry) => ({
      ...entry,

      source:
        "fallback",
    })
  );


function buildTransformation(
  row
) {
  const before = {
    src:
      row.before_image_url ||
      "",

    alt:
      row.before_alt ||
      "Fotografija pre",

    label:
      row.before_label ||
      "Pre",

    value:
      row.before_value ||
      "",
  };


  const after = {
    src:
      row.after_image_url ||
      "",

    alt:
      row.after_alt ||
      "Fotografija posle",

    label:
      row.after_label ||
      "Posle",

    value:
      row.after_value ||
      "",
  };


  return {
    id:
      row.slug,

    slug:
      row.slug,

    title:
      row.title,

    duration:
      row.duration ||
      "",

    summary:
      row.summary ||
      "",

    before,

    after,

    source:
      "supabase",

    detail: {
      id:
        `transformation-${row.slug}`,

      type:
        "transformation",

      eyebrow:
        "Transformacija",

      title:
        row.title,

      summary:
        row.summary ||
        "",

      blocks: [
        {
          type:
            "beforeAfter",

          before,

          after,
        },

        ...(
          Array.isArray(
            row.detail_blocks
          )
            ? row.detail_blocks
            : []
        ),
      ],
    },
  };
}


function getTransformationDetail(
  entry
) {
  if (
    entry.source ===
    "fallback"
  ) {
    return getGymDetail(
      `transformation-${entry.id}`
    );
  }


  return entry.detail;
}


function Transformations() {
  const {
    openDetail,
  } =
    useDetailReader();

  const trackRef =
    useRef(null);

  const cardRefs =
    useRef([]);

  const [
    entries,
    setEntries,
  ] =
    useState(
      fallbackEntries
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(
    fallbackEntries.length > 1
      ? 1
      : 0
  );


  /* =====================================================
     SUPABASE
     ===================================================== */

  useEffect(() => {
    let cancelled =
      false;


    async function loadTransformations() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_transformations"
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
          "Transformacije nisu učitane iz Supabase-a:",
          error
        );

        return;
      }


      const nextEntries =
        (data ?? [])
          .map(
            buildTransformation
          )
          .filter(
            (entry) =>
              entry.before.src &&
              entry.after.src
          );


      /*
        Dok AdminTransformations
        nije završen, ako nema
        nijedne kompletne objavljene
        transformacije zadržavamo
        postojeće test kartice.
      */

      if (
        nextEntries.length === 0
      ) {
        return;
      }


      setEntries(
        nextEntries
      );
    }


    loadTransformations();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* =====================================================
     INITIAL / DATA CENTER
     ===================================================== */

  useEffect(() => {
    if (
      entries.length ===
      0
    ) {
      return;
    }


    cardRefs.current =
      cardRefs.current.slice(
        0,
        entries.length
      );


    const initialIndex =
      entries.length > 1
        ? 1
        : 0;


    setActiveIndex(
      initialIndex
    );


    const frame =
      requestAnimationFrame(
        () => {
          centerCard(
            initialIndex,
            false
          );
        }
      );


    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, [
    entries.length,
  ]);


  /* =====================================================
     ACTIVE CARD DURING SCROLL / SWIPE
     ===================================================== */

  useEffect(() => {
    const track =
      trackRef.current;

    if (!track) {
      return;
    }


    function handleScroll() {
      const trackRect =
        track.getBoundingClientRect();

      const trackCenter =
        trackRect.left +
        trackRect.width / 2;


      let closestIndex =
        0;

      let closestDistance =
        Infinity;


      cardRefs.current.forEach(
        (
          card,
          index
        ) => {
          if (!card) {
            return;
          }


          const rect =
            card.getBoundingClientRect();

          const cardCenter =
            rect.left +
            rect.width / 2;

          const distance =
            Math.abs(
              cardCenter -
              trackCenter
            );


          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;

            closestIndex =
              index;
          }
        }
      );


      setActiveIndex(
        closestIndex
      );
    }


    track.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    handleScroll();


    return () => {
      track.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [
    entries.length,
  ]);


  /* =====================================================
     CENTER CARD
     ===================================================== */

  function centerCard(
    index,
    smooth = true
  ) {
    const track =
      trackRef.current;

    const card =
      cardRefs.current[
        index
      ];


    if (
      !track ||
      !card
    ) {
      return;
    }


    const target =
      card.offsetLeft -
      (
        track.clientWidth -
        card.offsetWidth
      ) /
        2;


    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    track.scrollTo({
      left:
        target,

      behavior:
        smooth &&
        !reducedMotion
          ? "smooth"
          : "auto",
    });


    setActiveIndex(
      index
    );
  }


  /* =====================================================
     PREVIOUS
     ===================================================== */

  function previous() {
    if (
      entries.length ===
      0
    ) {
      return;
    }


    const nextIndex =
      activeIndex <= 0
        ? entries.length -
          1
        : activeIndex - 1;


    centerCard(
      nextIndex
    );
  }


  /* =====================================================
     NEXT
     ===================================================== */

  function next() {
    if (
      entries.length ===
      0
    ) {
      return;
    }


    const nextIndex =
      activeIndex >=
      entries.length -
        1
        ? 0
        : activeIndex + 1;


    centerCard(
      nextIndex
    );
  }


  if (
    entries.length ===
    0
  ) {
    return null;
  }


  return (
    <section
      className="transformations"
      id="transformacije"
    >
      <div className="transformations__inner">

        {/* =========================================
            HEADER
            ========================================= */}

        <header className="transformations__header">
          <div>
            <p className="transformations__eyebrow">
              Rezultati članova
            </p>

            <h2>
              Napredak koji

              <span>
                se vidi.
              </span>
            </h2>
          </div>


          <p className="transformations__intro">
            Stvarne priče ljudi
            koji treniraju u
            Monte Cristu.
          </p>
        </header>


        {/* =========================================
            CAROUSEL
            ========================================= */}

        <div className="transformations__carousel">

          {/* DESKTOP LEFT */}

          <button
            type="button"
            className="
              transformations__arrow
              transformations__arrow--desktop
              transformations__arrow--left
            "
            onClick={
              previous
            }
            aria-label="Prethodna transformacija"
          >
            ←
          </button>


          {/* TRACK */}

          <div
            className="transformations__track"
            ref={trackRef}
          >
            {entries.map(
              (
                entry,
                index
              ) => {
                const isActive =
                  activeIndex ===
                  index;

                const detail =
                  getTransformationDetail(
                    entry
                  );


                return (
                  <article
                    className={[
                      "transformation-card",

                      isActive
                        ? "is-active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={
                      entry.id
                    }
                    ref={(
                      element
                    ) => {
                      cardRefs.current[
                        index
                      ] =
                        element;
                    }}
                  >

                    {/* =============================
                        PRE / POSLE
                        ============================= */}

                    <div className="transformation-card__images">
                      <figure>
                        <div className="transformation-card__image">
                          <img
                            src={
                              entry.before
                                .src
                            }
                            alt={
                              entry.before
                                .alt
                            }
                            loading="lazy"
                          />

                          <span>
                            {entry.before
                              .label ||
                              "Pre"}
                          </span>
                        </div>


                        {entry.before
                          .value && (
                          <figcaption>
                            {
                              entry.before
                                .value
                            }
                          </figcaption>
                        )}
                      </figure>


                      <figure>
                        <div className="transformation-card__image">
                          <img
                            src={
                              entry.after
                                .src
                            }
                            alt={
                              entry.after
                                .alt
                            }
                            loading="lazy"
                          />

                          <span>
                            {entry.after
                              .label ||
                              "Posle"}
                          </span>
                        </div>


                        {entry.after
                          .value && (
                          <figcaption>
                            {
                              entry.after
                                .value
                            }
                          </figcaption>
                        )}
                      </figure>
                    </div>


                    {/* =============================
                        TEXT
                        ============================= */}

                    <div className="transformation-card__copy">
                      <div className="transformation-card__meta">
                        {entry.duration && (
                          <span>
                            {
                              entry.duration
                            }
                          </span>
                        )}

                        <span>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                          {" / "}

                          {String(
                            entries.length
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>


                      <h3>
                        {
                          entry.title
                        }
                      </h3>


                      <p>
                        {
                          entry.summary
                        }
                      </p>


                      <button
                        type="button"
                        className="transformation-card__open"
                        onClick={() =>
                          openDetail(
                            detail
                          )
                        }
                      >
                        Otvori priču

                        <span
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>


          {/* DESKTOP RIGHT */}

          <button
            type="button"
            className="
              transformations__arrow
              transformations__arrow--desktop
              transformations__arrow--right
            "
            onClick={
              next
            }
            aria-label="Sledeća transformacija"
          >
            →
          </button>
        </div>


        {/* =========================================
            MOBILE NAVIGATION
            ========================================= */}

        <div className="transformations__mobile-nav">
          <button
            type="button"
            onClick={
              previous
            }
            aria-label="Prethodna transformacija"
          >
            ←
          </button>


          <div className="transformations__mobile-counter">
            <span>
              {String(
                activeIndex + 1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <i />

            <span>
              {String(
                entries.length
              ).padStart(
                2,
                "0"
              )}
            </span>
          </div>


          <button
            type="button"
            onClick={
              next
            }
            aria-label="Sledeća transformacija"
          >
            →
          </button>
        </div>


        {/* =========================================
            DESKTOP COUNTER
            ========================================= */}

        <div className="transformations__counter">
          <span>
            {String(
              activeIndex + 1
            ).padStart(
              2,
              "0"
            )}
          </span>

          <i />

          <span>
            {String(
              entries.length
            ).padStart(
              2,
              "0"
            )}
          </span>
        </div>
      </div>
    </section>
  );
}


export default Transformations;