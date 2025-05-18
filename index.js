
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


  // == GRUNDINSTÄLLNINGAR ==
  // SVG-storleken och definierar marginaler för axlar och text.
  const width = +svg.attr("width");   // +svg = Omvandlar "800" (sträng) till 800 (tal)
  const height = +svg.attr("height");
  const margin = { top: 40, right: 20, bottom: 50, left: 60 };

  // Definerar utrymmet inre ritområdet – utrymmet där själva diagrammet får plats.
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // == APPEND GROUP ==
  // Skapar en grupp i SVG som vi kan rita i.
  // Skapar en <g>-grupp och flyttar hela grafen inåt så att den inte kolliderar med marginalerna.
  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // == Fasta färger per kategori (kön eller etnicitet) ==
  // Skapa en färgskala för kön och etnicitet. Ordningen är viktig: den matchar datavärdena. 
  const colorScale = d3.scaleOrdinal()
    .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
    .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);
  
  // === MODE === 
  // mode === "average" – en stapel per kategori
  if (mode === "average") {
    // categoryXScale = skala för kön eller etnicitet på X-axeln.
    // X-skalan visar t.ex. "lambda", "theta", "omicron" (eller motsvarande etniciteter).
    // d3.scaleBand används för kategorisk data med jämnt fördelat utrymme.
    const categoryXScale = d3.scaleBand()
      .domain(data.map(d => d[type]))  // t.ex. ["lambda", "theta", "omicron"]
      .range([0, innerWidth])
      .padding(0.2);

    // earningsYScale = skala för pengar på Y-axeln (0 kr → max kr)
    // Y-skalan går från 0 till högsta värdet i earnings.
    // Notera att SVG-axeln går från top → bottom, så range är omvänt!
    const earningsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.earnings)])
      .nice() // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]);

    // === APPEND AXES ===
    // Skapar X- och Y-axlar.
    // Y-axel
    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScale));

    // X-axel
    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(categoryXScale));

     // Staplar - BARS - Earnings  == Här ritas staplarna ut
    const earningsBars = chartGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
      .attr("y", d => earningsYScale(d.earnings)) // .y utgår från earnings, dvs. 0 kr → max kr
      .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
      .attr("height", d => innerHeight - earningsYScale(d.earnings))  // d.earnings används för stapelhöjd
      .attr("fill", d => colorScale(d[type]));  // Färg baserat på kategori (kön eller etnicitet)

  } else {

    //  mode === "time" – flera staplar per år (grupperade)
    // If-sats försäkrar att Välj vilka kategorier som ska jämföras i varje år.
    const categories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    // === SKALOR === 
    // Varje år är en "grupp" av staplar på X-axeln → skapa en "outer" skala.
    // yearXScaleOuter = placerar varje årsgrupp på X-axeln. Det är det yttre skalet, som skapar ett mellanrum mellan varje år.
    // Outer skalan: en hel grupp (år) får ett utrymme på X-axeln.
    const yearXScaleOuter = d3.scaleBand()
      .domain(data.map(d => d.year))  // t.ex. [2015, 2016, ..., 2024]
      .range([0, innerWidth])
      .padding(0.2);

    // Inuti varje år, finns en stapel för varje kategori (kön eller etnicitet) → skapa en "inner" skala.
    // categoryXScaleInner = inuti varje år, bestämmer hur de tre staplarna (för kön/etnicitet) ska placeras. Det är det inre skalet, som skapar mellanrum mellan t.ex. "lambda" och "theta" inom samma år.
    //  Inner skalan: inom varje år placerar vi 3 staplar, en för varje kategori.
    //  Namnet "inner" syftar alltså på att det är en skala inuti en annan skala – inte SVG.
    const categoryXScaleInner = d3.scaleBand()
      .domain(categories)  // t.ex. ["lambda", "theta", "omicron"]
      .range([0, yearXScaleOuter.bandwidth()])
      .padding(0.05);

    // earningsYScale = skala för pengar på Y-axeln (0 kr → max kr) 
    // =>  Beräkna maxvärdet för alla staplar (för alla kategorier i alla år).
    // Precis som i "average"-läget, fast här räknar vi maxvärdet från alla kategorier för alla år.
    const earningsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(categories, cat => d[cat]))])
      .nice()   // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]);


    // === APPEND AXES === 
    // Skapar X- och Y-axlar.
    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScale));

    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(yearXScaleOuter));


    // == STAPLAR == 
    // För varje år skapas en <g>-grupp (visuell “container” för de tre staplarna inuti året).
    // Varje år får sin egna <g>-grupp.
    const yearGroups = chartGroup.selectAll("g.year")
      .data(data)  // data = [{ year: 2015, lambda: ..., ... }, ...]
      .enter()
      .append("g")
      .attr("transform", d => `translate(${yearXScaleOuter(d.year)}, 0)`);

    // Ritar en stapel per kategori i varje år.
    // För varje år ritar vi en stapel per kön/etnicitet (med inre skalan).
    // Genom att först göra en .map() till { category, value } får vi ut exakt den data vi behöver.
    const yearBars = yearGroups.selectAll("rect")
      .data(d => categories.map(cat => ({ category: cat, value: d[cat] }))) // d är ett objekt för ett år { year: 2015, lambda: ..., ... } och .map(cat => ({ category: cat, value: d[cat] })) - detta gör om varje kategori till ett objekt som ser ut så här: [{ category: "lambda", value: 10 }, ...]  === varje år får sin egen uppsättning stapeldata
      .enter()   // .enter().append("rect") 
      .append("rect") // = För varje { category, value } som skapades ovan, ritar vi nu en stapel (ett <rect>-element) i yearGroup
      .attr("x", d => categoryXScaleInner(d.category)) // Använder den inre X-skalan för att placera "lambda", "theta", etc. inuti varje år.
      .attr("y", d => earningsYScale(d.value))  // Y-skalan är inverterad: 0 är längst ner, högsta värde längst upp. Detta sätter översta kanten på stapeln.
      .attr("width", categoryXScaleInner.bandwidth()) // Varje stapel får lika stor bredd, enligt den inre skalan.
      .attr("height", d => innerHeight - earningsYScale(d.value))  // Stapelhöjden är skillnaden mellan basen (innerHeight) och topp-punkten (y)
      .attr("fill", d => colorScale(d.category));  // Färg baserat på kategori (kön eller etnicitet)
  }

  // == Titel ==
  // En text-element i SVG. Skapar en dynamisk rubrik högst upp i grafen.
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

updateChart(); // Renderar sidan när den laddas






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