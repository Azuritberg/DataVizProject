import { Gigs, DJs, Producers, Cities } from './data.js';

// Grundinställningar
const svg = d3.select("svg");
const tooltip = d3.select(".tooltip");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 50, right: 50, bottom: 80, left: 100 };

// Kombinera Gigs och DJs
/* const data = Gigs.map(gig => {
  const dj = DJs.find(d => d.id === gig.djID);
  return {
    djName: dj ? dj.name : "unknown",
    djGender: dj ? dj.gender : "unknown",
    djEthnicity: dj ? dj.ethnicity : "unknown",
    attendance: gig.attendance,
    djEarnings: gig.djEarnings,
    year: +gig.date.slice(0,4)
  };
}).filter(d => d.djGender !== "unknown"); */

//Go through all DJs find their gigs and display avg values

let datasetTest = []
let datasetTestAvg = []
let datasetTestAvg2 = []


let ethinicties = ["tau", "psi", "rho"]
let genders = ["theta", "lambda", "omicron"]
for (const producer of Producers) {
  let prodGigs = Gigs.filter(x => x.producerID == producer.id);
  let gigEarnings = prodGigs.map(x => x.djEarnings);
  console.log(gigEarnings.reduce((pv, cv) => {return pv + cv;}, 0) / gigEarnings.length);
}
let rhoSum = 0, psiSum = 0, tauSum = 0;
for (const city of Cities.filter(x => x.population > 400)) {
  let djsFromGigs = Gigs.filter(x => x.cityID == city.id).map(x => {return x.djID});
  let rho = []
  let psi = []
  let tau = []
  for (const djID of djsFromGigs) {
    let dj = DJs.find(x => x.id == djID)
    if(dj.gender == "lambda"){
      rho.push(dj)
    } else if (dj.gender == "omicron"){
      psi.push(dj)
    } else if(dj.gender == "theta"){
      tau.push(dj);
    }
  }
  rhoSum = rhoSum + rho.length;
  psiSum = psiSum + psi.length;
  tauSum = tauSum + tau.length;
  console.log(city.population, rho.length, psi.length, tau.length);
}
console.log(rhoSum, psiSum, tauSum);
/* for (const e of ethinicties) {
  let DJFiltEth = DJs.filter(x => x.ethnicity == e).filter(x => x.managerID == 9597);
  console.log(DJFiltEth);
  let dataPoint = {
    ethnicity: e,
    value: 0
  }
  let DJsum;
  let DJsSum;
  for (const DJ of DJFiltEth) {
    let gigsFiltered = Gigs.filter(x => x.djID == DJ.id)
                        .map(x => {return x.djEarnings});
    let DJsum = gigsFiltered.reduce((pv, cv) => {return pv + cv;}, 0);
    dataPoint.value += DJsum / gigsFiltered.length;
  }
  dataPoint.value = dataPoint.value/DJFiltEth.length;
  datasetTestAvg.push(dataPoint);
}
for (const g of genders) {
  let DJFiltGender= DJs.filter(x => x.gender == g);
  let dataPoint = {
    gender: g,
    value: 0
  }
  let DJsum;
  let DJsSum;
  for (const DJ of DJFiltGender) {
    let gigsFiltered = Gigs.filter(x => x.djID == DJ.id)
                        .map(x => {return x.cost});
    let DJsum = gigsFiltered.reduce((pv, cv) => {return pv + cv;}, 0);
    dataPoint.value += DJsum / gigsFiltered.length;
  }
  dataPoint.value = dataPoint.value/DJFiltGender.length;
  datasetTestAvg2.push(dataPoint);
}
console.log(datasetTestAvg, datasetTestAvg2); */

for (const dj of DJs) {
  let e = [];
  let a = [];
  let dataPoint = {
    dj: dj,
    info : {
      earnings : [],
      attendees : []
    }
  }
  for (const gig of Gigs) {
    if(dj.id == gig.djID){
      e.push(gig.djEarnings);
      a.push(gig.attendance);
    }
    
  }
  const aLen = a.length;
  const eLen = e.length;
  
  dataPoint = {
    dj: dj,
    info : {
      earnings : (e.reduce((pv, cv) => {return pv + cv;}, 0) / eLen),
      attendance : (a.reduce((pv, cv) => {return pv + cv}, 0) / aLen)
    }
  }
  datasetTest.push(dataPoint);
}
let data = datasetTest;


console.log(datasetTest);

// Skala för x och y
const x = d3.scaleLinear()
  .domain([380, d3.max(data, d => d.info.attendance) + 50])
  .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.info.earnings) + 5000])
  .range([height - margin.bottom, margin.top]);

/* // Färgkarta för grupp + subgrupp
const colorMap = {
  "theta-tho": "#3C32BF",
  "theta-psi": "#7C4DFF",
  "theta-rho": "#651FFF",
  "lambda-tho": "#E65151",
  "lambda-psi": "#FF4081",
  "lambda-rho": "#D81B60",
  "omicron-tho": "#ABE743",
  "omicron-psi": "#C6FF00",
  "omicron-rho": "#AEEA00",
  "unknown-unknown": "#39FFBE"  // Färg för okända DJs #eeeeee
}; */
const colorMap = {
  "tho": "#3C32BF",
  "psi": "#ABE743",
  "rho": "#E65151",
  "unknown-unknown": "#39FFBE"
};

// Skapa axlar
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Skapa och styla X-axel
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", 50)
    .attr("fill", "#3C32BF")
    .attr("text-anchor", "middle")
    .style("font-size", "1rem")
    .style("font-weight", "bold")
    .text("Number of Guests");

// Skapa och styla Y-axel
svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -70)
    .attr("fill", "#3C32BF")
    .attr("text-anchor", "middle")
    .style("font-size", "1rem")
    .style("font-weight", "bold")
    .text("DJ's Earnings (SEK)");

// Style på själva ticks och lines för X-axeln
svg.selectAll(".x-axis text")
    .style("fill", "#3C32BF")
    .style("font-size", "13px")
    .style("font-weight", "600")
    .style("letter-spacing", "0.5px");

svg.selectAll(".x-axis path")
    .style("stroke", "#3C32BF")
    .style("stroke-width", "2px");

svg.selectAll(".x-axis line")
    .style("stroke", "#3C32BF")
    .style("stroke-width", "1px");

// Style på ticks och lines för Y-axeln
svg.selectAll(".y-axis text")
    .style("fill", "#3C32BF")
    .style("font-size", "13px")
    .style("font-weight", "600")
    .style("letter-spacing", "0.5px");

svg.selectAll(".y-axis path")
    .style("stroke", "#3C32BF")
    .style("stroke-width", "2px");

svg.selectAll(".y-axis line")
    .style("stroke", "#3C32BF")
    .style("stroke-width", "1px");


// Rita cirklarna
const points = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("cx", d => x(d.info.attendance))
  .attr("cy", d => y(d.info.earnings))
  .attr("fill", d => {
    const key = `${d.dj.ethnicity}`;
    return colorMap[key] || colorMap["unknown-unknown"];  // Använd fallback
  })
  .style("stroke", "#c5c5c5")
  .style("stroke-width", 0.8)

  .on("mouseover", (event, d) => {
    //if (d3.select(event.currentTarget).attr("opacity") == 0) return;
    if (d3.select(event.currentTarget).classed("inactive")) return;
    tooltip.transition().duration(300).style("opacity", 1)
      .on("end", () => tooltip.classed("show", true));

    const group = d.dj.gender || "unknown Grupp";
    const subGroup = d.dj.ethnicity || "unknown Subgrupp";

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatNumber(num) {
        if (!num && num !== 0) return '';
        return num.toLocaleString('sv-SE');
    }

      tooltip.html(`
      <strong>${d.dj.name || "Unknown DJ"}</strong><br>
      Group: ${capitalize(d.dj.gender) || "Unknown"}<br>
      Subgroup: ${capitalize(d.dj.ethnicity)|| "Unknown"}<br>
      Guests: ${formatNumber(d.info.attendance)}<br>
      Earnings: ${formatNumber(d.info.earnings)} SEK
    `);

    const key = `${d.dj.gender}-${d.dj.ethnicity}`;
    const isUnknown = !(key in colorMap);

    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr("r", 8)
      .style("filter", isUnknown
        ? "drop-shadow(0 0 8px #aaaaaa) drop-shadow(0 0 12px #39FFBE)" // Grön glow för okända
        : "drop-shadow(0 0 8px #3C32BF) drop-shadow(0 0 12px #3C32BF)" // Neonblå för andra
      );
   })   

   .on("mousemove", (event) => {
    //if (d3.select(event.currentTarget).attr("opacity") == 0) return;
    if (d3.select(event.currentTarget).classed("inactive")) return;
    const tooltipWidth = 220; // Tooltipens bredd
    const tooltipHeight = 100; // Tooltipens höjd (ungefär)
    const chartBox = document.getElementById("chartBox");
    const chartRect = chartBox.getBoundingClientRect();
    
    const mouseX = event.clientX - chartRect.left;
    const mouseY = event.clientY - chartRect.top;
  
    let tooltipX = mouseX + 20;
    let tooltipY = mouseY - 30;
  
    // Kolla om tooltip går utanför till höger
    if (tooltipX + tooltipWidth > chartRect.width) {
      tooltipX = mouseX - tooltipWidth - 20;
    }
    
    // Kolla om tooltip går utanför toppen
    if (tooltipY < 0) {
      tooltipY = mouseY + 30;
    }
  
    tooltip
      .style("left", tooltipX + "px")
      .style("top", tooltipY + "px");
  })
  

  .on("mouseout", (event) => {
    //if (d3.select(event.currentTarget).attr("opacity") == 0) return;
    if (d3.select(event.currentTarget).classed("inactive")) return;
    tooltip.transition().duration(200).style("opacity", 0)
      .on("end", () => tooltip.classed("show", false));
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr("r", 5)
      .style("filter", "none");
  });

  //points.classed("point-glow", true);


// ----------------------------
//  KNAPPAR FÖR FILTRERING
// ----------------------------

// Filterdata
const groups = ["theta", "lambda", "omicron"];
const subGroups = ["tho", "psi", "rho"];
const years = d3.range(2015, 2025);

// Globala filterval
let selectedGroup = null;
let selectedSubGroup = null;
let selectedYear = null;

// Skapa knappar för grupper
groups.forEach(group => {
    d3.select("#groupFilter")
      .append("button")
      .text(group.charAt(0).toUpperCase() + group.slice(1))
      .attr("class", "filter-btn group-btn")
      .on("click", function() {
        if (selectedGroup === group) {
          selectedGroup = null; // Återställ om redan vald
          d3.selectAll(".group-btn").classed("active", false);
        } else {
          selectedGroup = group;
          d3.selectAll(".group-btn").classed("active", false);
          d3.select(this).classed("active", true);
        }
        updateFilters();
      });
  });
  

// Skapa knappar för subgrupper
subGroups.forEach(subGroup => {
    d3.select("#subGroupFilter")
      .append("button")
      .text(subGroup.charAt(0).toUpperCase() + subGroup.slice(1))
      .attr("class", "filter-btn subgroup-btn")
      .on("click", function() {
        if (selectedSubGroup === subGroup) {
          selectedSubGroup = null;
          d3.selectAll(".subgroup-btn").classed("active", false);
        } else {
          selectedSubGroup = subGroup;
          d3.selectAll(".subgroup-btn").classed("active", false);
          d3.select(this).classed("active", true);
        }
        updateFilters();
      });
  });
  

// Skapa knappar för årtal
years.forEach(year => {
    d3.select("#yearFilter")
      .append("button")
      .text(year)
      .attr("class", "filter-btn year-btn")
      .on("click", function() {
        if (selectedYear === year) {
          selectedYear = null;
          d3.selectAll(".year-btn").classed("active", false);
        } else {
          selectedYear = year;
          d3.selectAll(".year-btn").classed("active", false);
          d3.select(this).classed("active", true);
        }
        updateFilters();
      });
  });

  

// Funktion för att uppdatera scatterplot
function updateFilters() {
    points
      .each(function(d) {
        const groupMatch = !selectedGroup || d.djGender === selectedGroup;
        const subGroupMatch = !selectedSubGroup || d.djEthnicity === selectedSubGroup;
        const yearMatch = !selectedYear || d.year === selectedYear;
        const match = groupMatch && subGroupMatch && yearMatch;
  
        const key = `${d.djGender}-${d.djEthnicity}`;
  
        const circle = d3.select(this)

        circle.classed("inactive", !match);

        circle.transition()
          .duration(500)
          .attr("opacity", match ? 1 : 0.02)
          .attr("fill", colorMap[key] || colorMap["unknown-unknown"]) 
          
      });
  }
  


// Rensa alla filter
d3.select("#resetFiltersBtn").on("click", () => {
    selectedGroup = null;
    selectedSubGroup = null;
    selectedYear = null;
  
    d3.selectAll(".group-btn").classed("active", false);
    d3.selectAll(".subgroup-btn").classed("active", false);
    d3.selectAll(".year-btn").classed("active", false);
  
    updateFilters();
  });
  








  /* // Funktion för att uppdatera scatterplot
function updateFilters() {
  points
    .transition()
    .duration(500)
    .attr("opacity", d => {
      const groupMatch = !selectedGroup || d.djGender === selectedGroup;
      const subGroupMatch = !selectedSubGroup || d.djEthnicity === selectedSubGroup;
      const yearMatch = !selectedYear || d.year === selectedYear;
      return (groupMatch && subGroupMatch && yearMatch) ? 1 : 0.03;
    })
    .attr("fill", d => {
      const key = `${d.djGender}-${d.djEthnicity}`;
      return colorMap[key] || colorMap["unknown-unknown"];
    });
} */










