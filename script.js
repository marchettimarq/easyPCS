// script.js (minimal harness) — proves JS loads and DOM wiring works
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded");

  const phasesContainer = document.getElementById("phases");
  const addPhaseBtn = document.getElementById("addPhaseBtn");

  if (!phasesContainer) {
    console.error("No #phases container found");
    return;
  }

  function createPhaseCard(title = "New Phase") {
    const card = document.createElement("div");
    card.className = "phase-card";
    card.innerHTML = `
      <h3 contenteditable="true" role="textbox" aria-label="Phase title">${title}</h3>
      <ul class="task-list" aria-label="Tasks"></ul>
      <button class="add-task-btn btn" type="button">+ Add Task</button>
    `;

    card.querySelector(".add-task-btn").addEventListener("click", () => {
      const taskText = prompt("Enter task name:");
      if (taskText) {
        const li = document.createElement("li");
        li.textContent = taskText;
        card.querySelector(".task-list").appendChild(li);
      }
    });

    return card;
  }

  // Starter phases so you immediately see content on load
  const defaultPhases = ["Pre-PCS", "PCS Move", "Post-PCS"];
  defaultPhases.forEach(name => phasesContainer.appendChild(createPhaseCard(name)));

  if (addPhaseBtn) {
    addPhaseBtn.addEventListener("click", () => {
      const name = prompt("Enter phase name:");
      if (name) phasesContainer.appendChild(createPhaseCard(name));
    });
  }
});
