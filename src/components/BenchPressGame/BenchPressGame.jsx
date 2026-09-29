import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./BenchPressGame.css";


const FRAME_COUNT =
  9;


/*
  5 poena po kliku =
  oko 20 klikova do vrha.
*/

const CLICK_POWER =
  5;


/*
  Ako korisnik stane,
  posle 700ms teg počinje
  polako da pada.
*/

const DECAY_DELAY =
  700;


/*
  Pad na svakih 100ms.
*/

const DECAY_AMOUNT =
  0.7;


/*
  Posle uspeha CTA dugmad kratko
  ostaju neaktivna, da poslednji
  brzi klik/tap ne može slučajno
  da otvori kontakt ili članarine.
*/

const SUCCESS_ACTION_DELAY =
  550;


/* =====================================================
   FRAME PATHS
   ===================================================== */

const BENCH_FRAMES =
  Array.from(
    {
      length:
        FRAME_COUNT,
    },
    (
      _,
      index
    ) =>
      `/images/bench-game/bench-${String(
        index + 1
      ).padStart(
        2,
        "0"
      )}.png`
  );


function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}


function BenchPressGame() {
  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    started,
    setStarted,
  ] = useState(false);

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const [
    actionsReady,
    setActionsReady,
  ] = useState(false);

  const [
    imageError,
    setImageError,
  ] = useState(false);


  const progressRef =
    useRef(0);

  const lastClickRef =
    useRef(0);


  /* =====================================================
     PRELOAD FREJMOVA

     Browser unapred učita svih 9,
     tako da pri brzom kliktanju
     ne dobijemo blink između slika.
     ===================================================== */

  useEffect(() => {
    BENCH_FRAMES.forEach(
      (src) => {
        const image =
          new Image();

        image.src =
          src;
      }
    );
  }, []);


  /* =====================================================
     SUCCESS ACTION SAFETY

     Kad korisnik završi izazov,
     CTA dugmad se pojave na svom
     mestu, ali prvih 550ms ne mogu
     da prime klik/tap. Tako poslednji
     brzi klik ne može slučajno da
     aktivira "Prijavi se".
     ===================================================== */

  useEffect(() => {
    if (!completed) {
      setActionsReady(
        false
      );

      return;
    }


    setActionsReady(
      false
    );


    const timeout =
      window.setTimeout(
        () => {
          setActionsReady(
            true
          );
        },
        SUCCESS_ACTION_DELAY
      );


    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [
    completed,
  ]);


  /* =====================================================
     CURRENT FRAME
     ===================================================== */

  const frameNumber =
    useMemo(
      () => {
        if (completed) {
          return FRAME_COUNT;
        }


        /*
          Progress 0–99 pretvaramo
          u frejmove 1–8.

          Frejm 09 je rezervisan
          ISKLJUČIVO za uspeh.
        */

        const frame =
          1 +
          Math.floor(
            (
              progress /
              100
            ) *
              (
                FRAME_COUNT -
                1
              )
          );


        return clamp(
          frame,
          1,
          FRAME_COUNT -
            1
        );
      },
      [
        progress,
        completed,
      ]
    );


  const frameSrc =
    BENCH_FRAMES[
      frameNumber - 1
    ];


  /* =====================================================
     POLAKO SPUŠTANJE TEGA
     ===================================================== */

  useEffect(() => {
    if (
      !started ||
      completed
    ) {
      return;
    }


    const interval =
      window.setInterval(
        () => {
          const now =
            performance.now();


          if (
            now -
              lastClickRef.current <
            DECAY_DELAY
          ) {
            return;
          }


          const current =
            progressRef.current;


          if (
            current <= 0
          ) {
            return;
          }


          const next =
            clamp(
              current -
                DECAY_AMOUNT,
              0,
              100
            );


          progressRef.current =
            next;

          setProgress(
            next
          );
        },
        100
      );


    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    started,
    completed,
  ]);


  /* =====================================================
     CLICK / TAP
     ===================================================== */

  function liftWeight() {
    if (completed) {
      return;
    }


    if (!started) {
      setStarted(true);
    }


    lastClickRef.current =
      performance.now();


    const next =
      clamp(
        progressRef.current +
          CLICK_POWER,
        0,
        100
      );


    progressRef.current =
      next;

    setProgress(
      next
    );


    if (
      next >= 100
    ) {
      progressRef.current =
        100;

      setProgress(100);

      setCompleted(true);
    }
  }


  /* =====================================================
     RESET
     ===================================================== */

  function resetGame() {
    progressRef.current =
      0;

    lastClickRef.current =
      0;

    setProgress(0);

    setStarted(false);

    setCompleted(false);

    setActionsReady(false);

    setImageError(false);
  }


  return (
    <section
      className="bench-game"
      id="bench-izazov"
    >
      <div className="bench-game__inner">

        {/* =========================================
            HEADER
            ========================================= */}

        <header className="bench-game__header">
          <div>
            <p className="bench-game__eyebrow">
              Bench izazov
            </p>

            <h2>
              Možeš li da

              <span>
                podigneš teg?
              </span>
            </h2>
          </div>


          <p className="bench-game__intro">
            Brzo klikći ili
            tapkaj dugme i
            podigni teg do kraja.
          </p>
        </header>


        {/* =========================================
            GAME
            ========================================= */}

        <div className="bench-game__stage">

          {/* =====================================
              VISUAL
              ===================================== */}

          <div className="bench-game__visual">
            {!imageError ? (
              <img
                src={
                  frameSrc
                }
                alt=""
                aria-hidden="true"
                draggable="false"
                onError={() =>
                  setImageError(
                    true
                  )
                }
              />
            ) : (
              <div className="bench-game__fallback">
                <span className="bench-game__fallback-label">
                  Nedostaje frejm{" "}
                  {String(
                    frameNumber
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>
            )}
          </div>


          {/* =====================================
              CONTROLS
              ===================================== */}

          <div className="bench-game__controls">
            {!completed ? (
              <>
                <div className="bench-game__progress-top">
                  <span>
                    Napredak
                  </span>

                  <strong>
                    {Math.round(
                      progress
                    )}
                    %
                  </strong>
                </div>


                <div
                  className="bench-game__progress"
                  role="progressbar"
                  aria-label="Napredak podizanja tega"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={
                    Math.round(
                      progress
                    )
                  }
                >
                  <span
                    style={{
                      width:
                        `${progress}%`,
                    }}
                  />
                </div>


                <button
                  className="bench-game__lift"
                  type="button"
                  onClick={
                    liftWeight
                  }
                >
                  Brzo klikći da
                  podigneš teg
                </button>


                <p
                  className="bench-game__status"
                  aria-live="polite"
                >
                  {!started
                    ? "Teg je spreman."
                    : "Ne staj."}
                </p>
              </>
            ) : (

              /* =================================
                 SUCCESS
                 ================================= */

              <div
                className="bench-game__success"
                aria-live="polite"
              >
                <p>
                  Uspeo si.
                </p>

                <h3>
                  Čestitam,

                  <span>
                    a sad uradi
                    to sam!
                  </span>
                </h3>


                <div
                  className={[
                    "bench-game__success-actions",

                    actionsReady
                      ? "is-ready"
                      : "is-locked",
                  ].join(" ")}
                >

                  {/* PRIMARNI CTA */}

                  <a
                    className="
                      mc-button
                      mc-button--primary
                    "
                    href="#kontakt"
                    aria-disabled={
                      !actionsReady
                    }
                    tabIndex={
                      actionsReady
                        ? 0
                        : -1
                    }
                    onClick={(
                      event
                    ) => {
                      if (
                        !actionsReady
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Prijavi se

                    <span
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>


                  {/* SEKUNDARNI CTA */}

                  <a
                    className="bench-game__contact"
                    href="#clanarine"
                    aria-disabled={
                      !actionsReady
                    }
                    tabIndex={
                      actionsReady
                        ? 0
                        : -1
                    }
                    onClick={(
                      event
                    ) => {
                      if (
                        !actionsReady
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Izaberi plan
                    treninga

                    <span
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </div>


                <button
                  className="bench-game__reset"
                  type="button"
                  onClick={
                    resetGame
                  }
                >
                  Ponovi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


export default BenchPressGame;