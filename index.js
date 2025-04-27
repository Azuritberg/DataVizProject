import { Gigs, DJs } from './data.js';

    const svg = d3.select("svg");
    const tooltip = d3.select(".tooltip");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 50, right: 50, bottom: 80, left: 100 };

    // Kombinera Gigs och DJs
    const data = Gigs.map(gig => {
      const dj = DJs.find(d => d.id === gig.djID);
      return {
        djName: dj ? dj.name : "Okänd",
        djGender: dj ? dj.gender : "okänd",
        djEthnicity: dj ? dj.ethnicity : "okänd",
        attendance: gig.attendance,
        djEarnings: gig.djEarnings,
        year: +gig.date.slice(0,4)
      };
    }).filter(d => d.djGender !== "okänd");

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.attendance) + 50])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.djEarnings) + 5000])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(["theta", "lambda", "omicron"])
      .range(["#3C32BF", "#E65151", "#ABE743"]);

    const genders = Array.from(new Set(data.map(d => d.djGender)));
    const ethnicities = Array.from(new Set(data.map(d => d.djEthnicity)));
    const years = Array.from(new Set(data.map(d => d.year)));

    genders.forEach(g => {
      d3.select("#genderFilter")
      .append("option").attr("value", g)
      .text(g)
      .style("color", "#3C32BF");
    });
    ethnicities.forEach(e => {
      d3.select("#ethnicityFilter")
      .append("option")
      .attr("value", e)
      .text(e)
      .style("color", "#3C32BF");
    });
    years.forEach(y => {
      d3.select("#yearFilter")
      .append("option")
      .attr("value", y)
      .text(y)
      .style("color", "#3C32BF");
    });

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("class", "x-axis") 
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("fill", "#3C32BF") // färg på class till axel X
        .text("Antal Gäster");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)    // Centrerar mitt på axeln
        .attr("y", -90)            // Flyttar ut texten lite från axeln
        .attr("dy", "1em")         // Justerar vertikal förskjutning
        .style("text-anchor", "middle")   // Centrerar texten
        .style("font-size", "1rem")       // Gör texten större
        .style("font-weight", "bold")     // Gör texten fet
        .attr("fill", "#3C32BF")          // färg på class till axel Y
        .text("DJ:s Inkomst (SEK)");



      // Style för X-axeln
    svg.selectAll(".x-axis text")
        .style("fill", "#3C32BF")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("font-weight", "600")
        .style("letter-spacing", "0.5px");

    svg.selectAll(".x-axis path")
        .style("stroke", "#3C32BF")
        .style("stroke-width", "2px");

    svg.selectAll(".x-axis line")
        .style("stroke", "#3C32BF")
        .style("stroke-width", "1px");

    // Style för Y-axeln
    svg.selectAll(".y-axis text")
        .style("fill", "#3C32BF")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("font-weight", "600")
        .style("letter-spacing", "0.5px");

    svg.selectAll(".y-axis path")
        .style("stroke", "#3C32BF")
        .style("stroke-width", "2px");

    svg.selectAll(".y-axis line")
        .style("stroke", "#3C32BF")
        .style("stroke-width", "1px");
    

    const points = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", d => x(d.attendance))
      .attr("cy", d => y(d.djEarnings))
      .attr("fill", d => color(d.djGender))
      .style("stroke", "#c5c5c5") // vit kant
      .style("stroke-width", 0.8)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(300).style("opacity", 1)
          .on("end", () => tooltip.classed("show", true));
        tooltip.html(`
          <strong>${d.djName}</strong><br>
          Kön: ${d.djGender}<br>
          Etnicitet: ${d.djEthnicity}<br>
          Gäster: ${d.attendance}<br>
          Inkomst: ${d.djEarnings} kr
        `);
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr("r", 8)
          .style("filter", "drop-shadow(0 0 6px #3C32BF) drop-shadow(0 0 10px #3C32BF)")
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", (event) => {
        tooltip.transition().duration(200).style("opacity", 0)
          .on("end", () => tooltip.classed("show", false));
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr("r", 5)   // Går tillbaka
          .style("filter", "none");
      });
      /*
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });*/
    

    function applyFilters() {
      const selectedGender = d3.select("#genderFilter").property("value");
      const selectedEthnicity = d3.select("#ethnicityFilter").property("value");
      const selectedYear = d3.select("#yearFilter").property("value");

      points
        .transition()       
        .duration(500) 
        .ease(d3.easeCubic)    // (millisekunder), 500 = 0.5 sekunder och ease
        .attr("opacity", d => {
            const genderMatch = selectedGender === "all" || d.djGender === selectedGender;
            const ethnicityMatch = selectedEthnicity === "all" || d.djEthnicity === selectedEthnicity;
            const yearMatch = selectedYear === "all" || d.year == selectedYear;
            return genderMatch && ethnicityMatch && yearMatch ? 1 : 0.1;
        });
    }

    d3.selectAll("select").on("change", applyFilters);


    






    /* const points = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cx", d => x(d.attendance))
      .attr("cy", d => y(d.djEarnings))
      .attr("fill", d => color(d.djGender))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`<strong>${d.djName}</strong><br>Kön: ${d.djGender}<br>Etnicitet: ${d.djEthnicity}<br>Gäster: ${d.attendance}<br>Inkomst: ${d.djEarnings} kr`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0)); */