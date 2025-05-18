



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