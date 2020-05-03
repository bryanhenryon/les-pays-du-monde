const filterBtn = document.getElementById("filter-btn");
const filterContent = document.getElementById("filter-content");
const searchInput = document.getElementById("search-input");
const contries = document.getElementById("countries");
const openModal = document.getElementById("modal-container");
const footer = document.getElementById("footer");

document.addEventListener("DOMContentLoaded", loadCountries);
searchInput.addEventListener("keyup", searchCountry);
filterContent.addEventListener("click", filterCountries);
filterBtn.addEventListener("click", toggleDropDownMenu);

footer.innerHTML = `&copy ${new Date().getFullYear()} Bryan Henryon &mdash; <a href="https://www.bryanhenryon.fr" target="_blank">www.bryanhenryon.fr</a>`;

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function getIndex(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response.url))
      .catch((err) => reject(err));
  });
}

function loadCountries() {
  get("https://restcountries.eu/rest/v2/all").then((data) => {
    getCountries(data);
  });
}

function searchCountry(e) {
  if (e.target.value !== "") {
    get(`https://restcountries.eu/rest/v2/name/${e.target.value}`)
      .then((data) => {
        getCountries(data);
      })
      .catch(() => {
        const noResult = document.createElement("div");
        noResult.id = "no-result";
        noResult.textContent = "Aucun résultat 🤷‍♂️";
        countries.innerHTML = "";
        countries.appendChild(noResult);
      });
  } else {
    loadCountries();
  }
}

function filterCountries(e) {
  switch (e.target.textContent) {
    case "Toutes les régions":
      get(`https://restcountries.eu/rest/v2/all`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
      break;
    case "Europe":
      get(`https://restcountries.eu/rest/v2/region/europe`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
      break;
    case "Amérique":
      get(`https://restcountries.eu/rest/v2/region/americas`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
      break;
    case "Afrique":
      get(`https://restcountries.eu/rest/v2/region/africa`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
      break;
    case "Asie":
      get(`https://restcountries.eu/rest/v2/region/asia`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
      break;
    case "Océanie":
      get(`https://restcountries.eu/rest/v2/region/oceania`).then((data) => {
        getCountries(data);
        hideDropdownMenu();
      });
  }
}

function toggleDropDownMenu() {
  filterContent.classList.toggle("active");

  if (filterContent.classList.contains("active")) {
    filterContent.style.display = "block";
    document.querySelector(".fa-chevron-down").style.transform =
      "rotate(180deg)";

    window.addEventListener("click", (e) => {
      e.target !== filterBtn && filterContent.classList.contains("active")
        ? hideDropdownMenu()
        : false;
    });
  } else {
    filterContent.style.display = "none";
    document.querySelector(".fa-chevron-down").style.transform = "rotate(0)";
  }
}

function hideDropdownMenu() {
  filterContent.classList.remove("active");
  filterContent.style.display = "none";
  document.querySelector(".fa-chevron-down").style.transform = "rotate(0)";
}

function getCountries(data) {
  let output = "";
  for (country of data) {
    output += `
    <div class="card">
      <div class="card-image">
        <img src="${country.flag}">
      </div>
      <div class="card-content">
        <h2>${
          country.translations.fr === null
            ? country.name
            : country.translations.fr
        }</h2>
        <h4>Population : <span>${country.population.toLocaleString()}</span></h4>
        <h4>Région : <span>${
          country.region === ""
            ? (country.region = "Non renseignée")
            : country.region
        }</span></h4>
        <h4>Capitale : <span>${
          country.capital === ""
            ? (country.capital = "Aucune")
            : country.capital
        }</span></h4>
      </div>
    </div>`;
  }
  countries.innerHTML = output;
  showModal(data);
}

function showModal(data) {
  const cards = document.querySelectorAll(".card");

  for (card of cards) {
    card.addEventListener("click", (e) => {
      for (country of data) {
        if (e.target.src === country.flag) {
          openModal.classList.toggle("active");
          openModal.innerHTML = `
          <div id="modal">
          <div id="close-modal">
            <i class="gg-close"></i></i>
          </div>
            <div id="modal-img">
              <img src="${country.flag}">
            </div>
            <div id="modal-content">
              <div class="country-details">
                <h2>${
                  country.translations.fr === null
                    ? country.name
                    : country.translations.fr
                }</h2>
                <h4>Nom natif : <span>${country.nativeName}</span></h4>
                <h4>Population : <span>${country.population.toLocaleString()}</span></h4>
                <h4>Région : <span>${country.region}</span></h4>
                <h4>Sous-région : <span>${
                  country.subregion === ""
                    ? (country.subregion = "Aucune")
                    : country.subregion
                }</span></h4>
                <h4>Capitale : <span>${country.capital}</span></h4>
              </div>
    
              <div class="country-details">
                <h4>Domaine de premier niveau : <span>${
                  country.topLevelDomain
                }</span></h4>
                <h4>Monnaie : <span>${getCurrencies(country)}</span></h4>
                <h4>Langues : <span>${getLanguages(country)}</span></h4>
                <h4><p>Fuseau horaire :</p> <span>${getTimezones(
                  country
                )}</span></h4>
                <h4>Indicatif téléphonique : <span>${
                  country.callingCodes
                }</span></h4>
                <h4>ISO 3166-1 alpha-3 : <span>${country.alpha3Code}</span></h4>
              </div>
    
              <div class="country-details">
                <h4>Pays frontaliers</h4>
                ${
                  country.borders.length === 0
                    ? (country.borders = "Aucun")
                    : getBorderCountries(country)
                }
              </div>
            </div>
          </div>
          `;

          const closeModalBtn = document.getElementsByClassName("gg-close");
          closeModalBtn[0].addEventListener("click", (e) =>
            e.target.parentElement.parentElement.parentElement.classList.remove(
              "active"
            )
          );

          const modalContainer = document.getElementById("modal-container");
          window.addEventListener("click", (e) => {
            e.target === modalContainer
              ? modalContainer.classList.remove("active")
              : false;
          });
        }
      }
    });
  }
}

function getLanguages(country) {
  let output = [];
  for (language of country.languages) {
    output.push(language.name);
  }
  return output.join(", ");
}

function getCurrencies(country) {
  let output = [];
  for (currency of country.currencies) {
    const symbol = currency.symbol;
    const name = currency.name;

    if (symbol === null) {
      return `Aucun symbole monétaire (${name})`;
    } else if (name === null) {
      return `${symbol} Nom de monnaie non renseignée`;
    } else if (symbol === null && name === null) {
      return "";
    }
    output.push(`${symbol} (${name})`);
  }
  return output.join(", ");
}

function getTimezones(country) {
  let output = [];
  for (timezone of country.timezones) {
    output.push(timezone);
  }
  return output.join(" ");
}

function getBorderCountries(country) {
  let output = [];
  for (border of country.borders) {
    output.push(`<span class="border">${border}</span>`);
  }
  return output.join(" ");
}
