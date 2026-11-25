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
   • "credits": who made the photos and video, e.g.
       credits: { photo: "Anna Ozola", video: ["Jānis Bērziņš", "Sintija Kirsone"] }
     Leave a name out (or "") and that line is not shown.
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
  photo: "images/about/Layer1.png",
  text: {
    en: "Sintija Kirsone is a multidisciplinary artist based in Riga, whose creative practice focuses primarily on creating installations and spatial art objects. Her works do not impose a single fixed narrative; on the contrary, she invites the viewer to become a co-author and find a meaning within the objects that resonates with them on a personal level.

Kirsone’s visual language is inspired by unconventional materials, the aesthetics of form, and elements of design. Exploring the boundary between the functional and the artistic, she seeks out new visual stories and meaningful collisions between the material and the conceptual.",
    lv: "Sintija Kirsone ir multidisciplināra māksliniece no Rīgas, kura savā radošajā praksē galvenokārt pievēršas instalāciju un telpisku mākslas objektu izveidei. Viņas darbi neuzspiež vienu konkrētu vēstījumu, bet gluži pretēji, māksliniece aicina skatītāju kļūt par līdzautoru un atrast objektos tādu nozīmi, kas personiski rezonē ar viņu pašu.

Kirsones vizuālo valodu iedvesmo neierasti materiāli, formu estētika un dizaina elementi. Pētot robežu starp funkcionālo un māksliniecisko, viņa meklē jaunus vizuālos stāstus un jēgpilnas sadursmes starp materiālo un konceptuālo.",
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

/* Works are shown newest year first. Order inside a year = order here.
   Each work's pictures live in its own folder in images/works/.
   The folder name in the paths must match the folder on GitHub exactly
   (capital letters too), and so must the file endings (.jpg / .png). */
window.WORKS = [
  {
    id: "piepuskot",
    title: "PIEPUŠĶOT",
    year: 2026,
    techniques: ["installation"],
    materials: { en: "signature technique, crystallization", lv: "autortehnika, kristalizācija", zh: "" },
    cutout: "images/works/piepuskot/piepuskotCUTOUT.png",
    images: [
      "images/works/piepuskot/piepuskot1.jpg",
      "images/works/piepuskot/piepuskot2.jpg",
      "images/works/piepuskot/piepuskot3.jpg",
      "images/works/piepuskot/piepuskot4.jpg",
      "images/works/piepuskot/piepuskot5.jpg",
      "images/works/piepuskot/piepuskot6.png",
      "images/works/piepuskot/piepuskot789.png",
      "images/works/piepuskot/piepuskot10.jpg"
    ],
    video: { link: "https://youtu.be/3LB8MtDiuQA" },
    credits: { photo: "Maija Sjomkāne, Sintija Kirsone" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "piepuskot-maboca",
    title: "PIEPUŠĶOT (MABOCA)",
    year: 2026,
    techniques: ["installation"],
    materials: { en: "signature technique, crystallization", lv: "autortehnika, kristalizācija", zh: "" },
    cutout: "images/works/piepuskotMABOCA/piepuskotMABOCACUTOUT.png",
    images: [
      "images/works/piepuskotMABOCA/piepuskotMABOCA1.png",
      "images/works/piepuskotMABOCA/piepuskotMABOCA2.jpg",
      "images/works/piepuskotMABOCA/piepuskotMABOCA3.jpg"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "es-te-biju",
    title: "ES TE BIJU",
    year: 2026,
    techniques: ["installation", "video"],
    materials: { en: "Glass aquarium, video projection", lv: "Stikla akvārijs, video projekcija", zh: "" },
    cutout: "images/works/Estebiju/EsTeBijuCUTOUT.png",
    images: [
      "images/works/Estebiju/EsTeBiju1.png",
      "images/works/Estebiju/EsTeBiju2.png",
      "images/works/Estebiju/EsTeBiju3.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "tas-nekas",
    title: "TAS NEKAS",
    year: 2026,
    techniques: ["screenprint", "installation"],
    materials: { en: "Ice, screen print, oil paint", lv: "Ledus, sietspiede, eļļas krāsa", zh: "" },
    cutout: "images/works/tasnekas/tasnekasCUTOUT.png",
    images: [
      "images/works/tasnekas/tasnekas1.jpg",
      "images/works/tasnekas/tasnekas2.jpg",
      "images/works/tasnekas/tasnekas3.png",
      "images/works/tasnekas/tasnekas4.png",
      "images/works/tasnekas/tasnekas5.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "rokas",
    title: "ROKAS",
    year: 2026,
    techniques: ["installation"],
    materials: { en: "Materials", lv: "Materiāli", zh: "" },
    cutout: "images/works/Rokas/RokasCUTOUT.png",
    images: [
      "images/works/Rokas/Rokas1.jpg",
      "images/works/Rokas/Rokas2.png",
      "images/works/Rokas/Rokas3.png",
      "images/works/Rokas/Rokas4.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "jura",
    title: "JŪRA",
    year: 2026,
    techniques: ["video"],
    materials: { en: "Video", lv: "Video", zh: "" },
    cutout: "images/works/Jura/juraCUTOUT.png",
    images: [],
    video: { link: "" },   // ← paste the YouTube link here
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "videokompozicija-1",
    title: "VIDEOKOMPOZĪCIJA I",
    year: 2026,
    techniques: ["video"],
    materials: { en: "Video", lv: "Video", zh: "" },
    cutout: "images/works/VIDEOCOMP1/videocomp1CUTOUT.png",
    images: [
      "images/works/VIDEOCOMP1/videocomp11.png",
      "images/works/VIDEOCOMP1/videocomp12.png",
      "images/works/VIDEOCOMP1/videocomp13.png"
    ],
    video: { link: "" },   // ← paste the YouTube link here
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "videokompozicija-2",
    title: "VIDEOKOMPOZĪCIJA II",
    year: 2026,
    techniques: ["video"],
    materials: { en: "Video", lv: "Video", zh: "" },
    cutout: "images/works/VIDEOCOMP2/videocomp2CUTOUT.png",
    images: [],
    video: { link: "" },   // ← paste the YouTube link here
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "videokompozicija-3",
    title: "VIDEOKOMPOZĪCIJA III",
    year: 2026,
    techniques: ["video"],
    materials: { en: "Video", lv: "Video", zh: "" },
    cutout: "images/works/VIDEOCOMP3/videocomp3CUTOUT.png",
    images: [],
    video: { link: "" },   // ← paste the YouTube link here
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "gaujiens",
    title: "GAUJIENS",
    year: 2025,
    techniques: ["video"],
    materials: { en: "Video", lv: "Video", zh: "" },
    cutout: "images/works/Gaujiens/gaujiensCUTOUT.png",
    images: [
      "images/works/Gaujiens/gaujiens1.png",
      "images/works/Gaujiens/gaujiens2.png",
      "images/works/Gaujiens/gaujiens3.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "macibu-traucejums",
    title: "MĀCĪBU TRAUCĒJUMS",
    year: 2025,
    techniques: ["installation"],
    materials: { en: "Textile objects", lv: "Tekstila objekti", zh: "" },
    cutout: "images/works/MacibuTraucejums/MacibuTraucejumsCUTOUT.png",
    images: [
      "images/works/MacibuTraucejums/MacibuTraucejums1.png",
      "images/works/MacibuTraucejums/MacibuTraucejums2.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  },
  {
    id: "sapnu-kerajs",
    title: "SAPŅU ĶĒRĀJS",
    year: 2025,
    techniques: ["screenprint"],
    materials: { en: "Screen print on paper", lv: "Sietspiede uz papīra", zh: "" },
    cutout: "images/works/sapnukerajs/sapnukerajsCUTOUT.png",
    images: [
      "images/works/sapnukerajs/sapnukerajs1.png",
      "images/works/sapnukerajs/sapnukerajs2.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: { en: "English text about the work.", lv: "Teksts latviski.", zh: "" },
    publications: []
  }
];
