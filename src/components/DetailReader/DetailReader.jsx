import {
  useEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import ContentRenderer
  from "./ContentRenderer";

import {
  useDetailReader,
} from "./DetailReaderContext";

import "./DetailReader.css";


function DetailReader() {
  const dialogRef =
    useRef(null);

  const scrollRef =
    useRef(null);

  const titleRef =
    useRef(null);

  const shouldReduceMotion =
    useReducedMotion();


  const {
    current,
    currentId,
    isOpen,
    canGoBack,
    pushDetail,
    closeReader,
    goBack,
    restoreFocus,
  } =
    useDetailReader();


  /* ===================================================
     NATIVE DIALOG STATE
     =================================================== */

  useEffect(() => {
    const dialog =
      dialogRef.current;


    if (!dialog) {
      return;
    }


    if (
      isOpen &&
      !dialog.open
    ) {
      dialog.showModal();
    }


    if (
      !isOpen &&
      dialog.open
    ) {
      dialog.close();
    }
  }, [isOpen]);


  /* ===================================================
     PAGE SCROLL LOCK
     =================================================== */

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);


  /* ===================================================
     NEW PAGE INSIDE READER
     =================================================== */

  useEffect(() => {
    if (
      !isOpen ||
      !current
    ) {
      return;
    }


    requestAnimationFrame(
      () => {
        if (
          scrollRef.current
        ) {
          scrollRef.current.scrollTop =
            0;
        }


        titleRef.current?.focus();
      }
    );
  }, [
    currentId,
    current,
    isOpen,
  ]);


  function handleCancel(
    event
  ) {
    event.preventDefault();

    closeReader();
  }


  function handleBackdropClick(
    event
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      closeReader();
    }
  }


  if (!current) {
    return (
      <dialog
        ref={dialogRef}
        className="detail-reader"
        onCancel={
          handleCancel
        }
        onClose={
          restoreFocus
        }
      />
    );
  }


  const hasMedia =
    Boolean(
      current.heroImage ||
      current.placeholderInitial
    );


  return (
    <dialog
      ref={dialogRef}
      className="detail-reader"
      aria-labelledby="detail-reader-title"
      onCancel={
        handleCancel
      }
      onClose={
        restoreFocus
      }
      onClick={
        handleBackdropClick
      }
    >
      <div className="detail-reader__panel">
        <header className="detail-reader__topbar">
          <div>
            {canGoBack ? (
              <button
                type="button"
                className="detail-reader__back"
                onClick={
                  goBack
                }
              >
                <span
                  aria-hidden="true"
                >
                  ←
                </span>

                Nazad
              </button>
            ) : (
              <span className="detail-reader__topbar-label">
                Monte Cristo
              </span>
            )}
          </div>


          <button
            type="button"
            className="detail-reader__close"
            aria-label="Zatvori"
            onClick={
              closeReader
            }
          >
            ×
          </button>
        </header>


        <div
          className="detail-reader__scroll"
          ref={scrollRef}
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.article
              className="detail-reader__page"
              key={
                current.id
              }
              initial={{
                opacity: 0,

                y:
                  shouldReduceMotion
                    ? 0
                    : 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,

                y:
                  shouldReduceMotion
                    ? 0
                    : -5,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0.01
                    : 0.18,

                ease:
                  "easeOut",
              }}
            >
              <section
                className={[
                  "detail-reader__hero",

                  hasMedia
                    ? ""
                    : "detail-reader__hero--text-only",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {hasMedia && (
                  <div className="detail-reader__hero-media">
                    {current.heroImage ? (
                      <img
                        src={
                          current.heroImage
                        }
                        alt={
                          current.heroAlt ||
                          ""
                        }
                      />
                    ) : (
                      <div
                        className="detail-reader__hero-placeholder"
                        aria-hidden="true"
                      >
                        <span>
                          {
                            current.placeholderInitial
                          }
                        </span>
                      </div>
                    )}
                  </div>
                )}


                <div className="detail-reader__hero-copy">
                  <p className="detail-reader__eyebrow">
                    {
                      current.eyebrow
                    }
                  </p>


                  <h2
                    id="detail-reader-title"
                    tabIndex={-1}
                    ref={titleRef}
                  >
                    {
                      current.title
                    }
                  </h2>


                  {current.summary && (
                    <p className="detail-reader__summary">
                      {
                        current.summary
                      }
                    </p>
                  )}
                </div>
              </section>


              <ContentRenderer
                blocks={
                  current.blocks ??
                  []
                }
                pushDetail={
                  pushDetail
                }
              />


              {current.cta && (
                <div className="detail-reader__cta">
                  <a
                    href={
                      current.cta
                        .href
                    }
                    className="
                      mc-button
                      mc-button--primary
                    "
                    onClick={
                      closeReader
                    }
                  >
                    {
                      current.cta
                        .label
                    }

                    <span
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </dialog>
  );
}


export default DetailReader;