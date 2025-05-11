
//import { Gigs, DJs, Producers, Cities } from './data.js';

// Skapa alla Grafer här!!

/*
// Tillfälliga knappar OBS!! vi får ändra detta sedan så vi kan generera alla knappar
export const cities = ["Agrabah", "Sunnydale", "Rimini", "Karatas", "Asteroid City"]; // importera från data.js
export const Producers = ["Trance AB", "No Mind AB", "Festen AB", "Gigskaparna", "Xtas Produktioner"];


const cityContainer = d3.select(".city-buttons");

cityContainer.selectAll("button")
  .data(Cities)
  .enter()
  .append("button")
  .attr("class", "btn-city")
  .text(d => d);



const producerContainer = d3.select(".producer-buttons");

producerContainer.selectAll("button")
  .data(Producers)
  .enter()
  .append("button")
  .attr("class", "btn-producer")
  .text(d => d);
*/



// Tillfälliga knappar OBS!! vi får ändra detta sedan så vi kan generera alla knappar

// === DATA ARRAYS ===
const cities = [
  "Sao Adão", "Agrabah", "Alphaville", "Asteroid City", "Atlantika", "Bagdogski",
  "Belleville", "Brightburn", "Chong Guo", "Ciudad Encantada", "Dunauvarosz",
  "Santo Tome", "Sunnydale", "Pokyo", "Rimini", "Moesko", "Mos Eisley", "Kaabuli",
  "Karatas", "Kattstad", "Khansaar", "Kosmolac", "Krzystanopolis", "Ville Rose"
];

const producers = [
  "Banzai AB", "Festen AB", "Filrinet AB", "Gigskaparna", "Nattmingel AB",
  "Neverending AB", "No Mind AB", "Trance AB", "Xtas Produktioner"
];

// === CREATE CITY BUTTONS ===
const cityButtonsContainer = document.querySelector(".city-buttons");

cities.forEach(city => {
  const button = document.createElement("button");
  button.textContent = city;
  button.classList.add("btn-city");
  cityButtonsContainer.appendChild(button);
});

// === CREATE PRODUCER BUTTONS ===
const producerButtonsContainer = document.querySelector(".producer-buttons");

producers.forEach(producer => {
  const button = document.createElement("button");
  button.textContent = producer;
  button.classList.add("btn-producer");
  producerButtonsContainer.appendChild(button);
});

// === HANDLE ACTIVE BUTTON STATE ===
function activateOne(buttonsClass) {
  const buttons = document.querySelectorAll(buttonsClass);
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// === ACTIVATE CITIES & PRODUCERS ===
activateOne(".btn-city");
activateOne(".btn-producer");



