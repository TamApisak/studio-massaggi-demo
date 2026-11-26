# Massage studio website

A one-page site in Italian. No build step: upload the folder as it is.

| File | What it is | Who edits it |
|---|---|---|
| `dati.js` | Name, phone, address, hours, massages, prices, texts, photos, links | **Owner** |
| `foto/` | Studio photos | **Owner** |
| `index.html` | Page structure and fixed Italian labels | Developer |
| `stile.css` | Colours, fonts, layout (colours are the variables at the top) | Developer |
| `sito.js` | Fills the page from `dati.js` | Developer |

## Updating the site

Open `dati.js` in any text editor, change the text between the quotes, save, reload the page.

Anything inside `[[double brackets]]`, an empty `""`, or a `null` duration/price is a
**placeholder**. Placeholders show in yellow with a dashed border, and a yellow "Bozza"
banner at the top counts how many are left. When the count reaches zero the banner and the
`[BOZZA]` prefix in the browser tab disappear by themselves.

To preview on your computer, run this in the folder and open http://localhost:4173

```bash
python3 -m http.server 4173
```

## Details still needed from the owner

- Studio name and city
- Phone number in international format (`+39 …`), and the WhatsApp number if different
- Full address
- Opening hours for each day, including closed days
- The menu: each massage's Italian name, duration(s), exact price(s), short description
- A description of the studio for "Chi siamo"
- Photos: one welcoming shot of the studio, one more for "Chi siamo" (landscape, about 1600 px wide, JPG)
- Google Maps: the "Copy link" link and the "Embed a map" address from the studio's verified profile
- Instagram / Facebook addresses, if any
- Preferred domain name and registrar

## Before launch

- [ ] Banner shows zero placeholders (it is gone)
- [ ] Owner has approved every text and price
- [ ] On a real phone: **Prenota su WhatsApp** opens a chat with the studio, with the message already written
- [ ] On a real phone: **Chiama** and the phone number start a call to the right number
- [ ] **Ottieni indicazioni** opens the studio's own Google Maps profile, and **Mostra la mappa** shows the right pin
- [ ] Photos load and each has an Italian description (`alt`)
- [ ] Legal details: Italian business sites normally show the P.IVA in the footer, and need a privacy notice — confirm with the owner's accountant

## Custom domain

Nothing is registered yet. First decide with the owner: **domain name**, **registrar**, and
**hosting provider**. The DNS records depend on the host; these are the usual ones for
static hosts that give free HTTPS. Always copy the final values from the host's own
dashboard, since they are specific to the project.

| Host | Root domain (`example.it`) | `www.example.it` |
|---|---|---|
| Netlify | `A` → `75.2.60.5` (or `ALIAS` → `apex-loadbalancer.netlify.com`) | `CNAME` → `<site-name>.netlify.app` |
| Cloudflare Pages | `CNAME` → `<project>.pages.dev` (DNS must be on Cloudflare) | `CNAME` → `<project>.pages.dev` |
| GitHub Pages | `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | `CNAME` → `<user>.github.io` |

After connecting the domain:

1. Wait for DNS to spread (minutes to a few hours), then check that the host shows the certificate as issued.
2. Open `https://example.it` and `https://www.example.it`: both must load with the padlock, and one should redirect to the other.
3. Open `http://example.it`: it must redirect to `https://`.
4. Repeat the phone checks from "Before launch" on the live address.
