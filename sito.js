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
      return '<li><span class="minutes">' + minutes + '</span><span class="dots" aria-hidden="true"></span><span class="price">' + price + "</span></li>";
    }).join("");
    return '<article class="treatment"><h3>' + fill(t.name, "nome del massaggio") + "</h3><p>" +
      fill(t.description, "descrizione") + '</p><ul class="options">' + rows + "</ul></article>";
  }).join("");

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

  /* ---- phone, WhatsApp, directions -------------------------------------- */
  function markTodo(el, why) { el.classList.add("is-todo"); el.removeAttribute("target"); el.title = why; }

  var phoneOk = isReady(S.phone) && digits(S.phone).length >= 8;
  var waNumber = isReady(S.whatsapp) ? S.whatsapp : S.phone;
  var waOk = isReady(waNumber) && digits(waNumber).length >= 8;

  each(".js-phone", function (el) {
    if (phoneOk) { el.href = "tel:+" + digits(S.phone); el.textContent = S.phone; }
    else { el.outerHTML = todo("numero di telefono"); }
  });
  each(".js-call", function (el) {
    if (phoneOk) el.href = "tel:+" + digits(S.phone);
    else markTodo(el, "Numero di telefono da inserire in dati.js");
  });
  each(".js-whatsapp", function (el) {
    if (waOk) el.href = "https://wa.me/" + digits(waNumber) + "?text=" + encodeURIComponent(S.whatsappMessage || "");
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
