import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabaseClient";

import "./Testimonials.css";


function Testimonials() {
  const [
    testimonials,
    setTestimonials,
  ] = useState([]);


  useEffect(() => {
    let cancelled =
      false;


    async function loadTestimonials() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "gym_testimonials"
          )
          .select(
            "id, name, quote_text"
          )
          .eq(
            "published",
            true
          )
          .order(
            "sort_order",
            {
              ascending:
                true,
            }
          );


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "Iskustva članova nisu učitana:",
          error
        );

        return;
      }


      setTestimonials(
        data ??
        []
      );
    }


    loadTestimonials();


    return () => {
      cancelled =
        true;
    };
  }, []);


  if (
    testimonials.length ===
    0
  ) {
    return null;
  }


  return (
    <section className="testimonials">
      <div className="testimonials__inner">
        <p className="testimonials__eyebrow">
          Iskustva članova
        </p>

        <h2>
          Šta kažu ljudi
          koji treniraju ovde.
        </h2>

        <div className="testimonials__grid">
          {testimonials.map(
            (
              testimonial
            ) => (
              <blockquote
                key={
                  testimonial.id
                }
              >
                <p>
                  “{
                    testimonial
                      .quote_text
                  }”
                </p>

                <footer>
                  {
                    testimonial
                      .name
                  }
                </footer>
              </blockquote>
            )
          )}
        </div>
      </div>
    </section>
  );
}


export default Testimonials;