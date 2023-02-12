import { API } from "./Api";
import search from "../../img/icons/search.svg";

export class CustomersLayout {
  constructor(options) {
    const { appWrapper } = options;
    this.appWrap = appWrapper;
    this.headerContainer = document.createElement("div");
    this.customersWrap = document.createElement("div");
    this.dataContainer = document.createElement("div");
    this.footerContainer = document.createElement("div");
    this.buttonsWrap = document.createElement("div");
    this.statisticsWrap = document.createElement("div");
    this.currentPage = 1;
    this.lastPage = Math.floor(this.currentPage / 4) * 4 + 4;
    this.isSingleTitle = true;
  }

  async renderHeader() {
    this.headerContainer.classList.add("customers-header");
    const header = `
      <div class="customers-title-wrapper">
        <h2 class="customers-header-title">All Customers</h2>
        <p class="customers-header-text">Active Members</p>
      </div>
      <div class="customers-header-search">
        <img src=${search} alt="search-icon">
        <input type="text" name="header-search" placeholder="Search" id="search" />
      </div>
    `;
    this.headerContainer.innerHTML = header;
    this.customersWrap.append(this.headerContainer);
  }

  renderCustomers(resultRequest) {
    const sliceIntoPages = (array) => {
      const arraySize = 8;
      const slicedArray = [];
      for (let i = 0; i < array.length; i += arraySize) {
        slicedArray.push(array.slice(i, i + arraySize));
      }
      return slicedArray;
    };
    this.allCustomers = sliceIntoPages(resultRequest);
    this.renderCurrentPage();
  }
  renderCurrentPage() {
    this.customersWrap.classList.add("customers");
    this.dataContainer.classList.add("customers-data");
    const titleConfig = [
      "Customer Name",
      "Company",
      "Phone Number",
      "Email",
      "Country",
      "Status",
    ];

    const renderTitle = () => {
      titleConfig.forEach((item) => {
        const paragraph = document.createElement("p");
        paragraph.classList.add("customers-data-title");
        paragraph.id = item;
        paragraph.innerText = item;
        this.dataContainer.append(paragraph);
      });
    };
    const renderCustomersInfo = () => {
      if (document.body.clientWidth > 1000) renderTitle();
      this.allCustomers[this.currentPage - 1].forEach((item) => {
        let { id, name, company, phone, email, country, status } = item;
        phone = `${phone.slice(0, 9)}-${phone.slice(9)}`;
        const paragraphNames = [name, company, phone, email, country];
        if (document.body.clientWidth <= 1000) {
          for (let i = 0; i < paragraphNames.length; i++) {
            let paragraphTitle = document.createElement("p");
            paragraphTitle.innerText = titleConfig[i];
            paragraphTitle.classList.add("customers-data-title");
            let paragraphInfo = document.createElement("p");
            paragraphInfo.classList.add("customers-data-info");
            paragraphInfo.innerText = paragraphNames[i];
            this.dataContainer.append(paragraphTitle, paragraphInfo);
          }
        } else {
          paragraphNames.forEach((item) => {
            let paragraph = document.createElement("p");
            paragraph.classList.add("customers-data-info");
            paragraph.innerText = item;
            this.dataContainer.append(paragraph);
          });
        }
        if (document.body.clientWidth <= 1000) {
          const statusTitle = document.createElement("p");
          statusTitle.classList.add(
            "customers-data-title",
            "customers-data-title--status"
          );
          statusTitle.innerText = titleConfig[5];
          this.dataContainer.append(statusTitle);
        }
        const btnStatusWrap = document.createElement("div");
        const btnStatus = document.createElement("button");
        btnStatusWrap.classList.add("customers-data-info-btn-wrap");
        btnStatus.classList.add("customers-data-info-btn");
        btnStatus.id = id;
        btnStatus.innerText = status ? "Active" : "Inactive";
        if (!status) btnStatus.classList.toggle("customers-data-inactive-btn");

        btnStatus.addEventListener("click", ({ target: { textContent } }) => {
          btnStatus.classList.toggle("customers-data-inactive-btn");
          if (textContent === "Inactive") {
            btnStatus.innerText = "Active";
            item.status = true;
          } else {
            btnStatus.innerText = "Inactive";
            item.status = false;
          }
          API.patch({
            endpoint:
              "https://my.api.mockaroo.com/customers.json?key=fc23cb30&__method=PATCH",
            body: {
              id: item.id,
              name: item.name,
              company: item.company,
              phone: item.phone,
              email: item.email,
              country: item.country,
              status: item.status,
            },
          });
        });
        btnStatusWrap.append(btnStatus);
        this.dataContainer.append(btnStatusWrap);
      });
    };
    renderCustomersInfo();

    //event listener for automatic update elements after resize
    window.addEventListener("resize", () => {
      clearTimeout(window.resizedTimeout);
      window.resizedTimeout = setTimeout(() => {
        this.dataContainer.innerHTML = "";
        renderCustomersInfo();
        this.isSingleTitle = false;
      }, 500);
    });

    this.headerContainer.after(this.dataContainer);
  }

  renderPageButtons() {
    let pagesQuantity = this.allCustomers.length;
    this.buttonsWrap.classList.add("customers-footer-btn-wrap");
    const {
      prev,
      next,
      dots1,
      dots2,
      page1,
      page2,
      page3,
      page4,
      back40,
      skip40,
    } = this.createBtns([
      "prev",
      "next",
      "dots1",
      "dots2",
      "page1",
      "page2",
      "page3",
      "page4",
      "back40",
      "skip40",
    ]);
    const pages = [page4, page3, page2, page1];
    const renderCurrentBtns = () => {
      prev.innerHTML = `
        <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.936 6.392L0.176 3.668L2.936 0.944H4.664L1.892 3.668L4.664 6.392H2.936Z" fill="#404B52"/>
        </svg>`;
      next.innerHTML = `
        <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.344 0.944H2.072L4.832 3.668L2.072 6.392H0.344L3.116 3.668L0.344 0.944Z" fill="#404B52"/>
        </svg>`;
      dots1.innerText = "...";
      dots2.innerText = "...";
      skip40.innerText = "+40";
      back40.innerText = "-40";
      if (this.currentPage > this.lastPage) {
        this.lastPage += 4;
      } else if (this.currentPage < this.lastPage - 3) {
        this.lastPage -= 4;
      }
      if (this.lastPage > pagesQuantity) {
        this.lastPage = pagesQuantity;
      } else if (this.lastPage < 4) {
        this.lastPage = 4;
      }
      for (let i = 0; i < pages.length; i++) {
        pages[i].innerText = +this.lastPage - i;
        if (+pages[i].textContent === +this.currentPage) {
          pages[i].classList.add("customers-footer-btn--active");
        } else {
          pages[i].classList.remove("customers-footer-btn--active");
        }
      }
      this.buttonsWrap.innerHTML = "";
      this.buttonsWrap.append(
        prev,
        this.lastPage > 4 ? back40 : "",
        this.currentPage > 4 ? dots1 : "",
        page1,
        page2,
        page3,
        page4,
        this.lastPage != pagesQuantity ? dots2 : "",
        this.lastPage != pagesQuantity ? skip40 : "",
        next
      );
    };
    renderCurrentBtns();

    pages.forEach((item) => {
      item.addEventListener("click", ({ target: { textContent } }) => {
        this.currentPage = +textContent;
        this.dataContainer.innerHTML = "";
        this.renderCurrentPage();
        renderCurrentBtns();
      });
    });
    next.addEventListener("click", () => {
      if (this.currentPage < pagesQuantity) {
        this.currentPage += 1;
        this.dataContainer.innerHTML = "";
        this.renderCurrentPage();
        renderCurrentBtns();
        this.renderStatistics();
      }
    });
    prev.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.dataContainer.innerHTML = "";
        this.renderCurrentPage();
        renderCurrentBtns();
        this.renderStatistics();
      }
    });
    back40.addEventListener("click", () => {
      if (this.currentPage - 40 > 1) {
        this.currentPage -= 40;
        this.lastPage = Math.floor(this.currentPage / 4) * 4 + 4;
      } else {
        this.currentPage = 1;
        this.lastPage = 4;
      }
      this.dataContainer.innerHTML = "";
      this.renderCurrentPage();
      renderCurrentBtns();
      this.renderStatistics();
    });
    skip40.addEventListener("click", () => {
      if (this.currentPage + 40 < pagesQuantity) {
        this.currentPage += 40;
        this.lastPage = Math.floor(this.currentPage / 4) * 4 + 4;
      } else {
        this.currentPage = pagesQuantity;
        this.lastPage = pagesQuantity;
      }
      this.dataContainer.innerHTML = "";
      this.renderCurrentPage();
      renderCurrentBtns();
      this.renderStatistics();
    });
    this.footerContainer.append(this.buttonsWrap);
  }

  renderStatistics() {
    const statistics = document.createElement("p");
    statistics.classList.add("customers-footer-statistics");
    statistics.innerText = `Showing data ${this.currentPage * 8 - 7} to ${
      this.currentPage * 8
    } of ${this.allCustomers.length * 8} entries`;
    this.statisticsWrap.innerHTML = "";
    this.statisticsWrap.append(statistics);
    this.buttonsWrap.before(this.statisticsWrap);
    this.footerContainer.append(this.statisticsWrap);
  }

  renderFooter() {
    this.renderPageButtons();
    this.renderStatistics();
    this.footerContainer.classList.add("customers-footer");
    this.customersWrap.append(this.footerContainer);
    this.appWrap.append(this.customersWrap);
  }

  createBtns(names) {
    let buttons = {};
    names.forEach((item) => {
      buttons[item] = document.createElement("button");
      buttons[item].classList.add(
        "customers-footer-btn",
        `customers-footer-btn--${item}`
      );
    });
    return buttons;
  }
}
