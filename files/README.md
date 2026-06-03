# CVVR Lab Website

Production-ready, highly interactive, and responsive static website for the **Computer Vision and Virtual Reality Lab (CVVR Lab)**, Department of Avionics, Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram, Kerala, India.

This project is built from scratch utilizing a modern **Deep Space Technology** design theme with a performance-first approach, using native HTML5, CSS3, and ES6 JavaScript.

---

## Features

- **Cosmic Theme & Design Aesthetic**: Curated color palette (Space Blue `#0A0D14`, Deep Nebula `#0F1420`, Card Space `#1A2135`) inspired by ISRO, NASA, and MIT Media Lab, utilizing smooth CSS grid layouts, glowing accents, and glassmorphism.
- **Dynamic Starfield Simulation**: High-performance, lightweight particle-based animated canvas starfield matching viewport sizes without CPU overhead.
- **Faceted Publication System**: Scalable system powered by `data/publications.json` (seeding 181 real academic works of Prof. Deepak Mishra from OpenAlex). Supports keyword search, multi-filter dropdowns (Type, Year, Research Area), and pagination.
- **Interactive Metric Counters**: Animated counters that transition statistics (Publications, Citations, Projects, etc.) on viewport intersection.
- **Page Loading Screen**: Customized overlay showing the official CVVR eye logo pulsing with loading bars, fading out once the page assets load.
- **Responsive Layouts**: Flexible mobile hamburger menus, multi-column wrap alignments, and single-column mobile views.
- **Full SEO & Social Metas**: Title tags, structural markup, Open Graph tags, and transparent SVG branding assets.

---

## Repository Structure

```text
.
├── assets/
│   └── images/
│       └── cvvr-hero.png          # High-res hero imagery
├── css/
│   └── style.css                  # Core CSS design system
├── js/
│   ├── main.js                    # Layout controllers, starfield & JSON binders
│   └── publications.js            # Publications filter & pagination engine
├── data/
│   ├── publications.json          # Academic publications database
│   ├── projects.json              # Funded research projects database
│   ├── people.json                # Laboratory members directory database
│   └── news.json                  # News timeline events database
├── images/
│   ├── logo.svg                   # Cropped transparent logo
│   ├── logo.png                   # Transparent fallback logo
│   ├── favicon.svg                # Favicon vector icon
│   └── favicon.png                # Favicon fallback icon
├── index.html                     # Lab home and about section
├── research.html                  # Lab research themes grid
├── publications.html              # Interactive publications catalog
├── projects.html                  # Funded research projects cards
├── people.html                    # Directory of faculty, scholars & partners
├── pi.html                        # PI detailed academic profile
├── teaching.html                  # Coordinated coursework details
├── facilities.html                # Experimental equipment & computing facilities
├── news.html                      # Timeline of announcements and updates
├── contact.html                   # Contact addresses and embedded Google Map
├── README.md                      # Maintenance & deployment guide (this file)
├── style.css                      # Shim redirecting to css/style.css
└── script.js                      # Shim loading js/main.js
```

---

## Local Installation

No compiler, runtime dependencies, or heavy framework is required. Everything runs natively in the web browser.

1. **Clone or Download** this repository.
2. **Serve Locally** using any web server. For example:
   - If you have Python:
     ```bash
     python3 -m http.server 8000
     ```
   - If you have Node.js and `live-server`:
     ```bash
     npx live-server
     ```
3. **Open the browser** and navigate to `http://localhost:8000`.

---

## GitHub Pages Deployment

The website is fully optimized for hosting on **GitHub Pages**. For a comprehensive, step-by-step walkthrough detailing repository creation, file uploads, branch configurations, and DNS verification, please see the **GITHUB PAGES HOSTING GUIDE** section in the main documentation.

---

## Maintenance & Content Updates

### 1. How to Update Publications
Publications are stored in `data/publications.json` under the `"publications"` array. The frontend reads this list dynamically. You do **not** need to modify any HTML files to add or update publications.

To add a new publication, open [publications.json](file:///Users/nathan/Downloads/files/data/publications.json) and add a JSON block following this schema:
```json
{
  "title": "Title of your new academic paper",
  "authors": "Deepak Mishra, Author B, Author C",
  "venue": "IEEE Transactions on Geoscience and Remote Sensing",
  "year": 2026,
  "doi": "10.1109/TGRS.2026.xxxxxxx",
  "url": "https://ieeexplore.ieee.org/document/xxxxxxx",
  "type": "Journal",
  "area": "Satellite Image Processing"
}
```
*Note on fields:*
- `type`: Must be one of `Journal`, `Conference`, `Book Chapter`, or `Workshop`.
- `area`: The category (e.g. `Satellite Image Processing`, `Deep Visual Learning`, `Virtual Reality Simulators`). This is used for the dropdown filter.

### 2. How to Replace Logo
The logo is stored in the `images/` directory. To replace it:
1. Save your new logo as a transparent SVG in `images/logo.svg`.
2. Save a transparent PNG version in `images/logo.png`.
3. Save a 64x64 transparent PNG version in `images/favicon.png`.
4. Update the vector mappings in `images/favicon.svg` if needed.
The HTML files are styled to automatically scale and display the logo in the sticky header and footer branding.

### 3. How to Replace Profile Photos
1. Save your profile photos in a folder named `assets/images/people/`, e.g., `assets/images/people/deepak-mishra.jpg`.
2. Locate the avatar initials block in the HTML file, for example in `pi.html`:
   ```html
   <div class="avatar large">DM</div>
   ```
3. Replace the initials with the image tag:
   ```html
   <div class="avatar large">
     <img class="profile-photo" src="assets/images/people/deepak-mishra.jpg" alt="Prof. Deepak Mishra">
   </div>
   ```

### 4. How to Add News Items
News items are loaded from `data/news.json`. Open [news.json](file:///Users/nathan/Downloads/files/data/news.json) and add a block at the top:
```json
{
  "date": "YYYY-MM-DD",
  "type": "General / Research / Workshop / Honor / Project",
  "title": "Short title describing the news",
  "summary": "Full sentence outlining the event or achievement."
}
```
The home page automatically pulls the first **3 items** (controlled by `data-limit="3"` in `index.html`), while `news.html` lists the entire chronological database.

### 5. How to Update Projects
Project cards are rendered from `data/projects.json`. To modify projects, open [projects.json](file:///Users/nathan/Downloads/files/data/projects.json) and add or edit:
```json
{
  "title": "Project Title",
  "description": "Short summary of the project goals.",
  "fundingAgency": "Funding body name (e.g. IIST-ISRO Project)",
  "collaborators": "Collaborating researchers/institutions",
  "duration": "Start - End Date / Multi-year program",
  "status": "Active / Completed / Archival",
  "impact": "Brief note on the social or scientific impact",
  "expectedOutcomes": "Software deliverables, papers, or datasets."
}
```
The frontend dynamically maps these details into responsive, highlighted project grid cards.
