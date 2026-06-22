const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// 1. Loader screen controller
window.addEventListener("load", () => {
  const loader = $("#loader");
  if (loader) {
    loader.classList.add("fade-out");
  }
});

// Set current footer year
$("#year") && ($("#year").textContent = new Date().getFullYear());

// 2. Mobile navbar hamburger toggle
const navToggle = $("#navToggle");
const siteNav = $("#siteNav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  });
  
  // Close menu on link click
  $$("a", siteNav).forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "Menu";
    });
  });
}

// 3. Metric counters animation
function animateCounters() {
  const counters = $$(".counter");
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1500;
      const start = performance.now();
      
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        el.textContent = Math.round(target * eased).toLocaleString("en-IN") + (target >= 100 ? "+" : "");
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });
  
  counters.forEach((counter) => observer.observe(counter));
}

// 4. Particle starfield canvas animator
function drawStarfield() {
  const canvas = $("#starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    
    // Scale stars count based on screen width
    const count = Math.min(120, Math.floor(window.innerWidth / 10));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.7 + 0.2, // alpha opacity
      s: Math.random() * 0.12 + 0.03 // falling speed
    }));
  };
  
  const frame = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((star) => {
      star.y += star.s;
      // Loop star back to top when it exits screen
      if (star.y > window.innerHeight) {
        star.y = 0;
        star.x = Math.random() * window.innerWidth;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.fillStyle = isLight ? `rgba(15, 23, 42, ${star.a * 0.8})` : `rgba(240, 244, 255, ${star.a})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  };
  
  resize();
  window.addEventListener("resize", resize);
  frame();
}

// 5. Utility helper to load JSON files
async function getJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load database file at: ${path}`);
  return res.json();
}

// 6. Render Research Themes Grid
function renderResearch() {
  const grid = $("#researchGrid");
  if (!grid) return;
  
  const themes = [
    {
      title: "Satellite Image Processing",
      badge: "Remote Sensing",
      challenge: "High resolution optical and SAR satellites capture massive structural datasets, but alignment, pansharpening, and semantic interpretation remain challenging.",
      contribution: "Developing image fusion algorithms (pansharpening), deep representation mapping for landslide identification, and robust land-use classification.",
      outcome: "Publications in IEEE Transactions, co-developed datasets, and algorithms shared with space applications centers."
    },
    {
      title: "Deep Visual Learning",
      badge: "Deep Learning",
      challenge: "Deploying neural networks in avionics and orbit requires robust prediction, low parameter footprint, and reliable performance under domain shifts.",
      contribution: "Formulating novel CNN and Vision Transformer architectures for real-time visual tracking, segmentation, and zero-shot categorization.",
      outcome: "Open-source deep networks, real-time object tracking benchmarks, and optimized parameter architectures."
    },
    {
      title: "Virtual Reality Simulators",
      badge: "Immersive Tech",
      challenge: "Creating repeatable, safe, and highly interactive training and simulation modules for complex flight avionics and disaster scenarios.",
      contribution: "Synthesizing immersive virtual environments, 3D interaction parameters, and multi-user simulations for disaster mitigation and flight path training.",
      outcome: "Immersive VR disaster response prototype models, user studies, and visual spatial interaction analytics."
    },
    {
      title: "Biometric Authentication",
      badge: "Pattern Recognition",
      challenge: "Securing access points in mission-critical applications requires high-accuracy, spoof-resistant face and iris recognition systems.",
      contribution: "Formulating deep metric learning architectures, multi-modal biometrics, and cross-spectral recognition algorithms.",
      outcome: "High-accuracy biometric pipelines, thermal face datasets, and spoof-detection modules."
    },
    {
      title: "Computational Neuroscience",
      badge: "Neural Modeling",
      challenge: "Bridging the gap between biological brains and artificial networks to create more efficient and adaptable machine learning models.",
      contribution: "Mathematical modeling of synaptic plasticities, biological visual pathways, and computational brain models.",
      outcome: "Theoretical neural papers, biologically inspired learning rules, and network architectures."
    },
    {
      title: "Digital Signal Processing",
      badge: "Instrumentation",
      challenge: "Extracting semantic info from noisy, multidimensional biosignals, hyperspectral bands, and flight instrumentation readings.",
      contribution: "Applying advanced filtering, wavelets, and adaptive algorithms to hyperspectral sensing and avionics signals.",
      outcome: "Robust signal restoration pipelines, denoising toolboxes, and instrumentation interfaces."
    }
  ];
  
  grid.innerHTML = themes.map((t) => `
    <article class="research-card">
      <span class="badge">${t.badge}</span>
      <h3>${t.title}</h3>
      <p><strong>Challenge:</strong> ${t.challenge}</p>
      <p><strong>Lab Focus:</strong> ${t.contribution}</p>
      <p><strong>Deliverable:</strong> ${t.outcome}</p>
      <ul>
        <li>Filter publications under "${t.title}" in the publications catalog.</li>
      </ul>
    </article>
  `).join("");
}

// 7. Render News Timeline Widget
async function renderNews() {
  const targets = [$("#newsList"), $("#homeNews")].filter(Boolean);
  if (!targets.length) return;
  
  try {
    const items = await getJson("data/news.json");
    targets.forEach((target) => {
      const limit = Number(target.dataset.limit || items.length);
      target.innerHTML = items.slice(0, limit).map((item) => `
        <article class="timeline-item">
          <time datetime="${item.date}">
            ${new Date(item.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <div>
            <span class="badge">${item.type}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
        </article>
      `).join("");
    });
  } catch (error) {
    console.error("Failed to render news:", error);
  }
}

// 8. Render Project Cards
async function renderProjects() {
  const grid = $("#projectsGrid");
  if (!grid) return;
  
  try {
    const projects = await getJson("data/projects.json");
    grid.innerHTML = projects.map((p) => `
      <article class="card">
        <span class="badge">${p.status}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><strong>Funding Body:</strong> ${p.fundingAgency}</p>
        <p><strong>Key Collaborator:</strong> ${p.collaborators}</p>
        <p><strong>Duration:</strong> ${p.duration}</p>
        <p><strong>Expected Impact:</strong> ${p.impact}</p>
        <p><strong>Outcome Indicators:</strong> ${p.expectedOutcomes}</p>
      </article>
    `).join("");
  } catch (error) {
    console.error("Failed to render projects:", error);
  }
}

// 9. Render People Directory
async function renderPeople() {
  const host = $("#peopleSections");
  if (!host) return;
  
  try {
    const groups = await getJson("data/people.json");
    host.innerHTML = groups.map((g) => `
      <section class="section-heading" style="margin-top: 2rem;">
        <p class="eyebrow">${g.category}</p>
        <div class="card-grid">
          ${g.members.map((m) => `
            <article class="card">
              <div class="avatar">${m.photo ? `<img class="profile-photo" src="${m.photo}" alt="${m.name}">` : m.initials}</div>
              <h3>${m.name}</h3>
              <p class="small-meta">${m.role}</p>
              <p>${m.researchArea}</p>
              ${m.links && m.links.length ? `
                <div class="chip-row">
                  ${m.links.map((lnk) => `<a class="tag" href="${lnk.url}" target="_blank" rel="noreferrer">${lnk.label}</a>`).join("")}
                </div>
              ` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");
  } catch (error) {
    console.error("Failed to render people directory:", error);
  }
}

// 10. Render Lab Facilities
function renderFacilities() {
  const grid = $("#facilitiesGrid");
  if (!grid) return;
  
  const assets = [
    {
      title: "Deep Learning GPUs",
      desc: "NVIDIA-powered CUDA computing servers hosting multi-GPU environments optimized for training deep convolutional models, GANs, and large-scale vision transformers."
    },
    {
      title: "Thermal Camera System",
      desc: "High-precision FLIR infrared imaging setup to investigate biometric face detection and secure authentication beyond the visible spectrum."
    },
    {
      title: "Stereo Vision Setup",
      desc: "Synchronized dual-camera baseline array to facilitate depth mapping, 3D surface reconstruction, flight path navigation, and immersive spatial positioning."
    },
    {
      title: "4 GigE Vision Cameras",
      desc: "High-throughput industrial ethernet cameras mapping ultra-low latency frame grabs for real-time visual tracking and hardware-in-the-loop avionics."
    },
    {
      title: "VR headsets & simulators",
      desc: "Immersive spatial hardware (including HTC Vive and Meta headsets) supporting 3D environment synthesis and disaster response interaction simulators."
    },
    {
      title: "Software Toolkits",
      desc: "Standardized environments in PyTorch, TensorFlow, OpenCV, MATLAB, ROS (Robot Operating System), Blender, and geospatial analysis platforms (QGIS/ArcGIS)."
    },
    {
      title: "Avionics Dev Workstations",
      desc: "Dedicated computing nodes connected to local high-speed LAN networks enabling hardware testing and sensor integration pipelines."
    },
    {
      title: "Immersive Research Lab",
      desc: "Collaborative research workspace providing active students and agency researchers with the ideal environment for physical experiment setups."
    }
  ];
  
  grid.innerHTML = assets.map((a) => `
    <article class="card">
      <span class="badge">Hardware & computing</span>
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
    </article>
  `).join("");
}

// 11. Render Course Curriculum Reference
function renderCourses() {
  const grid = $("#coursesGrid");
  if (!grid) return;
  
  const courses = [
    {
      title: "Machine Learning for Signal Processing",
      topics: ["Statistical learning theories", "Feature extraction and classification", "Adaptive neural processing"],
      books: "Bishop (PRML), Haykin (Neural Networks), Murphy (Machine Learning)"
    },
    {
      title: "Computer Vision",
      topics: ["Pinhole camera models & geometry", "Feature detection & descriptors (SIFT, ORB)", "Structure from Motion & Stereo"],
      books: "Szeliski (Computer Vision), Forsyth & Ponce (Modern Approach)"
    },
    {
      title: "Deep Learning for Computer Vision",
      topics: ["Convolutional Neural Networks", "Transformers & Attention mechanisms", "Generative adversarial networks"],
      books: "Goodfellow (Deep Learning), current IEEE/CVF research papers"
    },
    {
      title: "Digital Image and Video Processing",
      topics: ["2D Fourier transforms & filtering", "Image restorations & deblurring", "Video motion estimation"],
      books: "Gonzalez & Woods (Digital Image Processing)"
    },
    {
      title: "Pattern Recognition",
      topics: ["Supervised vs unsupervised classifiers", "Clustering techniques", "Dimensionality reduction (PCA, LDA)"],
      books: "Duda, Hart & Stork (Pattern Classification)"
    },
    {
      title: "Virtual Reality Systems",
      topics: ["3D interaction & viewing transforms", "Haptic rendering & displays", "Human visual factors in VR"],
      books: "Burdea & Coiffet (Virtual Reality Technology)"
    }
  ];
  
  grid.innerHTML = courses.map((c) => `
    <article class="course-card">
      <span class="badge">Avionics curriculum</span>
      <h3>${c.title}</h3>
      <p>Bridging theoretical fundamentals with practical laboratory applications.</p>
      <ul>
        ${c.topics.map((t) => `<li>${t}</li>`).join("")}
      </ul>
      <p style="margin-top: auto; font-size: 0.88rem;"><strong>References:</strong> ${c.books}</p>
      <a class="text-link" href="contact.html" style="margin-top: 0.5rem;">Request course materials &rarr;</a>
    </article>
  `).join("");
}

// 12. Hero slideshow animator
function initHeroSlideshow() {
  const slides = $$(".hero-slide");
  if (!slides.length) return;
  
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000); // fade every 5 seconds
}

// 13. Lightbox modal controller for gallery
function initLightbox() {
  const galleryItems = $$(".gallery-item");
  const lightbox = $("#lightbox");
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const closeBtn = $("#lightboxClose");
  const prevBtn = $("#lightboxPrev");
  const nextBtn = $("#lightboxNext");
  
  let currentIndex = 0;
  
  // Extract slide data from DOM elements
  const images = galleryItems.map(item => {
    const imgEl = $("img", item);
    const captionEl = $(".gallery-caption", item);
    return {
      src: imgEl ? imgEl.getAttribute("src") : "",
      alt: imgEl ? imgEl.getAttribute("alt") : "",
      caption: captionEl ? captionEl.textContent : ""
    };
  });
  
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open"); // locks background scroll
    if (closeBtn) closeBtn.focus();
  }
  
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open"); // restores scroll
  }
  
  function updateLightbox() {
    const data = images[currentIndex];
    if (lightboxImg && data) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    }
    if (lightboxCaption && data) {
      lightboxCaption.textContent = data.caption;
    }
  }
  
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }
  
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }
  
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });
  
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);
  
  // Close on backdrop click (clicking outside image content wrapper)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard accessibility navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });
}

// Initialise widgets
animateCounters();
drawStarfield();
renderResearch();
renderNews().catch(console.error);
renderProjects().catch(console.error);
renderPeople().catch(console.error);
renderFacilities();
renderCourses();
initHeroSlideshow();
initLightbox();

// 14. Theme Toggle Logic
function initThemeToggle() {
  const toggleBtn = $("#themeToggle");
  if (!toggleBtn) return;
  
  const currentTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  
  if (currentTheme === "light" || (!currentTheme && prefersLight)) {
    document.documentElement.setAttribute("data-theme", "light");
  }
  
  toggleBtn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

initThemeToggle();
