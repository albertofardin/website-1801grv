const KINGDOM_IDS = [
  "italia",
  "francia",
  "britannia",
  "prussia",
  "russia",
  "scandinavia",
  "svizzera",
];

const KINGDOMS = {};
let currentKingdom = null;

async function loadKingdoms() {
  try {
    const responses = await Promise.all(
      KINGDOM_IDS.map(async (id) => {
        const response = await fetch(`./factions/${id}.json`);
        if (!response.ok) {
          throw new Error(`Impossibile caricare ${id}.json`);
        }
        return [id, await response.json()];
      }),
    );

    responses.forEach(([id, data]) => {
      KINGDOMS[id] = data;
    });
  } catch (error) {
    console.error(error);
  }
}

function openKingdomPanel(id) {
  const k = KINGDOMS[id];
  if (!k) return;

  document
    .querySelectorAll(".kingdom-card")
    .forEach((c) => c.classList.remove("active"));
  document.querySelector(`[data-kingdom="${id}"]`).classList.add("active");

  document.getElementById("panel-flag").src = k.flag;
  document.getElementById("panel-flag").alt = k.name;
  document.getElementById("panel-name").textContent = k.name;
  document.getElementById("panel-motto").textContent = k.motto;

  const grid = document.getElementById("panel-info-grid");
  grid.innerHTML = Object.entries(k.info)
    .map(
      ([label, value]) =>
        `<div class="info-cell"><p class="info-label">${label}</p><p class="info-value">${value}</p></div>`,
    )
    .join("");

  document.getElementById("panel-description").textContent =
    k.description || "";

  const charsGrid = document.getElementById("panel-chars-grid");
  charsGrid.innerHTML =
    (k.characters || [])
      .map(
        (char, i) => `
        <div class="char-card" onclick="openCharModal('${id}', ${i})" tabindex="0" onkeydown="if(event.key==='Enter')openCharModal('${id}',${i})">
          <img src="${char.image || "./people/_default.png"}" alt="${char.name}" class="char-avatar" loading="lazy"/>
          <div class="char-info">
            <p class="char-name">${char.name}</p>
            <p class="char-role">${char.role}</p>
          </div>
        </div>
      `,
      )
      .join("") +
    `
      <div class="char-card add-character" onclick="window.open('https://forms.gle/UAoUfAJ2hMs9Fdb5A', '_blank')">
        <div class="add-content">
          <i class="fa-solid fa-plus"></i>
          <p class="char-name">Modifica o aggiungi il tuo personaggio</p>
        </div>
      </div>
      `;

  currentKingdom = id;
  document.getElementById("kingdom-panel").classList.add("open");
  document.getElementById("panel-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
  document.getElementById("kingdom-panel").scrollTop = 0;
}

function closeKingdomPanel() {
  document.getElementById("kingdom-panel").classList.remove("open");
  document.getElementById("panel-overlay").classList.remove("active");
  document.body.style.overflow = "";
  document
    .querySelectorAll(".kingdom-card")
    .forEach((c) => c.classList.remove("active"));
  currentKingdom = null;
}

function calcolaEta(dataNascitaStr) {
  // formato: "gg/mm/aaaa"
  const [giorno, mese, anno] = dataNascitaStr.split("/").map(Number);

  const oggiReale = new Date();

  // 🔑 CONFIGURAZIONE (da impostare UNA SOLA VOLTA)
  const ANNO_BASE_REALE = 2023; // anno reale in cui il gioco è iniziato
  const ANNO_BASE_GIOCO = 1801; // anno del mondo di gioco in quel momento

  // calcolo anno corrente nel mondo di gioco
  const annoGiocoCorrente =
    ANNO_BASE_GIOCO + (oggiReale.getFullYear() - ANNO_BASE_REALE);

  // costruiamo "oggi" nel mondo di gioco
  const oggi = new Date(
    annoGiocoCorrente,
    oggiReale.getMonth(),
    oggiReale.getDate(),
  );

  let eta = oggi.getFullYear() - anno;

  const meseCorrente = oggi.getMonth() + 1;
  const giornoCorrente = oggi.getDate();

  if (
    meseCorrente < mese ||
    (meseCorrente === mese && giornoCorrente < giorno)
  ) {
    eta--;
  }

  return eta;
}

function openCharModal(kingdomId, charIndex) {
  const k = KINGDOMS[kingdomId];
  if (!k || !k.characters || !k.characters[charIndex]) return;
  const char = k.characters[charIndex];
  document.getElementById("modal-flag").src = k.flag;
  document.getElementById("modal-flag").alt = k.name;
  document.getElementById("modal-avatar").src =
    char.image || "./people/_default.png";
  document.getElementById("modal-avatar").alt = char.name;
  document.getElementById("modal-char-name").textContent = char.name;
  document.getElementById("modal-char-role").textContent = char.role;
  document.getElementById("modal-char-year").textContent =
    `${char.year}, ${calcolaEta(char.year)} anni`;
  document.getElementById("modal-badge-spec").innerHTML = char.class;
  document.getElementById("modal-quote-text").textContent = char.quote;
  document.getElementById("modal-description").textContent = char.desc;
  document.getElementById("char-modal").classList.add("open");
}

function closeCharModal() {
  document.getElementById("char-modal").classList.remove("open");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (document.getElementById("char-modal").classList.contains("open")) {
      closeCharModal();
    } else if (
      document.getElementById("kingdom-panel").classList.contains("open")
    ) {
      closeKingdomPanel();
    }
  }
});

document
  .getElementById("panel-overlay")
  .addEventListener("click", closeKingdomPanel);

document.querySelectorAll(".kingdom-card").forEach((card) => {
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openKingdomPanel(card.dataset.kingdom);
    }
  });
});

loadKingdoms();
