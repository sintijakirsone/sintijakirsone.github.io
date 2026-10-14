/* =========================================================
   SITE CONTENT — edit this file to change works and texts.
   ---------------------------------------------------------
   • Each work needs a unique "id" (small letters, numbers, "-").
     The work page address becomes: work.html#<id>
   • "techniques" uses the ids from TECHNIQUES below.
     A work can have one or more techniques.
   • "cutout" = the image used in the pile (PNG with
     transparent background works best).
   • "images" = photos shown on the work page.
   • "video": null for no video, or
       { src: "videos/my-video.mp4" }          (your own file)
       { link: "https://vimeo.com/..." }      (link to Vimeo/YouTube)
   • Texts have "en", "lv" and "zh". If one is empty,
     English is shown instead.
   ========================================================= */

window.TECHNIQUES = [
  { id: "screenprint",  en: "Screen print",  lv: "Sietspiede",   zh: "" },
  { id: "installation", en: "Installations", lv: "Instalācijas", zh: "" },
  { id: "video",        en: "Video",         lv: "Video",        zh: "" }
];

window.UI = {
  works:        { en: "Works",        lv: "Darbi",       zh: "" },
  about:        { en: "About me",     lv: "Par mani",    zh: "" },
  contact:      { en: "Contact",      lv: "Kontakti",    zh: "" },
  all:          { en: "All",          lv: "Visi",        zh: "" },
  allTitle:     { en: "All works",    lv: "Visi darbi",  zh: "" },
  publications: { en: "Publications", lv: "Publikācijas", zh: "" },
  sound:        { en: "Sound",        lv: "Skaņa",       zh: "" },
  background:   { en: "Background",   lv: "Fons",        zh: "" },
  playVideo:    { en: "Watch video",  lv: "Skatīt video", zh: "" },
  videoSoon:    { en: "Video coming soon", lv: "Video drīzumā", zh: "" },
  back:         { en: "All works",    lv: "Visi darbi",  zh: "" },
  next:         { en: "Next work",    lv: "Nākamais darbs", zh: "" }
};

window.ABOUT = {
  photo: "images/about/portrait-placeholder.svg",
  text: {
    en: "My name is Sintija Kirsone. I am a multidisciplinary artist based in Riga, Latvia. My main focus is creating installations and art objects that reflect our current times and ourselves.",
    lv: "Mani sauc Sintija Kirsone. Esmu multidisciplināra māksliniece no Rīgas. Galvenokārt veidoju instalācijas un mākslas objektus, kas atspoguļo mūsdienas un mūs pašus.",
    zh: ""
  }
};

/* Placeholder text used by every work until real texts are ready */
var PH_EN = "Placeholder text. Here you will describe the work: the idea behind it, how it was made, and where it was shown. A second paragraph can talk about the materials and the process.";
var PH_LV = "Vietturis teksts. Šeit būs darba apraksts: ideja, kā tas tapa un kur tas tika izstādīts. Otrajā rindkopā var pastāstīt par materiāliem un procesu.";

function placeholderWork(id, title, year, techniques, materialsEn, materialsLv, opts) {
  opts = opts || {};
  return {
    id: id,
    title: title,
    year: year,
    techniques: techniques,
    materials: { en: materialsEn, lv: materialsLv, zh: "" },
    cutout: "images/works/" + id + "/cutout.svg",
    images: [
      "images/works/" + id + "/photo-1.svg",
      "images/works/" + id + "/photo-2.svg",
      "images/works/" + id + "/photo-3.svg"
    ],
    video: opts.video || null,
    text: { en: PH_EN, lv: PH_LV, zh: "" },
    publications: opts.publications || []
  };
}

/* Works are shown newest year first. Order inside a year = order here. */
window.WORKS = [
  placeholderWork("piepuskot", "PIEPŪŠĶOT", 2026, ["installation"],
    "Plaster, rope, found objects", "Ģipsis, virve, atrasti objekti"),
  placeholderWork("tas-nekas", "TAS NEKAS", 2026, ["screenprint", "installation"],
    "Ice, screen print, oil paint", "Ledus, sietspiede, eļļas krāsa",
    { video: { placeholder: true },
      publications: [
        { title: "Placeholder article title", source: "Example magazine", url: "#" },
        { title: "Placeholder interview", source: "Example radio", url: "#" }
      ] }),
  placeholderWork("rokas", "ROKAS", 2026, ["installation"],
    "Plaster cast, pigment", "Ģipša lējums, pigments"),
  placeholderWork("es-tur-biju", "ES TUR BIJU", 2026, ["video"],
    "Single-channel video, 6 min", "Viena kanāla video, 6 min",
    { video: { placeholder: true } }),
  placeholderWork("sapnu-kerajs", "SAPŅU ĶĒRĀJS", 2025, ["screenprint"],
    "Screen print on paper", "Sietspiede uz papīra"),
  placeholderWork("gaujiens", "GAUJIENS", 2025, ["installation", "video"],
    "Installation, video, sound", "Instalācija, video, skaņa",
    { video: { placeholder: true } }),
  placeholderWork("macibu-traucejums", "MĀCĪBU TRAUCĒJUMS", 2025, ["screenprint"],
    "Screen print, textile", "Sietspiede, tekstils"),
  placeholderWork("darbs-8", "DARBS 8", 2024, ["screenprint"],
    "Placeholder materials", "Vietturis materiāli"),
  placeholderWork("darbs-9", "DARBS 9", 2024, ["installation"],
    "Placeholder materials", "Vietturis materiāli"),
  placeholderWork("darbs-10", "DARBS 10", 2024, ["video"],
    "Placeholder materials", "Vietturis materiāli",
    { video: { placeholder: true } })
];
