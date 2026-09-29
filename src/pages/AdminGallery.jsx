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

import "./AdminEditor.css";


function AdminGallery() {
  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    adding,
    setAdding,
  ] = useState(false);

  const [
    replacingId,
    setReplacingId,
  ] = useState(null);

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
          "gym_gallery"
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
        "Galeriju nije moguće učitati."
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


  async function addImage(
    file
  ) {
    if (!file) {
      return;
    }


    setAdding(
      true
    );

    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


    let uploaded =
      null;


    try {
      uploaded =
        await uploadGymMedia({
          file,

          folder:
            "gallery",
        });


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
            "gym_gallery"
          )
          .insert({
            sort_order:
              newOrder,

            image_url:
              uploaded.publicUrl,

            alt:
              "",

            published:
              true,
          })
          .select("*")
          .single();


      if (error) {
        throw error;
      }


      setItems(
        (current) => [
          data,
          ...current,
        ]
      );

      setMessage(
        "Fotografija je dodata u galeriju."
      );
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
        "Fotografija nije dodata."
      );
    } finally {
      setAdding(
        false
      );
    }
  }


  async function replaceImage(
    item,
    file
  ) {
    if (!file) {
      return;
    }


    setReplacingId(
      item.id
    );

    setMessage(
      ""
    );

    setErrorMessage(
      ""
    );


    let uploaded =
      null;


    try {
      uploaded =
        await uploadGymMedia({
          file,

          folder:
            "gallery",
        });


      const {
        error,
      } =
        await supabase
          .from(
            "gym_gallery"
          )
          .update({
            image_url:
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
        item.image_url
      ) {
        try {
          await removeGymMediaByUrl(
            item.image_url
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
        "Fotografija je zamenjena."
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
        "Fotografija nije zamenjena."
      );
    } finally {
      setReplacingId(
        null
      );
    }
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
          "gym_gallery"
        )
        .update({
          alt:
            item.alt ??
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
        "Fotografija nije sačuvana."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      "Fotografija je sačuvana."
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
        "Obrisati ovu fotografiju iz galerije?"
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
          "gym_gallery"
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
        "Fotografija nije obrisana."
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
        cleanupError
      ) {
        console.warn(
          cleanupError
        );
      }
    }


    setMessage(
      "Fotografija je obrisana."
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
            "gym_gallery"
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
            "gym_gallery"
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
        Učitavanje galerije...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Galerija
          </p>

          <h1>
            Fotografije teretane.
          </h1>

          <span>
            Dodaj fotografije, promeni
            redosled i odredi koje se
            prikazuju na javnom sajtu.
            Javni dizajn prikazuje prvih
            pet objavljenih fotografija.
          </span>
        </div>


        <label
          className="
            admin-editor__button
            admin-editor__button--primary
          "
          style={{
            cursor:
              adding
                ? "wait"
                : "pointer",
          }}
        >
          {adding
            ? "Upload..."
            : "+ Dodaj fotografiju"}

          <input
            type="file"
            accept="image/*"
            disabled={
              adding
            }
            onChange={(
              event
            ) => {
              const file =
                event
                  .target
                  .files?.[0];

              addImage(
                file
              );

              event.target.value =
                "";
            }}
            style={{
              display:
                "none",
            }}
          />
        </label>
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
          Još nema fotografija.
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
                      Fotografija{" "}
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </small>

                    <h2>
                      Galerija
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
                  <div className="
                    admin-editor__field
                    admin-editor__field--full
                  ">
                    <span>
                      Fotografija
                    </span>

                    <img
                      src={
                        item.image_url
                      }
                      alt={
                        item.alt ||
                        ""
                      }
                      style={{
                        display:
                          "block",

                        width:
                          "min(100%, 520px)",

                        maxHeight:
                          "360px",

                        objectFit:
                          "cover",
                      }}
                    />
                  </div>


                  <label className="
                    admin-editor__field
                    admin-editor__field--full
                  ">
                    <span>
                      Zameni fotografiju
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      disabled={
                        replacingId ===
                        item.id
                      }
                      onChange={(
                        event
                      ) => {
                        const file =
                          event
                            .target
                            .files?.[0];

                        replaceImage(
                          item,
                          file
                        );

                        event.target.value =
                          "";
                      }}
                    />
                  </label>


                  <label className="
                    admin-editor__field
                    admin-editor__field--full
                  ">
                    <span>
                      Alt tekst
                    </span>

                    <input
                      value={
                        item.alt ??
                        ""
                      }
                      placeholder="Na primer: Sprave u Monte Cristo teretani"
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          item.id,
                          "alt",
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


export default AdminGallery;
