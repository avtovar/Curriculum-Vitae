// ===================== TABS MODULE =====================
export function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Roving tabindex: primer tab focusable, resto -1
  tabButtons.forEach((btn, i) => {
    btn.setAttribute("tabindex", i === 0 ? "0" : "-1");
  });

  function activateTab(button) {
    const tabName = button.dataset.tab;

    tabButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");
    });
    tabContents.forEach(content => content.classList.remove("active"));

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    button.setAttribute("tabindex", "0");
    const activeContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
    if (activeContent) {
      activeContent.classList.add("active");
    }
  }

  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      activateTab(this);
    });

    button.addEventListener("keydown", function (e) {
      const buttons = Array.from(tabButtons);
      const index = buttons.indexOf(this);
      let targetIndex = null;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          targetIndex = (index - 1 + buttons.length) % buttons.length;
          break;
        case "ArrowRight":
        case "ArrowDown":
          targetIndex = (index + 1) % buttons.length;
          break;
        case "Home":
          targetIndex = 0;
          break;
        case "End":
          targetIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const target = buttons[targetIndex];
      target.click();
      target.focus();
    });
  });
}
