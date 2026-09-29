import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import "./Header.css";


const desktopLinks = [
  {
    href: "#programi",
    label: "Programi",
  },

  {
    href: "#treneri",
    label: "Treneri",
  },

  {
    href: "#o-nama",
    label: "O nama",
  },

  {
    href: "#clanarine",
    label: "Članarine",
  },

  {
    href: "#galerija",
    label: "Galerija",
  },

  {
    href: "#kontakt",
    label: "Kontakt",
  },
];


const mobileLinks = [
  ...desktopLinks,

  {
    href: "#bench-izazov",
    label: "Bench izazov",
  },
];


function Header() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const shouldReduceMotion =
    useReducedMotion();


  useEffect(() => {
    function handleScroll() {
      setScrolled(
        window.scrollY > 40
      );
    }


    handleScroll();


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  useEffect(() => {
    function handleKeyDown(
      event
    ) {
      if (
        event.key === "Escape"
      ) {
        setMenuOpen(false);
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
    if (!menuOpen) {
      document.body.style.overflow =
        "";

      return;
    }


    document.body.style.overflow =
      "hidden";


    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);


  function closeMenu() {
    setMenuOpen(false);
  }


  const headerClassName = [
    "site-header",

    scrolled
      ? "site-header--scrolled"
      : "",

    menuOpen
      ? "site-header--menu-open"
      : "",
  ]
    .filter(Boolean)
    .join(" ");


  return (
    <>
      <motion.header
        className={headerClassName}
        initial={{
          opacity: 0,

          y:
            shouldReduceMotion
              ? 0
              : -18,
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
              ? 0
              : 0.08,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
      >
        <motion.a
          className="site-header__brand"
          href="#pocetna"
          aria-label="Monte Cristo početna"
          onClick={closeMenu}
          initial={{
            opacity: 0,

            x:
              shouldReduceMotion
                ? 0
                : -12,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0.15
                : 0.55,

            delay:
              shouldReduceMotion
                ? 0
                : 0.22,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          <span className="site-header__brand-main">
            Monte
          </span>

          <span className="site-header__brand-main">
            Cristo
          </span>

          <span className="site-header__brand-small">
            GYM
          </span>
        </motion.a>


        <nav
          className="site-header__desktop-nav"
          aria-label="Glavna navigacija"
        >
          {desktopLinks.map(
            (
              item,
              index
            ) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{
                  opacity: 0,

                  y:
                    shouldReduceMotion
                      ? 0
                      : -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration:
                    shouldReduceMotion
                      ? 0.15
                      : 0.46,

                  delay:
                    shouldReduceMotion
                      ? 0
                      : 0.3 +
                        index *
                          0.055,

                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >
                {item.label}
              </motion.a>
            )
          )}
        </nav>


        <motion.a
          className="site-header__cta"
          href="#kontakt"
          initial={{
            opacity: 0,

            x:
              shouldReduceMotion
                ? 0
                : 10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0.15
                : 0.5,

            delay:
              shouldReduceMotion
                ? 0
                : 0.53,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
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
                  scale: 0.98,
                }
          }
        >
          Probni trening
        </motion.a>


        <motion.button
          className={[
            "site-header__menu-button",

            menuOpen
              ? "is-open"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          aria-label={
            menuOpen
              ? "Zatvori meni"
              : "Otvori meni"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              (current) =>
                !current
            )
          }
          initial={{
            opacity: 0,

            x:
              shouldReduceMotion
                ? 0
                : 10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0.15
                : 0.5,

            delay:
              shouldReduceMotion
                ? 0
                : 0.46,
          }}
          whileTap={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 0.94,
                }
          }
        >
          <span />
          <span />
          <span />
        </motion.button>
      </motion.header>


      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="
              mobile-menu
              is-open
            "
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
                  ? 0.12
                  : 0.28,

              ease:
                "easeOut",
            }}
          >
            <nav
              className="mobile-menu__nav"
              aria-label="Mobilna navigacija"
            >
              {mobileLinks.map(
                (
                  item,
                  index
                ) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={
                      closeMenu
                    }
                    initial={{
                      opacity: 0,

                      y:
                        shouldReduceMotion
                          ? 0
                          : 22,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration:
                        shouldReduceMotion
                          ? 0.12
                          : 0.46,

                      delay:
                        shouldReduceMotion
                          ? 0
                          : 0.06 +
                            index *
                              0.055,

                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {item.label}
                  </motion.a>
                )
              )}
            </nav>


            <motion.div
              className="mobile-menu__footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay:
                  shouldReduceMotion
                    ? 0
                    : 0.34,

                duration:
                  0.4,
              }}
            >
              <span>
                Monte Cristo Gym
              </span>

              <span>
                Gornji Milanovac
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


export default Header;