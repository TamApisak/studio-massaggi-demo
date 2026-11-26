/* ==========================================================================
   STUDIO DETAILS — this is the only file the owner needs to edit.

   • Anything written inside [[double square brackets]] is a PLACEHOLDER.
     It shows highlighted in yellow on the page until you replace it.
   • Keep the quotes "" and the commas at the end of each line.
   • Save the file and reload the page to see the change.
   ========================================================================== */

window.STUDIO = {

  /* DEMO: everything below is invented sample data with stock photos.
     Replace it with the real studio's details, then set demo to false.   */
  demo: true,

  /* ---- Basics ---------------------------------------------------------- */
  name: "Studio Salvia",
  city: "Torino",

  // One short sentence shown under the name.
  intro: "Prenditi una pausa: un massaggio pensato per te, in un ambiente tranquillo a Torino.",

  /* ---- Contact ---------------------------------------------------------
     Write the number in international format, e.g. "+39 333 123 4567".
     Leave whatsapp empty ("") if it is the same number as the phone.      */
  phone: "+39 000 000 0000",
  whatsapp: "",
  whatsappMessage: "Ciao, vorrei prenotare un massaggio. Quali orari sono disponibili?",

  /* ---- Address & map ---------------------------------------------------
     mapsLink:  open the studio's verified Google Maps profile → Share →
                "Copy link", and paste it here.
     mapsEmbed: Share → "Embed a map" → copy ONLY the address inside
                src="..." and paste it here.                               */
  address: {
    street: "Via Esempio 12",
    postcodeCity: "10100 Torino (TO)",
  },
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Torino",
  mapsEmbed: "https://www.google.com/maps?q=Torino&output=embed",

  /* ---- Opening hours ---------------------------------------------------
     Examples: "9:00–19:00"   "9:00–13:00 · 15:00–19:00"   "Chiuso"        */
  hours: [
    { day: "Lunedì",    time: "Chiuso" },
    { day: "Martedì",   time: "10:00–20:00" },
    { day: "Mercoledì", time: "10:00–20:00" },
    { day: "Giovedì",   time: "10:00–20:00" },
    { day: "Venerdì",   time: "10:00–21:00" },
    { day: "Sabato",    time: "9:30–19:00" },
    { day: "Domenica",  time: "10:00–14:00" },
  ],

  /* ---- Massages & prices -----------------------------------------------
     One block per treatment. Prices are numbers in euro, without the
     symbol (60 or 59.5). If a massage has several durations, add one
     line per duration inside "options".
     Copy a whole { ... }, block to add a treatment; delete one to remove. */
  treatments: [
    {
      name: "Massaggio rilassante",
      description: "Movimenti lenti e avvolgenti su tutto il corpo, per staccare la spina e ritrovare la calma.",
      options: [
        { minutes: 30, price: 35 },
        { minutes: 60, price: 60 },
        { minutes: 90, price: 85 },
      ],
    },
    {
      name: "Massaggio thailandese tradizionale",
      description: "Pressioni e allungamenti dolci, senza olio e con abiti comodi, per sentirsi più leggeri e sciolti.",
      options: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 90 },
      ],
    },
    {
      name: "Massaggio con oli aromatici",
      description: "Olio caldo profumato e tocco delicato: un momento di puro benessere per corpo e mente.",
      options: [
        { minutes: 60, price: 70 },
      ],
    },
    {
      name: "Massaggio schiena, collo e spalle",
      description: "Un trattamento mirato sulle zone dove si accumula più tensione, ideale dopo una giornata alla scrivania.",
      options: [
        { minutes: 30, price: 38 },
        { minutes: 45, price: 52 },
      ],
    },
    {
      name: "Massaggio ai piedi",
      description: "Pressioni rilassanti su piedi e polpacci, per una piacevole sensazione di leggerezza.",
      options: [
        { minutes: 30, price: 32 },
        { minutes: 45, price: 45 },
      ],
    },
    {
      name: "Massaggio di coppia",
      description: "Lo stesso massaggio rilassante, da vivere insieme nella stessa stanza. Prezzo per due persone.",
      options: [
        { minutes: 60, price: 115 },
      ],
    },
  ],

  /* ---- About -----------------------------------------------------------
     One or more short paragraphs, each in its own quotes.                 */
  about: [
    "Studio Salvia è un piccolo studio dove il tempo rallenta. All'arrivo ti accogliamo con una tisana calda e qualche domanda per capire come ti senti e che tipo di massaggio preferisci.",
    "Ogni trattamento si svolge in una stanza riservata, con luci soffuse, teli puliti e oli naturali. Riceviamo solo su appuntamento, così il tempo è davvero tutto per te.",
  ],

  /* ---- Photos ----------------------------------------------------------
     Put the image files in the "foto" folder and write the file name here,
     e.g. src: "foto/studio.jpg". "alt" is a short Italian description of
     what the photo shows (read aloud by screen readers).                  */
  // Demo photos are free stock images from Unsplash (unsplash.com/photos/oAvwAKFiU7Q
  // and unsplash.com/photos/VxAwTeiqDao). Replace them with real studio photos.
  photos: {
    hero:  { src: "foto/studio.jpg", alt: "Stanza luminosa dello studio con lettino da massaggio, teli bianchi e luce calda" },
    about: { src: "foto/dettaglio.jpg", alt: "Asciugamano arrotolato, flacone di olio, candela accesa e tulipani rosa su un tavolino" },
  },

  /* ---- Social links (full address, or "" to hide) ---------------------- */
  social: {
    instagram: "",
    facebook: "",
  },
};
