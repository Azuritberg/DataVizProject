import { Gigs, DJs, Producers, Cities } from './data.js';

// Grundinställningar
const svg = d3.select("svg");
svg.attr("width", 800).attr("height", 500);
const margin = { top: 50, right: 50, bottom: 80, left: 100 };

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


svg.selectAll("rect").data()

console.log(dataSet);
console.log(dataSet2);