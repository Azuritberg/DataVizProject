
// === ANIMERADE STAPLAR MED ENTER/UPDATE/EXIT ===
const bars = chartGroup.selectAll(".bar")
  .data(data, d => d[type]); // nyckel: kön eller etnicitet

// === UPPDATERA ===
bars.transition()
  .duration(1000)
  .attr("x", d => categoryXScale(d[type]))
  .attr("width", categoryXScale.bandwidth())
  .attr("y", d => earningsYScale(d.earnings))
  .attr("height", d => innerHeight - earningsYScale(d.earnings))
  .attr("fill", d => colorScale(d[type]));

// === ENTER ===
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

// === EXIT ===
bars.exit()
  .transition()
  .duration(500)
  .style("opacity", 0)
  .remove();


  // === ANIMERADE TEXTER OVANFÖR STAPLARNA ===
const labels = chartGroup.selectAll(".bar-label")
  .data(data, d => d[type]); // nyckel: kön eller etnicitet

// === UPPDATERA EXISTERNDE TEXTER ===
labels.transition()
  .duration(1000)
  .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
  .attr("y", d => earningsYScale(d.earnings) - 5)
  .text(d => d.earnings.toFixed(0));

// === ENTER – Lägg till nya texter ===
labels.enter()
  .append("text")
  .attr("class", "bar-label")
  .attr("x", d => categoryXScale(d[type]) + categoryXScale.bandwidth() / 2)
  .attr("y", innerHeight - 5) // Starta längst ner
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

// === EXIT – ta bort gamla texter ===
labels.exit()
  .transition()
  .duration(500)
  .style("opacity", 0)
  .remove();


















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