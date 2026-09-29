import {
  supabase,
} from "./supabaseClient";


export const GYM_MEDIA_BUCKET =
  "gym-media";


function sanitizeSegment(
  value
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9._-]+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}


function sanitizeFolder(
  folder
) {
  return String(
    folder || "uploads"
  )
    .split("/")
    .map(
      sanitizeSegment
    )
    .filter(Boolean)
    .join("/");
}


function sanitizeFileName(
  fileName
) {
  const name =
    String(
      fileName || "file"
    );

  const dotIndex =
    name.lastIndexOf(".");

  const baseName =
    dotIndex > 0
      ? name.slice(
          0,
          dotIndex
        )
      : name;

  const extension =
    dotIndex > 0
      ? name.slice(
          dotIndex + 1
        )
      : "";

  const safeBase =
    sanitizeSegment(
      baseName
    ) ||
    "file";

  const safeExtension =
    sanitizeSegment(
      extension
    );


  return safeExtension
    ? `${safeBase}.${safeExtension}`
    : safeBase;
}


export async function uploadGymMedia({
  file,
  folder = "uploads",
}) {
  if (!file) {
    throw new Error(
      "Fajl nije izabran."
    );
  }


  const safeFolder =
    sanitizeFolder(
      folder
    ) ||
    "uploads";

  const safeName =
    sanitizeFileName(
      file.name
    );

  const uniqueName =
    `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const path =
    `${safeFolder}/${uniqueName}`;


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        GYM_MEDIA_BUCKET
      )
      .upload(
        path,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,

          contentType:
            file.type ||
            undefined,
        }
      );


  if (error) {
    throw error;
  }


  const {
    data,
  } =
    supabase
      .storage
      .from(
        GYM_MEDIA_BUCKET
      )
      .getPublicUrl(
        path
      );


  return {
    path,

    publicUrl:
      data.publicUrl,
  };
}


export function getGymMediaPathFromUrl(
  value
) {
  if (!value) {
    return null;
  }


  try {
    const url =
      new URL(
        value
      );

    const marker =
      `/storage/v1/object/public/${GYM_MEDIA_BUCKET}/`;

    const markerIndex =
      url.pathname.indexOf(
        marker
      );


    if (
      markerIndex ===
      -1
    ) {
      return null;
    }


    const encodedPath =
      url.pathname.slice(
        markerIndex +
        marker.length
      );


    return decodeURIComponent(
      encodedPath
    );
  } catch {
    return null;
  }
}


export async function removeGymMedia(
  path
) {
  if (!path) {
    return;
  }


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        GYM_MEDIA_BUCKET
      )
      .remove([
        path,
      ]);


  if (error) {
    throw error;
  }
}


export async function removeGymMediaByUrl(
  value
) {
  const path =
    getGymMediaPathFromUrl(
      value
    );


  if (!path) {
    return;
  }


  await removeGymMedia(
    path
  );
}


export async function replaceGymMedia({
  file,
  folder,
}) {
  /*
    Namerno NE brišemo prethodni fajl ovde.

    Upload se dešava pre klika na "Sačuvaj".
    Kada bismo odmah obrisali staru sliku, a
    čuvanje reda u bazi kasnije ne uspe,
    baza bi ostala vezana za obrisani URL.

    Brisanje trenutnog fajla radimo bezbedno
    kada se ceo zapis obriše.
  */

  return uploadGymMedia({
    file,
    folder,
  });
}