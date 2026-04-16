/* ============================================================
       DATA — edit your products here
       images: array of paths — use local paths like "./static/product images/ABS Sensor.jpg"
       title: shown as the card heading
       desc: first line of description
       subDesc: (optional) second line — remove if not needed
       stats: pentagon values (value 0–10, actual = label shown on chart)
    ============================================================ */
const data = [
  {
    images: [
      "./static/Images/SP1.jpg",
      "./static/Images/SP2.jpg",
      "./static/Images/SP3.jpg",
      "./static/Images/SUN-1.jpg",
      "./static/Images/SUN.jpg"
    ],
    title: "ABS Sensor",
    desc: "High-precision wheel speed sensor",
    subDesc: "Compatible with most makes & models",
    stats: [
      { label: "SPD", value: 10, actual: "250km/h" },
      { label: "ACC", value: 8, actual: "3.2s" },
      { label: "PWR", value: 9, actual: "500HP" },
      { label: "CTRL", value: 7, actual: "Stable" },
      { label: "BRK", value: 6, actual: "38m" },
    ],
  },
  {
      images: [
        "./static/Images/SUN-1.jpg",
      "./static/Images/SUN.jpg"
    ],
    title: "AC Filter",
    desc: "Premium cabin air filter",
    subDesc: "HEPA-grade filtration",
    stats: [
      { label: "SPD", value: 7, actual: "200km/h" },
      { label: "ACC", value: 6, actual: "4.1s" },
      { label: "PWR", value: 8, actual: "420HP" },
      { label: "CTRL", value: 9, actual: "Firm" },
      { label: "BRK", value: 8, actual: "34m" },
    ],
  },
  {
    images: [
        "./static/Images/SP2.jpg",
        "./static/Images/SP1.jpg",
      "./static/Images/SP3.jpg",
      "./static/Images/SUN-1.jpg"
    ],
    title: "AC Filter",
    desc: "Premium cabin air filter",
    subDesc: "HEPA-grade filtration",
    stats: [
      { label: "SPD", value: 7, actual: "200km/h" },
      { label: "ACC", value: 6, actual: "4.1s" },
      { label: "PWR", value: 8, actual: "420HP" },
      { label: "CTRL", value: 9, actual: "Firm" },
      { label: "BRK", value: 8, actual: "34m" },
    ],
  },
  {
    images: [
        "./static/Images/SP3.jpg",
      "./static/Images/SP1.jpg",
      "./static/Images/SP2.jpg",
      "./static/Images/SUN-1.jpg",
    ],
    title: "AC Vent & Switch",
    desc: "OEM-replacement vent assembly",
    subDesc: "Direct fit, no modification needed",
    stats: [
      { label: "ATK", value: 9, actual: "95" },
      { label: "DEF", value: 7, actual: "80" },
      { label: "SPD", value: 8, actual: "88" },
      { label: "PAS", value: 6, actual: "75" },
      { label: "DRB", value: 9, actual: "92" },
    ],
  },
];

const container = document.getElementById("container");

/* ===== RADAR / PENTAGON ===== */
function createRadar(svg, stats) {
  const cx = 100,
    cy = 100,
    maxRadius = 60;
  function angle(i) {
    return -Math.PI / 2 + (2 * Math.PI * i) / stats.length;
  }
  function point(a, r) {
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  }

  for (let l = 1; l <= 5; l++) {
    let r = (l / 5) * maxRadius,
      pts = "";
    stats.forEach((_, i) => {
      let p = point(angle(i), r);
      pts += `${p.x},${p.y} `;
    });
    let poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    poly.setAttribute("points", pts);
    poly.setAttribute("class", "grid-level");
    svg.appendChild(poly);
  }

  stats.forEach((s, i) => {
    let end = point(angle(i), maxRadius);
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("class", "axis-line");
    svg.appendChild(line);

    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let lp = point(angle(i), maxRadius + 10);
    t.setAttribute("x", lp.x);
    t.setAttribute("y", lp.y);
    t.textContent = s.label;
    t.setAttribute("class", "stat-label");
    svg.appendChild(t);
  });

  const area = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  area.setAttribute("fill", "rgba(255, 123, 0, 0.3)");
  svg.appendChild(area);

  const points = [],
    texts = [];
  stats.forEach(() => {
    let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", 3);
    c.setAttribute("class", "stat-point");
    svg.appendChild(c);
    points.push(c);
    let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("class", "value-text");
    svg.appendChild(txt);
    texts.push(txt);
  });

  function update(i, prog) {
    let str = "";
    stats.forEach((s, idx) => {
      let p = idx < i ? 1 : idx === i ? prog : 0;
      let r = (s.value / 10) * maxRadius * p;
      let pt = point(angle(idx), r);
      points[idx].setAttribute("cx", pt.x);
      points[idx].setAttribute("cy", pt.y);
      texts[idx].setAttribute("x", pt.x + 5);
      texts[idx].setAttribute("y", pt.y);
      texts[idx].textContent = s.actual;
      str += `${pt.x},${pt.y} `;
    });
    area.setAttribute("points", str);
  }

  function animate(i) {
    let start = performance.now();
    function frame(t) {
      let k = Math.min((t - start) / 400, 1);
      let ease = 1 - Math.pow(1 - k, 3);
      update(i, ease);
      if (k < 1) requestAnimationFrame(frame);
      else if (i + 1 < stats.length) animate(i + 1);
    }
    requestAnimationFrame(frame);
  }
  animate(0);
}

/* ===== BUILD CARDS ===== */
data.forEach((item) => {
  let card = document.createElement("div");
  card.className = "card";

  /* --- slider --- */
  let slider = document.createElement("div");
  slider.className = "slider";

  let slides = document.createElement("div");
  slides.className = "slides";

  let dotsDiv = document.createElement("div");
  dotsDiv.className = "dots";

  let index = 0;

  item.images.forEach((img, i) => {
    let slide = document.createElement("div");
    slide.className = "slide";
    let image = document.createElement("img");
    image.src = img;
    image.onclick = () => openViewer(item.images, i);
    slide.appendChild(image);
    slides.appendChild(slide);

    let dot = document.createElement("div");
    dot.className = "dot";
    dot.onclick = () => {
      index = i;
      updateSlider();
    };
    dotsDiv.appendChild(dot);
  });

  function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = dotsDiv.children;
    for (let i = 0; i < dots.length; i++) {
      let diff = Math.abs(i - index);
      let size = 12 - diff * 2;
      if (size < 4) size = 4;
      dots[i].style.width = size + "px";
      dots[i].style.height = size + "px";
      dots[i].classList.toggle("active", i === index);
    }
  }

  let prev = document.createElement("div");
  prev.className = "card-nav card-prev";
  prev.innerHTML = "❮";
  prev.onclick = () => {
    index = (index - 1 + item.images.length) % item.images.length;
    updateSlider();
  };

  let next = document.createElement("div");
  next.className = "card-nav card-next";
  next.innerHTML = "❯";
  next.onclick = () => {
    index = (index + 1) % item.images.length;
    updateSlider();
  };

  slider.appendChild(slides);
  slider.appendChild(prev);
  slider.appendChild(next);
  updateSlider();

  /* --- text details --- */
  let details = document.createElement("div");
  details.className = "details";
  /* ── TO ADD MORE DESCRIPTION LINES: duplicate the <p> below ── */
  details.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <p class="desc-sub">${item.subDesc || ""}</p>
      `;

  /* --- radar --- */
  let radarBox = document.createElement("div");
  radarBox.className = "radar-box";
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  radarBox.appendChild(svg);
  createRadar(svg, item.stats);

  /* --- enquiry button --- */
  let btnWrap = document.createElement("div");
  btnWrap.className = "enquiry-btn-wrap";
  let btn = document.createElement("button");
  btn.className = "enquiry-btn";
  btn.textContent = "Hire Rental";
  btn.onclick = () => openForm(item.title);
  btnWrap.appendChild(btn);

  /* --- assemble --- */
  card.appendChild(slider);
  card.appendChild(dotsDiv);
  card.appendChild(details);
  card.appendChild(radarBox);
  card.appendChild(btnWrap);
  container.appendChild(card);
});

/* ===== FORM ===== */
function openForm(title) {
  document.getElementById("carname").value = title;
  document.getElementById("username").value = "";
  document.getElementById("formOverlay").style.display = "flex";
}
function closeForm() {
  document.getElementById("formOverlay").style.display = "none";
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById("formOverlay")) closeForm();
}
function sendToWhatsApp() {
  const name = document.getElementById("username").value;
  const car = document.getElementById("carname").value;
  if (!name) {
    alert("Enter name");
    return;
  }
  let msg = `*Car Enquiry Request!*%0AName: ${encodeURIComponent(name)}%0ACar Name: ${encodeURIComponent(car)}`;
  window.open(`https://api.whatsapp.com/send?phone=+918982611211&text=${msg}`);
}

/* ===== VIEWER ===== */
let viewerIndex = 0,
  viewerImages = [],
  scale = 1;
function openViewer(images, index) {
  viewerImages = images;
  viewerIndex = index;
  scale = 1;
  document.getElementById("viewerOverlay").style.display = "flex";
  showViewer();
}
function showViewer() {
  const img = document.getElementById("viewerImg");
  img.src = viewerImages[viewerIndex];
  img.style.transform = `scale(${scale})`;
}
function changeView(dir) {
  viewerIndex = (viewerIndex + dir + viewerImages.length) % viewerImages.length;
  scale = 1;
  showViewer();
}
function closeViewer() {
  document.getElementById("viewerOverlay").style.display = "none";
}
function zoomIn() {
  scale = Math.min(scale + 0.3, 5);
  showViewer();
}
function zoomOut() {
  scale = Math.max(scale - 0.3, 1);
  showViewer();
}
// ============================================OPEN CLOSE HAM MENU=================================

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    const icon = document.querySelector(".menu-icon i");
    
    // Toggle the active class
    nav.classList.toggle("active");
    
    // Smoothly swap the icon
    if (nav.classList.contains("active")) {
        icon.classList.replace("fa-bars", "fa-xmark");
    } else {
        icon.classList.replace("fa-xmark", "fa-bars");
    }
}

// Close menu when clicking a link
document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById("navLinks");
        const icon = document.querySelector(".menu-icon i");
        nav.classList.remove("active");
        icon.classList.replace("fa-xmark", "fa-bars");
    });
});

// Close menu if user clicks anywhere else on the page
window.addEventListener('click', (e) => {
    const nav = document.getElementById("navLinks");
    const menuIcon = document.querySelector(".menu-icon");
    if (!nav.contains(e.target) && !menuIcon.contains(e.target)) {
        nav.classList.remove("active");
        document.querySelector(".menu-icon i").classList.replace("fa-xmark", "fa-bars");
    }
});