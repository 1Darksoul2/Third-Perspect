(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var inr = function (n) { return "\u20b9" + Math.round(n).toLocaleString("en-IN"); };
  var FREE = (window.SHOP && SHOP.freeShipping) || 1999;
  var PAGE = 24;

  /* ---------- data ---------- */
  var COLORS = [
    { n: "Aqua", c: [196, 70, 56] }, { n: "Ember", c: [18, 88, 56] }, { n: "Moss", c: [98, 42, 46] },
    { n: "Bone", c: [38, 28, 84] }, { n: "Chrome", c: [0, 0, 72] }, { n: "Ink", c: [250, 22, 26] }
  ];
  var SIZES = [{ n: "Small", m: 1, s: .72 }, { n: "Medium", m: 1.6, s: .86 }, { n: "Large", m: 2.4, s: 1 }];
  var PROJECTS = [
    { n: "Lamp shade series", who: "Boutique lighting studio", type: "Production", mat: "PLA Silk", qty: "120 pcs", time: "9 days", prof: "lamp", c: [18, 88, 56], d: "A scalloped shade range that would have needed six weeks of mould tooling. Printed and shipped in nine days." },
    { n: "Robot chassis brackets", who: "Student robotics team", type: "Prototyping", mat: "PETG and Nylon", qty: "40 sets", time: "4 days", prof: "knob", c: [200, 62, 60], d: "Three design revisions in a week, then a final set in nylon for competition." },
    { n: "Table markers", who: "Cafe chain", type: "Production", mat: "PLA", qty: "300 pcs", time: "7 days", prof: "cup", c: [38, 28, 84], d: "Numbered table markers with a weighted base, in the brand colour." },
    { n: "Radio knobs", who: "Restoration workshop", type: "Custom", mat: "ABS", qty: "12 pcs", time: "5 days", prof: "knob", c: [0, 0, 72], d: "Measured from a broken original and modelled, so a vintage set could be rebuilt." },
    { n: "Tabletop terrain", who: "Local game store", type: "Production", mat: "PLA and Resin", qty: "60 pcs", time: "10 days", prof: "tower", c: [98, 42, 46], d: "Modular terrain pieces for demo nights, painted by the store." },
    { n: "Display risers", who: "Skincare brand", type: "Custom", mat: "PETG", qty: "80 pcs", time: "6 days", prof: "vase", c: [196, 70, 56], d: "Stepped risers for a pop-up counter, matched to the brand blue." }
  ];

  /* ---------- layered object renderer ---------- */
  var P = {
    vase: function (t) { return Math.max(.16, .46 + .36 * Math.sin(Math.PI * Math.pow(t, .8)) - .22 * t + .05 * Math.sin(t * 22)); },
    bottle: function (t) { return t < .62 ? .62 - .06 * t : Math.max(.2, .62 - (t - .62) * 1.45 + .02 * Math.sin(t * 40)); },
    spindle: function (t) { return Math.max(.14, .2 + .5 * Math.pow(Math.sin(Math.PI * t), 1.4) * (1 - .3 * Math.cos(t * 18))); },
    lamp: function (t) { return Math.min(.95, .4 + .55 * Math.pow(t, 1.15) + .03 * Math.sin(t * 60)); },
    cup: function (t) { return (t < .07 ? .52 : .6 - .05 * t) + .02 * Math.sin(t * 36); },
    tower: function (t) { return t > .88 && Math.floor(t * 50) % 2 === 0 ? .34 : .46 + .1 * (Math.floor(t * 7) % 2); },
    pawn: function (t) {
      if (t < .1) return .6 - .1 * t * 5;
      if (t < .62) return .2 + .32 * Math.pow(1 - (t - .1) / .52, 2);
      var u = (t - .8) / .2; return Math.max(.14, .34 * Math.sqrt(Math.max(0, 1 - u * u)) + (t < .72 ? .12 : 0));
    },
    egg: function (t) { return Math.max(.1, .78 * Math.pow(Math.sin(Math.PI * Math.pow(t, .85)), .7)); },
    knob: function (t) { return t < .55 ? .38 : .38 + .4 * Math.sin((t - .55) * Math.PI / .45); },
    cap: function (t) { return t < .15 ? .72 : .56 + .02 * Math.sin(t * 50); },
    drop: function (t) { return Math.max(.08, .75 * Math.sqrt(Math.max(0, Math.sin(Math.PI * Math.pow(t, .6))))); }
  };
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function clamp(x) { return Math.max(0, Math.min(100, x)); }
  function hsl(c, dl) { return "hsl(" + c[0] + "," + c[1] + "%," + clamp(c[2] + dl) + "%)"; }

  function drawObj(cv, prof, o) {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    var ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var layers = o.layers || 64, scale = o.scale || 1, p = o.p == null ? 1 : o.p;
    var base = h * .9, partH = h * .74 * scale, maxR = Math.min(w * .4, partH * .46), cx = w / 2;
    var pitch = partH / layers, n = Math.floor(p * layers);
    ctx.globalAlpha = .5; ctx.fillStyle = o.plate || css("--muted");
    ctx.fillRect(cx - maxR - 24, base + 2, (maxR + 24) * 2, 2);
    ctx.globalAlpha = 1;
    var lw = Math.max(1.2, pitch * .88);
    for (var i = 0; i < n; i++) {
      var r = prof((i + .5) / layers) * maxR, y = base - i * pitch - pitch * .5;
      var g = ctx.createLinearGradient(cx - r, 0, cx + r, 0);
      g.addColorStop(0, hsl(o.c, -22)); g.addColorStop(.3, hsl(o.c, 8)); g.addColorStop(.55, hsl(o.c, 16)); g.addColorStop(1, hsl(o.c, -26));
      ctx.fillStyle = g; ctx.globalAlpha = i % 2 ? .93 : 1;
      ctx.fillRect(cx - r, y - lw / 2, r * 2, lw);
    }
    ctx.globalAlpha = 1;
    if (o.live && n < layers) {
      var rn = prof((n + .5) / layers) * maxR, yn = base - n * pitch, nx = cx + Math.sin((o.time || 0) / 170) * rn * .9;
      ctx.fillStyle = "#FFA94D"; ctx.strokeStyle = "#0b0818"; ctx.lineWidth = 2; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(nx - 9, yn - 24); ctx.lineTo(nx + 9, yn - 24); ctx.lineTo(nx + 2.5, yn - 3); ctx.lineTo(nx - 2.5, yn - 3); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(nx - 14, yn - 35, 28, 12); ctx.fill(); ctx.stroke();
    }
  }
  function drawAll(root) {
    $$("canvas[data-prof]", root || document).forEach(function (cv) {
      if (!cv.clientWidth) return;
      drawObj(cv, P[cv.dataset.prof], { layers: +cv.dataset.layers || 64, c: cv.dataset.c.split(",").map(Number), scale: +cv.dataset.scale || 1 });
    });
  }
  function cvHTML(prof, c, scale, layers) {
    return '<div class="cv"><canvas data-prof="' + prof + '" data-c="' + c.join(",") + '"' + (scale ? ' data-scale="' + scale + '"' : "") + (layers ? ' data-layers="' + layers + '"' : "") + ' aria-hidden="true"></canvas></div>';
  }

  /* ---------- state, toast ---------- */
  var state = { view: "home", cat: "all", sub: "All", shown: PAGE, adult: false, q: "", sort: "feat", cart: [], proj: "All" };
  try { state.adult = sessionStorage.getItem("tp-adult") === "1"; } catch (e) {}
  var restoreCart = function () { try { var saved = JSON.parse(localStorage.getItem("ll-cart") || "[]"); if (Array.isArray(saved)) state.cart = saved.filter(function (x) { return x && pById(x.id) && x.q > 0 && SIZES[x.size] && COLORS[x.color]; }); } catch (e) {} };
  function saveCart() { try { localStorage.setItem("ll-cart", JSON.stringify(state.cart)); } catch (e) {} }
  var toastT;
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2200); }

  /* ---------- catalog ---------- */
  var P_BY_ID = {}; PRODUCTS.forEach(function (p) { P_BY_ID[p.id] = p; });
  var C_BY_ID = {}; CATS.forEach(function (c) { C_BY_ID[c.id] = c; });
  function pById(id) { return P_BY_ID[id]; }
  function cById(id) { return C_BY_ID[id]; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  /* a real photo sits on top of the drawn placeholder; if the file is missing it removes itself */
  function shot(p) { return window.SHOP && SHOP.useImages && p.img ? '<img class="shot" src="' + SHOP.imageBase + p.img + '" alt="' + esc(p.n) + '" loading="lazy">' : ""; }
  document.addEventListener("error", function (e) { if (e.target && e.target.classList && e.target.classList.contains("shot")) e.target.remove(); }, true);
  function withShot(html, p) { return html.replace(/<\/div>$/, shot(p) + "</div>"); }
  function publicProducts() { return PRODUCTS.filter(function (p) { return !cById(p.cat).adult; }); }

  function tilesHTML(selectable) {
    var all = selectable ? '<button class="tile" type="button" data-cat="all" aria-pressed="' + (state.cat === "all") + '"><div><p class="micro">' + publicProducts().length + ' items</p><h3>Everything</h3><p>The full collection</p></div>' + cvHTML("vase", [196, 70, 56], .9, 40) + "</button>" : "";
    return all + CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="tile" type="button" data-cat="' + c.id + '" aria-pressed="' + (selectable && state.cat === c.id) + '"><div><p class="micro">' + n + ' items' + (c.adult ? ", 18+" : "") + '</p><h3>' + c.n + "</h3><p>" + c.d + "</p></div>" + cvHTML(c.prof, c.c, .9, 40) + "</button>";
    }).join("");
  }
  function cardHTML(p) {
    var c = COLORS[p.col].c, cat = cById(p.cat);
    return '<article class="pcard" data-id="' + p.id + '" tabindex="0"><div class="pimg">' + (p.flag ? '<span class="flag">' + p.flag + "</span>" : "") + withShot(cvHTML(p.prof, c), p) +
      '</div><div class="pbody"><span class="micro">' + (p.sub || cat.n) + "</span><h3>" + esc(p.n) + '</h3><div class="prow"><span class="price">' + inr(p.price) + '</span><button class="btn small" type="button" data-add="' + p.id + '">Add to cart</button></div></div></article>';
  }
  restoreCart();
  function renderSubs() {
    var box = $("#subs"), cat = state.cat === "all" ? null : cById(state.cat);
    if (!cat || !cat.subs.length || (cat.adult && !state.adult)) { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = ["All"].concat(cat.subs).map(function (s) { return '<button class="chip" type="button" data-sub="' + esc(s) + '" aria-pressed="' + (state.sub === s) + '">' + esc(s) + "</button>"; }).join("");
  }
  function renderGrid() {
    var cat = state.cat === "all" ? null : cById(state.cat);
    renderSubs();
    if (cat && cat.adult && !state.adult) {
      $("#grid").innerHTML = '<div class="gate"><h3>For adults only</h3><p>This section has products meant for people aged 18 and over. Please confirm your age to continue.</p><div class="gate-row"><button class="btn" type="button" data-age="yes">I am 18 or older</button><button class="btn ghost" type="button" data-age="no">Take me back</button></div></div>';
      $("#count").textContent = ""; $("#more").innerHTML = ""; return;
    }
    var list = PRODUCTS.filter(function (p) {
      if (cById(p.cat).adult && p.cat !== state.cat) return false;
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (state.sub !== "All" && p.sub !== state.sub) return false;
      return !state.q || (p.n + " " + p.sub + " " + p.mat + " " + cById(p.cat).n).toLowerCase().indexOf(state.q) > -1;
    });
    if (state.sort === "lo") list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "hi") list.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === "az") list.sort(function (a, b) { return a.n.localeCompare(b.n); });
    var shown = list.slice(0, state.shown);
    $("#grid").innerHTML = list.length ? shown.map(cardHTML).join("") : '<p class="empty">Nothing matches that search. Try another word or pick Everything.</p>';
    $("#count").textContent = list.length + (list.length === 1 ? " item" : " items");
    var left = list.length - shown.length;
    $("#more").innerHTML = left > 0 ? '<button class="btn ghost" type="button" data-more="1">Show ' + Math.min(PAGE, left) + " more (" + left + " left)</button>" : "";
    drawAll($("#grid"));
  }
  function renderCatHead() {
    var cat = state.cat === "all" ? null : cById(state.cat);
    $("#tiles-cat").hidden = !!cat;
    $("#cat-back").hidden = !cat;
    $("#cat-title").textContent = cat ? cat.n : "The catalog";
    $("#cat-desc").textContent = cat ? cat.d + "." : "Browse every design, printed to order. Pick a collection, or search by name.";
  }
  function renderTiles() {
    $("#tiles-cat").innerHTML = tilesHTML(true);
    $("#tiles-home").innerHTML = tilesHTML(false);
    $("#best").innerHTML = publicProducts().filter(function (p) { return p.flag === "Popular"; }).slice(0, 4).map(cardHTML).join("");
    drawAll();
  }

  /* ---------- cart ---------- */
  function addToCart(id, opt) {
    opt = opt || {};
    var color = opt.color == null ? pById(id).col : opt.color, size = opt.size == null ? 0 : opt.size, qty = opt.qty || 1;
    var found = state.cart.filter(function (x) { return x.id === id && x.color === color && x.size === size; })[0];
    if (found) found.q += qty; else state.cart.push({ id: id, color: color, size: size, q: qty });
    saveCart(); renderCart(); toast(pById(id).n + " added to cart");
  }
  function lineTotal(x) { return pById(x.id).price * SIZES[x.size].m * x.q; }
  function renderCart() {
    var count = state.cart.reduce(function (a, x) { return a + x.q; }, 0);
    $("#cart-count").textContent = count;
    var sub = state.cart.reduce(function (a, x) { return a + lineTotal(x); }, 0);
    $("#subtotal").textContent = inr(sub);
    $("#items").innerHTML = state.cart.length ? state.cart.map(function (x, i) {
      var p = pById(x.id);
      return '<div class="item">' + withShot(cvHTML(p.prof, COLORS[x.color].c, SIZES[x.size].s, 30), p) + "<div><h4>" + esc(p.n) + '</h4><span class="micro">' + SIZES[x.size].n + ", " + COLORS[x.color].n + '</span><div class="qty"><button type="button" data-dec="' + i + '" aria-label="Fewer">&minus;</button><span>' + x.q + '</span><button type="button" data-inc="' + i + '" aria-label="More">+</button></div></div><div style="text-align:right"><div class="price">' + inr(lineTotal(x)) + '</div><button class="linkbtn" type="button" data-rm="' + i + '">Remove</button></div></div>';
    }).join("") : '<p class="note">Your cart is empty. Browse the catalog to add something.</p>';
    var left = Math.max(0, FREE - sub);
    $("#ship").innerHTML = (sub === 0 ? "Free shipping on orders over " + inr(FREE) : left > 0 ? "Add " + inr(left) + " more for free shipping" : "You have free shipping") + '<div class="bar"><i style="width:' + Math.min(100, sub / FREE * 100) + '%"></i></div>';
    $("#checkout").disabled = !state.cart.length;
    drawAll($("#items"));
  }
  function openCart() { $("#scrim").hidden = false; $("#drawer").hidden = false; renderCart(); }
  function closeAll() { $("#scrim").hidden = true; $("#drawer").hidden = true; $("#modal").hidden = true; $("#co-status").textContent = ""; }

  /* ---------- product modal ---------- */
  var mcur = null;
  function openModal(id) {
    var p = pById(id); mcur = { id: id, color: p.col, size: 1, qty: 1 };
    $("#sheet").innerHTML =
      '<div class="left">' + withShot(cvHTML(p.prof, COLORS[p.col].c, SIZES[1].s, 80).replace('<canvas', '<canvas id="m-cv"'), p) + "</div>" +
      '<div class="right"><button class="iconbtn close" type="button" id="m-close">Close</button><span class="micro">' + cById(p.cat).n + (p.sub ? ", " + p.sub : "") + "</span><h2>" + esc(p.n) + "</h2>" +
      '<p style="color:var(--muted)">' + p.d + '</p><div class="meta micro"><span>' + p.mat + "</span><span>Print time " + p.t + "</span><span>Ships in 2 to 5 days</span></div>" +
      '<div><p class="micro" style="margin-bottom:8px">Colour: <span id="m-cn"></span></p><div class="chips" id="m-cols">' + COLORS.map(function (c, i) { return '<button class="sw" type="button" style="--c:' + hsl(c.c, 0) + '" data-mc="' + i + '" aria-label="' + c.n + '" aria-pressed="' + (i === p.col) + '"></button>'; }).join("") + "</div></div>" +
      '<div><p class="micro" style="margin-bottom:8px">Size</p><div class="chips" id="m-sizes">' + SIZES.map(function (s, i) { return '<button class="chip" type="button" data-ms="' + i + '" aria-pressed="' + (i === 1) + '">' + s.n + "</button>"; }).join("") + "</div></div>" +
      '<div class="prow"><span class="price" id="m-price" style="font-size:24px"></span><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" type="button" id="m-add">Add to cart</button></div></div>' +
      '<button class="btn ghost small" type="button" id="m-cust" style="justify-self:start">Customize this design</button></div>';
    $("#scrim").hidden = false; $("#modal").hidden = false;
    modalUpdate();
  }
  function modalUpdate() {
    var p = pById(mcur.id);
    $("#m-cn").textContent = COLORS[mcur.color].n;
    $("#m-price").textContent = inr(p.price * SIZES[mcur.size].m);
    $$("[data-mc]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.mc === mcur.color); });
    $$("[data-ms]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.ms === mcur.size); });
    drawObj($("#m-cv"), P[p.prof], { layers: 80, c: COLORS[mcur.color].c, scale: SIZES[mcur.size].s });
  }

  /* ---------- customize: a request form, no automatic price ---------- */
  var MATS = window.MATERIALS || [], QUALS = window.QUALITIES || [], CCOLS = window.CUSTOM_COLORS || [];
  var SHAPES = [["vase", "Vase"], ["pawn", "Chess piece"], ["knob", "Knob"], ["tower", "Tower"], ["drop", "Pendant"]];
  var MAX_MB = (window.SHOP && SHOP.maxUploadMB) || 50, MAX_FILES = (window.SHOP && SHOP.maxFiles) || 5;
  var EXT3D = ["stl", "obj", "3mf", "glb", "step", "stp"], EXTIMG = ["png", "jpg", "jpeg"];
  var firstMat = MATS.filter(function (m) { return m.available === true; })[0];
  var cust = { shape: "vase", color: 0, qual: QUALS.length ? QUALS[0].id : "", mat: firstMat ? firstMat.id : "", files: [] };
  function availText(a) { return a === true ? "Available" : a === "request" ? "On request, confirmed after review" : "Currently unavailable"; }
  function cardHTML2(group, id, title, body, checked, disabled, extra) {
    return '<label class="opt' + (disabled ? " off" : "") + '"><input type="radio" name="' + group + '" value="' + esc(id) + '"' + (checked ? " checked" : "") + (disabled ? " disabled" : "") + '><span class="opt-b"><b>' + esc(title) + "</b>" + body + (extra || "") + "</span></label>";
  }
  function buildCustomizer() {
    $("#c-shape").innerHTML = SHAPES.map(function (s) { return '<button class="chip" type="button" data-shape="' + s[0] + '" aria-pressed="' + (s[0] === cust.shape) + '">' + s[1] + "</button>"; }).join("");
    $("#c-qual").innerHTML = QUALS.map(function (q) {
      return cardHTML2("quality", q.id, q.n, "<span>" + esc(q.d) + '</span><span class="note">' + esc(q.trade) + "</span>", q.id === cust.qual, false);
    }).join("");
    $("#c-mat").innerHTML = MATS.map(function (m) {
      var off = m.available !== true && m.available !== "request";
      return cardHTML2("material", m.id, m.n, "<span>" + esc(m.d) + '</span><span class="note"><b>Good for:</b> ' + esc(m.use) + '</span><span class="note"><b>Traits:</b> ' + esc(m.traits) + '</span><span class="note"><b>Limits:</b> ' + esc(m.limit) + "</span>", m.id === cust.mat, off, '<span class="avail' + (m.available === true ? " ok" : "") + '">' + availText(m.available) + "</span>");
    }).join("");
    $("#c-col").innerHTML = CCOLS.map(function (c, i) {
      return '<button class="sw' + (c.stock ? " stock" : "") + '" type="button" role="radio" style="--c:' + hsl(c.c, 0) + '" data-cc="' + i + '" aria-label="' + esc(c.n) + (c.stock ? ", in stock" : ", on request") + '" aria-checked="' + (i === cust.color) + '" tabindex="' + (i === cust.color ? 0 : -1) + '"></button>';
    }).join("");
    $("#c-up-rules").textContent = "Accepted: 3D files (" + EXT3D.join(", ").toUpperCase() + ") and images (" + EXTIMG.join(", ").toUpperCase() + "). Up to " + MAX_FILES + " files, " + MAX_MB + " MB each.";
    renderFiles();
    custUpdate();
  }
  function custUpdate() {
    var size = +$("#c-size").value, col = CCOLS[cust.color];
    var qty = Math.max(1, Math.min(500, parseInt($("#c-qty").value, 10) || 1));
    $("#c-size-o").textContent = size + " mm";
    if (col) { $("#c-col-n").textContent = col.n; $("#c-col-s").textContent = col.stock ? "(in stock)" : "(on request)"; }
    $$("[data-shape]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.shape === cust.shape); });
    $$("[data-cc]").forEach(function (b) { var on = +b.dataset.cc === cust.color; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    var m = MATS.filter(function (x) { return x.id === cust.mat; })[0];
    var rows = [["Model", $("#c-model").value.trim() || "Not named yet"], ["Files", cust.files.length ? cust.files.length + " selected" : "None yet"], ["Quality", cust.qual || "-"], ["Material", m ? m.n : "-"], ["Colour", col ? col.n : "-"], ["Size", size + " mm, " + $("#c-fin").value], ["Quantity", qty]];
    $("#c-summary").innerHTML = rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("");
    if (col) drawObj($("#c-canvas"), P[cust.shape], { layers: 90, c: col.c, scale: .4 + .6 * (size / 300) });
  }
  function extOf(name) { var i = name.lastIndexOf("."); return i < 0 ? "" : name.slice(i + 1).toLowerCase(); }
  function fmtSize(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
  function addFiles(list) {
    var errs = [];
    Array.prototype.forEach.call(list, function (f) {
      var ext = extOf(f.name), kind = EXT3D.indexOf(ext) > -1 ? "3D file" : EXTIMG.indexOf(ext) > -1 ? "Image" : "";
      if (!kind) { errs.push(f.name + " is not an accepted file type."); return; }
      if (f.size > MAX_MB * 1048576) { errs.push(f.name + " is larger than " + MAX_MB + " MB."); return; }
      if (!f.size) { errs.push(f.name + " is empty."); return; }
      if (cust.files.some(function (x) { return x.file.name === f.name && x.file.size === f.size; })) return;
      if (cust.files.length >= MAX_FILES) { errs.push("Up to " + MAX_FILES + " files per request. " + f.name + " was not added."); return; }
      cust.files.push({ file: f, kind: kind, status: "Ready to send" });
    });
    $("#c-file").value = "";
    renderFiles();
    custUpdate();
    setStatus("#c-status", errs.join(" "), errs.length > 0);
  }
  function renderFiles() {
    $("#c-files").innerHTML = cust.files.map(function (x, i) {
      return '<li><span class="fn">' + esc(x.file.name) + '</span><span class="note">' + x.kind + " (" + esc(extOf(x.file.name).toUpperCase()) + "), " + fmtSize(x.file.size) + '</span><span class="note fs-st">' + esc(x.status) + '</span><button type="button" class="linkbtn" data-rmfile="' + i + '" aria-label="Remove ' + esc(x.file.name) + '">Remove</button></li>';
    }).join("");
  }

  /* ---------- projects ---------- */
  function renderProjects() {
    var types = ["All", "Production", "Prototyping", "Custom"];
    $("#proj-filter").innerHTML = types.map(function (t) { return '<button class="chip" type="button" data-pf="' + t + '" aria-pressed="' + (state.proj === t) + '">' + t + "</button>"; }).join("");
    $("#projects-grid").innerHTML = PROJECTS.filter(function (p) { return state.proj === "All" || p.type === state.proj; }).map(function (p) {
      return '<article class="proj">' + cvHTML(p.prof, p.c, .8, 70) + '<div class="pb"><span class="micro">' + p.type + ", " + p.who + "</span><h3>" + p.n + "</h3><p>" + p.d + '</p><div class="meta micro"><span>' + p.mat + "</span><span>" + p.qty + "</span><span>" + p.time + "</span></div></div></article>";
    }).join("");
    drawAll($("#projects-grid"));
  }


  /* ---------- phone menu from the logo ---------- */
  var mq = window.matchMedia("(max-width: 720px)");
  function setMenu(open) {
    var nav = $("#nav"), br = $("#brand");
    nav.classList.toggle("open", open);
    if (mq.matches) br.setAttribute("aria-expanded", open ? "true" : "false"); else br.removeAttribute("aria-expanded");
  }
  if (mq.addEventListener) mq.addEventListener("change", function () { setMenu(false); });

  $$("[data-free]").forEach(function (el) { el.textContent = inr(FREE); });

  /* ---------- font switcher ---------- */
  var FONTS = [["soft", "Soft serif"], ["editorial", "Editorial"], ["modern", "Modern"]];
  var fontIdx = 0;
  function applyFont(i, announce) {
    fontIdx = i;
    if (FONTS[i][0] === "soft") document.documentElement.removeAttribute("data-font"); else document.documentElement.setAttribute("data-font", FONTS[i][0]);
    try { localStorage.setItem("tp-font", FONTS[i][0]); } catch (e) {}
    if (announce) toast("Font: " + FONTS[i][1]);
  }
  try { var sf = localStorage.getItem("tp-font"); FONTS.forEach(function (f, i) { if (f[0] === sf) fontIdx = i; }); } catch (e) {}

  /* ---------- routing ---------- */
  var VIEWS = ["home", "catalog", "customize", "about", "contact", "login", "signup"];
  function route() {
    var parts = (location.hash || "#home").slice(1).split("/"), h = parts[0];
    if (VIEWS.indexOf(h) < 0) h = "home";
    if (h === "catalog") {
      /* #catalog shows every collection; #catalog/<id> shows that collection only */
      var want = parts[1] && cById(parts[1]) ? parts[1] : "all";
      if (want !== state.cat) { state.cat = want; state.sub = "All"; state.shown = PAGE; }
    }
    state.view = h;
    VIEWS.forEach(function (v) { $("#view-" + v).hidden = v !== h; });
    $$("[data-nav]").forEach(function (a) { if (a.dataset.nav === h) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    closeAll(); setMenu(false);
    window.scrollTo(0, 0);
    if (h === "catalog") { $$("[data-cat]", $("#tiles-cat")).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.cat === state.cat); }); renderCatHead(); renderGrid(); }
    requestAnimationFrame(function () { drawAll(); if (h === "customize") custUpdate(); if (h === "home") knotResize(); });
  }

  /* ---------- hero: 3D spinning logo coin (three.js) ---------- */
  var LOGO_HI = "data:image/webp;base64,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";
  var knot = null;
  function initKnot() {
    try {
      if (!window.THREE) return;
      var T = THREE, cv = $("#knot");
      var renderer = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = T.sRGBEncoding;
      var scene = new T.Scene(), cam = new T.PerspectiveCamera(35, 1, .1, 60);
      /* reflection map for the chrome rim: blue and orange softboxes */
      var ec = document.createElement("canvas"); ec.width = 1024; ec.height = 512;
      var g = ec.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 512);
      gr.addColorStop(0, "#f2fbff"); gr.addColorStop(.32, "#5fb4d9"); gr.addColorStop(.5, "#6a4a38"); gr.addColorStop(.74, "#1a100b"); gr.addColorStop(1, "#f2c28f");
      g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
      g.fillStyle = "rgba(255,255,255,.96)"; g.fillRect(110, 80, 90, 160); g.fillRect(430, 50, 170, 64); g.fillRect(770, 100, 70, 180);
      g.fillStyle = "rgba(255,150,50,.9)"; g.fillRect(620, 190, 120, 42); g.fillStyle = "rgba(100,200,255,.85)"; g.fillRect(260, 210, 90, 36);
      var env = new T.CanvasTexture(ec); env.mapping = T.EquirectangularReflectionMapping; env.encoding = T.sRGBEncoding;
      var chrome = new T.MeshStandardMaterial({ color: 0xffffff, metalness: .6, roughness: .5, envMap: env, envMapIntensity: .55 });
      var face = new T.MeshStandardMaterial({ color: 0x1a1512, metalness: 0, roughness: .85, envMap: env, envMapIntensity: .1 });
      var R = 1.2, H = .22, group = new T.Group();
      var rim = new T.Mesh(new T.CylinderGeometry(R, R, H, 96, 1, true), chrome); rim.rotation.x = Math.PI / 2; group.add(rim);
      var tg = new T.TorusGeometry(R, .08, 24, 120);
      var t1 = new T.Mesh(tg, chrome); t1.position.z = H / 2; group.add(t1);
      var t2 = new T.Mesh(tg, chrome); t2.position.z = -H / 2; group.add(t2);
      var dg = new T.CircleGeometry(R - .01, 96);
      var front = new T.Mesh(dg, face); front.position.z = H / 2 + .003; group.add(front);
      var back = new T.Mesh(dg, face); back.position.z = -H / 2 - .003; back.rotation.y = Math.PI; group.add(back);
      scene.add(group);
      scene.add(new T.AmbientLight(0xffffff, .95));
      var dl = new T.DirectionalLight(0xffffff, .5); dl.position.set(2, 3, 5); scene.add(dl);
      new T.TextureLoader().load(LOGO_HI, function (lt) {
        lt.encoding = T.sRGBEncoding; lt.anisotropy = renderer.capabilities.getMaxAnisotropy();
        face.map = lt; face.color.set(0xffffff); face.needsUpdate = true;
        knotRender(performance.now());
      });
      knot = { r: renderer, s: scene, c: cam, m: group, mx: 0, my: 0, tx: 0, ty: 0 };
      $("#hero").classList.add("gl");
      window.addEventListener("pointermove", function (e) { knot.tx = e.clientX / window.innerWidth - .5; knot.ty = e.clientY / window.innerHeight - .5; });
      knotResize(); knotRender(0);
    } catch (e) { knot = null; }
  }
  function knotResize() {
    if (!knot) return;
    var cv = $("#knot"), w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    knot.r.setSize(w, h, false);
    var a = w / h; knot.c.aspect = a; knot.c.updateProjectionMatrix();
    var z = Math.max(2.75 / (.6 * .63), 2.75 / (.92 * .63 * a));
    if (a < .8) z *= 1.2;
    knot.c.position.set(0, 0, z);
    knotRender(performance.now());
  }
  function knotRender(ts) {
    if (!knot) return;
    knot.mx += (knot.tx - knot.mx) * .06; knot.my += (knot.ty - knot.my) * .06;
    var t = reduce ? 0 : ts / 1000;
    knot.m.rotation.y = reduce ? .45 : t * .9 + knot.mx * .6;
    knot.m.rotation.x = .12 + knot.my * .5 + (reduce ? 0 : Math.sin(t * .6) * .08);
    knot.r.render(knot.s, knot.c);
  }

  /* ---------- teaser animation ---------- */
  function teaserFrame(ts) {
    var cv = $("#teaser"); if (!cv || !cv.clientWidth) return;
    var cycle = 12500, p = reduce ? 1 : Math.min(1, ((ts + .72 * 10000) % cycle) / 10000);
    drawObj(cv, P.vase, { layers: 80, c: [196, 80, 58], p: p, live: !reduce && p < 1, time: ts, plate: "#9ADBFF" });
  }
  function loop(ts) {
    if (state.view === "home") { knotRender(ts); teaserFrame(ts); }
    requestAnimationFrame(loop);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var br = t.closest("#brand");
    if (br && mq.matches) { e.preventDefault(); setMenu(!$("#nav").classList.contains("open")); return; }
    if (!t.closest("#nav")) setMenu(false);
    var tg = t.closest("[data-toggle]");
    if (tg) { var inp = $("#" + tg.dataset.toggle); var show = inp.type === "password"; inp.type = show ? "text" : "password"; tg.textContent = show ? "Hide" : "Show"; return; }
    if (t.closest("#forgot")) { setStatus("#l-status", "Template only: connect your login provider to send password reset emails.", false); return; }
    var fo = t.closest('[data-act="font"]'); if (fo) { applyFont((fontIdx + 1) % FONTS.length, true); return; }
    var sb = t.closest("[data-sub]"); if (sb) { state.sub = sb.dataset.sub; state.shown = PAGE; renderGrid(); return; }
    if (t.closest("[data-more]")) { state.shown += PAGE; renderGrid(); return; }
    var ag = t.closest("[data-age]");
    if (ag) { if (ag.dataset.age === "yes") { state.adult = true; try { sessionStorage.setItem("tp-adult", "1"); } catch (e) {} renderGrid(); } else { location.hash = "#catalog"; } return; }
    var add = t.closest("[data-add]"); if (add) { e.stopPropagation(); addToCart(add.dataset.add); return; }
    var tile = t.closest("[data-cat]"); if (tile) { location.hash = tile.dataset.cat === "all" ? "#catalog" : "#catalog/" + tile.dataset.cat; return; }
    var card = t.closest(".pcard"); if (card) { openModal(card.dataset.id); return; }
    if (t.closest("#open-cart")) { openCart(); return; }
    if (t.closest("#close-cart") || t.closest("#m-close") || t.id === "scrim") { closeAll(); return; }
    var mc = t.closest("[data-mc]"); if (mc) { mcur.color = +mc.dataset.mc; modalUpdate(); return; }
    var ms = t.closest("[data-ms]"); if (ms) { mcur.size = +ms.dataset.ms; modalUpdate(); return; }
    if (t.closest("#m-add")) { addToCart(mcur.id, { color: mcur.color, size: mcur.size }); closeAll(); openCart(); return; }
    if (t.closest("#m-cust")) { var pr = pById(mcur.id); cust.shape = SHAPES.some(function (s) { return s[0] === pr.prof; }) ? pr.prof : cust.shape; closeAll(); location.hash = "#customize"; setTimeout(buildCustomizer, 0); return; }
    var inc = t.closest("[data-inc]"); if (inc) { state.cart[+inc.dataset.inc].q++; saveCart(); renderCart(); return; }
    var dec = t.closest("[data-dec]"); if (dec) { var it = state.cart[+dec.dataset.dec]; it.q--; if (it.q < 1) state.cart.splice(+dec.dataset.dec, 1); saveCart(); renderCart(); return; }
    var rm = t.closest("[data-rm]"); if (rm) { state.cart.splice(+rm.dataset.rm, 1); saveCart(); renderCart(); return; }
    var sh = t.closest("[data-shape]"); if (sh) { cust.shape = sh.dataset.shape; custUpdate(); return; }
    var cc = t.closest("[data-cc]"); if (cc) { cust.color = +cc.dataset.cc; custUpdate(); return; }
    var rf = t.closest("[data-rmfile]"); if (rf) { cust.files.splice(+rf.dataset.rmfile, 1); renderFiles(); custUpdate(); $("#c-file").focus(); return; }
    var pf = t.closest("[data-pf]"); if (pf) { state.proj = pf.dataset.pf; renderProjects(); return; }
    if (t.closest("#checkout")) { $("#co-status").textContent = "Template checkout. Connect your payment provider to take real orders."; return; }
    if (t.closest('[data-act="theme"]')) {
      var root = document.documentElement, dark = root.dataset.theme ? root.dataset.theme === "dark" : !(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
      root.dataset.theme = dark ? "light" : "dark"; requestAnimationFrame(function () { drawAll(); if (state.view === "customize") custUpdate(); });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAll(); setMenu(false); }
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("pcard")) openModal(e.target.dataset.id);
  });
  window.addEventListener("hashchange", route);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { knotResize(); drawAll(); if (state.view === "customize") custUpdate(); if (!$("#modal").hidden) modalUpdate(); }, 100); });

  $("#q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); state.shown = PAGE; renderGrid(); });
  $("#sort").addEventListener("change", function (e) { state.sort = e.target.value; state.shown = PAGE; renderGrid(); });
  ["c-size", "c-fill", "c-fin", "c-qty", "c-model"].forEach(function (id) { $("#" + id).addEventListener("input", custUpdate); $("#" + id).addEventListener("change", custUpdate); });
  $("#cform").addEventListener("change", function (e) {
    if (e.target.name === "quality") { cust.qual = e.target.value; custUpdate(); }
    if (e.target.name === "material") { cust.mat = e.target.value; custUpdate(); }
  });
  $("#c-file").addEventListener("change", function (e) { addFiles(e.target.files); });
  (function () {
    var dz = $("#c-drop");
    ["dragenter", "dragover"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("over"); }); });
    dz.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  })();
  $("#c-col").addEventListener("keydown", function (e) {
    var k = e.key, n = CCOLS.length;
    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].indexOf(k) < 0) return;
    e.preventDefault();
    cust.color = (cust.color + (k === "ArrowRight" || k === "ArrowDown" ? 1 : n - 1)) % n;
    custUpdate(); $('[data-cc="' + cust.color + '"]').focus();
  });

  function setStatus(sel, msg, err) { var el = $(sel); el.textContent = msg; el.classList.toggle("err", !!err); }
  function bad(el, msg, st) { setStatus(st, msg, true); el.focus(); }
  function okEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function okPhone(v) { var d = v.replace(/[\s()+-]/g, ""); return /^\d{10,13}$/.test(d); }
  $("#cform").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!$("#c-model").value.trim()) return bad($("#c-model"), "Add a model name so we can track your request.", "#c-status");
    if (!cust.files.length) return bad($("#c-file"), "Upload at least one 3D file or reference image.", "#c-status");
    if (!cust.mat) return bad($("#c-mat"), "Choose a material.", "#c-status");
    if (!$("#c-name").value.trim()) return bad($("#c-name"), "Add your name so we know who to reply to.", "#c-status");
    if (!okEmail($("#c-email").value.trim())) return bad($("#c-email"), "Add a valid email so we can send the quote.", "#c-status");
    if (!okPhone($("#c-phone").value.trim())) return bad($("#c-phone"), "Add a phone number with 10 to 13 digits so we can call you about the request.", "#c-status");
    var url = window.SHOP && SHOP.customOrderEndpoint;
    if (!url) return setStatus("#c-status", "Online requests are not connected yet, so nothing was sent. Please contact us by email or phone for now.", true);
    var fd = new FormData($("#cform"));
    fd.delete("quality"); fd.delete("material");
    fd.append("quality", cust.qual); fd.append("material", cust.mat);
    fd.append("colour", CCOLS[cust.color] ? CCOLS[cust.color].n : "");
    fd.append("colourInStock", CCOLS[cust.color] && CCOLS[cust.color].stock ? "yes" : "no");
    fd.append("previewShape", cust.shape);
    cust.files.forEach(function (x) { fd.append("files", x.file, x.file.name); x.status = "Uploading..."; });
    renderFiles();
    var btn = $("#c-submit"); btn.disabled = true;
    setStatus("#c-status", "Sending your request...", false);
    fetch(url, { method: "POST", body: fd, headers: { "Accept": "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("status " + r.status);
      cust.files.forEach(function (x) { x.status = "Uploaded"; });
      renderFiles();
      setStatus("#c-status", "Your customization request has been submitted. Our team will review your requirements and contact you to confirm feasibility, any additional design charges, and the final quote before proceeding.", false);
    }).catch(function () {
      cust.files.forEach(function (x) { x.status = "Not sent"; });
      renderFiles();
      setStatus("#c-status", "We could not send your request. Nothing was submitted. Check your connection and try again, or contact us by email or phone.", true);
    }).then(function () { btn.disabled = false; });
  });
  $("#kform").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!okEmail($("#k-email").value.trim())) return bad($("#k-email"), "Add a valid email so we can reply.", "#k-status");
    setStatus("#k-status", "Template form: connect it to your inbox to receive real messages.", false);
  });
  $("#nform").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!okEmail($("#n-email").value.trim())) return bad($("#n-email"), "Enter a valid email.", "#n-status");
    setStatus("#n-status", "Template form: connect it to your mailing list.", false);
  });
  $("#lform").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!okEmail($("#l-email").value.trim())) return bad($("#l-email"), "Enter the email you signed up with.", "#l-status");
    if (!$("#l-pass").value) return bad($("#l-pass"), "Enter your password.", "#l-status");
    setStatus("#l-status", "Template only: nothing was checked. Connect your login provider (for example Firebase, Auth0 or Supabase) to make this real.", false);
  });
  function strength(v) {
    var n = 0;
    if (v.length >= 8) n++; if (/\d/.test(v)) n++; if (/[a-z]/.test(v) && /[A-Z]/.test(v)) n++; if (/[^A-Za-z0-9]/.test(v)) n++;
    return n;
  }
  $("#s-pass").addEventListener("input", function (e) {
    var n = strength(e.target.value), m = $("#s-meter");
    m.style.width = (n * 25) + "%";
    m.style.background = n <= 1 ? "var(--err)" : n === 2 ? "var(--accent)" : "var(--blue)";
    $("#s-meter-t").textContent = e.target.value ? ["Too short", "Weak", "Okay", "Good", "Strong"][n] : "Use 8 or more characters with a number.";
  });
  $("#sform").addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = $("#s-pass").value;
    if (!$("#s-name").value.trim()) return bad($("#s-name"), "Add your name.", "#s-status");
    if (!okEmail($("#s-email").value.trim())) return bad($("#s-email"), "Enter a valid email.", "#s-status");
    if (pw.length < 8 || !/\d/.test(pw)) return bad($("#s-pass"), "Use at least 8 characters, including a number.", "#s-status");
    if (pw !== $("#s-pass2").value) return bad($("#s-pass2"), "The two passwords do not match.", "#s-status");
    if (!$("#s-terms").checked) return bad($("#s-terms"), "Tick the box to accept the terms.", "#s-status");
    setStatus("#s-status", "Template only: no account was created. Connect your login provider to make sign-up real.", false);
  });

  /* ---------- boot ---------- */
  applyFont(fontIdx, false);
  setMenu(false);
  renderTiles(); renderCart(); renderProjects(); buildCustomizer(); renderGrid();
  initKnot();
  route();
  if (reduce) { knotRender(0); teaserFrame(0); } else { requestAnimationFrame(loop); }
})();
