import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import "./AdminEditor.css";


function AdminFAQ() {
  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingId,
    setSavingId,
  ] = useState(null);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    loadItems();
  }, []);


  async function loadItems() {
    setLoading(true);

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_faqs"
        )
        .select("*")
        .order(
          "sort_order",
          {
            ascending:
              true,
          }
        );


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "FAQ nije moguće učitati."
      );

      setLoading(false);

      return;
    }


    setItems(
      data ?? []
    );

    setLoading(false);
  }


  function updateItem(
    id,
    field,
    value
  ) {
    setItems(
      (
        current
      ) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,

                  [field]:
                    value,
                }
              : item
        )
    );
  }


  async function addItem() {
    setMessage("");

    setErrorMessage("");


    const firstOrder =
      items.length > 0
        ? Math.min(
            ...items.map(
              (item) =>
                Number(
                  item.sort_order ??
                  0
                )
            )
          )
        : 0;

    const newOrder =
      items.length > 0
        ? firstOrder - 1
        : 0;


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_faqs"
        )
        .insert({
          sort_order:
            newOrder,

          question:
            "Novo pitanje",

          answer:
            "",

          published:
            false,
        })
        .select("*")
        .single();


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Novo pitanje nije dodato."
      );

      return;
    }


    setItems(
      (current) => [
        data,
        ...current,
      ]
    );

    setMessage(
      "Novo pitanje je dodato."
    );
  }


  async function saveItem(
    item
  ) {
    setSavingId(
      item.id
    );

    setMessage("");

    setErrorMessage("");


    const {
      error,
    } =
      await supabase
        .from(
          "gym_faqs"
        )
        .update({
          question:
            item.question,

          answer:
            item.answer,

          published:
            Boolean(
              item.published
            ),

          sort_order:
            Number(
              item.sort_order
            ),
        })
        .eq(
          "id",
          item.id
        );


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Pitanje nije sačuvano."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      "Pitanje je sačuvano."
    );

    setSavingId(
      null
    );

    await loadItems();
  }


  async function removeItem(
    item
  ) {
    const confirmed =
      window.confirm(
        `Obrisati pitanje:\n\n${item.question}?`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "gym_faqs"
        )
        .delete()
        .eq(
          "id",
          item.id
        );


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Pitanje nije obrisano."
      );

      return;
    }


    setMessage(
      "Pitanje je obrisano."
    );

    await loadItems();
  }


  async function moveItem(
    index,
    direction
  ) {
    const targetIndex =
      index +
      direction;


    if (
      targetIndex <
        0 ||
      targetIndex >=
        items.length
    ) {
      return;
    }


    const current =
      items[index];

    const target =
      items[
        targetIndex
      ];


    const currentOrder =
      current.sort_order;

    const targetOrder =
      target.sort_order;


    const [
      first,
      second,
    ] =
      await Promise.all([
        supabase
          .from(
            "gym_faqs"
          )
          .update({
            sort_order:
              targetOrder,
          })
          .eq(
            "id",
            current.id
          ),

        supabase
          .from(
            "gym_faqs"
          )
          .update({
            sort_order:
              currentOrder,
          })
          .eq(
            "id",
            target.id
          ),
      ]);


    if (
      first.error ||
      second.error
    ) {
      console.error(
        first.error ||
          second.error
      );

      setErrorMessage(
        "Redosled nije promenjen."
      );

      return;
    }


    await loadItems();
  }


  if (loading) {
    return (
      <p>
        Učitavanje FAQ-a...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            FAQ
          </p>

          <h1>
            Pitanja i odgovori.
          </h1>

          <span>
            Dodaj, menjaj,
            objavljuj i poređaj
            pitanja koja se
            prikazuju posetiocima.
          </span>
        </div>


        <button
          type="button"
          className="
            admin-editor__button
            admin-editor__button--primary
          "
          onClick={
            addItem
          }
        >
          + Novo pitanje
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


      {items.length ===
      0 ? (
        <div className="admin-editor__empty">
          Još nema pitanja.
        </div>
      ) : (
        <div className="admin-editor__list">
          {items.map(
            (
              item,
              index
            ) => (
              <article
                className="admin-editor-card"
                key={
                  item.id
                }
              >
                <div className="admin-editor-card__head">
                  <div>
                    <small>
                      Pitanje{" "}
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </small>

                    <h2>
                      {
                        item.question
                      }
                    </h2>
                  </div>


                  <div className="admin-editor__order">
                    <button
                      type="button"
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        moveItem(
                          index,
                          -1
                        )
                      }
                      aria-label="Pomeri gore"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        items.length -
                          1
                      }
                      onClick={() =>
                        moveItem(
                          index,
                          1
                        )
                      }
                      aria-label="Pomeri dole"
                    >
                      ↓
                    </button>
                  </div>
                </div>


                <div className="admin-editor__grid">
                  <label className="
                    admin-editor__field
                    admin-editor__field--full
                  ">
                    <span>
                      Pitanje
                    </span>

                    <input
                      value={
                        item.question ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "question",
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
                      Odgovor
                    </span>

                    <textarea
                      value={
                        item.answer ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "answer",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>
                </div>


                <div className="admin-editor__checks">
                  <label className="admin-editor__check">
                    <input
                      type="checkbox"
                      checked={
                        Boolean(
                          item.published
                        )
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "published",
                          event
                            .target
                            .checked
                        )
                      }
                    />

                    Objavljeno
                  </label>
                </div>


                <div className="admin-editor__actions">
                  <button
                    type="button"
                    className="
                      admin-editor__button
                      admin-editor__button--primary
                    "
                    disabled={
                      savingId ===
                      item.id
                    }
                    onClick={() =>
                      saveItem(
                        item
                      )
                    }
                  >
                    Sačuvaj
                  </button>


                  <button
                    type="button"
                    className="
                      admin-editor__button
                      admin-editor__button--danger
                    "
                    onClick={() =>
                      removeItem(
                        item
                      )
                    }
                  >
                    Obriši
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}


export default AdminFAQ;