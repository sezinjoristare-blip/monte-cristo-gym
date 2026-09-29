function AdminSectionPlaceholder({
  eyebrow,
  title,
  description,
}) {
  return (
    <section className="admin-placeholder">
      <header className="admin-page-header">
        <p>
          {eyebrow}
        </p>

        <h1>
          {title}
        </h1>

        <div className="admin-page-header__line">
          <p>
            {description}
          </p>
        </div>
      </header>


      <div className="admin-placeholder__box">
        <span>
          Sledeći korak
        </span>

        <h2>
          Supabase forma
          za ovu sekciju.
        </h2>

        <p>
          Ruta i administratorska
          zaštita već rade.
          Ovde ćemo sada povezati
          čitanje, dodavanje,
          izmenu, brisanje i
          objavljivanje sadržaja.
        </p>
      </div>
    </section>
  );
}


export default AdminSectionPlaceholder;