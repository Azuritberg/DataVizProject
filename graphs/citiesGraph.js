import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset,  transformToLineData, getMaxValueDatasetOverall, maxValueLineSet, getGreekGraphSymbol } from '../data/auxfunctions.js';
import { Cities } from '../data/data.js';

let ethColors = [ "#ACFF58","#45F5BC", "#00F453"];
let genColors = ["#BE71F5", "#5850EE", "#F034B8"];
let testData = yearsToAllTimeDataset(ethnicties, cities, dataSetCitiesEth);
let ymax = getMaxValueDatasetOverall(testData, ethnicties);
console.log(ymax);
// GROUPED BAR CHART
export function renderGroupedBarChartCities(){

  d3.select(".btnCity--ethnicity").classed("pressed", true);
  d3.select(".btnCity--ethnicity").classed("pressedEth", true);
  let groups = ethnicties;
  let colors;
  let mode = "ethnicity"
  let specificityMode = "allCities";
  const svg = d3.select("#chart-cities");
  svg.selectAll("*").remove();

  const tooltip = d3.select("#tooltip-general");

  //grab width and height from svg element
  const width = Number(svg.attr("width"));
  const height = Number(svg.attr("height"));
  //define margin stuff
  const margin = {top: 50, right: 20, bottom: 70, left: 40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let xA = d3.scaleBand()
    .domain(testData.map(x => x.type))
    .range([0, innerWidth])
    .padding(0.2);

  

  function render(type) {
    console.log(testData);
    svg.selectAll("*").remove();
    if(type == ethnicties){
        testData = yearsToAllTimeDataset(ethnicties, cities, dataSetCitiesEth);
        ymax = getMaxValueDatasetOverall(testData, ethnicties);
        colors = ethColors
    } else {
        testData = yearsToAllTimeDataset(genders, cities, dataSetCitiesGen);
        ymax = getMaxValueDatasetOverall(testData, genders);
        colors = genColors;
    }

    let xA = d3.scaleBand()
    .domain(testData.map(x => x.type))
    .range([0, innerWidth])
    .padding(0.2);
    
    let xB = d3.scaleBand()
    .domain(type)
    .range([0, xA.bandwidth()])
    .padding(0.2);

  const color = d3.scaleOrdinal()
    .domain(type)
    .range(colors);

    let y = d3.scaleLinear()
    .domain([0, ymax])
    .range([innerHeight, 0])
    .nice();

    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  chartGroup.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xA))
    .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
  chartGroup.append("g")
    .call(d3.axisLeft(y));
  
  // Bars
  chartGroup.append("g")
    .selectAll("g")
    .data(testData)
    .enter()
    .append("g")
      .attr("transform", d => `translate(${xA(d.type)}, 0)`)
    .selectAll("rect")
    .data(d => type.map(key => ({ key: key, value: d[key] })))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xB(d.key))
    .attr("width", xB.bandwidth())
    .attr("y", innerHeight)
    .attr("height", 0)
    .attr("fill", d => color(d.key))
    .on("mouseover", function(event, d) {
      tooltip
        .style("display", "block")
        .html(`
          <div class="tooltip-header" style="color:${color(d.key)};">${d.key[0].toUpperCase() + d.key.slice(1)} : ${getGreekGraphSymbol(d.key)}</div>
          <div><strong>Group</strong>: ${d.key[0].toUpperCase() + d.key.slice(1)}</div>
          <div><strong>Value</strong>: ${d.value}</div>
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
    .attr("y", d => y(d.value))
    .attr("height", d => innerHeight - y(d.value));

    let graphTitle = svg.append("text")
                .attr("x", width/2)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .attr("font-size", "1rem")
                .text(() => {
                    return "Cities gigs broken down by " + mode + " of DJ"
                });
            let subtitle = svg.append("text")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "0.8rem")
            .attr("fill", "#666")
            .text("Between the years 2015 - 2025")
  }
  function renderLines(lineData, category){
    let data = transformToLineData(lineData, category)
    console.log(data);
    svg.selectAll("*").remove();
    let ymax = maxValueLineSet(category, data);
    let x = d3.scalePoint()
      .domain(data[0].values.map(d => d.year))
      .range([0, innerWidth])
      .padding(0);
    let y = d3.scaleLinear()
      .domain([0, ymax])
      .range([innerHeight, 0]);
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value));
    let colors;
    if(category == ethnicties){
      colors = ethColors;
    } else {
      colors = genColors;
    }
    let c = d3.scaleOrdinal()
      .domain(category)
      .range(colors);

    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    chartGroup.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))
  
    chartGroup.append("g")
      .call(d3.axisLeft(y));

    const lineGroup = chartGroup.selectAll(".cat")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "cat");
    
    lineGroup.append("path")
      .attr("class", "l")
      .attr("d", d => line(d.values))
      .attr("stroke", d=> c(d.category))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", function() {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);


    lineGroup.each(function(d){
      d3.select(this)
        .selectAll("circle")
        .data(d.values)
        .enter()
        .append("circle")
        .attr("cx", a => x(a.year))
        .attr("cy", a => y(a.value))
        .attr("r", 0)
        .attr("fill", () => c(d.category))
        .on("mouseover", function(event, a) {
          tooltip
          .style("display", "block")
          .html(`
            <div class="tooltip-header" style="color:${c(d.category)};">${d.category[0].toUpperCase() + d.category.slice(1)} : ${getGreekGraphSymbol(d.category)}
            </div>
            <div><strong>Year</strong>: ${a.year}</div>
            <div><strong>Value</strong>: ${a.value}</div>
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
        .delay((_, i) => i * 80)
        .attr("r", 6);
    })
    let graphTitle = svg.append("text")
      .attr("x", width/2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "1rem")
      .text(() => {
          return Cities.find(x => x.id == specificityMode).name +"'s gigs broken down by " + mode + " of DJ"
      });
    let subtitle = svg.append("text")
      .attr("x", width / 2)
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8rem")
      .attr("fill", "#666")
      .text("Further divided by year")
  }
  render(ethnicties, testData);

    
    let a = d3.select(".btnCity--gender")
        .on("click", (event) => {
            if(mode != "gender"){
              d3.select(".btnCity--ethnicity").classed("pressed", false);
              d3.select(".btnCity--ethnicity").classed("pressedEth", false);
              d3.select(".btnCity--gender").classed("pressedGen", true)
              d3.select(".btnCity--gender").classed("pressed", true);
              d3.selectAll(".btn-city")
                .filter(function() {
                  return d3.select(this).classed("pressedEth")
                })
                .classed("pressedGen", true)
                .classed("pressedEth", false);
              
              mode = "gender";
              svg.selectAll("*").remove();
              if(specificityMode == "allCities")
                render(genders)
              else
                renderLines(dataSetCitiesGen.find(x => x.id == specificityMode).data, genders);
            }
        });
    let b = d3.select(".btnCity--ethnicity")
        .on("click", (event) => {
            if(mode != "ethnicity"){
              d3.select(".btnCity--gender").classed("pressed", false);
              d3.select(".btnCity--gender").classed("pressedGen", false);
              d3.select(".btnCity--ethnicity").classed("pressed", true);
              d3.select(".btnCity--ethnicity").classed("pressedEth", true);
              d3.selectAll(".btn-city")
                .filter(function() {
                  return d3.select(this).classed("pressedGen")
                })
                .classed("pressedGen", false)
                .classed("pressedEth", true);
              mode = "ethnicity"
              svg.selectAll("*").remove();
              if(specificityMode == "allCities")
                render(ethnicties)
              else
                renderLines(dataSetCitiesEth.find(x => x.id == specificityMode).data, ethnicties);
            }
        });
  let cityButtons = d3.selectAll(".btn-city")
    .attr("class", (d, i , nodes) => {
        return `btn-city ${Cities.find(x => x.name == nodes[i].textContent).id} ${Cities.find(x => x.name == nodes[i].textContent).name}`
    }).attr("id",(d, i ,nodes) => `${Cities.find(x => x.name == nodes[i].textContent).id}`)
    .on("click", (event) => {
        if(event.target.classList.contains("pressed")){
            d3.selectAll(".btn-city").classed("pressed", false);
            d3.selectAll(".btn-city").classed("pressedGen", false);
            d3.selectAll(".btn-city").classed("pressedEth", false);
            specificityMode = "allCities"
            console.log(specificityMode, mode)
            if(mode == "ethnicity"){
              render(ethnicties, testData);
            } else {
              render(genders, testData);
            }
        }else{
            let select = d3.selectAll(".btn-city");
            select.classed("pressed", false);
            d3.selectAll(".btn-city").classed("pressedGen", false);
            d3.selectAll(".btn-city").classed("pressedEth", false);
            event.target.classList.add("pressed");
            
            specificityMode = event.target.id;
            console.log(specificityMode, mode)
            let lineData;
            if(mode == "ethnicity"){
                event.target.classList.add("pressedEth");
                //render line based on ethnicity
                console.log("mode is " + specificityMode)
                lineData = dataSetCitiesEth.find(x => x.id == specificityMode).data;
                renderLines(lineData, ethnicties)
            } else if(mode == "gender") {
                event.target.classList.add("pressedGen");
                //render line based on gender
                console.log("mode is " + mode)
                lineData = dataSetCitiesGen.find(x => x.id == specificityMode).data;
                renderLines(lineData, genders);
            }
        }


    });
  console.log(cityButtons);

/*   let selection = svg.selectAll("rect")
    .data(testData)
    .enter();
 */

}
renderGroupedBarChartCities();