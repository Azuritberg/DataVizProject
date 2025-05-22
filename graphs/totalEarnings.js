import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender, datasetTotalEarningsYearByYearEth, datasetTotalEarningsYearByYearGen } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset, getMaxValueDataset,  transformToLineData, combineGroups, getGreekGraphSymbol } from '../data/auxfunctions.js';



//let currentType = null;     // gender eller ethnicity eller null
//let currentMode = null;     // average eller time eller null



// === CREATE FUNCTION renderEarningsBarChart === Som skapar stapeldiagram och linjediagram ===

export function renderEarningsGraphChart(data, type = "gender", mode = "average") {

  const svg = d3.select("#chart-earnings");
  svg.selectAll("*").remove();  // Tömma SVG och rita nytt

  const tooltip = d3.select("#tooltip-general");

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
      .domain([0, d3.max(data, (d, i, nodes) => d.earnings)])  //(d, i, nodes)
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
      .data(data, d => d[type]);  // .data() binder ny data till befintliga staplar
      earningsBars.remove(); // Rensa gamla staplar

      chartGroup.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => categoryXScale(d[type]))  // .x positioneras baserat på kön/etnicitet
        .attr("width", categoryXScale.bandwidth())  // .height är skillnaden mellan y=0 och earnings 
        .attr("y", innerHeight)    // Börjar längst ner
        .attr("height", 0)         // Börjar med höjd 0
        .attr("fill", d => colorScale(d[type]))  // Färg baserat på kategori (kön eller etnicitet)
        .on("mouseover", function(event, d) {
          tooltip
            .style("display", "block")
            .html(`
              <div class="tooltip-header" style="color:${colorScale(d[type])};">${d[type][0].toUpperCase() + d[type].slice(1)} : ${getGreekGraphSymbol(d[type])}</div>
              <div><strong>Year</strong> : ${d.year ?? "All time"}</div>
              <div><strong>Earnings</strong> : ${d.earnings.toFixed(0)}</div>
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
        .attr("y", d => earningsYScale(d.earnings))  // .y utgår från earnings, dvs. 0 kr → max kr
        .attr("height", d => innerHeight - earningsYScale(d.earnings));  // d.earnings används för stapelhöjd




      // === ENTER/UPDATE/EXIT FÖR TEXTER === // === TEXT OVANFÖR STAPLAR ===
    const earningsLabels = chartGroup.selectAll(".bar-label")
      .data(data, d => d[type]);
      earningsLabels.remove(); // Rensa gamla staplar

      chartGroup.selectAll(".bar-label")
        .data(data)
        .enter()  // Enter (skapa nya staplar)
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
        .attr("y", innerHeight - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .style("opacity", 0)
        .text(d => d.earnings.toFixed(0))  // eller .toFixed(1) om du vill ha decimaler
        .transition()
        .duration(1500)
        .delay((_, i) => i * 100)  // Stagger för att komma en efter en
        .style("opacity", 1)
        .attr("y", d => earningsYScale(d.earnings) - 10);  // text lite ovanför stapeln
  
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
      .attr("stroke-width", 3)  // Tjocklek
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
          .transition()  // .transition().duration(500)	Animera varje cirkel
          .duration(2500)
          .delay((_, i) => i * 80) // Lägg till liten delay per punkt för flyt - Varje punkt kommer lite efter föregående
          .attr("r", 6); // Växer upp till vanlig storlek
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



// === BUTTONS FÖR EARNINGS-GRAFEN ===

let currentTypeGraphEarnings = "ethnicity";     // "gender" eller "ethnicity"
let currentModeGraphEarnings = "average";      // "average" eller "time"


export function updateEarningsChart() {

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
        ? datasetTotalEarningsYearByYearGen
        : datasetTotalEarningsYearByYearEth;
    }
  
    // === Rendera diagrammet ===
    renderEarningsGraphChart(data, currentTypeGraphEarnings, currentModeGraphEarnings);
  }

  //Interaktion för total earnings chart


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