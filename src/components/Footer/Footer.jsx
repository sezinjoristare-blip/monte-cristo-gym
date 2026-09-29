import {
  motion,
  useReducedMotion,
} from "motion/react";

import "./Footer.css";


const companyLinks = [
  {
    href: "#o-nama",
    label: "O nama",
  },

  {
    href: "#treneri",
    label: "Treneri",
  },

  {
    href: "#galerija",
    label: "Galerija",
  },

  {
    href: "#transformacije",
    label: "Transformacije",
  },
];


const trainingLinks = [
  {
    href: "#clanarine",
    label: "Članarine",
  },

  {
    href: "#programi",
    label: "Programi",
  },

  {
    href: "#faq",
    label: "FAQ",
  },

  {
    href: "#bench-izazov",
    label: "Bench izazov",
  },
];


const contactLinks = [
  {
    href: "tel:0642377400",
    label: "Relja — 064 2377 400",
  },

  {
    href: "tel:0600890908",
    label: "Nole — 060 0890 908",
  },

  {
    href: "#kontakt",
    label: "Lokacija",
  },

  {
    href: "#kontakt",
    label: "Radno vreme",
  },
];


const ease = [
  0.16,
  1,
  0.3,
  1,
];


function FooterLinkGroup({
  title,
  links,
  delay,
  shouldReduceMotion,
}) {
  return (
    <motion.div
      className="site-footer__column"
      initial={{
        opacity: 0,

        y:
          shouldReduceMotion
            ? 0
            : 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration:
          shouldReduceMotion
            ? 0.2
            : 0.55,

        delay:
          shouldReduceMotion
            ? 0
            : delay,

        ease,
      }}
    >
      <p className="site-footer__column-title">
        {title}
      </p>

      <nav
        className="site-footer__column-links"
        aria-label={title}
      >
        {links.map(
          (link) => (
            <a
              key={
                `${title}-${link.label}`
              }
              href={
                link.href
              }
            >
              {link.label}
            </a>
          )
        )}
      </nav>
    </motion.div>
  );
}


function Footer() {
  const shouldReduceMotion =
    useReducedMotion();


  return (
    <footer
      className="site-footer"
      role="contentinfo"
    >

      {/* =========================================
          TOP
          ========================================= */}

      <div className="site-footer__top">
        <div className="site-footer__top-inner">

          <motion.a
            className="site-footer__brand"
            href="#pocetna"
            aria-label="Monte Cristo Gym — početna"
            initial={{
              opacity: 0,

              x:
                shouldReduceMotion
                  ? 0
                  : -28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.6,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.7,

              ease,
            }}
          >
            <strong>
              Monte Cristo
            </strong>

            <span>
              Gym
            </span>
          </motion.a>


          <motion.div
            className="site-footer__socials"
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
              amount: 0.6,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.7,

              ease,
            }}
          >

            {/* INSTAGRAM — privremeno vodi na Kontakt
                dok ne ubacimo pravi URL */}

            <a
              className="site-footer__social"
              href="#kontakt"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  className="site-footer__social-fill"
                />
              </svg>
            </a>


            <a
              className="site-footer__social"
              href="tel:0600890908"
              aria-label="Pozovi Monte Cristo Gym"
              title="Pozovi"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="
                    M5.2 3.8
                    8.1 3
                    10 7.4
                    8.3 8.8
                    C9.2 11
                    11 12.8
                    13.2 13.7
                    L14.6 12
                    19 13.9
                    18.2 16.8
                    C17.8 18.2
                    16.5 19
                    15 18.8
                    C8.6 18
                    3.9 13.3
                    3.2 7
                    C3 5.5
                    3.8 4.2
                    5.2 3.8
                    Z
                  "
                />
              </svg>
            </a>


            <a
              className="site-footer__social"
              href="#kontakt"
              aria-label="Lokacija Monte Cristo Gym"
              title="Lokacija"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="
                    M12 21
                    C12 21
                    18 15.5
                    18 9.5
                    C18 6.2
                    15.3 3.5
                    12 3.5
                    C8.7 3.5
                    6 6.2
                    6 9.5
                    C6 15.5
                    12 21
                    12 21
                    Z
                  "
                />

                <circle
                  cx="12"
                  cy="9.5"
                  r="2.2"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>


      {/* =========================================
          MAIN
          ========================================= */}

      <div className="site-footer__main">
        <div className="site-footer__inner">

          <div className="site-footer__grid">

            {/* =====================================
                COMPANY INFO
                ===================================== */}

            <motion.div
              className="
                site-footer__column
                site-footer__company
              "
              initial={{
                opacity: 0,

                y:
                  shouldReduceMotion
                    ? 0
                    : 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0.2
                    : 0.55,

                ease,
              }}
            >
              <p className="site-footer__column-title">
                Monte Cristo Gym
              </p>

              <address>
                <span>
                  Teniski tereni
                </span>

                <span>
                  32300 Gornji Milanovac
                </span>

                {/*
                  DEMO PODACI.
                  Zameniti pravim APR
                  podacima ako klijent
                  preuzme sajt.
                */}

                <span>
                  PIB: 000000000
                </span>

                <span>
                  Matični broj: 00000000
                </span>
              </address>
            </motion.div>


            <FooterLinkGroup
              title="Monte Cristo"
              links={
                companyLinks
              }
              delay={0.05}
              shouldReduceMotion={
                shouldReduceMotion
              }
            />


            <FooterLinkGroup
              title="Trening"
              links={
                trainingLinks
              }
              delay={0.1}
              shouldReduceMotion={
                shouldReduceMotion
              }
            />


            <FooterLinkGroup
              title="Kontakt"
              links={
                contactLinks
              }
              delay={0.15}
              shouldReduceMotion={
                shouldReduceMotion
              }
            />
          </div>


          {/* =========================================
              BOTTOM
              ========================================= */}

          <motion.div
            className="site-footer__bottom"
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.8,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0.2
                  : 0.55,

              delay:
                shouldReduceMotion
                  ? 0
                  : 0.15,
            }}
          >
            <span>
              Gornji Milanovac
            </span>

            <span>
              © 2026 Monte Cristo Gym
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}


export default Footer;