export const animateBurgerMenu = () => {
  const checkbox = document.getElementById("menu-checkbox");
  const menu = document.getElementById("menu-container");
  const outsideSpace = document.getElementById("outside-space");
  const deleteElem = () => {
    menu.classList.add("menu-container--delete-anim");
    setTimeout(() => {
      menu.style.display = "none";
    }, 600);
  };
  outsideSpace.addEventListener("click", () => {
    if (checkbox.checked) {
      deleteElem();
      checkbox.checked = false;
    }
  });
  checkbox.addEventListener("click", ({ target: { checked } }) => {
    if (checked) {
      menu.classList.remove("menu-container--delete-anim");
      menu.style.display = "block";
    } else {
      deleteElem();
    }
  });
};
