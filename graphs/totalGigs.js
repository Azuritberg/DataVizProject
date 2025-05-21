import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset, getMaxValueDataset,  transformToLineData} from '../data/auxfunctions.js';

// ========================= ANDRA GRAFEN BÖRJAR =======================================================
// === CREATE FUNCTION renderGigsBarChart === Som skapar stapeldiagram och linjediagram ===


export function renderGigsGraphChart(data, type = "gender", mode = "average") {

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