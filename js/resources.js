document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("resourcesContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const resultCount = document.getElementById("resultCount");
  const gridViewBtn = document.getElementById("gridViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  const quickFilters = document.querySelectorAll("#quickFilters .text-link");
  const backToTopBtn = document.getElementById("backToTop");

  // PDF Modal Elements
  const pdfModal = document.getElementById("pdfModal");
  const pdfModalClose = document.getElementById("pdfModalClose");
  const pdfIframe = document.getElementById("pdfIframe");
  const pdfModalTitle = document.getElementById("pdfModalTitle");
  const pdfModalDownload = document.getElementById("pdfModalDownload");
  const pdfModalOpen = document.getElementById("pdfModalOpen");

  let allResources = [];
  let currentView = "grid"; // 'grid' or 'list'

  // Fetch JSON Data
  fetch("data/resources.json")
    .then((res) => res.json())
    .then((data) => {
      allResources = data;
      renderResources();
    })
    .catch((err) => {
      console.error("Failed to load resources:", err);
      container.innerHTML = "<p>Failed to load resources. Please try again later.</p>";
      resultCount.textContent = "0 resources found";
    });

  // Render Function
  function renderResources() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = allResources.filter((res) => {
      const matchText = (
        (res.title || "").toLowerCase().includes(searchTerm) ||
        (res.description || "").toLowerCase().includes(searchTerm) ||
        (res.course || "").toLowerCase().includes(searchTerm) ||
        (res.authors || "").toLowerCase().includes(searchTerm) ||
        ((res.tags || []).join(" ").toLowerCase().includes(searchTerm))
      );
      const matchCat = category === "All" || res.type === category;
      return matchText && matchCat;
    });

    resultCount.textContent = `Showing ${filtered.length} resource${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--muted);">No resources found matching your criteria.</div>`;
      return;
    }

    container.innerHTML = filtered.map((res) => {
      // Determine primary action
      let buttonsHtml = "";
      
      if (res.pdfUrl && res.pdfUrl !== "javascript:void(0)") {
        buttonsHtml += `<button class="btn primary view-pdf-btn" data-url="${res.pdfUrl}" data-title="${res.title}">View PDF</button>`;
      }
      
      if (res.sourceUrl && res.sourceUrl !== "javascript:void(0)") {
        buttonsHtml += `<a href="${res.sourceUrl}" target="_blank" rel="noreferrer" class="btn ${!buttonsHtml ? 'primary' : ''}">Official Source</a>`;
      }

      if (!buttonsHtml && res.status) {
        buttonsHtml = `<span class="badge" style="align-self: center;">${res.status}</span>`;
      }

      const tagsHtml = res.tags ? res.tags.map(t => `<span>${t}</span>`).join("") : "";

      return `
        <article class="resource-card card">
          <div class="card-content">
            <span class="eyebrow">${res.type} ${res.course ? '• ' + res.course : ''}</span>
            <h3>${res.title}</h3>
            ${res.authors ? `<p style="font-size: 0.85rem; color: var(--accent-2); margin-top: -0.5rem;">${res.authors}</p>` : ''}
            <p>${res.description}</p>
            
            <div class="resource-meta">
              ${res.year || res.date ? `<span>📅 ${res.year || res.date}</span>` : ''}
              ${res.pages ? `<span>📄 ${res.pages} pages</span>` : ''}
              ${res.size ? `<span>💾 ${res.size}</span>` : ''}
            </div>

            ${tagsHtml ? `<div class="chip-row">${tagsHtml}</div>` : ''}
          </div>
          
          <div class="resource-actions">
            ${buttonsHtml}
          </div>
        </article>
      `;
    }).join("");

    // Attach event listeners for PDF modal
    const pdfButtons = container.querySelectorAll(".view-pdf-btn");
    pdfButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const url = e.target.getAttribute("data-url");
        const title = e.target.getAttribute("data-title");
        openPdfModal(url, title);
      });
    });
  }

  // Event Listeners for Filters
  searchInput.addEventListener("input", renderResources);
  categoryFilter.addEventListener("change", renderResources);

  quickFilters.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tag = e.target.getAttribute("data-tag");
      searchInput.value = tag;
      renderResources();
    });
  });

  // View Toggles
  gridViewBtn.addEventListener("click", () => {
    currentView = "grid";
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    container.classList.remove("resources-list");
    container.classList.add("resources-grid");
  });

  listViewBtn.addEventListener("click", () => {
    currentView = "list";
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    container.classList.remove("resources-grid");
    container.classList.add("resources-list");
  });

  // PDF Modal Logic
  function openPdfModal(url, title) {
    pdfModalTitle.textContent = title;
    pdfIframe.src = url + "#toolbar=0"; // Attempt to hide native toolbar if possible
    pdfModalDownload.href = url;
    pdfModalOpen.href = url;
    
    pdfModal.classList.add("active");
    pdfModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open"); // Lock background scroll
  }

  function closePdfModal() {
    pdfModal.classList.remove("active");
    pdfModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    setTimeout(() => {
      pdfIframe.src = ""; // Clear src so it doesn't keep loading in bg
    }, 300);
  }

  pdfModalClose.addEventListener("click", closePdfModal);
  
  // Close modal when clicking outside content
  pdfModal.addEventListener("click", (e) => {
    if (e.target === pdfModal) {
      closePdfModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pdfModal.classList.contains("active")) {
      closePdfModal();
    }
  });

  // Back to Top Button
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
