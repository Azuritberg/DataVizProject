


import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender, datasetTotalEarningsYearByYearEth, datasetTotalEarningsYearByYearGen } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset, getMaxValueDataset, transformToLineData, combineGroups, getGreekGraphSymbol } from '../data/auxfunctions.js';





// === CREATE FUNCTION renderGigsBarChart === Som skapar stapeldiagram och linjediagram ===

export function renderGigsGraphChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-plays");
  svg.selectAll("*").remove();

  const tooltip = d3.select("#tooltip-general");

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 50, right: 20, bottom: 50, left: 50 };
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

    const gigsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalGigs)])
      .nice()
      .range([innerHeight, 0]);

    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(gigsYScale));

    const xAxisGroup = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`);

    const xAxis = d3.axisBottom(categoryXScale)
      .tickFormat(d => {
        if (typeof d === "string") {
          return d.charAt(0).toUpperCase() + d.slice(1);
        }
        return d;
      });

    xAxisGroup.call(xAxis);
    
    // const xAxis = chartGroup.append("g")
    //   .attr("transform", `translate(0, ${innerHeight})`)
    //   .call(d3.axisBottom(categoryXScale));


    // === STAPLAR ===
   // Staplar - BARS - Gigs  == Här ritas staplarna ut
    const gigsBars = chartGroup.selectAll(".bar");
      gigsBars.remove(); // Rensa gamla staplar

      chartGroup.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => categoryXScale(d[type]))
        .attr("width", categoryXScale.bandwidth())
        .attr("y", innerHeight)
        .attr("height", 0)
        .attr("fill", d => colorScale(d[type]))
        .on("mouseover", function(event, d) {
          tooltip
            .style("display", "block")  
            .style("opacity", 1)
            .style("transform", "translateY(-6px)") // Liten mjuk uppflyttning
            .html(`
              <div class="tooltip-header" style="color:${colorScale(d[type])};">
                ${d[type][0].toUpperCase() + d[type].slice(1)} : ${getGreekGraphSymbol(d[type])}
              </div>
              <div><strong>Year</strong> : ${d.year ?? "All time"}</div>
              <div><strong>Gigs</strong> : ${d.totalGigs.toFixed(0)}</div>
            `);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseleave", function() {
          tooltip
            .style("opacity", 0)
            .style("transform", "translateY(0px)");
        })
        .transition()
        .duration(1500)
        .delay((_, i) => i * 100)
        .style("opacity", 1)
        .attr("y", d => gigsYScale(d.totalGigs) + 2)
        .attr("height", d => innerHeight - gigsYScale(d.totalGigs) - 3);

      // === TEXT OVANFÖR STAPLAR ===
      const gigsLabels = chartGroup.selectAll(".bar-label");
        gigsLabels.remove(); // Rensa gamla etiketter

        chartGroup.selectAll(".bar-label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bar-label")
          .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
          .attr("y", innerHeight - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#333")
          .style("opacity", 0)
          .text(d => d.totalGigs.toFixed(0))
          .transition()
          .duration(1500)
          .delay((_, i) => i * 100)
          .style("opacity", 1)
          .attr("y", d => gigsYScale(d.totalGigs) - 10);


  } else {


    const gigCategories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    const gigsLineData = transformToLineData(data, gigCategories);

    const yearXScaleLine = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);

    const gigsYScaleLine = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(gigCategories, cat => d[cat]))])
      .nice()
      .range([innerHeight, 0]);

    const xGigsAxisLine = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d")));

    const yGigsAxisLine = chartGroup.append("g").call(d3.axisLeft(gigsYScaleLine));

    const gigsLinePathFunction = d3.line()
      .x(d => yearXScaleLine(d.year))
      .y(d => gigsYScaleLine(d.value));


    const gigsLine = chartGroup.selectAll(".line")
      .data(gigsLineData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", d => gigsLinePathFunction(d.values))
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.category))
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", function() {  // stroke-dasharray sätter en "osynlig" linje med exakt samma längd som linjen.
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function() {  // stroke-dashoffset flyttar ut hela linjen ur synfältet.
        return this.getTotalLength();
      })
      .transition()  // .transition() animerar tillbaka stroke-dashoffset till 0 → linjen ritas upp framför ögonen.
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);


      gigsLineData.forEach(categoryGroup => {
        chartGroup.selectAll(`.circle-${categoryGroup.category}`)
          .data(categoryGroup.values)
          .enter()
          .append("circle")
          .attr("cx", d => yearXScaleLine(d.year))
          .attr("cy", d => gigsYScaleLine(d.value))
          .attr("r", 0) // Börjar som osynlig liten cirkel
          .attr("fill", colorScale(categoryGroup.category))
          .on("mouseover", function(event, d) {
            tooltip
              .style("display", "block")
              .html(`
                <div class="tooltip-header" style="color:${colorScale(categoryGroup.category)};">
                  ${categoryGroup.category[0].toUpperCase() + categoryGroup.category.slice(1)} : ${getGreekGraphSymbol(categoryGroup.category)}
                </div>
                <div><strong>Year</strong> : ${d.year}</div>
                <div><strong>Earnings</strong> : ${d.value.toFixed(0)}</div>
              `);
          })
          .on("mousemove", function(event) {
            tooltip
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 30) + "px");
          })
          .on("mouseleave", function() {
            tooltip.style("display", "none");
          })
          .transition()
          .duration(2500)
          .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt
          .attr("r", 6); // Växer upp till vanlig storlek
      });  
  }

  
  // === Titlar ===
  const graphGigsTitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "1rem")
    .text(mode === "average"
      ? `Total Gigs by ${type === "gender" ? "Gender" : "Ethnicity"}`
      : `Gigs Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

  const chartGigsSubtitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "0.8rem")
    .attr("fill", "#666")
    .text(mode === "average"
      ? `Shows total number of gigs per ${type === "gender" ? "gender group" : "ethnic group"}`
      : `Shows how many gigs each ${type === "gender" ? "gender group" : "ethnic group"} got per year`);

}
  
  

// === BUTTONS FÖR GIGS-GRAFEN ===
  
let currentTypeGraphGigs = "ethnicity";       // "gender" eller "ethnicity"
let currentModeGraphGigs = "average";         // "average" eller "time"
  
  
  
export function updateGigsChart() {
  // === Rensa aktiva klasser på alla knappar ===
  document.querySelectorAll(".btn--gigs--gender, .btn--gigs--ethnicity").forEach(btn => {
    btn.classList.remove("gender-active", "ethnicity-active", "active");
  });

  document.querySelectorAll(".btn-over-time-gigs, .btn-over-all-gigs").forEach(btn => {
    btn.classList.remove("gender-active", "ethnicity-active", "active");
  });

  // === Om ingen typ är vald, rensa graf och avsluta ===
  if (!currentTypeGraphGigs) {
    d3.select("#chart-plays").selectAll("*").remove();
    return;
  }

  // === Lägg till korrekt aktiv klass för typ-knappen ===
  const typeGigsClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";
  document.querySelectorAll(`.btn--gigs--${currentTypeGraphGigs}`).forEach(btn => {
    btn.classList.add("active", typeGigsClass);
  });

  
  if (!currentModeGraphGigs) {
    currentModeGraphGigs = "average";
  }
    
  // === Lägg till korrekt aktiv klass för mode-knappen ===
  const modeGigsBtnClass = currentModeGraphGigs === "average" ? ".btn-over-all-gigs" : ".btn-over-time-gigs";
  const modeClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";

  document.querySelectorAll(modeGigsBtnClass).forEach(btn => {
    btn.classList.add(modeClass, "active");
  });

  // === Välj korrekt data ===
  let data;
  if (currentModeGraphGigs === "average") {
    data = currentTypeGraphGigs === "gender"
      ? dataSetTotalGigsGender
      : dataSetTotalGigsEthnicity;
  } else {
    data = currentTypeGraphGigs === "gender"
      ? combineGroups(genders, dataSetCitiesGen) 
      : combineGroups(ethnicties, dataSetCitiesEth);
  }

    // === Rendera graf ===
  renderGigsGraphChart(data, currentTypeGraphGigs, currentModeGraphGigs);
}


// === Event listeners för gigs-knapparna ===
document.querySelectorAll(".btn--gigs--gender").forEach(btn => {
  btn.addEventListener("click", () => {
      currentTypeGraphGigs = currentTypeGraphGigs === "gender" ? null : "gender"; 
      updateGigsChart();
  });
});

document.querySelectorAll(".btn--gigs--ethnicity").forEach(btn => {
  btn.addEventListener("click", () => {
      currentTypeGraphGigs = currentTypeGraphGigs === "ethnicity" ? null : "ethnicity";
      updateGigsChart();
  });
});

document.querySelectorAll(".btn-over-time-gigs").forEach(btn => {
  btn.addEventListener("click", () => {
      currentModeGraphGigs = currentModeGraphGigs === "time" ? null : "time";
      updateGigsChart();
   });
});

document.querySelectorAll(".btn-over-all-gigs").forEach(btn => {
  btn.addEventListener("click", () => {
      currentModeGraphGigs = currentModeGraphGigs === "average" ? null : "average";
      updateGigsChart();
  });
});

















//=====================================================


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






// ==== Functions ====
function getMaxValueDataset(type, dataset){
  let yMax = 0;
  for (const t of type) {
    let arrayCollection = dataset.map(x => x.data).map(x => x.map(y => y[t]));
    for (const array of arrayCollection) {
      let y = array.reduce((pv, cv) => Math.max(pv, cv), -Infinity);
      if(y > yMax) yMax = y;
    }
  }
  return yMax;
}


function yearsToAllTimeDataset(type, type2, dataset){
  let objs = [];
  for (const t2 of type2) {
    let datamap = dataset.filter(x => x.name == t2).map(x => x.data)[0];
    
    let obj = {
      type: t2,
    }
    for (const t of type) {
      let objectData = datamap.map(x => x[t]).reduce((pv, cv) => pv + cv, 0);
      obj[t] = objectData
      console.log(t2,t, objectData)
    }
    objs.push(obj);
  }
  return objs
}



// == FUNKTION TILL ATT TRANSFORMERA DATA (linjegraf) ==
function transformToLineData(data, categories) {
  return categories.map(category => ({
    category,
    values: data.map(d => ({
      year: d.year,
      value: d[category]
    }))
  }));
}







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








// FÖRSTA GRAFEN BÖRJAR

// === CREATE FUNCTION renderEarningsBarChart === Som skapar stapeldiagram och linjediagram ===

function renderEarningsGraphChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-earnings");
  svg.selectAll("*").remove();  // Tömma SVG och rita nytt


  // == GRUNDINSTÄLLNINGAR ==
  // SVG-storleken och definierar marginaler för axlar och text.
  const width = +svg.attr("width");   // +svg = Omvandlar "800" (sträng) till 800 (tal)
  const height = +svg.attr("height");
  const margin = { top: 50, right: 20, bottom: 50, left: 50 };

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



     // === ENTER/UPDATE/EXIT FÖR STAPLAR ===
    const earningsBars = chartGroup.selectAll(".bar")
      .data(data, d => d[type]);

    earningsBars.transition()
      .duration(1000)
      .attr("x", d => categoryXScale(d[type]))
      .attr("width", categoryXScale.bandwidth())
      .attr("y", d => earningsYScale(d.earnings))
      .attr("height", d => innerHeight - earningsYScale(d.earnings))
      .attr("fill", d => colorScale(d[type]));

    earningsBars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))
      .attr("width", categoryXScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => colorScale(d[type]))
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attr("y", d => earningsYScale(d.earnings))
      .attr("height", d => innerHeight - earningsYScale(d.earnings));

    earningsBars.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .remove();

    // === ENTER/UPDATE/EXIT FÖR TEXTER ===
    const earningsLabels = chartGroup.selectAll(".bar-label")
      .data(data, d => d[type]);

    earningsLabels.transition()
      .duration(1000)
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", d => earningsYScale(d.earnings) - 5)
      .text(d => d.earnings.toFixed(0));

    earningsLabels.enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", innerHeight - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .style("opacity", 0)
      .text(d => d.earnings.toFixed(0))
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attr("y", d => earningsYScale(d.earnings) - 5);

    earningsLabels.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .remove();



    // // Staplar - BARS - Earnings  == Här ritas staplarna ut
    // const earningsBars = chartGroup.selectAll(".bar")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "bar")
    //   .attr("x", d => categoryXScale(d[type]))
    //   .attr("y", innerHeight)
    //   .attr("width", categoryXScale.bandwidth())
    //   .attr("height", 0)
    //   .attr("fill", d => colorScale(d[type]))
    //   .style("opacity", 0)
    //   .transition()
    //   .duration(1500)
    //   .delay((_, i) => i * 100)  // Stagger för att komma en efter en
    //   .ease(d3.easeExpOut)
    //   .attr("y", d => earningsYScale(d.earnings))
    //   .attr("height", d => innerHeight - earningsYScale(d.earnings))
    //   .style("opacity", 1);



    // //  // Staplar - BARS - Earnings  == Här ritas staplarna ut
    // // const earningsBars = chartGroup.selectAll(".bar")
    // //   .data(data)
    // //   .enter()
    // //   .append("rect")
    // //   .attr("class", "bar")
    // //   .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
    // //   .attr("y", d => earningsYScale(d.earnings)) // .y utgår från earnings, dvs. 0 kr → max kr
    // //   .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
    // //   .attr("height", d => innerHeight - earningsYScale(d.earnings))  // d.earnings används för stapelhöjd
    // //   .attr("fill", d => colorScale(d[type]));  // Färg baserat på kategori (kön eller etnicitet)

    // // === TEXT OVANFÖR STAPLAR ===
    //   chartGroup.selectAll(".bar-label")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .attr("class", "bar-label")
    //     .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
    //     .attr("y", d => earningsYScale(d.earnings) - 5)  // lite ovanför stapeln
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "12px")
    //     .attr("fill", "#333")
    //     .text(d => d.earnings.toFixed(0)); // eller .toFixed(1) om du vill ha decimal


      // === LINJEDIAGRAM ===
// Om mode === "time", ritar vi ett linjediagram som visar utvecklingen 
// av inkomst (eller annan variabel) över tid, för varje kategori (kön eller etnicitet).    

  } else {

    // === DEFINIERA KATEGORIER ===
    // Beroende på om vi tittar på kön eller etnicitet, väljer vi de kategorier vi vill visa linjer för.
    // t.ex. ["lambda", "theta", "omicron"] eller ["psi", "rho", "tau"]
    const earningsCategories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    // === TRANSFORMERA DATA ===
    // Vi gör om årsbaserad tabell-data till en struktur per kategori: 
    // Input: Vi omformar data från [{ year: 2015, lambda: 300, ... }, ...]
    // Output: till ett format per kategori: [{ category: "lambda", values: [ { year: ..., value: ... }, ... ] }]
    const earningsLineData = transformToLineData(data, earningsCategories);

    // === SKALA FÖR X-AXELN (år = tidslinje) ===
    // Skapar en linjär skala från första till sista år i datan.
    const yearXScaleLine = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))  // [minYear, maxYear] t.ex. [2015, 2024]
      .range([0, innerWidth]);  // Plats fördelas över bredden av diagrammet

    // === SKALA FÖR Y-AXELN (inkomst) ===
    // Hittar det högsta värdet i hela datasättet, i alla kategorier över alla år.
    const earningsYScaleLine = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(earningsCategories, cat => d[cat]))])
      .nice()  // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]); // SVG-ytan ritas från top (0) till bottom (innerHeight)

    // === AXLAR ===
    // Skapar X- och Y-axlar.
    // Ritar ut X-axeln längst ner (tidslinjen)
    const xAxisLine = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)  // Flytta X-axeln till botten av grafytan
      .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d"))); // "d" = visa heltal == visa årtal som heltal

    // Ritar ut Y-axeln till vänster (inkomst)
    const yAxisLine = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScaleLine)); // Rita Y-axel till vänster

    // === LINJE FUNKTION ===
    // En funktion som ritar en linje från x och y-koordinater
    // Skapar en linje-funktion. Funktionen som tar in [{year, value}, ...] och returnerar en SVG-path
    // Använder X- och Y-skalan för att omvandla data till koordinater
    const earningsLinePathFunction = d3.line()
      .x(d => yearXScaleLine(d.year))  // konverterar årtal till X-position
      .y(d => earningsYScaleLine(d.value));  // konverterar earnings till Y-position


    // ==================== Kod utan animation =========================   
    // // === LINJER ===
    // // Ritar en path-linje => för varje kategori (t.ex. "lambda", "theta" ...) ritas en linje baserat på den data vi har.
    // const earningsLines = chartGroup.selectAll(".line")
    //   .data(earningsLineData)  // en array med ett objekt per kategori (kön eller etnicitet)
    //   .enter() // ett utrymme att skapa nya element för varje datapost => .enter() returnerar ett utrymme som ett visuellt element
    //   .append("path") // Skapar ett nytt <path>-element i SVG för varje datapost (t.ex. ett för lambda, ett för theta, etc). Varje linje representerar en kategori
    //   .attr("class", "line")  // ger alla paths CSS-klassen "line" (för ev. styling).
    //   .attr("d", d => earningsLinePathFunction(d.values))  // Ritar linje baserat på d.values = [{year, value}, ...]
    //   .attr("fill", "none")  // Ingen fyllnad, bara linje
    //   .attr("stroke", d => colorScale(d.category))  // Färg baserat på kategori (kön eller etnicitet)
    //   .attr("stroke-width", 2);  // Tjocklek

    //   // === CIRKLAR FÖR VARJE DATAPUNKT ===
    //   // Går igenom varje kategori och ritar en cirkel för varje år i kategorin.
    //   earningsLineData.forEach(categoryGroup => {
    //     chartGroup.selectAll(`.circle-${categoryGroup.category}`)
    //       .data(categoryGroup.values) // [{year, value}, ...]
    //       .enter() 
    //       .append("circle") 
    //       .attr("cx", d => yearXScaleLine(d.year))  // placera cirkel horisontellt
    //       .attr("cy", d => earningsYScaleLine(d.value))  // placera cirkel vertikalt
    //       .attr("r", 5)  // radie på punkten 3
    //       .attr("fill", colorScale(categoryGroup.category));
    //   });



    // // === LINJER ===
    // // Ritar en path-linje => för varje kategori (t.ex. "lambda", "theta" ...) ritas en linje baserat på den data vi har.
    const earningsLines = chartGroup.selectAll(".line")
      .data(earningsLineData) // en array med ett objekt per kategori (kön eller etnicitet)
      .enter()  // ett utrymme att skapa nya element för varje datapost => .enter() returnerar ett utrymme som ett visuellt element
      .append("path")  // Skapar ett nytt <path>-element i SVG för varje datapost (t.ex. ett för lambda, ett för theta, etc). Varje linje representerar en kategori
      .attr("class", "line")   // ger alla paths CSS-klassen "line" (för ev. styling).
      .attr("d", d => earningsLinePathFunction(d.values))  // Ritar linje baserat på d.values = [{year, value}, ...]
      .attr("fill", "none")  // Ingen fyllnad, bara linje
      .attr("stroke", d => colorScale(d.category))  // Färg baserat på kategori (kön eller etnicitet)
      .attr("stroke-width", 2)  // Tjocklek
      .attr("stroke-dasharray", function() {  // stroke-dasharray sätter en "osynlig" linje med exakt samma längd som linjen.
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function() {  // stroke-dashoffset flyttar ut hela linjen ur synfältet.
        return this.getTotalLength();
      })
      .transition()  // .transition() animerar tillbaka stroke-dashoffset till 0 → linjen ritas upp framför ögonen.
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);


      // === CIRKLAR FÖR VARJE DATAPUNKT ===
     // Går igenom varje kategori och ritar en cirkel för varje år i kategorin.
      earningsLineData.forEach(categoryGroup => {
        chartGroup.selectAll(`.circle-${categoryGroup.category}`)
          .data(categoryGroup.values)  // [{year, value}, ...]
          .enter()
          .append("circle")
          .attr("cx", d => yearXScaleLine(d.year))  // placera cirkel horisontellt
          .attr("cy", d => earningsYScaleLine(d.value))  // placera cirkel vertikalt
          .attr("r", 0) // Börjar som osynlig liten cirkel
          .attr("fill", colorScale(categoryGroup.category))
          .transition()  // .transition().duration(500)	Animera varje cirkel
          .duration(2500)
          .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt - Varje punkt kommer lite efter föregående
          .attr("r", 5); // Växer upp till vanlig storlek
      });




    }

    // === TITEL ===
    // En text-element i SVG. Skapar en dynamisk rubrik högst upp i grafen som visar vilken typ av graf som visas.
    const graphEarnTitle = svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "1rem")
      .text(mode === "average"
        ? `Average DJ Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`
        : `DJ Earnings Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

    const chartEarnSubtitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)  // Lite under huvudrubriken
    .attr("text-anchor", "middle")
    .attr("font-size", "0.8rem")
    .attr("fill", "#666")
    .text(mode === "average"
      ? `Shows average income per ${type === "gender" ? "gender group" : "ethnic group"} across all gigs.`
      : `Shows income trend per ${type === "gender" ? "gender group" : "ethnic group"} over time.`);
}




let currentTypeGraphEarnings = "ethnicity";     // "gender" eller "ethnicity"
let currentModeGraphEarnings = "average";      // "average" eller "time"


//let currentType = null;     // gender eller ethnicity eller null
//let currentMode = null;     // average eller time eller null


// === Event listeners för earnings-knapparna ===
document.querySelector(".btn--earn--gender").addEventListener("click", () => {
  currentTypeGraphEarnings = currentTypeGraphEarnings === "gender" ? null : "gender"; 
  updateEarningsChart();
});

document.querySelector(".btn--earn--ethnicity").addEventListener("click", () => {
  currentTypeGraphEarnings = currentTypeGraphEarnings === "ethnicity" ? null : "ethnicity";
  updateEarningsChart();
});

document.querySelector(".btn-over-time-earn").addEventListener("click", () => {
  currentModeGraphEarnings = currentModeGraphEarnings === "time" ? null : "time";
  updateEarningsChart();
});

document.querySelector(".btn-over-all-earn").addEventListener("click", () => {
  currentModeGraphEarnings = currentModeGraphEarnings === "average" ? null : "average";
  updateEarningsChart();
});



// == FUNKTION TILL ATT UPPDATERA GRAFEN ==
function updateEarningsChart() {

  // === Ta bort alla knappar först ===
document.querySelectorAll(".btn--earn--gender, .btn--earn--ethnicity").forEach(btn => {
  btn.classList.remove("active");
});

document.querySelectorAll(".btn-over-time-earn, .btn-over-all-earn").forEach(btn => {
  btn.classList.remove("gender-active", "ethnicity-active", "active");
});

  // === Om ingen typ är vald, rensa grafen och avsluta ===
if (!currentTypeGraphEarnings) {
  d3.select("#chart-earnings").selectAll("*").remove(); // Rensa diagram om ingen typ vald
  return;
}

 // === Lägg till korrekt aktiv klass för typ ===
document.querySelectorAll(".btn--earn--gender, .btn--earn--ethnicity").forEach(btn => {
  btn.classList.remove("gender-active", "ethnicity-active", "active");
});

const typeEarningsClass = currentTypeGraphEarnings === "gender" ? "gender-active" : "ethnicity-active";

document.querySelectorAll(`.btn--earn--${currentTypeGraphEarnings}`).forEach(btn => {
  btn.classList.add("active", typeEarningsClass);
});



 // === Sätt standardläge om mode saknas ===
if (!currentModeGraphEarnings  || !currentModeGraphEarnings) {
  currentModeGraphEarnings = "average"; // går även att vänta tills användaren klickar på en knapp
}


  // === Lägg till aktiv stil för Over Time/All baserat på typ + mode ===
const modeEarningsBtnClass = currentModeGraphEarnings === "average" ? ".btn-over-all-earn" : ".btn-over-time-earn";
const earningActiveClass = currentTypeGraphEarnings === "gender" ? "gender-active" : "ethnicity-active";

document.querySelectorAll(modeEarningsBtnClass).forEach(btn => {
  btn.classList.add(earningActiveClass, "active");
});



  // === Välj data baserat på val ===
  let data;

  if (currentModeGraphEarnings === "average") {
    data = currentTypeGraphEarnings === "gender"
      ? dataSetAvgEarningsGender
      : dataSetAvgEarningsEthnicity;
  } else {
    data = currentTypeGraphEarnings === "gender"
      ? dataSetCitiesGen[0].data 
      : dataSetCitiesEth[0].data;
  }

  // === Rendera diagrammet ===
  renderEarningsGraphChart(data, currentTypeGraphEarnings, currentModeGraphEarnings);
}

updateEarningsChart(); // Renderar sidan när den laddas




// ================================ FÖRSTA GRAFEN SLUTAR ===========================================







// ========================= ANDRA GRAFEN BÖRJAR =======================================================




// === CREATE FUNCTION renderGigsBarChart === Som skapar stapeldiagram och linjediagram ===


function renderGigsGraphChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-plays");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 50, right: 20, bottom: 50, left: 50 };
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

    const gigsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalGigs)])
      .nice()
      .range([innerHeight, 0]);

    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(gigsYScale));
    
    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(categoryXScale));

    const gigsBars = chartGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))
      .attr("y", d => gigsYScale(d.totalGigs))
      .attr("width", categoryXScale.bandwidth())
      .attr("height", d => innerHeight - gigsYScale(d.totalGigs))
      .attr("fill", d => colorScale(d[type]));

    // === TEXT OVANFÖR STAPLAR ===
      chartGroup.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
        .attr("y", d => gigsYScale(d.totalGigs) - 5)  // lite ovanför stapeln
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .text(d => d.totalGigs.toFixed(0)); // eller .toFixed(1) om du vill ha decimal
    

  } else {


    const gigCategories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    const gigsLineData = transformToLineData(data, gigCategories);

    const yearXScaleLine = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);

    const gigsYScaleLine = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(gigCategories, cat => d[cat]))])
      .nice()
      .range([innerHeight, 0]);

    const xGigsAxisLine = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d")));

    const yGigsAxisLine = chartGroup.append("g").call(d3.axisLeft(gigsYScaleLine));

    const gigsLinePathFunction = d3.line()
      .x(d => yearXScaleLine(d.year))
      .y(d => gigsYScaleLine(d.value));

    
    // ==================== Kod utan animation =========================  
    // const gigsLine = chartGroup.selectAll(".line")
    //   .data(gigsLineData)
    //   .enter()
    //   .append("path")
    //   .attr("class", "line")
    //   .attr("d", d => gigsLinePathFunction(d.values))
    //   .attr("fill", "none")
    //   .attr("stroke", d => colorScale(d.category))
    //   .attr("stroke-width", 2);

    // gigsLineData.forEach(categoryGroup => {
    //   chartGroup.selectAll(`.circle-${categoryGroup.category}`)
    //     .data(categoryGroup.values)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => yearXScaleLine(d.year))
    //     .attr("cy", d => gigsYScaleLine(d.value))
    //     .attr("r", 5) //3
    //     .attr("fill", colorScale(categoryGroup.category));
    // });




    const gigsLine = chartGroup.selectAll(".line")
      .data(gigsLineData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", d => gigsLinePathFunction(d.values))
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.category))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", function() {  // stroke-dasharray sätter en "osynlig" linje med exakt samma längd som linjen.
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function() {  // stroke-dashoffset flyttar ut hela linjen ur synfältet.
        return this.getTotalLength();
      })
      .transition()  // .transition() animerar tillbaka stroke-dashoffset till 0 → linjen ritas upp framför ögonen.
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);


      gigsLineData.forEach(categoryGroup => {
        chartGroup.selectAll(`.circle-${categoryGroup.category}`)
          .data(categoryGroup.values)
          .enter()
          .append("circle")
          .attr("cx", d => yearXScaleLine(d.year))
          .attr("cy", d => gigsYScaleLine(d.value))
          .attr("r", 0) // Börjar som osynlig liten cirkel
          .attr("fill", colorScale(categoryGroup.category))
          .transition()
          .duration(2500)
          .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt
          .attr("r", 5); // Växer upp till vanlig storlek
      });  

  }

  // === Titlar ===
  const graphGigsTitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "1rem")
    .text(mode === "average"
      ? `Total Gigs by ${type === "gender" ? "Gender" : "Ethnicity"}`
      : `Gigs Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

  const chartGigsSubtitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "0.8rem")
    .attr("fill", "#666")
    .text(mode === "average"
      ? `Shows total number of gigs per ${type === "gender" ? "gender group" : "ethnic group"}`
      : `Shows how many gigs each ${type === "gender" ? "gender group" : "ethnic group"} got per year`);
}






let currentTypeGraphGigs = "ethnicity";       // "gender" eller "ethnicity"
let currentModeGraphGigs = "average";         // "average" eller "time"

document.querySelectorAll(".btn--gigs--gender").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTypeGraphGigs = currentTypeGraphGigs === "gender" ? null : "gender"; 
    updateGigsChart();
  });
});

document.querySelectorAll(".btn--gigs--ethnicity").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTypeGraphGigs = currentTypeGraphGigs === "ethnicity" ? null : "ethnicity";
    updateGigsChart();
  });
});

document.querySelectorAll(".btn-over-time-gigs").forEach(btn => {
  btn.addEventListener("click", () => {
    currentModeGraphGigs = currentModeGraphGigs === "time" ? null : "time";
    updateGigsChart();
  });
});

document.querySelectorAll(".btn-over-all-gigs").forEach(btn => {
  btn.addEventListener("click", () => {
    currentModeGraphGigs = currentModeGraphGigs === "average" ? null : "average";
    updateGigsChart();
  });
});



function updateGigsChart() {
  // === Rensa aktiva klasser på alla knappar ===
  document.querySelectorAll(".btn--gigs--gender, .btn--gigs--ethnicity").forEach(btn => {
    btn.classList.remove("gender-active", "ethnicity-active", "active");
  });

  document.querySelectorAll(".btn-over-time-gigs, .btn-over-all-gigs").forEach(btn => {
    btn.classList.remove("gender-active", "ethnicity-active", "active");
  });

  // === Om ingen typ är vald, rensa graf och avsluta ===
  if (!currentTypeGraphGigs) {
    d3.select("#chart-plays").selectAll("*").remove();
    return;
  }

  // === Lägg till korrekt aktiv klass för typ-knappen ===
  const typeGigsClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";
  document.querySelectorAll(`.btn--gigs--${currentTypeGraphGigs}`).forEach(btn => {
    btn.classList.add("active", typeGigsClass);
  });

  
  if (!currentModeGraphGigs) {
    currentModeGraphGigs = "average";
  }

//   //Toggel?!
//   if (!currentModeGraphGigs || !currentTypeGraphGigs) {
//   d3.select("#chart-plays").selectAll("*").remove(); // Rensa grafen
//   return;
// }

  // === Lägg till korrekt aktiv klass för mode-knappen ===
  const modeGigsBtnClass = currentModeGraphGigs === "average" ? ".btn-over-all-gigs" : ".btn-over-time-gigs";
  const modeClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";

  document.querySelectorAll(modeGigsBtnClass).forEach(btn => {
    btn.classList.add(modeClass, "active");
  });

  // === Välj korrekt data ===
  let data;
  if (currentModeGraphGigs === "average") {
    data = currentTypeGraphGigs === "gender"
      ? dataSetTotalGigsGender
      : dataSetTotalGigsEthnicity;
  } else {
    data = currentTypeGraphGigs === "gender"
      ? dataSetProducersGen[0].data
      : dataSetProducersEth[0].data;
  }

  // === Rendera graf ===
  renderGigsGraphChart(data, currentTypeGraphGigs, currentModeGraphGigs);
}

updateGigsChart();



//==============================================================================================

import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset, getMaxValueDataset,  transformToLineData} from '../data/auxfunctions.js';



//let currentType = null;     // gender eller ethnicity eller null
//let currentMode = null;     // average eller time eller null



// // === CREATE FUNCTION renderEarningsBarChart === Som skapar stapeldiagram och linjediagram ===

// export function renderEarningsGraphChart(data, type = "gender", mode = "average") {

//   const svg = d3.select("#chart-earnings");
//   svg.selectAll("*").remove();  // Tömma SVG och rita nytt


//   // == GRUNDINSTÄLLNINGAR ==
//   // SVG-storleken och definierar marginaler för axlar och text.
//   const width = +svg.attr("width");   // +svg = Omvandlar "800" (sträng) till 800 (tal)
//   const height = +svg.attr("height");
//   const margin = { top: 50, right: 20, bottom: 50, left: 50 };

//   // Definerar utrymmet inre ritområdet – utrymmet där själva diagrammet får plats.
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;

//   // == APPEND GROUP ==
//   // Skapar en grupp i SVG som vi kan rita i.
//   // Skapar en <g>-grupp och flyttar hela grafen inåt så att den inte kolliderar med marginalerna.
//   const chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // == Fasta färger per kategori (kön eller etnicitet) ==
//   // Skapa en färgskala för kön och etnicitet. Ordningen är viktig: den matchar datavärdena. 
//   const colorScale = d3.scaleOrdinal()
//     .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
//     .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);
  
//   // === MODE === 
//   // mode === "average" – en stapel per kategori
//   if (mode === "average") {
//     // categoryXScale = skala för kön eller etnicitet på X-axeln.
//     // X-skalan visar t.ex. "lambda", "theta", "omicron" (eller motsvarande etniciteter).
//     // d3.scaleBand används för kategorisk data med jämnt fördelat utrymme.
//     const categoryXScale = d3.scaleBand()
//       .domain(data.map(d => d[type]))  // t.ex. ["lambda", "theta", "omicron"]
//       .range([0, innerWidth])
//       .padding(0.2);

//     // earningsYScale = skala för pengar på Y-axeln (0 kr → max kr)
//     // Y-skalan går från 0 till högsta värdet i earnings.
//     // Notera att SVG-axeln går från top → bottom, så range är omvänt!
//     const earningsYScale = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.earnings)])
//       .nice() // Rundar av skalans max-värde ex. 50.5 blir 51
//       .range([innerHeight, 0]);

//     // === APPEND AXES ===
//     // Skapar X- och Y-axlar.
//     // Y-axel
//     const yAxis = chartGroup.append("g")
//       .call(d3.axisLeft(earningsYScale));

//     // X-axel
//     const xAxis = chartGroup.append("g")
//       .attr("transform", `translate(0, ${innerHeight})`)
//       .call(d3.axisBottom(categoryXScale));


//     // === ENTER/UPDATE/EXIT FÖR STAPLAR ===
//     const earningsBars = chartGroup.selectAll(".bar")
//       .data(data, d => d[type]);

//     earningsBars.transition()  // UPDATE  transition() körs på befintliga element
//       .duration(1500)
//       .attr("x", d => categoryXScale(d[type]))
//       .attr("width", categoryXScale.bandwidth())
//       .attr("y", d => earningsYScale(d.earnings))
//       .attr("height", d => innerHeight - earningsYScale(d.earnings))
//       .attr("fill", d => colorScale(d[type]));

//     earningsBars.enter()  // ENTER  enter() körs på nya element
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", d => categoryXScale(d[type]))
//       .attr("width", categoryXScale.bandwidth())
//       .attr("y", innerHeight)
//       .attr("height", 0)
//       .attr("fill", d => colorScale(d[type]))
//       .style("opacity", 0)
//       .transition()
//       .duration(1500)
//       .delay((_, i) => i * 100)
//       .style("opacity", 1)
//       .attr("y", d => earningsYScale(d.earnings))
//       .attr("height", d => innerHeight - earningsYScale(d.earnings)); // d.earnings används för stapelhöjd

//     earningsBars.exit()   // EXIT
//       .transition()
//       .duration(800)
//       .style("opacity", 0)
//       .remove();

//     // === ENTER/UPDATE/EXIT FÖR TEXTER === // === TEXT OVANFÖR STAPLAR ===
//     const earningsLabels = chartGroup.selectAll(".bar-label")
//       .data(data, d => d[type]);

//     earningsLabels.transition()
//       .duration(1500)
//       .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//       .attr("y", d => earningsYScale(d.earnings) - 10)
//       .text(d => d.earnings.toFixed(0));

//     earningsLabels.enter()
//       .append("text")
//       .attr("class", "bar-label")
//       .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//       .attr("y", innerHeight - 5)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "12px")
//       .attr("fill", "#333")
//       .style("opacity", 0)
//       .text(d => d.earnings.toFixed(0)) // eller .toFixed(1) om du vill ha decimal
//       .transition()
//       .duration(1500)
//       .delay((_, i) => i * 100)
//       .style("opacity", 1)
//       .attr("y", d => earningsYScale(d.earnings) - 10);  // text lite ovanför stapeln

//     earningsLabels.exit()
//       .transition()
//       .duration(800)
//       .style("opacity", 0)
//       .remove();
  

//     // // Staplar - BARS - Earnings  == Här ritas staplarna ut
//     // const earningsBars = chartGroup.selectAll(".bar")
//     //   .data(data)
//     //   .enter()
//     //   .append("rect")
//     //   .attr("class", "bar")
//     //   .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
//     //   .attr("y", innerHeight)
//     //   .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
//     //   .attr("height", 0)
//     //   .attr("fill", d => colorScale(d[type]))  // Färg baserat på kategori (kön eller etnicitet)
//     //   .style("opacity", 0)
//     //   .transition()
//     //   .duration(1500)
//     //   .delay((_, i) => i * 100)  // Stagger för att komma en efter en
//     //   .ease(d3.easeExpOut)
//     //   .attr("y", d => earningsYScale(d.earnings))  // .y utgår från earnings, dvs. 0 kr → max kr
//     //   .attr("height", d => innerHeight - earningsYScale(d.earnings))  // d.earnings används för stapelhöjd
//     //   .style("opacity", 1);


//     // // Koden utan Animation
//     // //  // Staplar - BARS - Earnings  == Här ritas staplarna ut
//     // // const earningsBars = chartGroup.selectAll(".bar")
//     // //   .data(data)
//     // //   .enter()
//     // //   .append("rect")
//     // //   .attr("class", "bar")
//     // //   .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
//     // //   .attr("y", d => earningsYScale(d.earnings)) // .y utgår från earnings, dvs. 0 kr → max kr
//     // //   .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
//     // //   .attr("height", d => innerHeight - earningsYScale(d.earnings))  // d.earnings används för stapelhöjd
//     // //   .attr("fill", d => colorScale(d[type]));  // Färg baserat på kategori (kön eller etnicitet)


//     // // === TEXT OVANFÖR STAPLAR ===
//     //   chartGroup.selectAll(".bar-label")
//     //     .data(data)
//     //     .enter()
//     //     .append("text")
//     //     .attr("class", "bar-label")
//     //     .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//     //     .attr("y", d => earningsYScale(d.earnings) - 5)  // lite ovanför stapeln
//     //     .attr("text-anchor", "middle")
//     //     .attr("font-size", "12px")
//     //     .attr("fill", "#333")
//     //     .text(d => d.earnings.toFixed(0)); // eller .toFixed(1) om du vill ha decimal



//       // === LINJEDIAGRAM ===
//       // Om mode === "time", ritar vi ett linjediagram som visar utvecklingen 
//       // av inkomst (eller annan variabel) över tid, för varje kategori (kön eller etnicitet).    

//   } else {

//     // === DEFINIERA KATEGORIER ===
//     // Beroende på om vi tittar på kön eller etnicitet, väljer vi de kategorier vi vill visa linjer för.
//     // t.ex. ["lambda", "theta", "omicron"] eller ["psi", "rho", "tau"]
//     const earningsCategories = type === "gender"
//       ? ["lambda", "theta", "omicron"]
//       : ["psi", "rho", "tau"];

//     // === TRANSFORMERA DATA ===
//     // Vi gör om årsbaserad tabell-data till en struktur per kategori: 
//     // Input: Vi omformar data från [{ year: 2015, lambda: 300, ... }, ...]
//     // Output: till ett format per kategori: [{ category: "lambda", values: [ { year: ..., value: ... }, ... ] }]
//     const earningsLineData = transformToLineData(data, earningsCategories);

//     // === SKALA FÖR X-AXELN (år = tidslinje) ===
//     // Skapar en linjär skala från första till sista år i datan.
//     const yearXScaleLine = d3.scaleLinear()
//       .domain(d3.extent(data, d => d.year))  // [minYear, maxYear] t.ex. [2015, 2024]
//       .range([0, innerWidth]);  // Plats fördelas över bredden av diagrammet

//     // === SKALA FÖR Y-AXELN (inkomst) ===
//     // Hittar det högsta värdet i hela datasättet, i alla kategorier över alla år.
//     const earningsYScaleLine = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d3.max(earningsCategories, cat => d[cat]))])
//       .nice()  // Rundar av skalans max-värde ex. 50.5 blir 51
//       .range([innerHeight, 0]); // SVG-ytan ritas från top (0) till bottom (innerHeight)

//     // === AXLAR ===
//     // Skapar X- och Y-axlar.
//     // Ritar ut X-axeln längst ner (tidslinjen)
//     const xAxisLine = chartGroup.append("g")
//       .attr("transform", `translate(0, ${innerHeight})`)  // Flytta X-axeln till botten av grafytan
//       .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d"))); // "d" = visa heltal == visa årtal som heltal

//     // Ritar ut Y-axeln till vänster (inkomst)
//     const yAxisLine = chartGroup.append("g")
//       .call(d3.axisLeft(earningsYScaleLine)); // Rita Y-axel till vänster

//     // === LINJE FUNKTION ===
//     // En funktion som ritar en linje från x och y-koordinater
//     // Skapar en linje-funktion. Funktionen som tar in [{year, value}, ...] och returnerar en SVG-path
//     // Använder X- och Y-skalan för att omvandla data till koordinater
//     const earningsLinePathFunction = d3.line()
//       .x(d => yearXScaleLine(d.year))  // konverterar årtal till X-position
//       .y(d => earningsYScaleLine(d.value));  // konverterar earnings till Y-position


//     // ==================== Kod utan animation =========================   
//     // // === LINJER ===
//     // // Ritar en path-linje => för varje kategori (t.ex. "lambda", "theta" ...) ritas en linje baserat på den data vi har.
//     // const earningsLines = chartGroup.selectAll(".line")
//     //   .data(earningsLineData)  // en array med ett objekt per kategori (kön eller etnicitet)
//     //   .enter() // ett utrymme att skapa nya element för varje datapost => .enter() returnerar ett utrymme som ett visuellt element
//     //   .append("path") // Skapar ett nytt <path>-element i SVG för varje datapost (t.ex. ett för lambda, ett för theta, etc). Varje linje representerar en kategori
//     //   .attr("class", "line")  // ger alla paths CSS-klassen "line" (för ev. styling).
//     //   .attr("d", d => earningsLinePathFunction(d.values))  // Ritar linje baserat på d.values = [{year, value}, ...]
//     //   .attr("fill", "none")  // Ingen fyllnad, bara linje
//     //   .attr("stroke", d => colorScale(d.category))  // Färg baserat på kategori (kön eller etnicitet)
//     //   .attr("stroke-width", 2);  // Tjocklek

//     //   // === CIRKLAR FÖR VARJE DATAPUNKT ===
//     //   // Går igenom varje kategori och ritar en cirkel för varje år i kategorin.
//     //   earningsLineData.forEach(categoryGroup => {
//     //     chartGroup.selectAll(`.circle-${categoryGroup.category}`)
//     //       .data(categoryGroup.values) // [{year, value}, ...]
//     //       .enter() 
//     //       .append("circle") 
//     //       .attr("cx", d => yearXScaleLine(d.year))  // placera cirkel horisontellt
//     //       .attr("cy", d => earningsYScaleLine(d.value))  // placera cirkel vertikalt
//     //       .attr("r", 5)  // radie på punkten 3
//     //       .attr("fill", colorScale(categoryGroup.category));
//     //   });



//     // // === LINJER ===
//     // // Ritar en path-linje => för varje kategori (t.ex. "lambda", "theta" ...) ritas en linje baserat på den data vi har.
//     const earningsLines = chartGroup.selectAll(".line")
//       .data(earningsLineData) // en array med ett objekt per kategori (kön eller etnicitet)
//       .enter()  // ett utrymme att skapa nya element för varje datapost => .enter() returnerar ett utrymme som ett visuellt element
//       .append("path")  // Skapar ett nytt <path>-element i SVG för varje datapost (t.ex. ett för lambda, ett för theta, etc). Varje linje representerar en kategori
//       .attr("class", "line")   // ger alla paths CSS-klassen "line" (för ev. styling).
//       .attr("d", d => earningsLinePathFunction(d.values))  // Ritar linje baserat på d.values = [{year, value}, ...]
//       .attr("fill", "none")  // Ingen fyllnad, bara linje
//       .attr("stroke", d => colorScale(d.category))  // Färg baserat på kategori (kön eller etnicitet)
//       .attr("stroke-width", 2)  // Tjocklek
//       .attr("stroke-dasharray", function() {  // stroke-dasharray sätter en "osynlig" linje med exakt samma längd som linjen.
//         return this.getTotalLength();
//       })
//       .attr("stroke-dashoffset", function() {  // stroke-dashoffset flyttar ut hela linjen ur synfältet.
//         return this.getTotalLength();
//       })
//       .transition()  // .transition() animerar tillbaka stroke-dashoffset till 0 → linjen ritas upp framför ögonen.
//       .duration(1500)
//       .ease(d3.easeLinear)
//       .attr("stroke-dashoffset", 0);


//       // === CIRKLAR FÖR VARJE DATAPUNKT ===
//      // Går igenom varje kategori och ritar en cirkel för varje år i kategorin.
//       earningsLineData.forEach(categoryGroup => {
//         chartGroup.selectAll(`.circle-${categoryGroup.category}`)
//           .data(categoryGroup.values)  // [{year, value}, ...]
//           .enter()
//           .append("circle")
//           .attr("cx", d => yearXScaleLine(d.year))  // placera cirkel horisontellt
//           .attr("cy", d => earningsYScaleLine(d.value))  // placera cirkel vertikalt
//           .attr("r", 0) // Börjar som osynlig liten cirkel
//           .attr("fill", colorScale(categoryGroup.category))
//           .transition()  // .transition().duration(500)	Animera varje cirkel
//           .duration(2500)
//           .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt - Varje punkt kommer lite efter föregående
//           .attr("r", 5); // Växer upp till vanlig storlek
//       });

//     }


//     // === TITEL ===
//     // En text-element i SVG. Skapar en dynamisk rubrik högst upp i grafen som visar vilken typ av graf som visas.
//     const graphEarnTitle = svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", 15)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "1rem")
//       .text(mode === "average"
//         ? `Average DJ Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`
//         : `DJ Earnings Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

//     const chartEarnSubtitle = svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", 30)  // Lite under huvudrubriken
//     .attr("text-anchor", "middle")
//     .attr("font-size", "0.8rem")
//     .attr("fill", "#666")
//     .text(mode === "average"
//       ? `Shows average income per ${type === "gender" ? "gender group" : "ethnic group"} across all gigs.`
//       : `Shows income trend per ${type === "gender" ? "gender group" : "ethnic group"} over time.`);

// }




// let currentTypeGraphEarnings = "ethnicity";     // "gender" eller "ethnicity"
// let currentModeGraphEarnings = "average";      // "average" eller "time"



// // == FUNKTION TILL ATT UPPDATERA GRAFEN ==
// export function updateEarningsChart() {

//     // === Ta bort alla knappar först ===
//   document.querySelectorAll(".btn--earn--gender, .btn--earn--ethnicity").forEach(btn => {
//     btn.classList.remove("active");
//   });
  
//   document.querySelectorAll(".btn-over-time-earn, .btn-over-all-earn").forEach(btn => {
//     btn.classList.remove("gender-active", "ethnicity-active", "active");
//   });
  
//     // === Om ingen typ är vald, rensa grafen och avsluta ===
//   if (!currentTypeGraphEarnings) {
//     d3.select("#chart-earnings").selectAll("*").remove(); // Rensa diagram om ingen typ vald
//     return;
//   }
  
//    // === Lägg till korrekt aktiv klass för typ ===
//   document.querySelectorAll(".btn--earn--gender, .btn--earn--ethnicity").forEach(btn => {
//     btn.classList.remove("gender-active", "ethnicity-active", "active");
//   });
  
//   const typeEarningsClass = currentTypeGraphEarnings === "gender" ? "gender-active" : "ethnicity-active";
  
//   document.querySelectorAll(`.btn--earn--${currentTypeGraphEarnings}`).forEach(btn => {
//     btn.classList.add("active", typeEarningsClass);
//   });
  
  
  
//    // === Sätt standardläge om mode saknas ===
//   if (!currentModeGraphEarnings  || !currentModeGraphEarnings) {
//     currentModeGraphEarnings = "average"; // går även att vänta tills användaren klickar på en knapp
//   }
  
  
//     // === Lägg till aktiv stil för Over Time/All baserat på typ + mode ===
//   const modeEarningsBtnClass = currentModeGraphEarnings === "average" ? ".btn-over-all-earn" : ".btn-over-time-earn";
//   const earningActiveClass = currentTypeGraphEarnings === "gender" ? "gender-active" : "ethnicity-active";
  
//   document.querySelectorAll(modeEarningsBtnClass).forEach(btn => {
//     btn.classList.add(earningActiveClass, "active");
//   });
  
  
  
//     // === Välj data baserat på val ===
//     let data;
  
//     if (currentModeGraphEarnings === "average") {
//       data = currentTypeGraphEarnings === "gender"
//         ? dataSetAvgEarningsGender
//         : dataSetAvgEarningsEthnicity;
//     } else {
//       data = currentTypeGraphEarnings === "gender"
//         ? dataSetCitiesGen[0].data 
//         : dataSetCitiesEth[0].data;
//     }
  
//     // === Rendera diagrammet ===
//     renderEarningsGraphChart(data, currentTypeGraphEarnings, currentModeGraphEarnings);
//   }

//   //Interaktion för total earnings chart


// // === Event listeners för earnings-knapparna ===
// document.querySelector(".btn--earn--gender").addEventListener("click", () => {
//   currentTypeGraphEarnings = currentTypeGraphEarnings === "gender" ? null : "gender"; 
//   updateEarningsChart();
// });
  
// document.querySelector(".btn--earn--ethnicity").addEventListener("click", () => {
//   currentTypeGraphEarnings = currentTypeGraphEarnings === "ethnicity" ? null : "ethnicity";
//   updateEarningsChart();
// });

// document.querySelector(".btn-over-time-earn").addEventListener("click", () => {
//   currentModeGraphEarnings = currentModeGraphEarnings === "time" ? null : "time";
//   updateEarningsChart();
// });

// document.querySelector(".btn-over-all-earn").addEventListener("click", () => {
//   currentModeGraphEarnings = currentModeGraphEarnings === "average" ? null : "average";
//   updateEarningsChart();
// });


//=======================================================================================
// import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
// import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
// import { yearsToAllTimeDataset, getMaxValueDataset, transformToLineData} from '../data/auxfunctions.js';



// // === CREATE FUNCTION renderGigsBarChart === Som skapar stapeldiagram och linjediagram ===


// export function renderGigsGraphChart(data, type = "gender", mode = "average") {

//   const svg = d3.select("#chart-plays");
//   svg.selectAll("*").remove();

//   const width = +svg.attr("width");
//   const height = +svg.attr("height");
//   const margin = { top: 50, right: 20, bottom: 50, left: 50 };
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;

//   const chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   const colorScale = d3.scaleOrdinal()
//     .domain(["lambda", "theta", "omicron", "tau", "psi", "rho"])
//     .range(["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]);

//   if (mode === "average") {
//     const categoryXScale = d3.scaleBand()
//       .domain(data.map(d => d[type]))
//       .range([0, innerWidth])
//       .padding(0.2);

//     const gigsYScale = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.totalGigs)])
//       .nice()
//       .range([innerHeight, 0]);

//     const yAxis = chartGroup.append("g")
//       .call(d3.axisLeft(gigsYScale));
    
//     const xAxis = chartGroup.append("g")
//       .attr("transform", `translate(0, ${innerHeight})`)
//       .call(d3.axisBottom(categoryXScale));


//     // === ENTER/UPDATE/EXIT FÖR STAPLAR ===
//     // Staplar - BARS - Earnings  == Här ritas staplarna ut
//     const gigsBars = chartGroup.selectAll(".bar")
//       .data(data, d => d[type]);

//     gigsBars.transition()  // UPDATE  transition() körs på befintliga element
//       .duration(1500)
//       .attr("x", d => categoryXScale(d[type]))
//       .attr("width", categoryXScale.bandwidth())
//       .attr("y", d => earningsYScale(d.earnings))
//       .attr("height", d => innerHeight - earningsYScale(d.earnings))
//       .attr("fill", d => colorScale(d[type]));

//     gigsBars.enter()  // ENTER  enter() körs på nya element
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
//       .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
//       .attr("y", innerHeight)
//       .attr("height", 0)
//       .attr("fill", d => colorScale(d[type]))  // Färg baserat på kategori (kön eller etnicitet)
//       .style("opacity", 0)
//       .transition()
//       .duration(1500)
//       .delay((_, i) => i * 100)
//       .style("opacity", 1)
//       .attr("y", d => gigsYScale(d.totalGigs))   // .y utgår från earnings, dvs. 0 kr → max kr
//       .attr("height", d => innerHeight - gigsYScale(d.totalGigs)); // d.earnings används för stapelhöjd

//     gigsBars.exit()   // EXIT
//       .transition()
//       .duration(800)
//       .style("opacity", 0)
//       .remove();


//     // === ENTER/UPDATE/EXIT FÖR TEXTER === // === TEXT OVANFÖR STAPLAR ===
//     const gigsLabels = chartGroup.selectAll(".bar-label")
//       .data(data, d => d[type]);

//     gigsLabels.transition()
//       .duration(1500)
//       .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//       .attr("y", d => earningsYScale(d.earnings) - 10)
//       .text(d => d.totalGigs.toFixed(0));

//     gigsLabels.enter()
//       .append("text")
//       .attr("class", "bar-label")
//       .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//       .attr("y", innerHeight - 5)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "12px")
//       .attr("fill", "#333")
//       .style("opacity", 0)
//       .text(d => d.totalGigs.toFixed(0)) // eller .toFixed(1) om du vill ha decimal
//       .transition()
//       .duration(1500)
//       .delay((_, i) => i * 100)  // Stagger för att komma en efter en
//       .style("opacity", 1)
//       .attr("y", d => gigsYScale(d.totalGigs) - 10);  // text lite ovanför stapeln

//     gigsLabels.exit()
//       .transition()
//       .duration(800)
//       .style("opacity", 0)
//       .remove();



    
//     // // Staplar - BARS - Earnings  == Här ritas staplarna ut
//     // const gigsBars = chartGroup.selectAll(".bar")
//     //   .data(data)
//     //   .enter()
//     //   .append("rect")
//     //   .attr("class", "bar")
//     //   .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
//     //   .attr("y", innerHeight)
//     //   .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
//     //   .attr("height", 0)
//     //   .attr("fill", d => colorScale(d[type]))  // Färg baserat på kategori (kön eller etnicitet)
//     //   .style("opacity", 0)
//     //   .transition()
//     //   .duration(1500)
//     //   .delay((_, i) => i * 100)  // Stagger för att komma en efter en
//     //   .ease(d3.easeExpOut)
//     //   .attr("y", d => gigsYScale(d.totalGigs))  // .y utgår från earnings, dvs. 0 kr → max kr
//     //   .attr("height", d => innerHeight - gigsYScale(d.totalGigs))  // d.earnings används för stapelhöjd
//     //   .style("opacity", 1);


//     // // const gigsBars = chartGroup.selectAll(".bar")
//     // //   .data(data)
//     // //   .enter()
//     // //   .append("rect")
//     // //   .attr("class", "bar")
//     // //   .attr("x", d => categoryXScale(d[type]))
//     // //   .attr("y", d => gigsYScale(d.totalGigs))
//     // //   .attr("width", categoryXScale.bandwidth())
//     // //   .attr("height", d => innerHeight - gigsYScale(d.totalGigs))
//     // //   .attr("fill", d => colorScale(d[type]));


//     // // === TEXT OVANFÖR STAPLAR ===
//     //   chartGroup.selectAll(".bar-label")
//     //     .data(data)
//     //     .enter()
//     //     .append("text")
//     //     .attr("class", "bar-label")
//     //     .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
//     //     .attr("y", d => gigsYScale(d.totalGigs) - 5)  // lite ovanför stapeln
//     //     .attr("text-anchor", "middle")
//     //     .attr("font-size", "12px")
//     //     .attr("fill", "#333")
//     //     .text(d => d.totalGigs.toFixed(0)); // eller .toFixed(1) om du vill ha decimal
    

//   } else {


//     const gigCategories = type === "gender"
//       ? ["lambda", "theta", "omicron"]
//       : ["psi", "rho", "tau"];

//     const gigsLineData = transformToLineData(data, gigCategories);

//     const yearXScaleLine = d3.scaleLinear()
//       .domain(d3.extent(data, d => d.year))
//       .range([0, innerWidth]);

//     const gigsYScaleLine = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d3.max(gigCategories, cat => d[cat]))])
//       .nice()
//       .range([innerHeight, 0]);

//     const xGigsAxisLine = chartGroup.append("g")
//       .attr("transform", `translate(0, ${innerHeight})`)
//       .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d")));

//     const yGigsAxisLine = chartGroup.append("g").call(d3.axisLeft(gigsYScaleLine));

//     const gigsLinePathFunction = d3.line()
//       .x(d => yearXScaleLine(d.year))
//       .y(d => gigsYScaleLine(d.value));

    
//     // ==================== Kod utan animation =========================  
//     // const gigsLine = chartGroup.selectAll(".line")
//     //   .data(gigsLineData)
//     //   .enter()
//     //   .append("path")
//     //   .attr("class", "line")
//     //   .attr("d", d => gigsLinePathFunction(d.values))
//     //   .attr("fill", "none")
//     //   .attr("stroke", d => colorScale(d.category))
//     //   .attr("stroke-width", 2);

//     // gigsLineData.forEach(categoryGroup => {
//     //   chartGroup.selectAll(`.circle-${categoryGroup.category}`)
//     //     .data(categoryGroup.values)
//     //     .enter()
//     //     .append("circle")
//     //     .attr("cx", d => yearXScaleLine(d.year))
//     //     .attr("cy", d => gigsYScaleLine(d.value))
//     //     .attr("r", 5) //3
//     //     .attr("fill", colorScale(categoryGroup.category));
//     // });




//     const gigsLine = chartGroup.selectAll(".line")
//       .data(gigsLineData)
//       .enter()
//       .append("path")
//       .attr("class", "line")
//       .attr("d", d => gigsLinePathFunction(d.values))
//       .attr("fill", "none")
//       .attr("stroke", d => colorScale(d.category))
//       .attr("stroke-width", 2)
//       .attr("stroke-dasharray", function() {  // stroke-dasharray sätter en "osynlig" linje med exakt samma längd som linjen.
//         return this.getTotalLength();
//       })
//       .attr("stroke-dashoffset", function() {  // stroke-dashoffset flyttar ut hela linjen ur synfältet.
//         return this.getTotalLength();
//       })
//       .transition()  // .transition() animerar tillbaka stroke-dashoffset till 0 → linjen ritas upp framför ögonen.
//       .duration(1500)
//       .ease(d3.easeLinear)
//       .attr("stroke-dashoffset", 0);


//       gigsLineData.forEach(categoryGroup => {
//         chartGroup.selectAll(`.circle-${categoryGroup.category}`)
//           .data(categoryGroup.values)
//           .enter()
//           .append("circle")
//           .attr("cx", d => yearXScaleLine(d.year))
//           .attr("cy", d => gigsYScaleLine(d.value))
//           .attr("r", 0) // Börjar som osynlig liten cirkel
//           .attr("fill", colorScale(categoryGroup.category))
//           .transition()
//           .duration(2500)
//           .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt
//           .attr("r", 5); // Växer upp till vanlig storlek
//       });  
//   }

  
//   // === Titlar ===
//   const graphGigsTitle = svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", 15)
//     .attr("text-anchor", "middle")
//     .attr("font-size", "1rem")
//     .text(mode === "average"
//       ? `Total Gigs by ${type === "gender" ? "Gender" : "Ethnicity"}`
//       : `Gigs Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

//   const chartGigsSubtitle = svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", 30)
//     .attr("text-anchor", "middle")
//     .attr("font-size", "0.8rem")
//     .attr("fill", "#666")
//     .text(mode === "average"
//       ? `Shows total number of gigs per ${type === "gender" ? "gender group" : "ethnic group"}`
//       : `Shows how many gigs each ${type === "gender" ? "gender group" : "ethnic group"} got per year`);

// }
  
  
  
  
  
  
// let currentTypeGraphGigs = "ethnicity";       // "gender" eller "ethnicity"
// let currentModeGraphGigs = "average";         // "average" eller "time"
  
  
  
// export function updateGigsChart() {
//   // === Rensa aktiva klasser på alla knappar ===
//   document.querySelectorAll(".btn--gigs--gender, .btn--gigs--ethnicity").forEach(btn => {
//     btn.classList.remove("gender-active", "ethnicity-active", "active");
//   });

//   document.querySelectorAll(".btn-over-time-gigs, .btn-over-all-gigs").forEach(btn => {
//     btn.classList.remove("gender-active", "ethnicity-active", "active");
//   });

//   // === Om ingen typ är vald, rensa graf och avsluta ===
//   if (!currentTypeGraphGigs) {
//     d3.select("#chart-plays").selectAll("*").remove();
//     return;
//   }

//   // === Lägg till korrekt aktiv klass för typ-knappen ===
//   const typeGigsClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";
//   document.querySelectorAll(`.btn--gigs--${currentTypeGraphGigs}`).forEach(btn => {
//     btn.classList.add("active", typeGigsClass);
//   });

  
//   if (!currentModeGraphGigs) {
//     currentModeGraphGigs = "average";
//   }
  
//   //   //Toggel?!
//   //   if (!currentModeGraphGigs || !currentTypeGraphGigs) {
//   //   d3.select("#chart-plays").selectAll("*").remove(); // Rensa grafen
//   //   return;
//   // }
  
//   // === Lägg till korrekt aktiv klass för mode-knappen ===
//   const modeGigsBtnClass = currentModeGraphGigs === "average" ? ".btn-over-all-gigs" : ".btn-over-time-gigs";
//   const modeClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";

//   document.querySelectorAll(modeGigsBtnClass).forEach(btn => {
//     btn.classList.add(modeClass, "active");
//   });

//   // === Välj korrekt data ===
//   let data;
//   if (currentModeGraphGigs === "average") {
//     data = currentTypeGraphGigs === "gender"
//       ? dataSetTotalGigsGender
//       : dataSetTotalGigsEthnicity;
//   } else {
//     data = currentTypeGraphGigs === "gender"
//       ? dataSetProducersGen[0].data
//       : dataSetProducersEth[0].data;
//   }

//     // === Rendera graf ===
//   renderGigsGraphChart(data, currentTypeGraphGigs, currentModeGraphGigs);
// }


// // === Event listeners för gigs-knapparna ===
// document.querySelectorAll(".btn--gigs--gender").forEach(btn => {
//   btn.addEventListener("click", () => {
//       currentTypeGraphGigs = currentTypeGraphGigs === "gender" ? null : "gender"; 
//       updateGigsChart();
//   });
// });

// document.querySelectorAll(".btn--gigs--ethnicity").forEach(btn => {
//   btn.addEventListener("click", () => {
//       currentTypeGraphGigs = currentTypeGraphGigs === "ethnicity" ? null : "ethnicity";
//       updateGigsChart();
//   });
// });

// document.querySelectorAll(".btn-over-time-gigs").forEach(btn => {
//   btn.addEventListener("click", () => {
//       currentModeGraphGigs = currentModeGraphGigs === "time" ? null : "time";
//       updateGigsChart();
//    });
// });

// document.querySelectorAll(".btn-over-all-gigs").forEach(btn => {
//   btn.addEventListener("click", () => {
//       currentModeGraphGigs = currentModeGraphGigs === "average" ? null : "average";
//       updateGigsChart();
//   });
// });





































/*// === UPPDATERAD DEL: renderEarningsGraphChart med enter/update/exit för stapeldiagram ===

function renderEarningsGraphChart(data, type = "gender", mode = "average") {
  const svg = d3.select("#chart-earnings");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 50, right: 20, bottom: 50, left: 50 };
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

    chartGroup.append("g").call(d3.axisLeft(earningsYScale));
    chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(categoryXScale));

    // === ENTER/UPDATE/EXIT FÖR STAPLAR ===
    const bars = chartGroup.selectAll(".bar")
      .data(data, d => d[type]);

    bars.transition()
      .duration(1000)
      .attr("x", d => categoryXScale(d[type]))
      .attr("width", categoryXScale.bandwidth())
      .attr("y", d => earningsYScale(d.earnings))
      .attr("height", d => innerHeight - earningsYScale(d.earnings))
      .attr("fill", d => colorScale(d[type]));

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))
      .attr("width", categoryXScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => colorScale(d[type]))
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attr("y", d => earningsYScale(d.earnings))
      .attr("height", d => innerHeight - earningsYScale(d.earnings));

    bars.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .remove();

    // === ENTER/UPDATE/EXIT FÖR TEXTER ===
    const labels = chartGroup.selectAll(".bar-label")
      .data(data, d => d[type]);

    labels.transition()
      .duration(1000)
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", d => earningsYScale(d.earnings) - 5)
      .text(d => d.earnings.toFixed(0));

    labels.enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", innerHeight - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .style("opacity", 0)
      .text(d => d.earnings.toFixed(0))
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attr("y", d => earningsYScale(d.earnings) - 5);

    labels.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .remove();

    // === TITEL ===
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "1rem")
      .text(`Average DJ Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8rem")
      .attr("fill", "#666")
      .text(`Shows average income per ${type === "gender" ? "gender group" : "ethnic group"} across all gigs.`);
  }
}
 */












// =============================== Kod fungerar staplar =================================================


/*
function renderGigsGraphChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-plays");
  svg.selectAll("*").remove();  // Tömma SVG och rita nytt


  // == GRUNDINSTÄLLNINGAR ==
  // SVG-storleken och definierar marginaler för axlar och text.
  const width = +svg.attr("width");   // +svg = Omvandlar "800" (sträng) till 800 (tal)
  const height = +svg.attr("height");
  const margin = { top: 50, right: 20, bottom: 50, left: 50 };

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
    const gigsYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.earnings)])
      .nice() // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]);

    // === APPEND AXES ===
    // Skapar X- och Y-axlar.
    // Y-axel
    const yAxis = chartGroup.append("g")
      .call(d3.axisLeft(gigsYScale));

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
      .attr("y", d => gigsYScale(d.earnings)) // .y utgår från gigs, dvs. 0 kr → max kr
      .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
      .attr("height", d => innerHeight - gigsYScale(d.gigs))  // d.earnings används för stapelhöjd
      .attr("fill", d => colorScale(d[type]));  // Färg baserat på kategori (kön eller etnicitet)


      // === LINJEDIAGRAM ===
// Om mode === "time", ritar vi ett linjediagram som visar utvecklingen 
// av inkomst (eller annan variabel) över tid, för varje kategori (kön eller etnicitet).    

  } else {

    // === DEFINIERA KATEGORIER ===
    // Beroende på om vi tittar på kön eller etnicitet, väljer vi de kategorier vi vill visa linjer för.
    // t.ex. ["lambda", "theta", "omicron"] eller ["psi", "rho", "tau"]
    const earningsCategories = type === "gender"
      ? ["lambda", "theta", "omicron"]
      : ["psi", "rho", "tau"];

    // === TRANSFORMERA DATA ===
    // Vi gör om årsbaserad tabell-data till en struktur per kategori: 
    // Input: Vi omformar data från [{ year: 2015, lambda: 300, ... }, ...]
    // Output: till ett format per kategori: [{ category: "lambda", values: [ { year: ..., value: ... }, ... ] }]
    const earningsLineData = transformToLineData(data, earningsCategories);

    // === SKALA FÖR X-AXELN (år = tidslinje) ===
    // Skapar en linjär skala från första till sista år i datan.
    const yearXScaleLine = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))  // [minYear, maxYear] t.ex. [2015, 2024]
      .range([0, innerWidth]);  // Plats fördelas över bredden av diagrammet

    // === SKALA FÖR Y-AXELN (inkomst) ===
    // Hittar det högsta värdet i hela datasättet, i alla kategorier över alla år.
    const earningsYScaleLine = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(earningsCategories, cat => d[cat]))])
      .nice()  // Rundar av skalans max-värde ex. 50.5 blir 51
      .range([innerHeight, 0]); // SVG-ytan ritas från top (0) till bottom (innerHeight)

    // === AXLAR ===
    // Skapar X- och Y-axlar.
    // Ritar ut X-axeln längst ner (tidslinjen)
    const xAxisLine = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)  // Flytta X-axeln till botten av grafytan
      .call(d3.axisBottom(yearXScaleLine).tickFormat(d3.format("d"))); // "d" = visa heltal == visa årtal som heltal

    // Ritar ut Y-axeln till vänster (inkomst)
    const yAxisLine = chartGroup.append("g")
      .call(d3.axisLeft(earningsYScaleLine)); // Rita Y-axel till vänster

    // === LINJE FUNKTION ===
    // En funktion som ritar en linje från x och y-koordinater
    // Skapar en linje-funktion. Funktionen som tar in [{year, value}, ...] och returnerar en SVG-path
    // Använder X- och Y-skalan för att omvandla data till koordinater
    const linePathFunction = d3.line()
      .x(d => yearXScaleLine(d.year))  // konverterar årtal till X-position
      .y(d => earningsYScaleLine(d.value));  // konverterar earnings till Y-position

    // === LINJER ===
    // Ritar en path-linje => för varje kategori (t.ex. "lambda", "theta" ...) ritas en linje baserat på den data vi har.
    const earningsLines = chartGroup.selectAll(".line")
      .data(earningsLineData)  // en array med ett objekt per kategori (kön eller etnicitet)
      .enter() // ett utrymme att skapa nya element för varje datapost => .enter() returnerar ett utrymme som ett visuellt element
      .append("path") // Skapar ett nytt <path>-element i SVG för varje datapost (t.ex. ett för lambda, ett för theta, etc). Varje linje representerar en kategori
      .attr("class", "line")  // ger alla paths CSS-klassen "line" (för ev. styling).
      .attr("d", d => linePathFunction(d.values))  // Ritar linje baserat på d.values = [{year, value}, ...]
      .attr("fill", "none")  // Ingen fyllnad, bara linje
      .attr("stroke", d => colorScale(d.category))  // Färg baserat på kategori (kön eller etnicitet)
      .attr("stroke-width", 2);  // Tjocklek

    // === CIRKLAR FÖR VARJE DATAPUNKT ===
    // Går igenom varje kategori och ritar en cirkel för varje år i kategorin.
    earningsLineData.forEach(categoryGroup => {
      chartGroup.selectAll(`.circle-${categoryGroup.category}`)
        .data(categoryGroup.values) // [{year, value}, ...]
        .enter() 
        .append("circle") 
        .attr("cx", d => yearXScaleLine(d.year))  // placera cirkel horisontellt
        .attr("cy", d => earningsYScaleLine(d.value))  // placera cirkel vertikalt
        .attr("r", 3)  // radie på punkten
        .attr("fill", colorScale(categoryGroup.category));
    });

    // === TITEL ===
    // En text-element i SVG. Skapar en dynamisk rubrik högst upp i grafen som visar vilken typ av graf som visas.
    const graphTitle = svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "1rem")
      .text(mode === "average"
        ? `Average DJ Earnings by ${type === "gender" ? "Gender" : "Ethnicity"}`
        : `DJ Earnings Over Time by ${type === "gender" ? "Gender" : "Ethnicity"}`);

    const chartSubtitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)  // Lite under huvudrubriken
    .attr("text-anchor", "middle")
    .attr("font-size", "0.8rem")
    .attr("fill", "#666")
    .text(mode === "average"
      ? `Shows average income per ${type === "gender" ? "gender group" : "ethnic group"} across all gigs.`
      : `Shows income trend per ${type === "gender" ? "gender group" : "ethnic group"} over time.`);

    }

}



// == FUNKTION TILL ATT TRANSFORMERA DATA (linjegraf) ==
function transformToLineData(data, categories) {
  return categories.map(category => ({
    category,
    values: data.map(d => ({
      year: d.year,
      value: d[category]
    }))
  }));
}



let currentTypeGraphGigs = "ethnicity";       // "gender" eller "ethnicity"
let currentModeGraphgigs = "average";      // "average" eller "time"
//let currentSource = "";           //  "city", "producer"
//let currentID = null;             // ID vid city/producer

//let currentType = null;     // gender eller ethnicity eller null
//let currentMode = null;     // average eller time eller null
//let currentSource = null;   // city eller producer eller null
//let currentID = null;       // ID vid city/producer


// === Event listeners för earnings-knapparna ===
document.querySelector(".btn--gender").addEventListener("click", () => {
  currentTypeGraphGigs= currentTypeGraphGigs === "gender" ? null : "gender"; 
  updateChart();
});

document.querySelector(".btn--ethnicity").addEventListener("click", () => {
  currentTypeGraphGigs = currentTypeGraphGigs === "ethnicity" ? null : "ethnicity";
  updateChart();
});

document.querySelector(".btn-over-time").addEventListener("click", () => {
  currentModeGraphGigs = currentModeGraphGigs === "time" ? null : "time";
  updateChart();
});

document.querySelector(".btn-over-all").addEventListener("click", () => {
  currentModeGraphGigs = currentModeGraphGigs === "average" ? null : "average";
  updateChart();
});



// == FUNKTION TILL ATT UPPDATERA GRAFEN ==
function updateGigsChart() {

  // === Ta bort alla knappar först ===
document.querySelectorAll(".btn--gender, .btn--ethnicity").forEach(btn => {
  btn.classList.remove("active");
});

document.querySelectorAll(".btn-over-time, .btn-over-all").forEach(btn => {
  btn.classList.remove("gender-active", "ethnicity-active", "active");
});

  // === Om ingen typ är vald, rensa grafen och avsluta ===
if (!currentTypeGraphGigs) {
  d3.select("#chart-earnings").selectAll("*").remove(); // Rensa diagram om ingen typ vald
  return;
}

 // === Lägg till korrekt aktiv klass för typ ===
document.querySelectorAll(".btn--gender, .btn--ethnicity").forEach(btn => {
  btn.classList.remove("gender-active", "ethnicity-active", "active");
});

const typeClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";

document.querySelectorAll(`.btn--${currentTypeGraphGigs}`).forEach(btn => {
  btn.classList.add("active", typeClass);
});



 // === Sätt standardläge om mode saknas ===
if (!currentModeGraphGigs  || !currentModeGraphGigs) {
  currentModeGraphGigs = "average"; // går även att vänta tills användaren klickar på en knapp
}


  // === Lägg till aktiv stil för Over Time/All baserat på typ + mode ===
const modeBtnClass = currentModeGraphGigs === "average" ? ".btn-over-all" : ".btn-over-time";
const activeClass = currentTypeGraphGigs === "gender" ? "gender-active" : "ethnicity-active";

document.querySelectorAll(modeBtnClass).forEach(btn => {
  btn.classList.add(activeClass, "active");
});



  // === Välj data baserat på val ===
  let data;

  if (currentModeGraphGigs === "average") {
    data = currentTypeGraphGigs === "gender"
      ? dataSetTotalGigsGender
      : dataSetTotalGigsEthnicity;
  } else {
    data = currentTypeGraphGigs === "gender"
      ? dataSetCitiesGen[0].data 
      : dataSetCitiesEth[0].data;
  }

  // === Rendera diagrammet ===
  renderGigsGraphChart(data, currentTypeGraphGigs, currentModeGraphGigs);
}

updateGigsChart(); // Renderar sidan när den laddas



*/
















// ===============================================================================================


/*  

 OBS!! Denna funktionen är samma som denna här över renderEarningsBarChart, men skillnaden är att den visar enbart stapelgraf och inte både stapelgraf och linjedgraf som den första koden här gör

// === CREATE FUNCTION renderEarningsBarChart === Som skapar stapeldiagram ===

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
*/





//let currentType = "gender";       // "gender" eller "ethnicity"
//let currentMode = "average";      // "average" eller "time"
//let currentSource = "";           //  "city", "producer"
//let currentID = null;             // ID vid city/producer

let currentType = null;     // gender eller ethnicity eller null
let currentMode = null;     // average eller time eller null
let currentSource = null;   // city eller producer eller null
let currentID = null;       // ID vid city/producer


document.querySelector(".btn--gender").addEventListener("click", () => {
  currentType = "gender";
  updateChart();
});

document.querySelector(".btn--ethnicity").addEventListener("click", () => {
  currentType = "ethnicity";
  updateChart();
});

document.querySelector(".btn-over-time").addEventListener("click", () => {
  currentMode = "time";
  updateChart();
});

document.querySelector(".btn-over-all").addEventListener("click", () => {
  currentMode = "average";
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


// === Ta bort alla tidigare aktiva klasser ===
document.querySelectorAll(".btn--gender, .btn--ethnicity").forEach(btn => {
  btn.classList.remove("active");
});

document.querySelectorAll(".btn-over-time, .btn-over-all").forEach(btn => {
  btn.classList.remove("gender-active", "ethnicity-active", "active");
});


// === Lägg till aktiv klass för typ ===
 // === Lägg till korrekt aktiv för typ ===
  if (currentType === "gender") {
    document.querySelectorAll(".btn--gender").forEach(btn => btn.classList.add("active"));
    
    if (currentMode === "average") {
      document.querySelectorAll(".btn-over-all").forEach(btn => {
        btn.classList.add("gender-active", "active");
      });
    } else {
      document.querySelectorAll(".btn-over-time").forEach(btn => {
        btn.classList.add("gender-active", "active");
      });
    }

  } else if (currentType === "ethnicity") {
    document.querySelectorAll(".btn--ethnicity").forEach(btn => btn.classList.add("active"));

    if (currentMode === "average") {
      document.querySelectorAll(".btn-over-all").forEach(btn => {
        btn.classList.add("ethnicity-active", "active");
      });
    } else {
      document.querySelectorAll(".btn-over-time").forEach(btn => {
        btn.classList.add("ethnicity-active", "active");
      });
    }
  }



  // === Rendera diagrammet ===
  renderEarningsBarChart(data, currentType, currentMode);
}

updateChart(); // Renderar sidan när den laddas


















/*
// ==============================

// == FUNKTION TILL ATT TRANSFORMERA DATA (linjegraf) ==
function transformToLineData(data, categories) {
  return categories.map(category => ({
    category,
    values: data.map(d => ({
      year: d.year,
      value: d[category]
    }))
  }));
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

*/






/// ===========================================================

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









  
/*
if (document.querySelector(".btn--gender").classList.contains("active")) {
    renderEarningsBarChart(dataSetAvgEarningsGender, "gender");
  }

// Skapa alla Grafer här!!


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
}/*













// ======================================================================


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





//================================================================================
/*
Gammal kod!! OBS
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
}*/