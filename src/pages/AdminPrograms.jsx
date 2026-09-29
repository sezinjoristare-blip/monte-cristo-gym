import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import AdminDetailBlocksEditor
  from "../components/Admin/AdminDetailBlocksEditor";

import "./AdminEditor.css";


function AdminPrograms() {
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
          "gym_programs"
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
        "Programe nije moguće učitati."
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


    const slug =
      `novi-program-${Date.now()}`;


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_programs"
        )
        .insert({
          slug,

          sort_order:
            newOrder,

          title:
            "Novi program",

          description:
            "",

          detail_summary:
            "",

          detail_blocks:
            [],

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
        "Novi program nije dodat."
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
      "Novi program je dodat."
    );
  }


  async function saveItem(
    item
  ) {
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
          "gym_programs"
        )
        .update({
          slug:
            item.slug.trim(),

          title:
            item.title.trim(),

          description:
            item.description ??
            "",

          detail_summary:
            item.detail_summary ??
            "",

          detail_blocks:
            Array.isArray(
              item.detail_blocks
            )
              ? item.detail_blocks
              : [],

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
        "Program nije sačuvan."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      `Program „${item.title}” je sačuvan.`
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
        `Obrisati program:\n\n${item.title}?`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "gym_programs"
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
        "Program nije obrisan."
      );

      return;
    }


    setMessage(
      "Program je obrisan."
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
            "gym_programs"
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
            "gym_programs"
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
        Učitavanje programa...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Programi
          </p>

          <h1>
            Programi treninga.
          </h1>

          <span>
            Uredi kartice programa i
            sadržaj koji se otvara u
            DetailReader-u.
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
          + Novi program
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
          Još nema programa u
          Supabase-u.
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
                      Program{" "}
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
                        item.title
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
                        updateItem(
                          item.id,
                          "title",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>


                  <label className="admin-editor__field">
                    <span>
                      Slug
                    </span>

                    <input
                      value={
                        item.slug ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "slug",
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
                      Kratak opis kartice
                    </span>

                    <textarea
                      value={
                        item.description ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "description",
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
                      Uvod u reader
                    </span>

                    <textarea
                      value={
                        item.detail_summary ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "detail_summary",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>
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
                    updateItem(
                      item.id,
                      "detail_blocks",
                      blocks
                    )
                  }
                  mediaFolder={
                    `programs/${item.slug}`
                  }
                />


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


export default AdminPrograms;