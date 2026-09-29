import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import {
  replaceGymMedia,
} from "../lib/gymMedia";

import AdminDetailBlocksEditor
  from "../components/Admin/AdminDetailBlocksEditor";

import "./AdminEditor.css";


const EMPTY_ABOUT = {
  id:
    1,

  eyebrow:
    "Monte Cristo",

  title:
    "Mesto na koje želiš da se vratiš.",

  lead:
    "",

  image_url:
    "",

  image_alt:
    "",

  facts:
    [],

  detail_blocks:
    [],
};


function AdminAbout() {
  const [
    item,
    setItem,
  ] =
    useState(
      EMPTY_ABOUT
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    loadItem();
  }, []);


  async function loadItem() {
    setLoading(
      true
    );

    setErrorMessage(
      ""
    );


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_about"
        )
        .select("*")
        .eq(
          "id",
          1
        )
        .maybeSingle();


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "O nama sadržaj nije moguće učitati."
      );

      setLoading(
        false
      );

      return;
    }


    setItem(
      data
        ? {
            ...EMPTY_ABOUT,
            ...data,

            facts:
              Array.isArray(
                data.facts
              )
                ? data.facts
                : [],

            detail_blocks:
              Array.isArray(
                data.detail_blocks
              )
                ? data.detail_blocks
                : [],
          }
        : EMPTY_ABOUT
    );

    setLoading(
      false
    );
  }


  function updateField(
    field,
    value
  ) {
    setItem(
      (
        current
      ) => ({
        ...current,

        [field]:
          value,
      })
    );
  }


  function updateFact(
    index,
    field,
    value
  ) {
    updateField(
      "facts",
      (
        item.facts ||
        []
      ).map(
        (
          fact,
          factIndex
        ) =>
          factIndex ===
          index
            ? {
                ...fact,

                [field]:
                  value,
              }
            : fact
      )
    );
  }


  function addFact() {
    const currentFacts =
      item.facts ||
      [];


    updateField(
      "facts",
      [
        ...currentFacts,

        {
          number:
            String(
              currentFacts.length +
                1
            ).padStart(
              2,
              "0"
            ),

          title:
            "",

          text:
            "",
        },
      ]
    );
  }


  function removeFact(
    index
  ) {
    updateField(
      "facts",
      (
        item.facts ||
        []
      ).filter(
        (
          _,
          factIndex
        ) =>
          factIndex !==
          index
      )
    );
  }


  function moveFact(
    index,
    direction
  ) {
    const facts = [
      ...(
        item.facts ||
        []
      ),
    ];

    const targetIndex =
      index +
      direction;


    if (
      targetIndex < 0 ||
      targetIndex >=
        facts.length
    ) {
      return;
    }


    [
      facts[index],
      facts[targetIndex],
    ] = [
      facts[targetIndex],
      facts[index],
    ];


    updateField(
      "facts",
      facts
    );
  }


  async function uploadImage(
    file
  ) {
    if (!file) {
      return;
    }


    setUploading(
      true
    );

    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


    try {
      const uploaded =
        await replaceGymMedia({
          file,

          folder:
            "about",
        });


      updateField(
        "image_url",
        uploaded.publicUrl
      );

      setMessage(
        "Glavna fotografija je uploadovana. Klikni Sačuvaj."
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      setErrorMessage(
        "Fotografija nije uploadovana."
      );
    } finally {
      setUploading(
        false
      );
    }
  }


  async function saveItem() {
    setSaving(
      true
    );

    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


    const {
      error,
    } =
      await supabase
        .from(
          "gym_about"
        )
        .upsert({
          id:
            1,

          eyebrow:
            item.eyebrow ??
            "",

          title:
            item.title ??
            "",

          lead:
            item.lead ??
            "",

          image_url:
            item.image_url ||
            null,

          image_alt:
            item.image_alt ??
            "",

          facts:
            Array.isArray(
              item.facts
            )
              ? item.facts
              : [],

          detail_blocks:
            Array.isArray(
              item.detail_blocks
            )
              ? item.detail_blocks
              : [],
        });


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "O nama sadržaj nije sačuvan."
      );

      setSaving(
        false
      );

      return;
    }


    setMessage(
      "O nama sadržaj je sačuvan."
    );

    setSaving(
      false
    );

    await loadItem();
  }


  if (loading) {
    return (
      <p>
        Učitavanje O nama sadržaja...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            O nama
          </p>

          <h1>
            Priča Monte Crista.
          </h1>

          <span>
            Uredi glavnu javnu sekciju,
            fotografiju, facts i sadržaj
            DetailReader-a.
          </span>
        </div>


        <button
          type="button"
          className="
            admin-editor__button
            admin-editor__button--primary
          "
          disabled={
            saving
          }
          onClick={
            saveItem
          }
        >
          {saving
            ? "Čuvanje..."
            : "Sačuvaj sve"}
        </button>
      </header>


      {message && (
        <p className="
          admin-editor__message
          admin-editor__message--success
        ">
          {message}
        </p>
      )}


      {errorMessage && (
        <p className="
          admin-editor__message
          admin-editor__message--error
        ">
          {errorMessage}
        </p>
      )}


      <article className="admin-editor-card">
        <div className="admin-editor__grid">
          <label className="admin-editor__field">
            <span>
              Eyebrow
            </span>

            <input
              value={
                item.eyebrow ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "eyebrow",
                  event
                    .target
                    .value
                )
              }
            />
          </label>


          <label className="admin-editor__field">
            <span>
              Naslov
            </span>

            <input
              value={
                item.title ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "title",
                  event
                    .target
                    .value
                )
              }
            />
          </label>


          <label className="
            admin-editor__field
            admin-editor__field--full
          ">
            <span>
              Lead
            </span>

            <textarea
              value={
                item.lead ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "lead",
                  event
                    .target
                    .value
                )
              }
            />
          </label>


          <label className="
            admin-editor__field
            admin-editor__field--full
          ">
            <span>
              Glavna fotografija
            </span>

            <input
              type="file"
              accept="image/*"
              disabled={
                uploading
              }
              onChange={(
                event
              ) =>
                uploadImage(
                  event
                    .target
                    .files?.[0]
                )
              }
            />
          </label>


          {item.image_url && (
            <div className="
              admin-editor__field
              admin-editor__field--full
            ">
              <span>
                Trenutna fotografija
              </span>

              <img
                src={
                  item.image_url
                }
                alt=""
                style={{
                  width:
                    "min(100%, 520px)",

                  maxHeight:
                    "360px",

                  objectFit:
                    "cover",
                }}
              />
            </div>
          )}


          <label className="
            admin-editor__field
            admin-editor__field--full
          ">
            <span>
              Alt tekst glavne fotografije
            </span>

            <input
              value={
                item.image_alt ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "image_alt",
                  event
                    .target
                    .value
                )
              }
            />
          </label>
        </div>


        <div
          style={{
            marginTop:
              "32px",
          }}
        >
          <div className="admin-editor-card__head">
            <div>
              <small>
                Javna sekcija
              </small>

              <h2>
                Facts
              </h2>
            </div>


            <button
              type="button"
              className="
                admin-editor__button
                admin-editor__button--primary
              "
              onClick={
                addFact
              }
            >
              + Dodaj činjenicu
            </button>
          </div>


          {(item.facts || []).map(
            (
              fact,
              index
            ) => (
              <div
                key={
                  index
                }
                style={{
                  borderTop:
                    "1px solid rgba(0,0,0,.12)",

                  padding:
                    "20px 0",
                }}
              >
                <div className="admin-editor__grid">
                  <label className="admin-editor__field">
                    <span>
                      Broj / oznaka
                    </span>

                    <input
                      value={
                        fact.number ??
                        fact.label ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateFact(
                          index,
                          "number",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>


                  <label className="admin-editor__field">
                    <span>
                      Naslov
                    </span>

                    <input
                      value={
                        fact.title ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateFact(
                          index,
                          "title",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>


                  <label className="
                    admin-editor__field
                    admin-editor__field--full
                  ">
                    <span>
                      Tekst
                    </span>

                    <textarea
                      value={
                        fact.text ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateFact(
                          index,
                          "text",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>
                </div>


                <div className="admin-editor__actions">
                  <button
                    type="button"
                    className="admin-editor__button"
                    disabled={
                      index ===
                      0
                    }
                    onClick={() =>
                      moveFact(
                        index,
                        -1
                      )
                    }
                  >
                    ↑ Gore
                  </button>

                  <button
                    type="button"
                    className="admin-editor__button"
                    disabled={
                      index ===
                      item.facts.length -
                        1
                    }
                    onClick={() =>
                      moveFact(
                        index,
                        1
                      )
                    }
                  >
                    ↓ Dole
                  </button>

                  <button
                    type="button"
                    className="
                      admin-editor__button
                      admin-editor__button--danger
                    "
                    onClick={() =>
                      removeFact(
                        index
                      )
                    }
                  >
                    Obriši činjenicu
                  </button>
                </div>
              </div>
            )
          )}
        </div>


        <AdminDetailBlocksEditor
          blocks={
            Array.isArray(
              item.detail_blocks
            )
              ? item.detail_blocks
              : []
          }
          onChange={(
            blocks
          ) =>
            updateField(
              "detail_blocks",
              blocks
            )
          }
          mediaFolder="about/reader"
        />


        <div className="admin-editor__actions">
          <button
            type="button"
            className="
              admin-editor__button
              admin-editor__button--primary
            "
            disabled={
              saving
            }
            onClick={
              saveItem
            }
          >
            {saving
              ? "Čuvanje..."
              : "Sačuvaj sve"}
          </button>
        </div>
      </article>
    </section>
  );
}


export default AdminAbout;