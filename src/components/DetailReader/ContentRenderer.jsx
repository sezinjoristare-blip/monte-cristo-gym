import {
  useEffect,
  useState,
} from "react";


function MediaPlaceholder({
  label,
}) {
  return (
    <div className="detail-reader__media-placeholder">
      <span>
        {label}
      </span>
    </div>
  );
}


function BeforeAfter({
  before,
  after,
}) {
  return (
    <div className="detail-reader__before-after">
      <figure>
        {before?.src ? (
          <img
            src={
              before.src
            }
            alt={
              before.alt ||
              "Pre"
            }
            loading="lazy"
          />
        ) : (
          <MediaPlaceholder
            label="PRE"
          />
        )}

        <figcaption>
          <span>
            {before?.label ||
              "Pre"}
          </span>

          {before?.value && (
            <strong>
              {
                before.value
              }
            </strong>
          )}
        </figcaption>
      </figure>


      <figure>
        {after?.src ? (
          <img
            src={
              after.src
            }
            alt={
              after.alt ||
              "Posle"
            }
            loading="lazy"
          />
        ) : (
          <MediaPlaceholder
            label="POSLE"
          />
        )}

        <figcaption>
          <span>
            {after?.label ||
              "Posle"}
          </span>

          {after?.value && (
            <strong>
              {
                after.value
              }
            </strong>
          )}
        </figcaption>
      </figure>
    </div>
  );
}


function TransformationCollection({
  items,
  pushDetail,
}) {
  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);


  if (
    !items ||
    items.length === 0
  ) {
    return (
      <div className="detail-reader__empty">
        <span>
          Transformacije
        </span>

        <p>
          Stvarne priče članova
          biće dodate kada
          dobijemo njihove
          fotografije, podatke i
          dozvolu za objavljivanje.
        </p>
      </div>
    );
  }


  const current =
    items[currentIndex];


  function previous() {
    setCurrentIndex(
      (index) =>
        index === 0
          ? items.length - 1
          : index - 1
    );
  }


  function next() {
    setCurrentIndex(
      (index) =>
        index ===
        items.length - 1
          ? 0
          : index + 1
    );
  }


  return (
    <section className="detail-reader__transformation-browser">
      <div className="detail-reader__transformation-controls">
        <button
          type="button"
          onClick={previous}
          aria-label="Prethodna transformacija"
        >
          ←
        </button>

        <span>
          {currentIndex + 1}
          {" / "}
          {items.length}
        </span>

        <button
          type="button"
          onClick={next}
          aria-label="Sledeća transformacija"
        >
          →
        </button>
      </div>


      <div className="detail-reader__transformation-card">
        <BeforeAfter
          before={
            current.before
          }
          after={
            current.after
          }
        />


        <div className="detail-reader__transformation-copy">
          {current.duration && (
            <small>
              {
                current.duration
              }
            </small>
          )}

          <h3>
            {current.title}
          </h3>

          <p>
            {current.summary}
          </p>


          <button
            type="button"
            className="detail-reader__story-button"
            onClick={() =>
              pushDetail(
                current.detailId
              )
            }
          >
            Otvori priču

            <span
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}


function VideoBlock({
  src,
  poster,
  caption,
}) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  if (!src) {
    return null;
  }


  if (!isOpen) {
    return (
      <div
        style={{
          margin:
            "28px 0",
        }}
      >
        <button
          type="button"
          className="
            mc-button
            mc-button--primary
          "
          onClick={() =>
            setIsOpen(
              true
            )
          }
        >
          Pusti video

          <span
            aria-hidden="true"
          >
            ▶
          </span>
        </button>

        {caption && (
          <p
            style={{
              marginTop:
                "10px",

              marginBottom:
                0,

              opacity:
                0.65,
            }}
          >
            {caption}
          </p>
        )}
      </div>
    );
  }


  return (
    <figure className="detail-reader__video-block">
      <video
        controls
        autoPlay
        playsInline
        preload="metadata"
        poster={
          poster ||
          undefined
        }
      >
        <source
          src={
            src
          }
        />

        Tvoj browser ne
        podržava video.
      </video>

      {caption && (
        <figcaption>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}


function getYouTubeVideoId(
  value
) {
  if (!value) {
    return null;
  }


  try {
    const url =
      new URL(
        value.trim()
      );

    const host =
      url.hostname
        .replace(
          /^www\./,
          ""
        )
        .replace(
          /^m\./,
          ""
        );


    if (
      host ===
      "youtu.be"
    ) {
      return (
        url.pathname
          .split("/")
          .filter(Boolean)[0] ||
        null
      );
    }


    if (
      host ===
        "youtube.com" ||
      host ===
        "youtube-nocookie.com"
    ) {
      if (
        url.pathname ===
        "/watch"
      ) {
        return (
          url.searchParams.get(
            "v"
          ) || null
        );
      }


      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);


      if (
        [
          "embed",
          "shorts",
          "live",
        ].includes(
          parts[0]
        )
      ) {
        return (
          parts[1] ||
          null
        );
      }
    }
  } catch {
    return null;
  }


  return null;
}


function YouTubeEmbed({
  url,
  caption,
}) {
  const videoId =
    getYouTubeVideoId(
      url
    );


  if (!videoId) {
    return null;
  }


  return (
    <figure className="detail-reader__video-block">
      <iframe
        src={
          `https://www.youtube-nocookie.com/embed/${videoId}`
        }
        title={
          caption ||
          "YouTube video"
        }
        loading="lazy"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          width:
            "100%",

          aspectRatio:
            "16 / 9",

          border:
            0,

          display:
            "block",
        }}
      />

      {caption && (
        <figcaption>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}


function normalizeInstagramUrl(
  value
) {
  if (!value) {
    return null;
  }


  try {
    const url =
      new URL(
        value.trim()
      );

    const host =
      url.hostname
        .replace(
          /^www\./,
          ""
        );


    if (
      host !==
        "instagram.com" &&
      host !==
        "instagr.am"
    ) {
      return null;
    }


    const parts =
      url.pathname
        .split("/")
        .filter(Boolean);


    if (
      ![
        "p",
        "reel",
        "tv",
      ].includes(
        parts[0]
      )
    ) {
      return null;
    }


    if (!parts[1]) {
      return null;
    }


    return (
      `https://www.instagram.com/${parts[0]}/${parts[1]}/`
    );
  } catch {
    return null;
  }
}


function InstagramEmbed({
  url,
  caption,
}) {
  const normalizedUrl =
    normalizeInstagramUrl(
      url
    );


  useEffect(() => {
    if (
      !normalizedUrl
    ) {
      return;
    }


    function processEmbeds() {
      window.instgrm
        ?.Embeds
        ?.process?.();
    }


    const existingScript =
      document.querySelector(
        'script[src="https://www.instagram.com/embed.js"]'
      );


    if (
      existingScript
    ) {
      processEmbeds();

      existingScript.addEventListener(
        "load",
        processEmbeds,
        {
          once: true,
        }
      );


      return () => {
        existingScript.removeEventListener(
          "load",
          processEmbeds
        );
      };
    }


    const script =
      document.createElement(
        "script"
      );


    script.src =
      "https://www.instagram.com/embed.js";

    script.async =
      true;

    script.onload =
      processEmbeds;


    document.body.appendChild(
      script
    );


    return undefined;
  }, [
    normalizedUrl,
  ]);


  if (
    !normalizedUrl
  ) {
    return null;
  }


  return (
    <figure className="detail-reader__video-block">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={
          normalizedUrl
        }
        data-instgrm-version="14"
        style={{
          margin:
            "0 auto",

          width:
            "100%",

          minWidth:
            0,
        }}
      >
        <a
          href={
            normalizedUrl
          }
          target="_blank"
          rel="noreferrer"
        >
          Pogledaj objavu na
          Instagramu
        </a>
      </blockquote>

      {caption && (
        <figcaption>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}


function ContentRenderer({
  blocks = [],
  pushDetail,
}) {
  return (
    <div className="detail-reader__blocks">
      {blocks.map(
        (
          block,
          index
        ) => {
          const key =
            `${block.type}-${index}`;


          if (
            block.type ===
            "paragraph"
          ) {
            return (
              <section
                className="detail-reader__text-block"
                key={key}
              >
                {block.title && (
                  <h3>
                    {
                      block.title
                    }
                  </h3>
                )}

                <p>
                  {block.text}
                </p>
              </section>
            );
          }


          if (
            block.type ===
            "facts"
          ) {
            return (
              <div
                className="detail-reader__facts"
                key={key}
              >
                {(
                  block.items ||
                  []
                ).map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <article
                      key={
                        item.label ||
                        itemIndex
                      }
                    >
                      <span>
                        {
                          item.label
                        }
                      </span>

                      <div>
                        <h3>
                          {
                            item.title
                          }
                        </h3>

                        <p>
                          {
                            item.text
                          }
                        </p>
                      </div>
                    </article>
                  )
                )}
              </div>
            );
          }


          if (
            block.type ===
            "image"
          ) {
            if (!block.src) {
              return null;
            }

            return (
              <figure
                className="detail-reader__image-block"
                key={key}
              >
                <img
                  src={
                    block.src
                  }
                  alt={
                    block.alt ||
                    ""
                  }
                  loading="lazy"
                />

                {block.caption && (
                  <figcaption>
                    {
                      block.caption
                    }
                  </figcaption>
                )}
              </figure>
            );
          }


          if (
            block.type ===
            "video"
          ) {
            return (
              <VideoBlock
                key={key}
                src={
                  block.src
                }
                poster={
                  block.poster
                }
                caption={
                  block.caption
                }
              />
            );
          }


          if (
            block.type ===
            "youtube"
          ) {
            return (
              <YouTubeEmbed
                key={key}
                url={
                  block.url
                }
                caption={
                  block.caption
                }
              />
            );
          }


          if (
            block.type ===
            "instagram"
          ) {
            return (
              <InstagramEmbed
                key={key}
                url={
                  block.url
                }
                caption={
                  block.caption
                }
              />
            );
          }


          if (
            block.type ===
            "beforeAfter"
          ) {
            return (
              <BeforeAfter
                key={key}
                before={
                  block.before
                }
                after={
                  block.after
                }
              />
            );
          }


          if (
            block.type ===
            "transformations"
          ) {
            return (
              <TransformationCollection
                key={key}
                items={
                  block.items
                }
                pushDetail={
                  pushDetail
                }
              />
            );
          }


          if (
            block.type ===
            "quote"
          ) {
            return (
              <blockquote
                className="detail-reader__quote"
                key={key}
              >
                <p>
                  {block.text}
                </p>

                {block.author && (
                  <footer>
                    {
                      block.author
                    }
                  </footer>
                )}
              </blockquote>
            );
          }


          return null;
        }
      )}
    </div>
  );
}


export default ContentRenderer;