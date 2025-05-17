
import { Gigs, DJs, Producers, Cities } from './data.js';


let dataSetCitiesEth = []
let dataSetCitiesGen = []
let dataSetProducersEth = [];
let dataSetProducersGen = [];

let genders = ["lambda", "theta", "omicron"];
let ethnicties = ["psi", "rho", "tau"];

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
for (const ethnicity of ethnicties) {
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJethnicity = DJs.find(y => y.id == gigDj).ethnicity;
        return DJethnicity == ethnicity;
    });
    let gigEarnings = filteredGigs.map(x => x.djEarnings).reduce((cv, pv) => {return cv + pv}, 0) / filteredGigs.length;
    let genderedGigs = filteredGigs.length;
    dataSetAvgEarningsEthnicity.push({
        ethnicity: ethnicity,
        earnings: gigEarnings
    });
    dataSetTotalGigsEthnicity.push({
        ethnicity: ethnicity,
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
  "Banzai AB", "Festen AB", "Finliret AB", "Gigskaparna", "Nattmingel AB",
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



// === CREATE FUNCTION renderEarningsBarChart ===

function renderEarningsBarChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-earnings");
  svg.selectAll("*").remove();  // Tömma SVG och rita nytt

  const width = +svg.attr("width");   // +svg = Omvandlar "800" (sträng) till 800 (tal)
  const height = +svg.attr("height");
  const margin = { top: 40, right: 20, bottom: 50, left: 60 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const colorScale = d3.scaleOrdinal()
    .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
    .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);

  if (mode === "average") {
    const categoryXScale = d3.scaleBand()
      .domain(data.map(d => d[type]))
      .range([0, innerWidth])
      .padding(0.2);

    const earningsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.earnings)])
      .nice()
      .range([innerHeight, 0]);

    // Y-axel
    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScale));

    // X-axel
    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(categoryXScale));

     // Staplar - BARS - Earnings
    const earningsBars = chartGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))
      .attr("y", d => earningsYScale(d.earnings))
      .attr("width", categoryXScale.bandwidth())
      .attr("height", d => innerHeight - earningsYScale(d.earnings))
      .attr("fill", d => colorScale(d[type]));
  }

  else {
    const categories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    const yearXScaleOuter = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.2);

    const categoryXScaleInner = d3.scaleBand()
      .domain(categories)
      .range([0, yearXScaleOuter.bandwidth()])
      .padding(0.05);

    const earningsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(categories, cat => d[cat]))])
      .nice()   // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]);

    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScale));

    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(yearXScaleOuter));

    const yearGroups = chartGroup.selectAll("g.year")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${yearXScaleOuter(d.year)}, 0)`);

    const yearBars = yearGroups.selectAll("rect")
      .data(d => categories.map(cat => ({ category: cat, value: d[cat] })))
      .enter()
      .append("rect")
      .attr("x", d => categoryXScaleInner(d.category))
      .attr("y", d => earningsYScale(d.value))
      .attr("width", categoryXScaleInner.bandwidth())
      .attr("height", d => innerHeight - earningsYScale(d.value))
      .attr("fill", d => colorScale(d.category));
  }

  // Titel
  const chartTitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "1rem")
    .text(mode === "average"
      ? `Average DJ Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`
      : `DJ Earnings Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);
}









let currentType = "gender";       // "gender" eller "ethnicity"
let currentMode = "average";      // "average" eller "time"
//let currentSource = "";           //  "city", "producer"
//let currentID = null;             // ID vid city/producer

// === Event listeners för earnings-knapparna ===
document.querySelector(".btn--gender").addEventListener("click", () => {
  currentType = "gender";
  updateChart();
});

document.querySelector(".btn--ethnicity").addEventListener("click", () => {
  currentType = "ethnicity";
  updateChart();
});

document.querySelector(".btn-over-all").addEventListener("click", () => {
  currentMode = "average";
  updateChart();
});

document.querySelector(".btn-over-time").addEventListener("click", () => {
  currentMode = "time";
  updateChart();
});

function updateChart() {
  let data;

  if (currentMode === "average") {
    data = currentType === "gender"
      ? dataSetAvgEarningsGender
      : dataSetAvgEarningsEthnicity;
  } else {
    data = currentType === "gender"
      ? dataSetCitiesGen[0].data 
      : dataSetCitiesEth[0].data;
  }

  renderEarningsBarChart(data, currentType, currentMode);
}

updateChart(); // Renderar när sidan laddas






/*
// === Event listeners för knappar ===
document.querySelector(".btn--gender").addEventListener("click", () => {
  renderEarningsBarChart(dataSetAvgEarningsGender, "gender");
});

document.querySelector(".btn--ethnicity").addEventlistnier("click", () => {
  renderEarningsBarChart(dataSetAvgEarningsEthnicity, "ethnicity");  
})

// === Start med Data från GENDER ===
renderEarningsBarChart(dataSetAvgEarningsGender, "gender");*/




// Rendera genomsnittliga inkomster efter kön:
//renderEarningsBarChart(dataSetAvgEarningsGender, "gender");

// Eller för etnicitet:
//renderEarningsBarChart(dataSetAvgEarningsEthnicity, "ethinicity");









/*  if (document.querySelector(".btn--gender").classList.contains("active")) {
    renderEarningsBarChart(dataSetAvgEarningsGender, "gender");
  }*/

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









// === CREATE FUNCTION renderEarningsBarChart ===
/*
function renderEarningsBarChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-earnings")
  svg.selectAll("*").remove(); // Tömma SVG och rita nytt

  const width = +svg.attr("width");  // +svg = Omvandlar "800" (sträng) till 800 (tal)
  const height = +svg.attr("height");
  const margin = { top: 40, right: 20, bottom: 40, left: 60 };

  const innerWidth = width - margin.left -margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const colorScale = d3.scaleOrdinal()
    .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
    .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);


  const categoryXScale = d3.scaleBand()
    .domain(data.map(d => d[type]))
    .range([0, innerWidth])
    .padding(0.2);
  
  const earningsYScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.earnings)])
    .nice() // Rundar av skalans max-värde ex. 50.5 blir 51
    .range([innerHeight, 0]);


   // Y-axel
  const yAxis = chartGroup.append("g")
    .call(d3.axisLeft(earningsYScale));
  
  // X-axel
  const xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(categoryXScale));
  
  // Staplar - BARS
  const chartBars = chartGroup.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => categoryXScale(d[type]))
    .attr("y", d => earningsYScale(d.earnings))
    .attr("width", categoryXScale.bandwidth())
    .attr("height", d => innerHeight - earningsYScale(d.earnings))
    .attr("fill", d => colorScale(d[type]));
  
  // Titel
  const title = chartGroup.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "1rem")
    .text(`Avarage Dj Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`);
    
}*/
























/* Gammal kod!! OBS
function renderEarningsBarChart(data, type = "gender", mode = "average") {
  const svg = d3.select("#chart-earnings");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 40, right: 20, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const colorScale = d3.scaleOrdinal()
    .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
    .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);

  if (mode === "average") {
    const xScale = d3.scaleBand()
      .domain(data.map(d => d[type]))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.earnings)])
      .nice()
      .range([innerHeight, 0]);

    chartGroup.append("g").call(d3.axisLeft(yScale));
    chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    chartGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d[type]))
      .attr("y", d => yScale(d.earnings))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.earnings))
      .attr("fill", d => colorScale(d[type]));
  } else {
    const categories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.2);

    const x1 = d3.scaleBand()
      .domain(categories)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(categories, c => d[c]))])
      .nice()
      .range([innerHeight, 0]);

    chartGroup.append("g").call(d3.axisLeft(yScale));
    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x0));

    chartGroup.selectAll("g.year")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.year)}, 0)`)
      .selectAll("rect")
      .data(d => categories.map(cat => ({ category: cat, value: d[cat] })))
      .enter()
      .append("rect")
      .attr("x", d => x1(d.category))
      .attr("y", d => yScale(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", d => colorScale(d.category));
  }

  // Titel
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "1rem")
    .text(mode === "average"
      ? `Average DJ Earnings by ${type}`
      : `DJ Earnings Over Time by ${type}`);
}
*/