import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import "./AdminEditor.css";


function AdminPricing() {
  const [
    plans,
    setPlans,
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
    loadPlans();
  }, []);


  async function loadPlans() {
    setLoading(true);

    setErrorMessage("");


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_pricing_plans"
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
        "Članarine nije moguće učitati."
      );

      setLoading(false);

      return;
    }


    setPlans(
      data ?? []
    );

    setLoading(false);
  }


  function updatePlan(
    id,
    field,
    value
  ) {
    setPlans(
      (
        current
      ) =>
        current.map(
          (plan) =>
            plan.id === id
              ? {
                  ...plan,

                  [field]:
                    value,
                }
              : plan
        )
    );
  }


  async function savePlan(
    plan
  ) {
    setSavingId(
      plan.id
    );

    setMessage("");

    setErrorMessage("");


    const cleanedFeatures =
      Array.isArray(
        plan.features
      )
        ? plan.features
            .map(
              (item) =>
                String(
                  item
                ).trim()
            )
            .filter(
              Boolean
            )
        : [];


    const {
      error,
    } =
      await supabase
        .from(
          "gym_pricing_plans"
        )
        .update({
          label:
            plan.label,

          badge:
            plan.badge,

          title:
            plan.title,

          price:
            plan.price,

          description:
            plan.description,

          features:
            cleanedFeatures,

          featured:
            Boolean(
              plan.featured
            ),

          published:
            Boolean(
              plan.published
            ),

          sort_order:
            Number(
              plan.sort_order
            ),
        })
        .eq(
          "id",
          plan.id
        );


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Izmena nije sačuvana."
      );

      setSavingId(
        null
      );

      return;
    }


    setMessage(
      `Sačuvano: ${plan.title}`
    );

    setSavingId(
      null
    );

    await loadPlans();
  }


  if (loading) {
    return (
      <p>
        Učitavanje članarina...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Članarine
          </p>

          <h1>
            Planovi i cene.
          </h1>

          <span>
            Promene koje ovde
            sačuvaš prikazaće se
            na javnom sajtu.
          </span>
        </div>
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


      <div className="admin-editor__list">
        {plans.map(
          (
            plan,
            index
          ) => (
            <article
              className="admin-editor-card"
              key={
                plan.id
              }
            >
              <div className="admin-editor-card__head">
                <div>
                  <small>
                    Plan
                  </small>

                  <h2>
                    {
                      plan.title
                    }
                  </h2>
                </div>

                <span className="admin-editor-card__index">
                  {String(
                    index +
                      1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>


              <div className="admin-editor__grid">
                <label className="admin-editor__field">
                  <span>
                    Naslov
                  </span>

                  <input
                    value={
                      plan.title ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
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
                    Cena
                  </span>

                  <input
                    value={
                      plan.price ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "price",
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>


                <label className="admin-editor__field">
                  <span>
                    Mala oznaka
                  </span>

                  <input
                    value={
                      plan.label ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "label",
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>


                <label className="admin-editor__field">
                  <span>
                    Bedž
                  </span>

                  <input
                    value={
                      plan.badge ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "badge",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Preporučeno"
                  />
                </label>


                <label className="
                  admin-editor__field
                  admin-editor__field--full
                ">
                  <span>
                    Opis
                  </span>

                  <textarea
                    value={
                      plan.description ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
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
                    Pogodnosti —
                    jedna stavka u
                    svakom redu
                  </span>

                  <textarea
                    value={
                      Array.isArray(
                        plan.features
                      )
                        ? plan.features
                            .join(
                              "\n"
                            )
                        : ""
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "features",
                        event
                          .target
                          .value
                          .split(
                            "\n"
                          )
                      )
                    }
                  />
                </label>


                <label className="admin-editor__field">
                  <span>
                    Redosled
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      plan.sort_order ??
                      0
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "sort_order",
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
                        plan.featured
                      )
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
                        "featured",
                        event
                          .target
                          .checked
                      )
                    }
                  />

                  Istaknuti plan
                </label>


                <label className="admin-editor__check">
                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        plan.published
                      )
                    }
                    onChange={(
                      event
                    ) =>
                      updatePlan(
                        plan.id,
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
                    plan.id
                  }
                  onClick={() =>
                    savePlan(
                      plan
                    )
                  }
                >
                  {savingId ===
                  plan.id
                    ? "Čuvanje..."
                    : "Sačuvaj plan"}
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}


export default AdminPricing;