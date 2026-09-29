import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../lib/supabaseClient";

import "./AdminEditor.css";


function AdminContact() {
  const [
    settings,
    setSettings,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
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
    loadSettings();
  }, []);


  async function loadSettings() {
    setLoading(true);


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "gym_settings"
        )
        .select("*")
        .eq(
          "id",
          1
        )
        .single();


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Kontakt podatke nije moguće učitati."
      );

      setLoading(false);

      return;
    }


    setSettings(
      data
    );

    setLoading(false);
  }


  function updateField(
    field,
    value
  ) {
    setSettings(
      (
        current
      ) => ({
        ...current,

        [field]:
          value,
      })
    );
  }


  async function saveSettings() {
    setSaving(true);

    setMessage("");

    setErrorMessage("");


    const {
      error,
    } =
      await supabase
        .from(
          "gym_settings"
        )
        .update({
          phone_relja:
            settings
              .phone_relja,

          phone_nole:
            settings
              .phone_nole,

          instagram_url:
            settings
              .instagram_url,

          map_url:
            settings
              .map_url,

          location_text:
            settings
              .location_text,

          working_hours:
            settings
              .working_hours,

          contact_heading:
            settings
              .contact_heading,

          contact_lead:
            settings
              .contact_lead,
        })
        .eq(
          "id",
          1
        );


    if (error) {
      console.error(
        error
      );

      setErrorMessage(
        "Kontakt podaci nisu sačuvani."
      );

      setSaving(false);

      return;
    }


    setMessage(
      "Kontakt podaci su sačuvani."
    );

    setSaving(false);

    await loadSettings();
  }


  if (
    loading ||
    !settings
  ) {
    return (
      <p>
        Učitavanje kontakta...
      </p>
    );
  }


  return (
    <section className="admin-editor">
      <header className="admin-editor__header">
        <div className="admin-editor__header-copy">
          <p>
            Kontakt
          </p>

          <h1>
            Kontakt podaci.
          </h1>

          <span>
            Telefoni, Instagram,
            lokacija, radno vreme
            i tekst kontakt sekcije.
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


      <div className="admin-editor__single">
        <div className="admin-editor__grid">

          <label className="admin-editor__field">
            <span>
              Relja — telefon
            </span>

            <input
              value={
                settings
                  .phone_relja ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "phone_relja",
                  event.target
                    .value
                )
              }
            />
          </label>


          <label className="admin-editor__field">
            <span>
              Nole — telefon
            </span>

            <input
              value={
                settings
                  .phone_nole ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "phone_nole",
                  event.target
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
              Instagram URL
            </span>

            <input
              value={
                settings
                  .instagram_url ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "instagram_url",
                  event.target
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
              Google Maps URL
            </span>

            <input
              value={
                settings
                  .map_url ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "map_url",
                  event.target
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
              Tekst lokacije
            </span>

            <input
              value={
                settings
                  .location_text ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "location_text",
                  event.target
                    .value
                )
              }
            />
          </label>


          <label className="admin-editor__field">
            <span>
              Radno vreme
            </span>

            <input
              value={
                settings
                  .working_hours ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "working_hours",
                  event.target
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
              Naslov kontakt sekcije
            </span>

            <input
              value={
                settings
                  .contact_heading ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "contact_heading",
                  event.target
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
              Uvodni tekst
            </span>

            <textarea
              value={
                settings
                  .contact_lead ??
                ""
              }
              onChange={(
                event
              ) =>
                updateField(
                  "contact_lead",
                  event.target
                    .value
                )
              }
            />
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
              saving
            }
            onClick={
              saveSettings
            }
          >
            {saving
              ? "Čuvanje..."
              : "Sačuvaj kontakt"}
          </button>
        </div>
      </div>
    </section>
  );
}


export default AdminContact;