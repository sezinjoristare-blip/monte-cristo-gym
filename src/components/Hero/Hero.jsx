import {
  Fragment,
} from "react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import "./Hero.css";


function AnimatedLine({
  text,
  startDelay,
  shouldReduceMotion,
}) {
  const words = text.split(" ");

  let characterCounter = 0;

  return (
    <span
      className="hero__title-line"
      aria-hidden="true"
    >
      {words.map(
        (word, wordIndex) => {
          const wordStartIndex =
            characterCounter;

          characterCounter +=
            word.length + 1;

          return (
            <Fragment
              key={`${word}-${wordIndex}`}
            >
              <span className="hero__title-word">
                {Array.from(word).map(
                  (
                    character,
                    characterIndex
                  ) => {
                    const animationIndex =
                      wordStartIndex +
                      characterIndex;

                    return (
                      <motion.span
                        className="hero__title-char"
                        key={
                          `${character}-${characterIndex}`
                        }
                        initial={{
                          opacity: 0,

                          y:
                            shouldReduceMotion
                              ? 0
                              : "0.72em",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration:
                            shouldReduceMotion
                              ? 0.15
                              : 0.62,

                          delay:
                            shouldReduceMotion
                              ? 0.08
                              : startDelay +
                                animationIndex *
                                  0.028,

                          ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                          ],
                        }}
                      >
                        {character}
                      </motion.span>
                    );
                  }
                )}
              </span>

              {wordIndex <
                words.length - 1 && (
                " "
              )}
            </Fragment>
          );
        }
      )}
    </span>
  );
}


function Hero() {
  const shouldReduceMotion =
    useReducedMotion();

  const entranceY =
    shouldReduceMotion
      ? 0
      : 22;


  return (
    <section
      className="hero"
      id="pocetna"
    >
      <motion.picture
        className="hero__picture"
        initial={{
          opacity: 0.72,

          scale:
            shouldReduceMotion
              ? 1
              : 1.055,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration:
            shouldReduceMotion
              ? 0.2
              : 1.65,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
      >
        <source
          media="(max-width: 700px)"
          srcSet="/images/hero/monte-cristo-hero-mobile.png"
        />

        <img
          className="hero__image"
          src="/images/hero/monte-cristo-hero.png"
          alt="Enterijer Monte Cristo teretane u Gornjem Milanovcu"
        />
      </motion.picture>


      <motion.div
        className="hero__overlay"
        aria-hidden="true"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.85,
          ease: "easeOut",
        }}
      />


      <div className="hero__content">
        <div className="hero__copy">
          <motion.p
            className="hero__eyebrow"
            initial={{
              opacity: 0,
              y: entranceY,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.15
                  : 0.55,

              delay:
                shouldReduceMotion
                  ? 0.05
                  : 0.22,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            Monte Cristo ·
            Gornji Milanovac
          </motion.p>


          <h1
            aria-label="Trening koji prati tvoj ritam."
          >
            <AnimatedLine
              text="Trening koji"
              startDelay={0.36}
              shouldReduceMotion={
                shouldReduceMotion
              }
            />

            <AnimatedLine
              text="prati tvoj ritam."
              startDelay={0.56}
              shouldReduceMotion={
                shouldReduceMotion
              }
            />
          </h1>


          <motion.p
            className="hero__description"
            initial={{
              opacity: 0,
              y: entranceY,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.15
                  : 0.68,

              delay:
                shouldReduceMotion
                  ? 0.1
                  : 0.95,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            Fitness, kardio,
            pilates i trening uz
            podršku licenciranih
            trenera.
          </motion.p>


          <motion.div
            className="hero__actions"
            initial={{
              opacity: 0,
              y: entranceY,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.15
                  : 0.68,

              delay:
                shouldReduceMotion
                  ? 0.12
                  : 1.08,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <motion.a
              className="
                mc-button
                mc-button--primary
              "
              href="#programi"
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
                      scale: 0.985,
                    }
              }
            >
              Pogledaj programe

              <span
                aria-hidden="true"
              >
                →
              </span>
            </motion.a>


            <motion.a
              className="
                mc-button
                mc-button--light
              "
              href="#kontakt"
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
                      scale: 0.985,
                    }
              }
            >
              Kontakt
            </motion.a>
          </motion.div>
        </div>


        <motion.div
          className="hero__bottom"
          initial={{
            opacity: 0,

            y:
              shouldReduceMotion
                ? 0
                : 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0.15
                : 0.65,

            delay:
              shouldReduceMotion
                ? 0.12
                : 1.22,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          <div className="hero__tags">
            <span>
              Fitness
            </span>

            <span>
              Kardio
            </span>

            <span>
              Pilates
            </span>
          </div>


          <a
            className="hero__scroll"
            href="#programi"
          >
            <span>
              Istraži
            </span>

            <motion.strong
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? {
                      y: 0,
                    }
                  : {
                      y: [
                        0,
                        4,
                        0,
                      ],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {
                      duration: 0,
                    }
                  : {
                      duration: 1.45,
                      repeat: Infinity,
                      repeatDelay: 0.55,
                      ease: "easeInOut",
                    }
              }
            >
              ↓
            </motion.strong>
          </a>
        </motion.div>
      </div>
    </section>
  );
}


export default Hero;