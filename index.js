
import { Gigs, DJs, Producers, Cities } from './data/data.js';
import { yearsToAllTimeDataset, getMaxValueDataset,  transformToLineData} from './data/auxfunctions.js';
import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from './data/dataInit.js';
import { cities, producers, genders, ethnicties } from './data/dataInit.js';
import { renderEarningsGraphChart, updateEarningsChart} from './graphs/totalearnings.js';
import { renderGigsGraphChart, updateGigsChart } from './graphs/totalgigs.js';



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

// === HANDLE ACTIVE BUTTON ===
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

updateEarningsChart(); // Renderar sidan när den laddas
updateGigsChart(); //Renderar sidan när den laddas
