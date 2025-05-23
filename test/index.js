import { Gigs, DJs, Producers, Cities } from './data.js';


// Grundinställningar
const svg = d3.select("svg");
svg.attr("width", 800).attr("height", 500);
const margin = { top: 50, right: 50, bottom: 80, left: 100 };

const width = +svg.attr("width");
const height = +svg.attr("height");
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;



/* let dataPoint = {
    name: "cityName",
    id: "cityID",
    data: [
        {year:2015, rho: 2, tau: 1, psi: 5},
        {year:2016, rho: 1, tau: 3, psi: 2}
    ]
} */
//dataSet = cities gigs shown by ethinicity split
//dataSet2 = citites gigs shown by gender split
let dataSet = []
let dataSet2 = []
let dataSetProducersEth = [];
let dataSetProducersGen = [];

let genders = ["lambda", "theta", "omicron"];
let ethinicties = ["psi", "rho", "tau"];

let dataSetAvgEarningsGender = [];
let dataSetAvgEarningsEthnicity = [];

let dataSetTotalGigsGender = [];
let dataSetTotalGigsEthnicity = [];


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
    dataSet.push(dataPoint);
    dataSet2.push(dataPoint2);
}

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


for (const gender of genders) {
    //filter gigs by gender
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJgender = DJs.find(y => y.id == gigDj).gender;
        return DJgender == gender;
    });
    console.log(gender, filteredGigs);
}




/*
const width = 800;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const cityData = dataSet[0]; // Exempel: Första staden
const years = cityData.data.map(d => d.year);
const ethnicities = ['rho', 'tau', 'psi'];

// Skala för x-axeln (år)
const x0 = d3.scaleBand()
    .domain(years)
    .range([0, innerWidth])
    .padding(0.2);

// Inre skala för varje stapelgrupp (för olika etniciteter)
const x1 = d3.scaleBand()
    .domain(ethnicities)
    .range([0, x0.bandwidth()])
    .padding(0.05);

// Skala för y-axeln (antal gigs)
const y = d3.scaleLinear()
    .domain([0, d3.max(cityData.data, d => Math.max(d.rho, d.tau, d.psi))])
    .nice()
    .range([innerHeight, 0]);

const color = d3.scaleOrdinal()
    .domain(ethnicities)
    .range(d3.schemeCategory10);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// X-axel
g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0).tickFormat(d3.format("d")));

// Y-axel
g.append("g")
    .call(d3.axisLeft(y));

// Staplarna
g.selectAll("g.bar-group")
    .data(cityData.data)
    .enter().append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x0(d.year)},0)`)
    .selectAll("rect")
    .data(d => ethnicities.map(key => ({ key, value: d[key] })))
    .enter().append("rect")
    .attr("x", d => x1(d.key))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => innerHeight - y(d.value))
    .attr("fill", d => color(d.key));
*/




// Könsfördelning över flera städer
// Det betyder att vi skapar ett grupperat stapeldiagram där vi 
// för varje år har ett block med staplar – en stapel per könskategori per stad. 
// För tydlighet börjar vi med att välja ett fåtal städer (t.ex. tre första) och ett par år (t.ex. 2019–2021).
const selectedCities = dataSet2.slice(0, 3); // Första 3 städerna
const selectedYears = [2019, 2020, 2021];
const genders = ['lambda', 'omicron', 'theta'];

const flatData = [];

for (const city of selectedCities) {
    for (const yearData of city.data) {
        if (selectedYears.includes(yearData.year)) {
            for (const gender of genders) {
                flatData.push({
                    city: city.name,
                    year: yearData.year,
                    gender: gender,
                    value: yearData[gender]
                });
            }
        }
    }
}

// Skapa skala för x: år
const x0 = d3.scaleBand()
    .domain(selectedYears)
    .range([0, innerWidth])
    .padding(0.2);

// Skala för varje stad inom varje år
const x1 = d3.scaleBand()
    .domain(selectedCities.map(c => c.name))
    .range([0, x0.bandwidth()])
    .padding(0.05);

// Inre skala för kön inom varje stad
const x2 = d3.scaleBand()
    .domain(genders)
    .range([0, x1.bandwidth()])
    .padding(0.05);

// Y-skala
const y = d3.scaleLinear()
    .domain([0, d3.max(flatData, d => d.value)])
    .nice()
    .range([innerHeight, 0]);

const color = d3.scaleOrdinal()
    .domain(genders)
    .range(d3.schemeSet2);

svg.selectAll("*").remove(); // Töm SVG innan vi ritar nytt
const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Axlar
g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0).tickFormat(d3.format("d")));

g.append("g")
    .call(d3.axisLeft(y));

// Nollinje (valfritt men tydlig)
g.append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "4,2");

// Rektanglar
selectedYears.forEach(year => {
    const yearGroup = g.append("g")
        .attr("transform", `translate(${x0(year)},0)`);

    selectedCities.forEach(city => {
        const cityGroup = yearGroup.append("g")
            .attr("transform", `translate(${x1(city.name)},0)`);

        const dataForCityYear = flatData.filter(d => d.year === year && d.city === city.name);

        cityGroup.selectAll("rect")
            .data(dataForCityYear)
            .enter().append("rect")
            .attr("x", d => x2(d.gender))
            .attr("y", d => y(d.value))
            .attr("width", x2.bandwidth())
            .attr("height", d => innerHeight - y(d.value))
            .attr("fill", d => color(d.gender));
    });
});

// Lägg till en legend (frivilligt)
const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, ${margin.top})`);

genders.forEach((gender, i) => {
    const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(gender));

    legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(gender)
        .attr("font-size", "12px");
});
