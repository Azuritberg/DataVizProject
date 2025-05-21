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
    
    const xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(categoryXScale));


    // === ENTER/UPDATE/EXIT FÖR STAPLAR ===
    // Staplar - BARS - Gigs  == Här ritas staplarna ut
    const gigsBars = chartGroup.selectAll(".bar")
      .data(data, d => d[type]);

    gigsBars.transition()  // UPDATE  transition() körs på befintliga element
      .duration(1500)
      .attr("x", d => categoryXScale(d[type]))
      .attr("width", categoryXScale.bandwidth())
      .attr("y", d => earningsYScale(d.earnings))
      .attr("height", d => innerHeight - earningsYScale(d.earnings))
      .attr("fill", d => colorScale(d[type]));

    gigsBars.enter()  // ENTER  enter() körs på nya element
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
      .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => colorScale(d[type]))  // Färg baserat på kategori (kön eller etnicitet)
      .on("mouseover", function(event, d) {
        tooltip
          .style("display", "block")
          .html(`
            <div class="tooltip-header" style="color:${colorScale(d[type])};">${d[type][0].toUpperCase() + d[type].slice(1)} : ${getGreekGraphSymbol(d[type])}</div>
            <div><strong>Year</strong> : ${d.year ?? "All time"}</div>
            <div><strong>Earnings</strong> : ${d.totalGigs.toFixed(0)}</div>
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
      .duration(1500)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attr("y", d => gigsYScale(d.totalGigs))   // .y utgår från earnings, dvs. 0 kr → max kr
      .attr("height", d => innerHeight - gigsYScale(d.totalGigs)); // d.earnings används för stapelhöjd

    gigsBars.exit()   // EXIT
      .transition()
      .duration(800)
      .style("opacity", 0)
      .remove();


    // === ENTER/UPDATE/EXIT FÖR TEXTER === // === TEXT OVANFÖR STAPLAR ===
    const gigsLabels = chartGroup.selectAll(".bar-label")
      .data(data, d => d[type]);

    gigsLabels.transition()
      .duration(1500)
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", d => earningsYScale(d.earnings) - 10)
      .text(d => d.totalGigs.toFixed(0));

    gigsLabels.enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
      .attr("y", innerHeight - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .style("opacity", 0)
      .text(d => d.totalGigs.toFixed(0)) // eller .toFixed(1) om du vill ha decimal
      .transition()
      .duration(1500)
      .delay((_, i) => i * 100)  // Stagger för att komma en efter en
      .style("opacity", 1)
      .attr("y", d => gigsYScale(d.totalGigs) - 10);  // text lite ovanför stapeln

    gigsLabels.exit()
      .transition()
      .duration(800)
      .style("opacity", 0)
      .remove();


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