import { Gigs, DJs, Producers, Cities } from './data.js';

export let dataSetCitiesEth = []
export let dataSetCitiesGen = []
export let dataSetProducersEth = [];
export let dataSetProducersGen = [];

export let genders = ["lambda", "theta", "omicron"];
export let ethnicties = ["psi", "rho", "tau"];

export let dataSetAvgEarningsGender = [];
export let dataSetAvgEarningsEthnicity = [];

export let dataSetTotalGigsGender = [];
export let dataSetTotalGigsEthnicity = [];

export let datasetTotalEarningsYearByYearEth = [];
export let datasetTotalEarningsYearByYearGen = [];


// ==== Creates dataset where each city is shown by it's gig count broken down in terms of each DJs gender and ethinicity ====
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
    dataSetCitiesEth.push(dataPoint);
    dataSetCitiesGen.push(dataPoint2);
}


//==== Same as above but for producers not cities ====
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
console.log(dataSetCitiesEth, dataSetCitiesGen)



// ==== Skapar ett en array filtered gigs som är alla gigsen för ett kön ====
for (const gender of genders) {
    //filter gigs by gender
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJgender = DJs.find(y => y.id == gigDj).gender;
        return DJgender == gender;
    });
    let gigEarnings = filteredGigs.map(x => x.djEarnings).reduce((cv, pv) => {return cv + pv}, 0) / filteredGigs.length; 
    let genderedGigs = filteredGigs.length;
    dataSetAvgEarningsGender.push({
        gender: gender,
        earnings: gigEarnings
    });
    dataSetTotalGigsGender.push({
        gender: gender,
        totalGigs : genderedGigs
    });
}
for (const ethnicity of ethnicties) {
    let filteredGigs = Gigs.filter(x => {
        let gigDj = x.djID;
        let DJethnicity = DJs.find(y => y.id == gigDj).ethnicity;
        return DJethnicity == ethnicity;
    });
    let gigEarnings = filteredGigs.map(x => x.djEarnings).reduce((cv, pv) => {return cv + pv}, 0) / filteredGigs.length;
    let genderedGigs = filteredGigs.length;
    dataSetAvgEarningsEthnicity.push({
        ethnicity: ethnicity,
        earnings: gigEarnings
    });
    dataSetTotalGigsEthnicity.push({
        ethnicity: ethnicity,
        totalGigs: genderedGigs
    });
}



for(let i = 0; i < 10; i++){

    let yearGigs = Gigs.filter(x => {
        let year = new Date(x.date).getFullYear();
        return year == 2015 + i;
    });
    let yearObjEth = {
        year: 2015 + i,
        psi: 0,
        rho: 0,
        tau: 0
    }
    let yearObjGen = {
        year: 2015 + i,
        lambda: 0,
        omicron: 0,
        theta: 0
    }
    for (const gender of genders) {
        let filteredGigs = yearGigs.filter(x => {
            let gigDj = x.djID;
            let DJgender = DJs.find(y => y.id == gigDj).gender;
            return DJgender == gender;
        }).map(x => x.djEarnings);
        const avg = filteredGigs.reduce((cv, pv) => pv + cv, 0) / filteredGigs.length;
        yearObjGen[gender] = isNaN(avg) ? 0 : avg;

    }
    for (const ethinicity of ethnicties) {
        let filteredGigs = yearGigs.filter(x => {
            let gigDj = x.djID;
            let DJethnicity = DJs.find(y => y.id == gigDj).ethnicity;
            return DJethnicity == ethinicity;
        }).map(x => x.djEarnings);
        const avg = filteredGigs.reduce((cv, pv) => pv + cv, 0) / filteredGigs.length;
        yearObjEth[ethinicity] = isNaN(avg) ? 0 : avg;

    }
    datasetTotalEarningsYearByYearEth.push(yearObjEth);
    datasetTotalEarningsYearByYearGen.push(yearObjGen);
}

// === DATA ARRAYS ===
export const cities = [
    "Sao Adão", "Agrabah", "Alphaville", "Asteroid City", "Atlantika", "Bagdogski",
    "Belleville", "Brightburn", "Chong Guo", "Ciudad Encantada", "Dunauvarosz",
    "Santo Tome", "Sunnydale", "Pokyo", "Rimini", "Moesko", "Mos Eisley", "Kaabuli",
    "Karatas", "Kattstad", "Khansaar", "Kosmolac", "Krzystanopolis", "Ville Rose"
  ];
  
export const producers = [
    "Banzai AB", "Festen AB", "Finliret AB", "Gigskaparna", "Nattmingel AB",
    "Neverending AB", "No Mind AB", "Trance AB", "Xtas Produktioner"
  ];
  

console.log(dataSetAvgEarningsGender, dataSetAvgEarningsEthnicity);
console.log(dataSetTotalGigsGender, dataSetTotalGigsEthnicity);




