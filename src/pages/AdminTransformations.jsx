import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import {
  removeGymMediaByUrl,
  uploadGymMedia,
} from "../lib/gymMedia";

import AdminDetailBlocksEditor
  from "../components/Admin/AdminDetailBlocksEditor";

import "./AdminEditor.css";


function AdminTransformations() {
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
    uploadingKey,
    setUploadingKey,
  ] = useState("");

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
          "gym_transformations"
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
        "Transformacije nije moguće učitati."
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
      `nova-transformacija-${Date.now()}`;


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_transformations"
        )
        .insert({
          slug,

          sort_order:
            newOrder,

          title:
            "Nova transformacija",

          duration:
            "",

          summary:
            "",

          before_image_url:
            null,

          before_alt:
            "",

          before_label:
            "Pre",

          before_value:
            "",

          after_image_url:
            null,

          after_alt:
            "",

          after_label:
            "Posle",

          after_value:
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
        "Nova transformacija nije dodata."
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
      "Nova transformacija je dodata."
    );
  }


  async function uploadImage(
    item,
    side,
    file
  ) {
    if (!file) {
      return;
    }


    const key =
      `${item.id}-${side}`;


    setUploadingKey(
      key
    );

    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


    const imageField =
      side === "before"
        ? "before_image_url"
        : "after_image_url";

    const previousUrl =
      item[
        imageField
      ];

    let uploaded =
      null;


    try {
      uploaded =
        await uploadGymMedia({
          file,

          folder:
            `transformations/${item.slug}/${side}`,
        });


      const {
        error,
      } =
        await supabase
          .from(
            "gym_transformations"
          )
          .update({
            [imageField]:
              uploaded.publicUrl,
          })
          .eq(
            "id",
            item.id
          );


      if (error) {
        throw error;
      }


      if (
        previousUrl
      ) {
        try {
          await removeGymMediaByUrl(
            previousUrl
          );
        } catch (
          cleanupError
        ) {
          console.warn(
            cleanupError
          );
        }
      }


      setMessage(
        side === "before"
          ? "PRE fotografija je sačuvana."
          : "POSLE fotografija je sačuvana."
      );

      await loadItems();
    } catch (
      error
    ) {
      console.error(
        error
      );


      if (
        uploaded?.publicUrl
      ) {
        try {
          await removeGymMediaByUrl(
            uploaded.publicUrl
          );
        } catch (
          cleanupError
        ) {
          console.warn(
            cleanupError
          );
        }
      }


      setErrorMessage(
        "Fotografija nije uploadovana."
      );
    } finally {
      setUploadingKey(
        ""
      );
    }
  }


  async function saveItem(
    item
  ) {
    if (
      !String(
        item.title ||
        ""
      ).trim()
    ) {
      setErrorMessage(
        "Naslov transformacije je obavezan."
      );

      return;
    }


    if (
      !String(
        item.slug ||
        ""
      ).trim()
    ) {
      setErrorMessage(
        "Slug transformacije je obavezan."
      );

      return;
    }


    if (
      item.published &&
      (
        !item.before_image_url ||
        !item.after_image_url
      )
    ) {
      setErrorMessage(
        "Za objavljenu transformaciju potrebne su i PRE i POSLE fotografija."
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
          "gym_transformations"
        )
        .update({
          slug:
            item.slug.trim(),

          title:
            item.title.trim(),

          duration:
            item.duration ??
            "",

          summary:
            item.summary ??
            "",

          before_image_url:
            item.before_image_url ||
            null,

          before_alt:
            item.before_alt ??
            "",

          before_label:
            item.before_label ||
            "Pre",

          before_value:
            item.before_value ??
            "",

          after_image_url:
            item.after_image_url ||
            null,

          after_alt:
            item.after_alt ??
            "",

          after_label:
            item.after_label ||
            "Posle",

          after_value:
            item.after_value ??
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
        "Transformacija nije sačuvana."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      `Transformacija „${item.title}” je sačuvana.`
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
        `Obrisati transformaciju:\n\n${item.title}?`
      );


    if (!confirmed) {
      return;
    }


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
          "gym_transformations"
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
        "Transformacija nije obrisana."
      );

      return;
    }


    const imageUrls = [
      item.before_image_url,
      item.after_image_url,
    ].filter(Boolean);


    for (
      const url
      of imageUrls
    ) {
      try {
        await removeGymMediaByUrl(
          url
        );
      } catch (
        cleanupError
      ) {
        console.warn(
          cleanupError
        );
      }
    }


    setMessage(
      "Transformacija je obrisana."
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
      items[
        index
      ];

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
            "gym_transformations"
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
            "gym_transformations"
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
        Učitavanje transformacija...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Transformacije
          </p>

          <h1>
            Rezultati članova.
          </h1>

          <span>
            Dodaj PRE/POSLE fotografije,
            osnovne podatke i kompletnu
            priču koja se otvara u
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
          + Nova transformacija
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
          Još nema transformacija.
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
                      Transformacija{" "}
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


                  <label className="admin-editor__field">
                    <span>
                      Trajanje / period
                    </span>

                    <input
                      value={
                        item.duration ??
                        ""
                      }
                      placeholder="Na primer: 6 meseci"
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "duration",
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
                      Kratak opis
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
                </div>


                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",

                    gap:
                      "24px",

                    marginTop:
                      "28px",
                  }}
                >
                  <div
                    style={{
                      border:
                        "1px solid rgba(0,0,0,.12)",

                      padding:
                        "18px",
                    }}
                  >
                    <h3>
                      PRE
                    </h3>


                    {item.before_image_url && (
                      <img
                        src={
                          item.before_image_url
                        }
                        alt={
                          item.before_alt ||
                          ""
                        }
                        style={{
                          display:
                            "block",

                          width:
                            "100%",

                          maxHeight:
                            "360px",

                          objectFit:
                            "cover",

                          marginBottom:
                            "16px",
                        }}
                      />
                    )}


                    <label className="admin-editor__field">
                      <span>
                        PRE fotografija
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          uploadingKey ===
                          `${item.id}-before`
                        }
                        onChange={(
                          event
                        ) => {
                          const file =
                            event
                              .target
                              .files?.[0];

                          uploadImage(
                            item,
                            "before",
                            file
                          );

                          event.target.value =
                            "";
                        }}
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Oznaka
                      </span>

                      <input
                        value={
                          item.before_label ??
                          "Pre"
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "before_label",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Vrednost
                      </span>

                      <input
                        value={
                          item.before_value ??
                          ""
                        }
                        placeholder="Na primer: 95 kg"
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "before_value",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Alt tekst
                      </span>

                      <input
                        value={
                          item.before_alt ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "before_alt",
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
                      border:
                        "1px solid rgba(0,0,0,.12)",

                      padding:
                        "18px",
                    }}
                  >
                    <h3>
                      POSLE
                    </h3>


                    {item.after_image_url && (
                      <img
                        src={
                          item.after_image_url
                        }
                        alt={
                          item.after_alt ||
                          ""
                        }
                        style={{
                          display:
                            "block",

                          width:
                            "100%",

                          maxHeight:
                            "360px",

                          objectFit:
                            "cover",

                          marginBottom:
                            "16px",
                        }}
                      />
                    )}


                    <label className="admin-editor__field">
                      <span>
                        POSLE fotografija
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          uploadingKey ===
                          `${item.id}-after`
                        }
                        onChange={(
                          event
                        ) => {
                          const file =
                            event
                              .target
                              .files?.[0];

                          uploadImage(
                            item,
                            "after",
                            file
                          );

                          event.target.value =
                            "";
                        }}
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Oznaka
                      </span>

                      <input
                        value={
                          item.after_label ??
                          "Posle"
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "after_label",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Vrednost
                      </span>

                      <input
                        value={
                          item.after_value ??
                          ""
                        }
                        placeholder="Na primer: 82 kg"
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "after_value",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>


                    <label className="admin-editor__field">
                      <span>
                        Alt tekst
                      </span>

                      <input
                        value={
                          item.after_alt ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            item.id,
                            "after_alt",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
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
                    `transformations/${item.slug}/reader`
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


export default AdminTransformations;