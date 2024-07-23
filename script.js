const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

//set dimensions
const width = 800,
    height = 400,
    margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 60
    };

// create svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// create div for tooltip
const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

// load data
d3.json(dataUrl).then((data) => {

    const baseTemperature = data.baseTemperature;
    const dataset = data.monthlyVariance;


    // format data
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = dataset.map(d => d.year);
    const temperatures = dataset.map(d => d.variance + baseTemperature);

    // change h2
    document.getElementById("sub").textContent = `${d3.min(year)} - ${d3.max(year)}: base temperature ${baseTemperature}°C`;



    // create scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(year) - 1, d3.max(year) + 1])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
        .domain(month)
        .range([height - margin.bottom, margin.top]);


    // create axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);


    // add axes
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .attr("id", "x-axis");
    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .attr("id", "y-axis");

    // create color scale
    const colorRange = ["#4575B4", "#74ADD1", "#ABD9E9", "#E0F3F8", "#FFFFBF", "#FEE090", "#FDAE61", "#F46D43", "#D73027", "#A50026"];
    const colorScale = d3.scaleQuantize()
        .domain(d3.extent(temperatures))
        .range(colorRange);

    // draw heat map
    const bandWidth = (width - margin.left - margin.right) / (d3.max(year) - d3.min(year));
    const bandHeight = yScale.bandwidth();
    const heatMap = svg
        .append("g")
        .attr("class", "heat-map")
        .selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(month[d.month - 1]))
        .attr("width", bandWidth)
        .attr("height", bandHeight)
        .attr("data-month", d => (month[d.month - 1]))
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance + baseTemperature)
        .style("fill", d => colorScale(d.variance + baseTemperature));

    // add event listeners
    heatMap.on("mouseover", function(event, d) {
        d3.select(this).classed("cell-hover", true);

        // show tooltip
        tooltip.html(
            `<p>${d.year} - ${month[d.month - 1]}</p>
            <p>${d3.format(".1f")(d.variance + baseTemperature)}°C</p>
             <p>${d3.format(".1f")(d.variance)}°C</p>`
        )
        const offsetX = tooltip.node().getBoundingClientRect().width / 2;
        const offsetY = tooltip.node().getBoundingClientRect().height*2; 
        tooltip.transition()
            .duration(0)
            .style("opacity", 0.8)
            .style("left", (event.pageX)- offsetX + "px")
            .style("top", yScale(month[d.month - 1]) + height- offsetY + "px");
    })
        .on("mouseout", function() {
            d3.select(this).classed("cell-hover", false);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // legend variables
    const legendHeight = 30;
    const legendWidth = 300;
    const legendMargin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 0
    };

    // set up container for legend
    const legendContainer = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${margin.left},${height - margin.bottom + legendMargin.top})`);

    // create gradient for the legend
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient");

    // define gradient stops
    colorRange.forEach((color, i) => {
        linearGradient.append("stop")
            .attr("offset", `${(i / (colorRange.length - 1)) * 100}%`)
            .attr("stop-color", color);
    })

    // draw rect and fill with gradient
    legendContainer
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("x", legendMargin.left)
        .attr("y", legendMargin.top)
        .attr("fill", "url(#legend-gradient)");

    // create scale for legend
    const legendScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([0, legendWidth]);
    
    // create legend axis
    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat((d) => `${d}°C`)
        .ticks(10);

    // add legend axis
    legendContainer
        .append("g")
        .attr("transform", `translate(${legendMargin.left},${legendMargin.top + legendHeight})`)
        .call(legendAxis);


});