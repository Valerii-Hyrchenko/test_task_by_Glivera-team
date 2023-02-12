import { API } from "./Classes/Api";
import { animateBurgerMenu } from "./animateScript/animateScripts";

import "./imports/importImg";
import "./imports/importStyle";

import { CustomersLayout } from "./Classes/CustomersLayout";

const appWrapper = document.getElementById("app-wrapper");

const renderCustomers = async () => {
  const customers = new CustomersLayout({ appWrapper });
  customers.renderHeader();
  API.preloader(true);
  await API.get({
    endpoint: "https://my.api.mockaroo.com/customers.json?key=fc23cb30",
  });
  customers.renderCustomers(API.resultGetRequest);
  API.preloader(false);
  customers.renderFooter();
};

//add event listener to elements dashboard menu and set default load Customers section
const activateDashboardMenu = () => {
  const dashboardElem = document.querySelectorAll(".menu-list__item");

  document.getElementById("Customers").classList.add("menu-list__item--active");
  renderCustomers();
  animateBurgerMenu();

  dashboardElem.forEach((item) => {
    item.addEventListener("click", ({ target }) => {
      let currentElem = target.parentNode.parentNode;
      if (currentElem.id && currentElem.id !== "Dashboard") {
        dashboardElem.forEach((item) =>
          item.classList.remove("menu-list__item--active")
        );
        currentElem.classList.add("menu-list__item--active");
      }
      switch (currentElem.id) {
        case "Product":
          appWrapper.innerHTML = `
          <p class="temporary-text">You don't have any Product section yet</p>`;
          //render Product
          break;
        case "Customers":
          appWrapper.innerHTML = "";
          renderCustomers();
          break;
        case "Income":
          appWrapper.innerHTML = `
          <p class="temporary-text">You don't have any Income section yet</p>`;
          //render Income
          break;
        case "Promote":
          appWrapper.innerHTML = `
          <p class="temporary-text">You don't have any Promote section yet</p>`;
          //render Promote
          break;
        case "Help":
          appWrapper.innerHTML = `
          <p class="temporary-text">You don't have any Help section yet</p>`;
          //render Help
          break;
        default:
          //render home page
          break;
      }
    });
  });
};
activateDashboardMenu();
