const state = {
  items: [],
  page: 1,
  perPage: 10,
  query: "",
  type: "all",
  year: "all",
  area: "all"
};

const pubList = document.querySelector("#publicationList");
const pubMeta = document.querySelector("#pubMeta");
const pagination = document.querySelector("#pagination");
const search = document.querySelector("#pubSearch");
const typeFilter = document.querySelector("#typeFilter");
const yearFilter = document.querySelector("#yearFilter");
const areaFilter = document.querySelector("#areaFilter");

function normalize(value) {
  return String(value || "").toLowerCase();
}

function filteredItems() {
  return state.items.filter((item) => {
    // 1. Search Query Match
    const haystack = normalize([
      item.title, 
      item.authors, 
      item.venue, 
      item.doi, 
      item.area
    ].join(" "));
    const queryOk = !state.query || haystack.includes(normalize(state.query));
    
    // 2. Type Filter Match
    const typeOk = state.type === "all" || item.type === state.type;
    
    // 3. Year Filter Match
    const yearOk = state.year === "all" || String(item.year) === state.year;
    
    // 4. Area Filter Match
    const areaOk = state.area === "all" || item.area === state.area;
    
    return queryOk && typeOk && yearOk && areaOk;
  });
}

function render() {
  if (!pubList) return;
  
  const items = filteredItems();
  const pages = Math.max(1, Math.ceil(items.length / state.perPage));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * state.perPage;
  const visible = items.slice(start, start + state.perPage);
  
  // Update count indicator
  if (pubMeta) {
    const end = Math.min(start + state.perPage, items.length);
    if (items.length > 0) {
      pubMeta.textContent = `Showing ${start + 1} - ${end} of ${items.length.toLocaleString("en-IN")} publications matching your filters`;
    } else {
      pubMeta.textContent = "No publications found matching your search filters.";
    }
  }
  
  // Render publication cards
  pubList.innerHTML = visible.map((item) => {
    // Generate a Google Scholar search link for this specific publication title
    const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`;
    
    return `
      <article class="publication-card">
        <div>
          <h3>${item.title}</h3>
          <p class="authors" style="color: var(--text); font-weight: 500;">${item.authors}</p>
          <p class="venue-info">${item.venue}, <strong>${item.year}</strong></p>
          <div class="pub-links">
            ${item.doi ? `<a href="https://doi.org/${item.doi}" target="_blank" rel="noreferrer">DOI Link</a>` : ""}
            ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">Publisher Link</a>` : ""}
            <a href="${scholarUrl}" target="_blank" rel="noreferrer">Google Scholar</a>
            <span class="tag">${item.area}</span>
          </div>
        </div>
        <span class="badge">${item.type}</span>
      </article>
    `;
  }).join("");
  
  // Render pagination buttons
  let paginationHtml = "";
  
  // Previous button
  paginationHtml += `
    <button type="button" ${state.page === 1 ? "disabled" : ""} id="prevPage" aria-label="Previous Page">&laquo; Prev</button>
  `;
  
  // Page number buttons
  const maxButtons = 5;
  let startPage = Math.max(1, state.page - Math.floor(maxButtons / 2));
  let endPage = Math.min(pages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `
      <button class="${i === state.page ? "active" : ""}" type="button" data-page="${i}" aria-label="Go to page ${i}">${i}</button>
    `;
  }
  
  // Next button
  paginationHtml += `
    <button type="button" ${state.page === pages ? "disabled" : ""} id="nextPage" aria-label="Next Page">Next &raquo;</button>
  `;
  
  if (pagination) {
    pagination.innerHTML = paginationHtml;
  }
}

function populateFilters() {
  if (!state.items.length) return;
  
  // Extract unique sorted years
  const years = [...new Set(state.items.map((item) => item.year))].sort((a, b) => b - a);
  // Extract unique sorted research areas
  const areas = [...new Set(state.items.map((item) => item.area))].sort();
  
  if (yearFilter) {
    yearFilter.innerHTML = '<option value="all">All Years</option>' + 
      years.map((year) => `<option value="${year}">${year}</option>`).join("");
  }
  
  if (areaFilter) {
    areaFilter.innerHTML = '<option value="all">All Research Areas</option>' + 
      areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  }
}

// Fetch and load database index
fetch("data/publications.json")
  .then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then((data) => {
    state.items = data.publications || [];
    populateFilters();
    render();
  })
  .catch((error) => {
    if (pubMeta) {
      pubMeta.textContent = "Could not load the publications index file (publications.json). Please check if the file is correctly placed in your repository.";
    }
    console.error("Failed to load publications:", error);
  });

// Event Listeners for Filters
if (search) {
  search.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.page = 1;
    render();
  });
}

if (typeFilter) {
  typeFilter.addEventListener("change", (event) => {
    state.type = event.target.value;
    state.page = 1;
    render();
  });
}

if (yearFilter) {
  yearFilter.addEventListener("change", (event) => {
    state.year = event.target.value;
    state.page = 1;
    render();
  });
}

if (areaFilter) {
  areaFilter.addEventListener("change", (event) => {
    state.area = event.target.value;
    state.page = 1;
    render();
  });
}

// Pagination Click Handler
if (pagination) {
  pagination.addEventListener("click", (event) => {
    const target = event.target;
    
    // Page number button click
    const pageBtn = target.closest("button[data-page]");
    if (pageBtn) {
      state.page = Number(pageBtn.dataset.page);
      render();
      scrollToListTop();
      return;
    }
    
    // Prev button click
    if (target.id === "prevPage" && state.page > 1) {
      state.page -= 1;
      render();
      scrollToListTop();
      return;
    }
    
    // Next button click
    const nextBtn = target.closest("#nextPage");
    const pages = Math.max(1, Math.ceil(filteredItems().length / state.perPage));
    if (nextBtn && state.page < pages) {
      state.page += 1;
      render();
      scrollToListTop();
    }
  });
}

// Utility function to scroll back to the top of filters
function scrollToListTop() {
  const targetElement = document.querySelector(".filters");
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 90,
      behavior: "smooth"
    });
  }
}
