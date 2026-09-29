import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import {
  removeGymMediaByUrl,
  replaceGymMedia,
} from "../lib/gymMedia";

import AdminDetailBlocksEditor
  from "../components/Admin/AdminDetailBlocksEditor";

import "./AdminEditor.css";


function AdminTrainers() {
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
    uploadingId,
    setUploadingId,
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
          "gym_trainers"
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
        "Trenere nije moguće učitati."
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
      `novi-trener-${Date.now()}`;


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_trainers"
        )
        .insert({
          slug,

          sort_order:
            newOrder,

          name:
            "Novi trener",

          role:
            "Licencirani trener",

          phone:
            "",

          image_url:
            null,

          summary:
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
        "Novi trener nije dodat."
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
      "Novi trener je dodat."
    );
  }


  async function uploadImage(
    item,
    file
  ) {
    if (!file) {
      return;
    }


    setUploadingId(
      item.id
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
            `trainers/${item.slug}`,

          previousUrl:
            item.image_url,
        });


      updateItem(
        item.id,
        "image_url",
        uploaded.publicUrl
      );

      setMessage(
        "Fotografija je uploadovana. Klikni Sačuvaj da se upiše u profil trenera."
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
      setUploadingId(
        null
      );
    }
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
        "Ime trenera je obavezno."
      );

      return;
    }


    if (
      !String(
        item.slug || ""
      ).trim()
    ) {
      setErrorMessage(
        "Slug trenera je obavezan."
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
          "gym_trainers"
        )
        .update({
          slug:
            item.slug.trim(),

          name:
            item.name.trim(),

          role:
            item.role ??
            "",

          phone:
            item.phone ??
            "",

          image_url:
            item.image_url ||
            null,

          summary:
            item.summary ??
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
        "Trener nije sačuvan."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      `Trener „${item.name}” je sačuvan.`
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
        `Obrisati trenera:\n\n${item.name}?`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "gym_trainers"
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
        "Trener nije obrisan."
      );

      return;
    }


    if (
      item.image_url
    ) {
      try {
        await removeGymMediaByUrl(
          item.image_url
        );
      } catch (
        error
      ) {
        console.warn(
          error
        );
      }
    }


    setMessage(
      "Trener je obrisan."
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
            "gym_trainers"
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
            "gym_trainers"
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
        Učitavanje trenera...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Treneri
          </p>

          <h1>
            Monte Cristo tim.
          </h1>

          <span>
            Uredi kartice trenera,
            telefone, fotografije i
            sadržaj njihovih readera.
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
          + Novi trener
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
          Još nema trenera.
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
                      Trener{" "}
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


                  <label className="admin-editor__field">
                    <span>
                      Uloga
                    </span>

                    <input
                      value={
                        item.role ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "role",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>


                  <label className="admin-editor__field">
                    <span>
                      Telefon
                    </span>

                    <input
                      value={
                        item.phone ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "phone",
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
                      Kratak opis / uvod u reader
                    </span>

                    <textarea
                      value={
                        item.summary ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "summary",
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
                      Fotografija
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      disabled={
                        uploadingId ===
                        item.id
                      }
                      onChange={(
                        event
                      ) =>
                        uploadImage(
                          item,
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
                            "min(100%, 360px)",

                          maxHeight:
                            "320px",

                          objectFit:
                            "cover",
                        }}
                      />
                    </div>
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
                    updateItem(
                      item.id,
                      "detail_blocks",
                      blocks
                    )
                  }
                  mediaFolder={
                    `trainers/${item.slug}/reader`
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


export default AdminTrainers;