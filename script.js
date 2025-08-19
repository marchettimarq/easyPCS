
document.addEventListener("DOMContentLoaded", () => {
    // Collapsible phase cards
    document.querySelectorAll(".phase-card h2").forEach(header => {
        header.addEventListener("click", () => {
            let card = header.parentElement;
            card.classList.toggle("collapsed");
        });
    });

    // Reset button
    document.getElementById("resetButton")?.addEventListener("click", () => {
        if(confirm("Reset all tasks?")) {
            localStorage.clear();
            location.reload();
        }
    });

    // Mark tasks complete with line-through in timeline
    document.querySelectorAll(".task input[type=checkbox]").forEach(box => {
        box.addEventListener("change", e => {
            let task = e.target.closest(".task");
            if(e.target.checked) {
                task.classList.add("completed");
            } else {
                task.classList.remove("completed");
            }
        });
    });
});
