/* Fills the page from dati.js. The owner does not need to edit this file. */
(function () {
  "use strict";
  var S = window.STUDIO || {};

  /* ---- helpers ---------------------------------------------------------- */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function todo(label) { return '<mark class="todo">' + esc(label) + "</mark>"; }
  // Escapes text and turns [[placeholders]] into highlighted marks.
  function fill(value, missingLabel) {
    if (value === undefined || value === null || String(value).trim() === "") return todo(missingLabel || "da completare");
    return esc(value).replace(/\[\[(.+?)\]\]/g, '<mark class="todo">$1</mark>');
  }
  function isReady(value) { return !!value && String(value).trim() !== "" && !/\[\[/.test(value); }
  function plain(value) { return String(value || "").replace(/\[\[|\]\]/g, ""); }
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, S);
  }
  function each(selector, fn) { Array.prototype.forEach.call(document.querySelectorAll(selector), fn); }
  function digits(phone) { return String(phone || "").replace(/\D/g, ""); }

  var euro = function (n) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency", currency: "EUR",
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2
    }).format(n);
  };

  /* ---- phone numbers ---------------------------------------------------- */
  var phoneOk = isReady(S.phone) && digits(S.phone).length >= 8;
  var waNumber = isReady(S.whatsapp) ? S.whatsapp : S.phone;
  var waOk = isReady(waNumber) && digits(waNumber).length >= 8;
  function waLink(message) {
    return "https://wa.me/" + digits(waNumber) + "?text=" + encodeURIComponent(message || "");
  }

  /* ---- simple text ------------------------------------------------------ */
  each("[data-text]", function (el) {
    el.innerHTML = fill(get(el.getAttribute("data-text")));
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- photos ----------------------------------------------------------- */
  each("[data-photo]", function (el) {
    var p = (S.photos || {})[el.getAttribute("data-photo")] || {};
    if (isReady(p.src)) {
      var img = document.createElement("img");
      img.src = p.src;
      img.alt = plain(p.alt);
      img.loading = el.getAttribute("data-photo") === "hero" ? "eager" : "lazy";
      el.appendChild(img);
      if (!isReady(p.alt)) el.insertAdjacentHTML("beforeend", '<span hidden>' + todo("descrizione foto") + "</span>");
    } else {
      el.classList.add("is-todo");
      el.innerHTML = "<strong>FOTO DA INSERIRE</strong><span>" + esc(el.getAttribute("data-photo-hint")) + "</span>";
    }
  });

  /* ---- treatments ------------------------------------------------------- */
  document.getElementById("treatments").innerHTML = (S.treatments || []).map(function (t) {
    var rows = (t.options || []).map(function (o) {
      var minutes = typeof o.minutes === "number" ? o.minutes + " min" : todo("durata");
      var price = typeof o.price === "number" ? euro(o.price) : todo("prezzo");
      // "Prenota" opens WhatsApp with this massage and duration already written.
      var book = "";
      if (waOk && isReady(t.name) && typeof o.minutes === "number") {
        var msg = "Ciao, vorrei prenotare: " + t.name + " (" + o.minutes + " min). Quali orari sono disponibili?";
        book = '<a class="book" target="_blank" rel="noopener" href="' + esc(waLink(msg)) + '" aria-label="' +
          esc("Prenota " + t.name + ", " + o.minutes + " minuti, su WhatsApp") + '">Prenota</a>';
      }
      return '<li><span class="minutes">' + minutes + '</span><span class="dots" aria-hidden="true"></span><span class="price">' + price + "</span>" + book + "</li>";
    }).join("");
    return '<article class="treatment" data-tags="' + esc((t.tags || []).join(" ")) + '"><h3>' + fill(t.name, "nome del massaggio") + "</h3><p>" +
      fill(t.description, "descrizione") + '</p><ul class="options">' + rows + "</ul></article>";
  }).join("");

  /* ---- "Cosa cerchi oggi?" filter ---------------------------------------- */
  (function () {
    var used = {};
    (S.treatments || []).forEach(function (t) { (t.tags || []).forEach(function (id) { used[id] = true; }); });
    var needs = (S.needs || []).filter(function (n) { return used[n.id]; });
    if (!needs.length) return;
    var box = document.getElementById("needs");
    var chips = box.querySelector(".chips");
    chips.innerHTML = '<button type="button" class="chip" data-need="" aria-pressed="true">Tutti</button>' +
      needs.map(function (n) {
        return '<button type="button" class="chip" data-need="' + esc(n.id) + '" aria-pressed="false">' + fill(n.label) + "</button>";
      }).join("");
    box.hidden = false;
    chips.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var need = chip.getAttribute("data-need");
      each("#needs .chip", function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      each("#treatments .treatment", function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(" ");
        card.hidden = !!need && tags.indexOf(need) === -1;
      });
    });
  })();

  /* ---- about ------------------------------------------------------------ */
  document.getElementById("about-text").innerHTML = (S.about || [""]).map(function (p) {
    return "<p>" + fill(p, "testo «Chi siamo»") + "</p>";
  }).join("");

  /* ---- hours ------------------------------------------------------------ */
  var todayIndex = (function () {
    // Monday = 0, in the studio's time zone.
    var name = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "Europe/Rome" }).format(new Date());
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(name);
  })();
  document.getElementById("hours").innerHTML = (S.hours || []).map(function (h, i) {
    var closed = /^chiuso$/i.test(String(h.time || "").trim());
    return "<tr" + (i === todayIndex ? ' class="is-today"' : "") + '><th scope="row">' + fill(h.day) +
      "</th><td" + (closed ? ' class="closed"' : "") + ">" + fill(h.time, "orario") + "</td></tr>";
  }).join("");

  /* ---- open now / closed now -------------------------------------------- */
  (function () {
    // "10:00–13:00 · 15:00–19:00" -> [[600, 780], [900, 1140]]; "Chiuso" -> []; unreadable -> null
    function slots(text) {
      text = String(text || "").trim();
      if (/^chiuso$/i.test(text)) return [];
      var re = /(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/g, m, out = [];
      while ((m = re.exec(text))) out.push([+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]]);
      return out.length ? out : null;
    }
    var week = (S.hours || []).map(function (h) { return slots(h.time); });
    if (week.length !== 7 || week.some(function (d) { return d === null; })) return;

    function clock(min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); }
    function status() {
      var p = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday);
      var now = +p.hour * 60 + +p.minute;
      var open = week[day].filter(function (s) { return now >= s[0] && now < s[1]; })[0];
      if (open) return { open: true, text: "Aperto ora · chiude alle " + clock(open[1]) };
      for (var i = 0; i <= 7; i++) {
        var d = (day + i) % 7;
        var next = week[d].filter(function (s) { return i > 0 || s[0] > now; })[0];
        if (next) {
          var when = i === 0 ? "oggi" : i === 1 ? "domani" : String(S.hours[d].day).toLowerCase();
          return { open: false, text: "Chiuso ora · apre " + when + " alle " + clock(next[0]) };
        }
      }
      return { open: false, text: "Chiuso" };
    }
    function show() {
      var s = status();
      each("[data-status]", function (el) {
        el.textContent = s.text;
        el.classList.toggle("is-open", s.open);
        el.hidden = false;
      });
    }
    show();
    setInterval(show, 60000);
  })();

  /* ---- phone, WhatsApp, directions -------------------------------------- */
  function markTodo(el, why) { el.classList.add("is-todo"); el.removeAttribute("target"); el.title = why; }

  each(".js-phone", function (el) {
    if (phoneOk) { el.href = "tel:+" + digits(S.phone); el.textContent = S.phone; }
    else { el.outerHTML = todo("numero di telefono"); }
  });
  each(".js-call", function (el) {
    if (phoneOk) el.href = "tel:+" + digits(S.phone);
    else markTodo(el, "Numero di telefono da inserire in dati.js");
  });
  each(".js-whatsapp", function (el) {
    if (waOk) el.href = waLink(S.whatsappMessage);
    else markTodo(el, "Numero WhatsApp da inserire in dati.js");
  });
  each(".js-maps", function (el) {
    if (isReady(S.mapsLink)) el.href = S.mapsLink;
    else markTodo(el, "Link Google Maps da inserire in dati.js");
  });

  /* ---- map (loaded only when the visitor asks, for privacy and speed) ---- */
  var map = document.getElementById("map");
  if (isReady(S.mapsEmbed)) {
    map.innerHTML = '<div class="map-prompt"><button type="button" class="btn btn-secondary">Mostra la mappa</button>' +
      "<small>La mappa è fornita da Google Maps: caricandola, Google può ricevere alcuni dati di navigazione.</small></div>";
    map.querySelector("button").addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = S.mapsEmbed;
      frame.title = "Mappa: come raggiungere " + plain(S.name);
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      map.innerHTML = "";
      map.appendChild(frame);
    });
  } else {
    map.classList.add("is-todo");
    map.innerHTML = '<div class="map-prompt"><strong>MAPPA DA INSERIRE</strong><span>Link «Incorpora mappa» di Google Maps</span></div>';
  }

  /* ---- social ----------------------------------------------------------- */
  var social = document.getElementById("social");
  var links = [["Instagram", (S.social || {}).instagram], ["Facebook", (S.social || {}).facebook]]
    .filter(function (l) { return isReady(l[1]); })
    .map(function (l) { return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + l[0] + "</a>"; });
  if (links.length) { social.innerHTML = links.join(""); social.hidden = false; }

  /* ---- page title, description, draft banner ---------------------------- */
  var missing = document.querySelectorAll(".todo, .is-todo").length;
  if (isReady(S.name)) {
    document.title = S.name + (isReady(S.city) ? " · Massaggi a " + S.city : "");
    if (isReady(S.city)) {
      document.querySelector('meta[name="description"]').content =
        S.name + ", studio massaggi a " + S.city + ": trattamenti, prezzi, orari e contatti. Prenota su WhatsApp.";
    }
  }
  if (S.demo && !missing) {
    var demo = document.getElementById("draft-banner");
    demo.textContent = "Demo · nome, prezzi, contatti e foto sono di esempio";
    demo.hidden = false;
    document.title = "[DEMO] " + document.title;
  }
  if (missing) {
    var banner = document.getElementById("draft-banner");
    banner.textContent = "Bozza · " + missing + " dettagli da completare in dati.js (evidenziati in giallo)";
    banner.hidden = false;
    document.title = "[BOZZA] " + document.title;
  }
})();
