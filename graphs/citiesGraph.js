import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset,  transformToLineData, getMaxValueDatasetOverall} from '../data/auxfunctions.js';
import { Cities } from '../data/data.js';

let ethColors = ["#00F453", "#ACFF58", "#45F5BC"];
let genColors = ["#BE71F5", "#5850EE", "#F034B8"];
let testData = yearsToAllTimeDataset(ethnicties, cities, dataSetCitiesEth);
let ymax = getMaxValueDatasetOverall(testData, ethnicties);
console.log(ymax);
// GROUPED BAR CHART
export function renderGroupedBarChartCities(){
    d3.select(".btnCity--ethnicity").classed("pressed", true);
    let groups = ethnicties;
    let colors;
  let mode = "ethnicity"
  let specificityMode = "allCities";
  const svg = d3.select("#chart-cities");
  svg.selectAll("*").remove();
  //grab width and height from svg element
  const width = Number(svg.attr("width"));
  const height = Number(svg.attr("height"));
  //define margin stuff
  const margin = {top: 50, right: 30, bottom: 60, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let xA = d3.scaleBand()
    .domain(testData.map(x => x.type))
    .range([0, innerWidth])
    .padding(0.2);

  

  function render(type) {
    console.log(testData);
    if(type == ethnicties){
        testData = yearsToAllTimeDataset(ethnicties, cities, dataSetCitiesEth);
        ymax = getMaxValueDatasetOverall(testData, ethnicties);
        colors = ethColors
    } else {
        testData = yearsToAllTimeDataset(genders, cities, dataSetCitiesGen);
        ymax = getMaxValueDatasetOverall(testData, genders);
        colors = genColors;
    }
    
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
      .attr("x", d => xB(d.key))
      .attr("y", d => y(d.value))
      .attr("height", d => {
        return innerHeight - y(d.value)
        })
      .attr("width", xB.bandwidth())
      .attr("fill", d => color(d.key));
  }
  render(ethnicties, testData);
    
    let a = d3.select(".btnCity--gender")
        .on("click", (event) => {
            d3.select(".btnCity--ethnicity").classed("pressed", false);
            d3.select(".btnCity--gender").classed("pressed", true);
            mode = "gender";
            svg.selectAll("*").remove();
            render(genders)
        });
    let b = d3.select(".btnCity--ethnicity")
        .on("click", (event) => {
            d3.select(".btnCity--gender").classed("pressed", false);
            d3.select(".btnCity--ethnicity").classed("pressed", true);
            mode = "ethnicity"
            svg.selectAll("*").remove();
            render(ethnicties)
        });
  let cityButtons = d3.selectAll(".btn-city")
    .attr("class", (d, i , nodes) => {
        return `btn-city ${Cities.find(x => x.name == nodes[i].textContent).id} ${Cities.find(x => x.name == nodes[i].textContent).name}`
    }).attr("id",(d, i ,nodes) => `${Cities.find(x => x.name == nodes[i].textContent).id}`)
    .on("click", (event) => {
        if(event.target.classList.contains("pressed")){
            d3.selectAll(".btn-city").classed("pressed", false);
            specificityMode = "allCitites"
            console.log(specificityMode)
        }else{
            let select = d3.selectAll(".btn-city");
            select.classed("pressed", false)
            event.target.classList.add("pressed");
            specificityMode = event.target.id;
            console.log(specificityMode)
        }


    });
  console.log(cityButtons);

/*   let selection = svg.selectAll("rect")
    .data(testData)
    .enter();
 */

}
renderGroupedBarChartCities();