import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import "./AdminEditor.css";


function AdminTestimonials() {
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
          "gym_testimonials"
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
        "Iskustva nije moguće učitati."
      );

      setLoading(
        false
      );

      return;
    }


    setItems(
      data ??
      []
    );

    setLoading(
      false
    );
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
          (
            item
          ) =>
            item.id ===
            id
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
    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


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
          "gym_testimonials"
        )
        .insert({
          sort_order:
            newOrder,

          name:
            "Novi član",

          quote_text:
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
        "Novo iskustvo nije dodato."
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
      "Novo iskustvo je dodato."
    );
  }


  async function saveItem(
    item
  ) {
    if (
      !String(
        item.name || ""
      ).trim()
    ) {
      setErrorMessage(
        "Ime je obavezno."
      );

      return;
    }


    if (
      Boolean(
        item.published
      ) &&
      !String(
        item.quote_text || ""
      ).trim()
    ) {
      setErrorMessage(
        "Objavljeno iskustvo mora imati tekst."
      );

      return;
    }


    setSavingId(
      item.id
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
          "gym_testimonials"
        )
        .update({
          name:
            item.name.trim(),

          quote_text:
            item.quote_text ??
            "",

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
        "Iskustvo nije sačuvano."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      "Iskustvo je sačuvano."
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
        `Obrisati iskustvo člana:\n\n${item.name}?`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "gym_testimonials"
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
        "Iskustvo nije obrisano."
      );

      return;
    }


    setMessage(
      "Iskustvo je obrisano."
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
      targetIndex < 0 ||
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


    const [
      first,
      second,
    ] =
      await Promise.all([
        supabase
          .from(
            "gym_testimonials"
          )
          .update({
            sort_order:
              target.sort_order,
          })
          .eq(
            "id",
            current.id
          ),

        supabase
          .from(
            "gym_testimonials"
          )
          .update({
            sort_order:
              current.sort_order,
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
        Učitavanje iskustava...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Iskustva članova
          </p>

          <h1>
            Šta kažu članovi.
          </h1>

          <span>
            Dodaj, uredi, objavi,
            sakrij i poređaj izjave
            koje se prikazuju na sajtu.
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
          + Novo iskustvo
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
          Još nema iskustava članova.
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
                      Iskustvo{" "}
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
                        item.name
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
                    >
                      ↓
                    </button>
                  </div>
                </div>


                <div className="admin-editor__grid">
                  <label className="admin-editor__field">
                    <span>
                      Ime
                    </span>

                    <input
                      value={
                        item.name ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "name",
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
                      Izjava
                    </span>

                    <textarea
                      value={
                        item.quote_text ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "quote_text",
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
                    {savingId ===
                    item.id
                      ? "Čuvanje..."
                      : "Sačuvaj"}
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


export default AdminTestimonials;
