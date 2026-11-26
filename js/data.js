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
       or several: [ { link: "..." }, { link: "...", label: { en: "Sketch", lv: "Skice" } } ]
   • "credits": who made the photos and video, e.g.
       credits: { photo: "Anna Ozola", video: ["Jānis Bērziņš", "Sintija Kirsone"] }
     Leave a name out (or "") and that line is not shown.
     The photo name is shown under every photo. If some photos have a
     different author, write that photo like this inside "images":
       { src: "images/works/rokas/Rokas2.png", photo: "Jānis Bērziņš" }
   • New paragraph inside a text: type \n\n (never press Enter inside the quotes).
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
    en: "Sintija Kirsone is a multidisciplinary artist based in Riga, whose creative practice focuses primarily on creating installations and spatial art objects. Her works do not impose a single fixed narrative; on the contrary, she invites the viewer to become a co-author and find a meaning within the objects that resonates with them on a personal level.\n\nKirsone’s visual language is inspired by unconventional materials, the aesthetics of form, and elements of design. Exploring the boundary between the functional and the artistic, she seeks out new visual stories and meaningful collisions between the material and the conceptual.",
    lv: "Sintija Kirsone ir multidisciplināra māksliniece no Rīgas, kura savā radošajā praksē galvenokārt pievēršas instalāciju un telpisku mākslas objektu izveidei. Viņas darbi neuzspiež vienu konkrētu vēstījumu, bet gluži pretēji, māksliniece aicina skatītāju kļūt par līdzautoru un atrast objektos tādu nozīmi, kas personiski rezonē ar viņu pašu.\n\nKirsones vizuālo valodu iedvesmo neierasti materiāli, formu estētika un dizaina elementi. Pētot robežu starp funkcionālo un māksliniecisko, viņa meklē jaunus vizuālos stāstus un jēgpilnas sadursmes starp materiālo un konceptuālo.",
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
    materials: {
      en: "Ice flowers, signature technique, crystallization · dimensions variable",
      lv: "Leduspuķes, autortehnika, kristalizācija · maināms izmērs",
      zh: ""
    },
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
    credits: { photo: "Maija Sjomkāne" },
    text: {
      en: "Ice flowers bloom across the windows of the room. The work reflects our habit of “piepušķot” – dressing things up, adding a little decoration on top of what is already there.\n\nCreated for the exhibition “Aizvakardiena”, together with professor and artist Ojārs Pētersons.",
      lv: "Uz telpas logiem uzplaukst leduspuķes. Darbs atspoguļo mūsu ieradumu lietas “piepušķot” – pievienot tām mazliet rotājuma pāri tam, kas jau ir.\n\nDarbs veidots izstādes “Aizvakardiena” ietvaros, kopā ar profesoru un mākslinieku Ojāru Pētersonu.",
      zh: ""
    },
    publications: []
  },
  {
    id: "piepuskot-maboca",
    title: "PIEPUŠĶOT (MABOCA)",
    year: 2026,
    techniques: ["installation"],
    materials: {
      en: "Ice flowers, signature technique, crystallization · 1 × 1 m",
      lv: "Leduspuķes, autortehnika, kristalizācija · 1 × 1 m",
      zh: ""
    },
    cutout: "images/works/piepuskotMABOCA/piepuskotMABOCACUTOUT.png",
    images: [
      "images/works/piepuskotMABOCA/piepuskotMABOCA1.png",
      "images/works/piepuskotMABOCA/piepuskotMABOCA2.jpg",
      "images/works/piepuskotMABOCA/piepuskotMABOCA3.jpg"
    ],
    video: null,
    credits: { photo: "Maija Sjomkāne", video: "" },
    text: {
      en: "Ice flowers bloom on restored green windows. The work reflects our habit of “piepušķot” – dressing things up, adding a little decoration on top of what is already there.\n\nCreated for the exhibition “Aizvakardiena”.",
      lv: "Uz restaurētiem, zaļiem logiem uzplaukst leduspuķes. Darbs atspoguļo mūsu ieradumu lietas “piepušķot” – pievienot tām mazliet rotājuma pāri tam, kas jau ir.\n\nDarbs veidots izstādes “Aizvakardiena” ietvaros.",
      zh: ""
    },
    publications: []
  },
  {
    id: "es-te-biju",
    title: "ES TE BIJU",
    year: 2026,
    techniques: ["installation", "video"],
    materials: {
      en: "Aquarium, water, projection of a 3D animation (Blender) · 20 × 40 cm",
      lv: "Akvārijs, ūdens, 3D animācijas (Blender) projekcija · 20 × 40 cm",
      zh: ""
    },
    cutout: "images/works/Estebiju/EsTeBijuCUTOUT.png",
    images: [
      "images/works/Estebiju/EsTeBiju1.png",
      "images/works/Estebiju/EsTeBiju2.png",
      "images/works/Estebiju/EsTeBiju3.png"
    ],
    video: [
      { link: "https://youtu.be/DYA8UKQxPaA" },
      { link: "https://youtube.com/shorts/GV-_eyJjkUs" }
    ],
    credits: { photo: "", video: "" },
    text: {
      en: "An empty aquarium filled with water. Projected into it is only the shadow of a goldfish – the trace of someone who was here.",
      lv: "Tukšs akvārijs, piepildīts ar ūdeni. Tajā projicēta vien zelta zivtiņas ēna – pēdas no kāda, kurš te bija.",
      zh: ""
    },
    publications: []
  },
  {
    id: "tas-nekas",
    title: "TAS NEKAS",
    year: 2026,
    techniques: ["screenprint", "installation"],
    materials: {
      en: "Ice, epoxy, screen print, oil paint",
      lv: "Ledus, epoksīds, sietspiede, eļļas krāsa",
      zh: ""
    },
    cutout: "images/works/tasnekas/tasnekasCUTOUT.png",
    images: [
      "images/works/tasnekas/tasnekas1.jpg",
      "images/works/tasnekas/tasnekas2.jpg",
      "images/works/tasnekas/tasnekas3.png",
      "images/works/tasnekas/tasnekas4.png",
      "images/works/tasnekas/tasnekas5.png"
    ],
    video: [
      { link: "https://youtu.be/20s_fpRfrfo" },
      { link: "https://youtube.com/shorts/Th9m5e4oi4M" }
    ],
    credits: { photo: "", video: "" },
    text: {
      en: "The words “tas nekas” (“it's nothing”) are screen printed onto a block of ice and a block of epoxy. When the ice melts, “tas” (“it”) disappears and only “nekas” (“nothing”) remains – and that is nothing.",
      lv: "Uz ledus un epoksīda kluča sietspiedes tehnikā uzklāts teksts “tas nekas”. Kad ledus izkusīs, “tas” paliks “nekas” – un tas ir nekas.",
      zh: ""
    },
    publications: []
  },
  {
    id: "rokas",
    title: "ROKAS",
    year: 2026,
    techniques: ["installation"],
    materials: {
      en: "Plaster bandages · 2 × 1 m",
      lv: "Ģipša saites · 2 × 1 m",
      zh: ""
    },
    cutout: "images/works/Rokas/RokasCUTOUT.png",
    images: [
      "images/works/Rokas/Rokas1.jpg",
      "images/works/Rokas/Rokas2.png",
      "images/works/Rokas/Rokas3.png",
      "images/works/Rokas/Rokas4.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: {
      en: "A chain of hands, cast in plaster bandages from the artist's own hands.",
      lv: "Roku ķēde, veidota no ģipša saitēm, atlejot autores pašas rokas.",
      zh: ""
    },
    publications: []
  },
  {
    id: "jura",
    title: "JŪRA",
    year: 2026,
    techniques: ["video"],
    materials: {
      en: "VR video game · Meta Quest, Unity 6.3 URP",
      lv: "VR videospēle · Meta Quest, Unity 6.3 URP",
      zh: ""
    },
    cutout: "images/works/Jura/juraCUTOUT.png",
    images: [],
    video: { link: "https://youtu.be/k5x80t-bNQ8" },
    credits: { photo: "", video: "" },
    text: {
      en: "The player wakes up on a small island rising from the middle of an endless sea, surrounded by clear turquoise water that grows deeper the further you go from the shore. Under the water swim carp – the most universal fish in the world. They float along minding their own business, but you can catch them! A caught carp tells you what it thinks about this frightening situation. If you don't let it go in time, it dies and floats high up into the sky, accompanied by angelic voices. Along the way you can also meet a rubber duck, a swim ring, rubbish bins, a yellow barrel, a very large treasure chest, a fishing boat and more.\n\nThe mechanics are simple: catch fish with the VR controller. You can dive into the water and reach the island's low peaks. Every catch triggers its own sound, and the audio follows your position – from the windy surface of the island to the silence under water. The game invites you to simply exist in a world that, beneath the waves, feels truly simple.",
      lv: "Spēlētājs pamostas uz mazas salas, kas paceļas bezgalīgas jūras vidū. To ieskauj dzidrs, tirkīzzils ūdens, kas kļūst arvien dziļāks, jo tālāk no krasta dodies. Zem ūdens mīt karpas – pasaules universālākās zivis. Tās savā nodabā peld, bet tu vari tās noķert! Noķerta karpa izsaka savu viedokli par šo, viņai bailīgo, situāciju. Ja nepaspēsi to laikus atlaist atpakaļ brīvībā, karpa nomirs un uzpeldēs augstu debesīs eņģeļu balsu pavadījumā. Spēlē vari sastapt arī citus varoņus – gumijas pīlīti, peldriņķi, miskastes, dzelteno mucu, ļoti lielu bagātību lādi, zvejnieku laivu un vēl!\n\nSpēles mehānika ir vienkārša: ķer zivis ar VR kontrolieri. Vari ienirt ūdenī un sasniegt salas zemās virsotnes. Katra noķeršana izraisa unikālu skaņas reakciju, un skaņa mainās līdz ar spēlētāja atrašanās vietu – no vējainās salas virsmas līdz zemūdens klusumam. Spēle aicina vienkārši eksistēt pasaulē, kas zem viļņiem šķiet patiesi vienkārša.",
      zh: ""
    },
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
    video: [
      { link: "https://youtu.be/wyGap4I4rik" },
      { link: "https://youtu.be/Xxxlj6yHExw" }
    ],
    credits: { photo: "", video: "" },
    text: { en: "", lv: "", zh: "" },
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
    video: [
      { link: "https://youtu.be/iOWVZ6nE0Yo" },
      { link: "https://youtu.be/sNxnsBQeBHQ", label: { en: "Sketch", lv: "Skice", zh: "" } }
    ],
    credits: { photo: "", video: "" },
    text: { en: "", lv: "", zh: "" },
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
    video: [
      { link: "https://youtu.be/kg0cxNU1API" },
      { link: "https://youtu.be/VRRsv_ObuWE", label: { en: "Sketch", lv: "Skice", zh: "" } }
    ],
    credits: { photo: "", video: "" },
    text: { en: "", lv: "", zh: "" },
    publications: []
  },
  {
    id: "gaujiens",
    title: "GAUJIENS",
    year: 2025,
    techniques: ["installation"],
    materials: {
      en: "Acrylic glass tube, water from the Gauja river · 2 m × 15 cm",
      lv: "Organiskā stikla caurule, Gaujas ūdens · 2 m × 15 cm",
      zh: ""
    },
    cutout: "images/works/Gaujiens/gaujiensCUTOUT.png",
    images: [
      "images/works/Gaujiens/gaujiens1.png",
      "images/works/Gaujiens/gaujiens2.png",
      "images/works/Gaujiens/gaujiens3.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: {
      en: "The Gauja out for a walk – an environment taken out of its own environment.",
      lv: "Gauja pastaigā – vide, izņemta no savas vides.",
      zh: ""
    },
    publications: []
  },
  {
    id: "macibu-traucejums",
    title: "MĀCĪBU TRAUCĒJUMS",
    year: 2025,
    techniques: ["installation"],
    materials: {
      en: "Fabric, sewn soft toys",
      lv: "Audums, uzšūtas mīkstās mantiņas",
      zh: ""
    },
    cutout: "images/works/MacibuTraucejums/MacibuTraucejumsCUTOUT.png",
    images: [
      "images/works/MacibuTraucejums/MacibuTraucejums1.png",
      "images/works/MacibuTraucejums/MacibuTraucejums2.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: {
      en: "Soft toys sewn onto fabric, each one standing for a letter of an invented alphabet. The work is about dyslexia.",
      lv: "Uz auduma uzšūtas mīkstās mantiņas, un katra no tām simbolizē izgudrota alfabēta burtu. Darbs ir par disleksiju.",
      zh: ""
    },
    publications: []
  },
  {
    id: "sapnu-kerajs",
    title: "SAPŅU ĶĒRĀJS",
    year: 2025,
    techniques: ["screenprint"],
    materials: {
      en: "Screen print on wallpaper, oil paint · 1 × 4 m",
      lv: "Sietspiede uz tapetes, eļļas krāsa · 1 × 4 m",
      zh: ""
    },
    cutout: "images/works/sapnukerajs/sapnukerajsCUTOUT.png",
    images: [
      "images/works/sapnukerajs/sapnukerajs1.png",
      "images/works/sapnukerajs/sapnukerajs2.png"
    ],
    video: null,
    credits: { photo: "", video: "" },
    text: {
      en: "The shape of the artist's body, with a “text” in the background describing a dream. Printed on wallpaper, the work becomes something that soaks up all the dreams of the night.",
      lv: "Autores ķermeņa forma, kuras fonā rakstītais “teksts” apraksta kādu sapni. Uz tapetes darbs kalpo kā lieta, kas uzsūc visus nakts sapņus.",
      zh: ""
    },
    publications: []
  }
];
