
// script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded!");

  const phasesContainer = document.getElementById("phases");
  const addPhaseBtn = document.getElementById("addPhaseBtn");

  if (!phasesContainer) {
    console.error("No element with id 'phases' found in index.html");
    return;
  }

  // Function to create a new phase card
  function createPhaseCard(title = "New Phase") {
    const card = document.createElement("div");
    card.className = "phase-card";
    card.innerHTML = `
      <h3 contenteditable="true">${title}</h3>
      <ul class="task-list"></ul>
      <button class="add-task-btn">+ Add Task</button>
    `;

    // Add task button logic
    card.querySelector(".add-task-btn").addEventListener("click", () => {
      const taskText = prompt("Enter task name:");
      if (taskText) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        card.querySelector(".task-list").appendChild(taskItem);
      }
    });

    return card;
  }

  // Initial default phases
  const defaultPhases = ["Pre-PCS", "PCS Move", "Post-PCS"];
  defaultPhases.forEach(phase => {
    phasesContainer.appendChild(createPhaseCard(phase));
  });

  // Add new phase button
  if (addPhaseBtn) {
    addPhaseBtn.addEventListener("click", () => {
      const phaseName = prompt("Enter phase name:");
      if (phaseName) {
        phasesContainer.appendChild(createPhaseCard(phaseName));
      }
    });
  }
});
