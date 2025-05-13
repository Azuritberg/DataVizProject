
import { Gigs, DJs, Producers, Cities } from './data.js';


let dataSetCitiesEth = []
let dataSetCitiesGen = []
let dataSetProducersEth = [];
let dataSetProducersGen = [];

let genders = ["lambda", "theta", "omicron"];
let ethinicties = ["psi", "rho", "tau"];

let dataSetAvgEarningsGender = [];
let dataSetAvgEarningsEthnicity = [];

let dataSetTotalGigsGender = [];
let dataSetTotalGigsEthnicity = [];



// ==== Creates dataset where each city is shown by it's gig count broken down in terms of each DJs gender and ethinicity ====
for (const city of Cities) {
    let cityGigs = Gigs.filter(x => x.cityID == city.id);
    let dataPoint = {
        name: city.name,
        id: city.id,
        data: []
    }
    let dataPoint2 = {
        name: city.name,
        id: city.id,
        data: []
    }
    for(let i = 0; i < 10; i++){
        let yearsGigs = cityGigs.filter(x => {
            let year = new Date(x.date).getFullYear();
            return year == 2015 + i;
        });
        let yearPoint = {
            year: 2015 + i,
            rho:0,
            tau:0,
            psi:0,
        };
        let yearPointGender = {
            year: 2015 + i,
            lambda: 0,
            omicron: 0,
            theta: 0,
        }
        let djIDs = yearsGigs.map(x => {return x.djID})
        let eths = djIDs.map(x => {
            return DJs.find(y => y.id == x).ethnicity;
        })
        let genders = djIDs.map(x => {
            return DJs.find(y => y.id == x).gender;
        })
        yearPointGender.theta = genders.filter(x => x == "theta").length;
        yearPointGender.omicron = genders.filter(x => x == "omicron").length;
        yearPointGender.lambda = genders.filter(x => x == "lambda").length;
        dataPoint2.data.push(yearPointGender);
        yearPoint.rho = eths.filter(x => x == "rho").length;
        yearPoint.psi = eths.filter(x => x == "psi").length;
        yearPoint.tau = eths.filter(x => x == "tau").length;
        dataPoint.data.push(yearPoint);
    }
    dataSetCitiesEth.push(dataPoint);
    dataSetCitiesGen.push(dataPoint2);
}


//==== Same as above but for producers not cities ====
for (const producer of Producers) {
    console.log(producer.id)
    let producerGigs = Gigs.filter(x => {return x.producerID == producer.id});
    let dataPointEth = {
        name: producer.name,
        id: producer.id,
        data: []
    }
    let dataPointGen = {
        name: producer.name,
        id: producer.id,
        data: []
    }
    for(let i = 0; i < 10; i++){
        let yearsGigs = producerGigs.filter(x => {
            let year = new Date(x.date).getFullYear();
            return year == 2015 + i;
        });
        let yearPointEth = {
            year: 2015 + i,
            rho:0,
            tau:0,
            psi:0,
        };
        let yearPointGen = {
            year: 2015 + i,
            lambda: 0,
            omicron: 0,
            theta: 0,
        }
        let djIDs = yearsGigs.map(x => {return x.djID})
        let eths = djIDs.map(x => {
            return DJs.find(y => y.id == x).ethnicity;
        })
        let genders = djIDs.map(x => {
            return DJs.find(y => y.id == x).gender;
        })
        yearPointGen.theta = genders.filter(x => x == "theta").length;
        yearPointGen.omicron = genders.filter(x => x == "omicron").length;
        yearPointGen.lambda = genders.filter(x => x == "lambda").length;
        dataPointGen.data.push(yearPointGen);
        yearPointEth.rho = eths.filter(x => x == "rho").length;
        yearPointEth.psi = eths.filter(x => x == "psi").length;
        yearPointEth.tau = eths.filter(x => x == "tau").length;
        dataPointEth.data.push(yearPointEth);
    }
    dataSetProducersEth.push(dataPointEth);
    dataSetProducersGen.push(dataPointGen);
}
console.log(dataSetProducersEth, dataSetProducersGen);
console.log(dataSetCitiesEth, dataSetCitiesGen)



// ==== Skapar ett en array filtered gigs som är alla gigsen för ett kön ====
for (const gender of genders) {
    //filter gigs by gender
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJgender = DJs.find(y => y.id == gigDj).gender;
        return DJgender == gender;
    });
    let gigEarnings = filteredGigs.map(x => x.djEarnings).reduce((cv, pv) => {return cv + pv}, 0) / filteredGigs.length; 
    let genderedGigs = filteredGigs.length;
    dataSetAvgEarningsGender.push({
        gender: gender,
        earnings: gigEarnings
    });
    dataSetTotalGigsGender.push({
        gender: gender,
        totalGigs : genderedGigs
    });
}
for (const ethinicity of ethinicties) {
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJethnicity = DJs.find(y => y.id == gigDj).ethnicity;
        return DJethnicity == ethinicity;
    });
    let gigEarnings = filteredGigs.map(x => x.djEarnings).reduce((cv, pv) => {return cv + pv}, 0) / filteredGigs.length;
    let genderedGigs = filteredGigs.length;
    dataSetAvgEarningsEthnicity.push({
        ethinicity: ethinicity,
        earnings: gigEarnings
    });
    dataSetTotalGigsEthnicity.push({
        ethnicity: ethinicity,
        totalGigs: genderedGigs
    });
}

console.log(dataSetAvgEarningsGender, dataSetAvgEarningsEthnicity);
console.log(dataSetTotalGigsGender, dataSetTotalGigsEthnicity);





// ==== Tillfälliga knappar OBS!! vi får ändra detta sedan så vi kan generera alla knappar ====

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