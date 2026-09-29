export const PROGRAM_DETAIL_IDS = {
  fitnes: "program-fitnes",
  kardio: "program-kardio",
  pilates: "program-pilates",
  mrsavljenje: "program-mrsavljenje",
  zatezanje: "program-zatezanje",
  misici: "program-misici",
};


export const TRAINER_DETAIL_IDS = {
  relja: "trainer-relja",
  nole: "trainer-nole",
};


export const ABOUT_DETAIL_ID =
  "about-monte-cristo";


export const TRANSFORMATIONS_DETAIL_ID =
  "transformations";


/*
  =====================================================
  TRANSFORMACIJE
  =====================================================

  OVDE NE UBACUJEMO LAŽNE REZULTATE.

  Kada dobijemo stvarne fotografije,
  dozvolu člana i stvarne podatke,
  dodajemo objekte ovakvog oblika:

  {
    id: "ana-2026",
    name: "Ana",
    title: "Ana — 6 meseci treninga",
    duration: "6 meseci",
    summary:
      "Kratak opis stvarnog napretka.",

    before: {
      src: "/images/transformations/ana-before.jpg",
      alt: "Ana pre početka programa",
      label: "Pre",
      value: "80 kg",
    },

    after: {
      src: "/images/transformations/ana-after.jpg",
      alt: "Ana nakon šest meseci treninga",
      label: "Posle",
      value: "60 kg",
    },

    blocks: [
      {
        type: "paragraph",
        title: "Početak",
        text:
          "Tekst koji je stvarno odobrio član.",
      },

      {
        type: "image",
        src:
          "/images/transformations/ana-training.jpg",
        alt:
          "Ana na treningu u Monte Cristu",
        caption:
          "Trening u Monte Cristu.",
      },

      {
        type: "video",
        src:
          "/videos/transformations/ana.mp4",
        poster:
          "/images/transformations/ana-video-poster.jpg",
        caption:
          "Deo treninga.",
      },
    ],
  }
*/


export const transformationEntries = [
  {
    id:
      "test-01",

    name:
      "Test 01",

    title:
      "Test transformacija 01",

    duration:
      "Test sadržaj",

    summary:
      "Ovo je privremena transformacija kojom proveravamo izgled, listanje i otvaranje detaljne priče.",

    before: {
      src:
        "/images/transformations/transformation-test-before.jpg",

      alt:
        "Test fotografija pre",

      label:
        "Pre",
    },

    after: {
      src:
        "/images/transformations/transformation-test-after.jpg",

      alt:
        "Test fotografija posle",

      label:
        "Posle",
    },

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Početak",

        text:
          "Ovo je privremeni tekst. Ovde će kasnije stajati stvarna priča člana o njegovom ili njenom napretku u Monte Cristu.",
      },

      {
        type:
          "image",

        src:
          "/images/transformations/transformation-test-before.jpg",

        alt:
          "Test fotografija",

        caption:
          "Privremena fotografija za proveru readera.",
      },

      {
        type:
          "paragraph",

        title:
          "Napredak",

        text:
          "Reader već može da kombinuje tekst, fotografije, video sadržaj i druge blokove. Stvarni sadržaj ćemo kasnije unositi iz admina.",
      },
    ],
  },


  {
    id:
      "test-02",

    name:
      "Test 02",

    title:
      "Test transformacija 02",

    duration:
      "Test sadržaj",

    summary:
      "Druga privremena kartica postoji da proverimo centralnu poziciju, strelice i bočne kartice.",

    before: {
      src:
        "/images/transformations/transformation-test-before.jpg",

      alt:
        "Test fotografija pre",

      label:
        "Pre",
    },

    after: {
      src:
        "/images/transformations/transformation-test-after.jpg",

      alt:
        "Test fotografija posle",

      label:
        "Posle",
    },

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Priča",

        text:
          "Ovo je samo test sadržaj za proveru kako izgleda detaljna transformacija kada se otvori iz carousela.",
      },

      {
        type:
          "image",

        src:
          "/images/transformations/transformation-test-after.jpg",

        alt:
          "Test fotografija",

        caption:
          "Privremena fotografija.",
      },
    ],
  },


  {
    id:
      "test-03",

    name:
      "Test 03",

    title:
      "Test transformacija 03",

    duration:
      "Test sadržaj",

    summary:
      "Treća test kartica omogućava da proverimo potpuno listanje u oba pravca i swipe na telefonu.",

    before: {
      src:
        "/images/transformations/transformation-test-before.jpg",

      alt:
        "Test fotografija pre",

      label:
        "Pre",
    },

    after: {
      src:
        "/images/transformations/transformation-test-after.jpg",

      alt:
        "Test fotografija posle",

      label:
        "Posle",
    },

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Detalji",

        text:
          "Kada uvedemo admin, svaka transformacija će imati svoje fotografije, kratak opis i proizvoljan niz sadržajnih blokova.",
      },
    ],
  },
];


/* =====================================================
   PROGRAM DETAILS
   ===================================================== */

const programDetails = {
  [PROGRAM_DETAIL_IDS.fitnes]: {
    id:
      PROGRAM_DETAIL_IDS.fitnes,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Fitnes",

    summary:
      "Trening za razvoj snage, forme i opšte kondicije, prilagođen različitim nivoima iskustva.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Kome je namenjen",

        text:
          "Fitnes je namenjen početnicima, rekreativcima i iskusnijim vežbačima koji žele da rade na snazi, kondiciji i opštoj formi.",
      },

      {
        type:
          "paragraph",

        title:
          "Fokus treninga",

        text:
          "Trening može da kombinuje vežbe snage, slobodne tegove, sprave i funkcionalne vežbe u skladu sa nivoom i ciljem vežbača.",
      },

      {
        type:
          "paragraph",

        title:
          "Kako da počneš",

        text:
          "Ako nisi siguran kako da organizuješ trening, možeš da razgovaraš sa trenerom i dobiješ smernice za početak.",
      },
    ],

    cta: {
      label:
        "Dogovori trening",

      href:
        "#kontakt",
    },
  },


  [PROGRAM_DETAIL_IDS.kardio]: {
    id:
      PROGRAM_DETAIL_IDS.kardio,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Kardio",

    summary:
      "Rad na izdržljivosti i kondiciji kroz trening koji može da se prilagodi tempu i cilju vežbača.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Kome je namenjen",

        text:
          "Kardio trening odgovara vežbačima koji žele da rade na kondiciji, izdržljivosti i redovnoj fizičkoj aktivnosti.",
      },

      {
        type:
          "paragraph",

        title:
          "Tempo koji ti odgovara",

        text:
          "Intenzitet treninga može da se prilagođava trenutnoj kondiciji i iskustvu, od postepenog početka do zahtevnijeg rada.",
      },

      {
        type:
          "paragraph",

        title:
          "Podrška",

        text:
          "Ako tek počinješ ili nisi siguran koji intenzitet ti odgovara, možeš da se posavetuješ sa trenerom.",
      },
    ],

    cta: {
      label:
        "Saznaj više",

      href:
        "#kontakt",
    },
  },


  [PROGRAM_DETAIL_IDS.pilates]: {
    id:
      PROGRAM_DETAIL_IDS.pilates,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Pilates",

    summary:
      "Kontrolisan trening usmeren na pokretljivost, stabilnost, držanje i osećaj u sopstvenom telu.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Kontrola pokreta",

        text:
          "Pilates stavlja naglasak na kontrolisano izvođenje pokreta, stabilnost i kvalitet vežbe.",
      },

      {
        type:
          "paragraph",

        title:
          "Prilagođen nivo",

        text:
          "Vežbe mogu da se prilagode nivou iskustva, tako da program može da odgovara i ljudima koji tek počinju.",
      },

      {
        type:
          "paragraph",

        title:
          "Više informacija",

        text:
          "Detalje o terminima i načinu rada potvrđuje Monte Cristo tim.",
      },
    ],

    cta: {
      label:
        "Pitaj za pilates",

      href:
        "#kontakt",
    },
  },


  [PROGRAM_DETAIL_IDS.mrsavljenje]: {
    id:
      PROGRAM_DETAIL_IDS.mrsavljenje,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Mršavljenje",

    summary:
      "Trening usmeren ka većoj potrošnji energije, boljoj kondiciji i postepenom napretku.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Kontinuitet pre svega",

        text:
          "Ideja nije kratkoročni ekstrem, već trening koji može da postane deo redovne rutine.",
      },

      {
        type:
          "paragraph",

        title:
          "Prilagođen pristup",

        text:
          "Tempo i izbor vežbi mogu da se prilagode trenutnoj kondiciji i iskustvu vežbača.",
      },

      {
        type:
          "paragraph",

        title:
          "Početak",

        text:
          "Za izbor odgovarajućeg načina treninga možeš direktno da razgovaraš sa Monte Cristo trenerom.",
      },
    ],

    cta: {
      label:
        "Razgovaraj sa trenerom",

      href:
        "#kontakt",
    },
  },


  [PROGRAM_DETAIL_IDS.zatezanje]: {
    id:
      PROGRAM_DETAIL_IDS.zatezanje,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Zatezanje",

    summary:
      "Rad na čvrstini, funkcionalnosti i oblikovanju tela kroz pažljivo odabrane vežbe.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Fokus",

        text:
          "Program kombinuje rad na snazi, kontroli pokreta i ukupnoj funkcionalnosti tela.",
      },

      {
        type:
          "paragraph",

        title:
          "Za različite nivoe",

        text:
          "Vežbe mogu da se prilagode početnicima i ljudima koji već imaju iskustva sa treningom.",
      },

      {
        type:
          "paragraph",

        title:
          "Plan treninga",

        text:
          "Za konkretnu organizaciju treninga i preporuku vežbi najbolje je razgovarati sa trenerom.",
      },
    ],

    cta: {
      label:
        "Pitaj trenera",

      href:
        "#kontakt",
    },
  },


  [PROGRAM_DETAIL_IDS.misici]: {
    id:
      PROGRAM_DETAIL_IDS.misici,

    type:
      "program",

    eyebrow:
      "Program",

    title:
      "Izgradnja mišića",

    summary:
      "Trening snage i progresivno opterećenje za one kojima je cilj razvoj mišićne mase.",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Trening snage",

        text:
          "Program se oslanja na vežbe snage i postepeno povećavanje zahteva u skladu sa iskustvom vežbača.",
      },

      {
        type:
          "paragraph",

        title:
          "Tehnika",

        text:
          "Pravilno izvođenje pokreta i odgovarajuće opterećenje važni su za kvalitetan i održiv trening.",
      },

      {
        type:
          "paragraph",

        title:
          "Stručna podrška",

        text:
          "Ako ti je potrebna pomoć oko izbora vežbi ili organizacije treninga, možeš da se obratiš treneru.",
      },
    ],

    cta: {
      label:
        "Kontaktiraj trenera",

      href:
        "#kontakt",
    },
  },
};


/* =====================================================
   TRAINERS
   ===================================================== */

const trainerDetails = {
  [TRAINER_DETAIL_IDS.relja]: {
    id:
      TRAINER_DETAIL_IDS.relja,

    type:
      "trainer",

    eyebrow:
      "Monte Cristo tim",

    title:
      "Relja",

    summary:
      "Licencirani trener.",

    placeholderInitial:
      "R",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Profil",

        text:
          "Detaljniji bio, iskustvo, specijalnosti i fotografija biće uneti nakon potvrde Monte Cristo tima.",
      },
    ],

    cta: {
      label:
        "Pozovi Relju",

      href:
        "tel:0642377400",
    },
  },


  [TRAINER_DETAIL_IDS.nole]: {
    id:
      TRAINER_DETAIL_IDS.nole,

    type:
      "trainer",

    eyebrow:
      "Monte Cristo tim",

    title:
      "Nole",

    summary:
      "Licencirani trener.",

    placeholderInitial:
      "N",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Profil",

        text:
          "Detaljniji bio, iskustvo, specijalnosti i fotografija biće uneti nakon potvrde Monte Cristo tima.",
      },
    ],

    cta: {
      label:
        "Pozovi Noleta",

      href:
        "tel:0600890908",
    },
  },
};


/* =====================================================
   ABOUT
   ===================================================== */

const aboutDetail = {
  [ABOUT_DETAIL_ID]: {
    id:
      ABOUT_DETAIL_ID,

    type:
      "about",

    eyebrow:
      "Monte Cristo",

    title:
      "Mesto na koje želiš da se vratiš.",

    summary:
      "Dobar trening nije samo spisak vežbi. Važni su prostor, atmosfera, kontinuitet i osećaj da možeš da napreduješ svojim tempom.",

    heroImage:
      "/images/hero/monte-cristo-hero.png",

    heroAlt:
      "Monte Cristo teretana i pogled ka teniskim terenima",

    blocks: [
      {
        type:
          "paragraph",

        title:
          "Prostor",

        text:
          "Monte Cristo je svetao i otvoren prostor sa velikim prozorima i pogledom prema sportskom kompleksu i teniskim terenima.",
      },

      {
        type:
          "facts",

        items: [
          {
            label:
              "01",

            title:
              "Svetao prostor",

            text:
              "Veliki prozori i prirodno svetlo daju prostoru otvoren i prijatan karakter.",
          },

          {
            label:
              "02",

            title:
              "Pogled na terene",

            text:
              "Teretana se nalazi uz sportski kompleks i gleda direktno ka teniskim terenima.",
          },

          {
            label:
              "03",

            title:
              "Za različite ciljeve",

            text:
              "Fitnes, kardio, pilates, zatezanje, mršavljenje i rad na mišićnoj masi.",
          },

          {
            label:
              "04",

            title:
              "Stručna podrška",

            text:
              "Licencirani treneri dostupni su članovima kojima je potrebna dodatna pomoć.",
          },
        ],
      },

      {
        type:
          "paragraph",

        title:
          "Priča Monte Crista",

        text:
          "Detaljniju istoriju i priču o Monte Cristu dodaćemo kada dobijemo potvrđene informacije i materijal od vlasnika.",
      },
    ],

    cta: {
      label:
        "Kontakt",

      href:
        "#kontakt",
    },
  },
};


/* =====================================================
   TRANSFORMATIONS
   ===================================================== */

const transformationDetails =
  Object.fromEntries(
    transformationEntries.map(
      (entry) => {
        const detailId =
          `transformation-${entry.id}`;

        return [
          detailId,

          {
            id:
              detailId,

            type:
              "transformation",

            eyebrow:
              "Transformacija",

            title:
              entry.title,

            summary:
              entry.summary,

            blocks: [
              {
                type:
                  "beforeAfter",

                before:
                  entry.before,

                after:
                  entry.after,
              },

              ...(entry.blocks || []),
            ],
          },
        ];
      }
    )
  );


const transformationsIndex = {
  [TRANSFORMATIONS_DETAIL_ID]: {
    id:
      TRANSFORMATIONS_DETAIL_ID,

    type:
      "transformations",

    eyebrow:
      "Rezultati članova",

    title:
      "Transformacije.",

    summary:
      "Stvarne priče i napredak članova Monte Crista.",

    blocks: [
      {
        type:
          "transformations",

        items:
          transformationEntries.map(
            (entry) => ({
              ...entry,

              detailId:
                `transformation-${entry.id}`,
            })
          ),
      },
    ],
  },
};


/* =====================================================
   ALL DETAILS
   ===================================================== */

export const gymDetails = {
  ...programDetails,
  ...trainerDetails,
  ...aboutDetail,
  ...transformationsIndex,
  ...transformationDetails,
};


export function getGymDetail(
  detailId
) {
  return (
    gymDetails[detailId] ||
    null
  );
}