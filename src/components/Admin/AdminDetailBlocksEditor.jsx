import {
  useState,
} from "react";

import {
  uploadGymMedia,
} from "../../lib/gymMedia";

import "./AdminDetailBlocksEditor.css";


const BLOCK_TYPES = [
  {
    type:
      "paragraph",

    label:
      "Tekst",
  },

  {
    type:
      "image",

    label:
      "Slika",
  },

  {
    type:
      "video",

    label:
      "Video fajl",
  },

  {
    type:
      "youtube",

    label:
      "YouTube",
  },

  {
    type:
      "instagram",

    label:
      "Instagram",
  },

  {
    type:
      "quote",

    label:
      "Citat",
  },

  {
    type:
      "facts",

    label:
      "Facts",
  },
];


function createBlock(
  type
) {
  if (
    type ===
    "paragraph"
  ) {
    return {
      type:
        "paragraph",

      title:
        "",

      text:
        "",
    };
  }


  if (
    type ===
    "image"
  ) {
    return {
      type:
        "image",

      src:
        "",

      storagePath:
        "",

      alt:
        "",

      caption:
        "",
    };
  }


  if (
    type ===
    "video"
  ) {
    return {
      type:
        "video",

      src:
        "",

      storagePath:
        "",

      poster:
        "",

      caption:
        "",
    };
  }


  if (
    type ===
      "youtube" ||
    type ===
      "instagram"
  ) {
    return {
      type,

      url:
        "",

      caption:
        "",
    };
  }


  if (
    type ===
    "quote"
  ) {
    return {
      type:
        "quote",

      text:
        "",

      author:
        "",
    };
  }


  if (
    type ===
    "facts"
  ) {
    return {
      type:
        "facts",

      items: [
        {
          label:
            "01",

          title:
            "",

          text:
            "",
        },
      ],
    };
  }


  return {
    type,
  };
}


function AdminDetailBlocksEditor({
  blocks = [],
  onChange,
  mediaFolder =
    "reader",
}) {
  const [
    uploadingKey,
    setUploadingKey,
  ] = useState("");


  function updateBlock(
    index,
    field,
    value
  ) {
    onChange(
      blocks.map(
        (
          block,
          blockIndex
        ) =>
          blockIndex ===
          index
            ? {
                ...block,

                [field]:
                  value,
              }
            : block
      )
    );
  }


  function addBlock(
    type
  ) {
    onChange([
      ...blocks,
      createBlock(
        type
      ),
    ]);
  }


  function removeBlock(
    index
  ) {
    const confirmed =
      window.confirm(
        "Obrisati ovaj blok?"
      );


    if (!confirmed) {
      return;
    }


    onChange(
      blocks.filter(
        (
          _,
          blockIndex
        ) =>
          blockIndex !==
          index
      )
    );
  }


  function moveBlock(
    index,
    direction
  ) {
    const targetIndex =
      index +
      direction;


    if (
      targetIndex < 0 ||
      targetIndex >=
        blocks.length
    ) {
      return;
    }


    const next =
      [
        ...blocks,
      ];


    [
      next[index],
      next[targetIndex],
    ] = [
      next[targetIndex],
      next[index],
    ];


    onChange(
      next
    );
  }


  function updateFact(
    blockIndex,
    factIndex,
    field,
    value
  ) {
    const block =
      blocks[
        blockIndex
      ];


    const items =
      (
        block.items ||
        []
      ).map(
        (
          item,
          index
        ) =>
          index ===
          factIndex
            ? {
                ...item,

                [field]:
                  value,
              }
            : item
      );


    updateBlock(
      blockIndex,
      "items",
      items
    );
  }


  function addFact(
    blockIndex
  ) {
    const block =
      blocks[
        blockIndex
      ];


    const items = [
      ...(
        block.items ||
        []
      ),

      {
        label:
          String(
            (
              block.items ||
              []
            ).length +
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
    ];


    updateBlock(
      blockIndex,
      "items",
      items
    );
  }


  function removeFact(
    blockIndex,
    factIndex
  ) {
    const block =
      blocks[
        blockIndex
      ];


    updateBlock(
      blockIndex,
      "items",
      (
        block.items ||
        []
      ).filter(
        (
          _,
          index
        ) =>
          index !==
          factIndex
      )
    );
  }


  async function handleMediaUpload(
    blockIndex,
    file
  ) {
    if (!file) {
      return;
    }


    const key =
      `${blockIndex}-${Date.now()}`;


    setUploadingKey(
      key
    );


    try {
      const uploaded =
        await uploadGymMedia({
          file,

          folder:
            mediaFolder,
        });


      const block =
        blocks[
          blockIndex
        ];


      onChange(
        blocks.map(
          (
            current,
            index
          ) =>
            index ===
            blockIndex
              ? {
                  ...block,

                  src:
                    uploaded.publicUrl,

                  storagePath:
                    uploaded.path,
                }
              : current
        )
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      window.alert(
        "Upload fajla nije uspeo."
      );
    } finally {
      setUploadingKey(
        ""
      );
    }
  }


  return (
    <div className="admin-blocks">
      <div className="admin-blocks__heading">
        <div>
          <small>
            DetailReader
          </small>

          <h3>
            Sadržaj readera
          </h3>
        </div>
      </div>


      <div className="admin-blocks__add">
        {BLOCK_TYPES.map(
          (
            item
          ) => (
            <button
              type="button"
              key={
                item.type
              }
              onClick={() =>
                addBlock(
                  item.type
                )
              }
            >
              + {item.label}
            </button>
          )
        )}
      </div>


      {blocks.length ===
      0 ? (
        <div className="admin-blocks__empty">
          Reader još nema
          sadržajne blokove.
        </div>
      ) : (
        <div className="admin-blocks__list">
          {blocks.map(
            (
              block,
              index
            ) => (
              <article
                className="admin-block"
                key={
                  `${block.type}-${index}`
                }
              >
                <header className="admin-block__header">
                  <div>
                    <small>
                      Blok{" "}
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </small>

                    <strong>
                      {
                        BLOCK_TYPES.find(
                          (
                            item
                          ) =>
                            item.type ===
                            block.type
                        )
                          ?.label ||
                        block.type
                      }
                    </strong>
                  </div>


                  <div className="admin-block__controls">
                    <button
                      type="button"
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        moveBlock(
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
                        blocks.length -
                          1
                      }
                      onClick={() =>
                        moveBlock(
                          index,
                          1
                        )
                      }
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeBlock(
                          index
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                </header>


                {block.type ===
                  "paragraph" && (
                  <div className="admin-block__fields">
                    <label>
                      <span>
                        Naslov
                      </span>

                      <input
                        value={
                          block.title ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "title",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Tekst
                      </span>

                      <textarea
                        value={
                          block.text ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
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
                )}


                {block.type ===
                  "image" && (
                  <div className="admin-block__fields">
                    <label>
                      <span>
                        Upload slike
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          Boolean(
                            uploadingKey
                          )
                        }
                        onChange={(
                          event
                        ) =>
                          handleMediaUpload(
                            index,
                            event
                              .target
                              .files?.[0]
                          )
                        }
                      />
                    </label>

                    {block.src && (
                      <img
                        className="admin-block__preview"
                        src={
                          block.src
                        }
                        alt=""
                      />
                    )}

                    <label>
                      <span>
                        URL slike
                      </span>

                      <input
                        value={
                          block.src ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "src",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Alt tekst
                      </span>

                      <input
                        value={
                          block.alt ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "alt",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Opis ispod slike
                      </span>

                      <input
                        value={
                          block.caption ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "caption",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
                )}


                {block.type ===
                  "video" && (
                  <div className="admin-block__fields">
                    <label>
                      <span>
                        Upload videa
                      </span>

                      <input
                        type="file"
                        accept="video/*"
                        disabled={
                          Boolean(
                            uploadingKey
                          )
                        }
                        onChange={(
                          event
                        ) =>
                          handleMediaUpload(
                            index,
                            event
                              .target
                              .files?.[0]
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        URL videa
                      </span>

                      <input
                        value={
                          block.src ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "src",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Poster URL
                      </span>

                      <input
                        value={
                          block.poster ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "poster",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Opis
                      </span>

                      <input
                        value={
                          block.caption ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "caption",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
                )}


                {(
                  block.type ===
                    "youtube" ||
                  block.type ===
                    "instagram"
                ) && (
                  <div className="admin-block__fields">
                    <label>
                      <span>
                        Link
                      </span>

                      <input
                        placeholder={
                          block.type ===
                          "youtube"
                            ? "https://youtube.com/watch?v=..."
                            : "https://instagram.com/reel/..."
                        }
                        value={
                          block.url ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "url",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Opis
                      </span>

                      <input
                        value={
                          block.caption ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "caption",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
                )}


                {block.type ===
                  "quote" && (
                  <div className="admin-block__fields">
                    <label>
                      <span>
                        Citat
                      </span>

                      <textarea
                        value={
                          block.text ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "text",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Autor
                      </span>

                      <input
                        value={
                          block.author ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateBlock(
                            index,
                            "author",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
                )}


                {block.type ===
                  "facts" && (
                  <div className="admin-block__facts">
                    {(
                      block.items ||
                      []
                    ).map(
                      (
                        fact,
                        factIndex
                      ) => (
                        <div
                          className="admin-block__fact"
                          key={
                            factIndex
                          }
                        >
                          <label>
                            <span>
                              Oznaka
                            </span>

                            <input
                              value={
                                fact.label ??
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                updateFact(
                                  index,
                                  factIndex,
                                  "label",
                                  event
                                    .target
                                    .value
                                )
                              }
                            />
                          </label>

                          <label>
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
                                  factIndex,
                                  "title",
                                  event
                                    .target
                                    .value
                                )
                              }
                            />
                          </label>

                          <label>
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
                                  factIndex,
                                  "text",
                                  event
                                    .target
                                    .value
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              removeFact(
                                index,
                                factIndex
                              )
                            }
                          >
                            Obriši činjenicu
                          </button>
                        </div>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        addFact(
                          index
                        )
                      }
                    >
                      + Dodaj činjenicu
                    </button>
                  </div>
                )}
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}


export default AdminDetailBlocksEditor;