// CARBONCUT Media Query Telemetry, Footprint Calculator & CRUD Checklist

let forcedMode = "auto";

function updateViewportReadout() {
  const w = window.innerWidth;
  document.getElementById("liveWidthPx").textContent = w;

  const devEl = document.getElementById("activeDeviceName");
  const ruleEl = document.getElementById("activeRuleCode");
  const colsEl = document.getElementById("liveGridCols");

  if (forcedMode === "mobile" || (forcedMode === "auto" && w <= 640)) {
    devEl.textContent = "Mobile (<= 640px)";
    ruleEl.textContent = "@media only screen and (max-width: 640px)";
    colsEl.textContent = "1-Column Stack";
  } else if (forcedMode === "tablet" || (forcedMode === "auto" && w <= 1024)) {
    devEl.textContent = "Tablet (<= 1024px)";
    ruleEl.textContent = "@media only screen and (max-width: 1024px)";
    colsEl.textContent = "2-Column Grid";
  } else {
    devEl.textContent = "Desktop (> 1024px)";
    ruleEl.textContent = "@media only screen and (min-width: 1025px)";
    colsEl.textContent = "3-Column Wide";
  }
}

function applyViewportPreview(mode, btn) {
  forcedMode = mode;
  const frame = document.getElementById("adaptiveFrame");
  frame.classList.remove("sim-tablet", "sim-mobile");
  if (mode === "tablet") frame.classList.add("sim-tablet");
  if (mode === "mobile") frame.classList.add("sim-mobile");

  document.querySelectorAll(".cc-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  updateViewportReadout();
}

window.addEventListener("resize", updateViewportReadout);

// CRUD Task Array
const DEFAULT_MILESTONES = [
  { id: 1, text: "Deploy Smart Meter Analytics across regional facilities", done: true },
  { id: 2, text: "Transition 60% of grid electricity to Solar Grid Transition PPA", done: false },
  { id: 3, text: "Retire 4.5 tonnes CO2e via Blue Carbon Mangroves credits", done: false }
];

let carbonTasks = JSON.parse(localStorage.getItem("carboncut_mq_tasks_v1")) || [...DEFAULT_MILESTONES];

function persist() {
  localStorage.setItem("carboncut_mq_tasks_v1", JSON.stringify(carbonTasks));
}

// READ
function renderTasks() {
  const ul = document.getElementById("crudTaskList");
  const countEl = document.getElementById("crudCount");
  ul.innerHTML = "";

  const done = carbonTasks.filter(t => t.done).length;
  countEl.textContent = `${done} of ${carbonTasks.length} reduction milestones completed`;

  if (carbonTasks.length === 0) {
    ul.innerHTML = `<li class="cc-task-row"><span>No reduction tasks yet. Add one above!</span></li>`;
    return;
  }

  carbonTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "cc-task-row";
    li.innerHTML = `
      <div class="cc-task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleDone(${index})" />
        <span class="${task.done ? "cc-done" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="cc-row-btns">
        <button type="button" class="cc-mini-btn" onclick="editTask(${index})">Edit</button>
        <button type="button" class="cc-mini-btn del" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// CREATE (onclick="addTask()")
function addTask() {
  const input = document.getElementById("crudTaskInput");
  const val = input.value.trim();
  if (!val) {
    input.focus();
    return;
  }
  carbonTasks.unshift({ id: Date.now(), text: val, done: false });
  input.value = "";
  persist();
  renderTasks();
}

// UPDATE
function toggleDone(index) {
  carbonTasks[index].done = !carbonTasks[index].done;
  persist();
  renderTasks();
}

function editTask(index) {
  const updated = prompt("Update carbon reduction milestone:", carbonTasks[index].text);
  if (updated !== null && updated.trim() !== "") {
    carbonTasks[index].text = updated.trim();
    persist();
    renderTasks();
  }
}

// DELETE
function deleteTask(index) {
  carbonTasks.splice(index, 1);
  persist();
  renderTasks();
}

function restoreSamples() {
  carbonTasks = [...DEFAULT_MILESTONES];
  persist();
  renderTasks();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Carbon Calculator
function computeCarbon() {
  const kwh = Number(document.getElementById("kwhInput").value);
  const km = Number(document.getElementById("kmInput").value);
  const diet = Number(document.getElementById("dietInput").value);

  document.getElementById("kwhVal").textContent = kwh;
  document.getElementById("kmVal").textContent = km;

  const monthly = Math.round((kwh * 0.72) + (km * 4.33 * 0.21) + diet);
  const annual = ((monthly * 12) / 1000).toFixed(2);

  document.getElementById("monthCo2").textContent = monthly;
  document.getElementById("yearCo2").textContent = annual;

  const note = document.getElementById("statusNote");
  if (monthly < 450) {
    note.textContent = "Low Impact — On track for 1.5°C Net-Zero benchmark";
  } else if (monthly <= 750) {
    note.textContent = "Moderate — 20% reduction achievable via Solar Grid Transition";
  } else {
    note.textContent = "High Footprint — Immediate clean energy & fleet audit advised";
  }
}

function addCalcMilestone() {
  const annual = document.getElementById("yearCo2").textContent;
  carbonTasks.unshift({
    id: Date.now(),
    text: `Offset ${annual} tonnes CO2e/year via CARBONCUT verified portfolio`,
    done: false
  });
  persist();
  renderTasks();
  document.getElementById("crud-tracker").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("crudTaskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

updateViewportReadout();
computeCarbon();
renderTasks();
