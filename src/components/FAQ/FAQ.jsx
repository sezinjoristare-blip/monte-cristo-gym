import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabaseClient";

import "./FAQ.css";


const fallbackQuestions = [
  {
    id: "fallback-1",
    question:
      "Nikada nisam trenirao/la. Da li mogu da počnem?",
    answer:
      "Naravno. Za početak možeš da razgovaraš sa trenerom i izabereš način treninga koji odgovara tvom trenutnom nivou i cilju.",
  },

  {
    id: "fallback-2",
    question:
      "Da li mogu da treniram uz trenera?",
    answer:
      "Da. Monte Cristo ima licencirane trenere. Za detalje, raspoložive termine i način rada najbolje je da ih direktno kontaktiraš.",
  },

  {
    id: "fallback-3",
    question:
      "Da li postoji pilates?",
    answer:
      "Da. Pilates je deo ponude Monte Crista, uz fitnes, kardio i druge oblike treninga.",
  },

  {
    id: "fallback-4",
    question:
      "Koje je radno vreme?",
    answer:
      "Monte Cristo radi svakog dana od 06:00 do 00:00.",
  },

  {
    id: "fallback-5",
    question:
      "Šta treba da ponesem na prvi trening?",
    answer:
      "Sportsku odeću, čiste patike za trening i vodu.",
  },

  {
    id: "fallback-6",
    question:
      "Gde mogu da proverim aktuelnu cenu članarine?",
    answer:
      "Aktuelne cene i uslove možeš da proveriš direktnim pozivom ili porukom Monte Cristo timu.",
  },
];


function FAQ() {
  const [
    questions,
    setQuestions,
  ] = useState(
    fallbackQuestions
  );

  const [
    openId,
    setOpenId,
  ] = useState(
    fallbackQuestions[0]
      .id
  );


  useEffect(() => {
    let active =
      true;


    async function loadQuestions() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_faqs"
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


      if (
        !active ||
        error
      ) {
        if (error) {
          console.error(
            "FAQ:",
            error
          );
        }

        return;
      }


      if (
        data &&
        data.length >
          0
      ) {
        setQuestions(
          data
        );

        setOpenId(
          data[0].id
        );
      }
    }


    loadQuestions();


    return () => {
      active =
        false;
    };
  }, []);


  return (
    <section
      className="faq"
      id="faq"
    >
      <div className="faq__inner">
        <header className="faq__header">
          <p>
            FAQ
          </p>

          <h2>
            Najčešća
            <span>
              pitanja.
            </span>
          </h2>
        </header>


        <div className="faq__list">
          {questions.map(
            (
              item
            ) => {
              const isOpen =
                openId ===
                item.id;


              return (
                <article
                  className={[
                    "faq-item",

                    isOpen
                      ? "is-open"
                      : "",
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    )}
                  key={
                    item.id
                  }
                >
                  <button
                    type="button"
                    aria-expanded={
                      isOpen
                    }
                    onClick={() =>
                      setOpenId(
                        isOpen
                          ? null
                          : item.id
                      )
                    }
                  >
                    <span>
                      {
                        item.question
                      }
                    </span>

                    <strong
                      aria-hidden="true"
                    >
                      {isOpen
                        ? "−"
                        : "+"}
                    </strong>
                  </button>


                  {isOpen && (
                    <div className="faq-item__answer">
                      <p>
                        {
                          item.answer
                        }
                      </p>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}


export default FAQ;