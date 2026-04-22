const settingsBtn = document.getElementById("settings-btn");
const modal = document.getElementById("settings-modal");
const closeBtn = modal.querySelector(".modal-close");

settingsBtn.addEventListener("click", () => {
    switchModalVisibility();
});

closeBtn.addEventListener("click", () => {
    switchModalVisibility();
});

modal.addEventListener("click", e => {
    if (e.target == modal) {
        switchModalVisibility();
    }
});

function switchModalVisibility() {
    modal.classList.toggle("hidden");
}