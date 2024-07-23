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
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "black")
    .style("color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

// load data
d3.json(dataUrl).then((data) => {

    const baseTemperature = data.baseTemperature;
    const dataset = data.monthlyVariance;
    console.log(dataset);

    // format data
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = dataset.map(d => d.year);
    const temperatures = dataset.map(d => d.variance + baseTemperature);



    // create scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(year) - 1, d3.max(year) + 1])
        .range([margin.left, width - margin.right]);
    const yScale = d3.scalePoint()
        .domain(month)
        .range([height - margin.bottom, margin.top]);

    // create axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d, i) => month[i]);

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
    const colorRange = ["#4575B4", "#74ADD1","#ABD9E9","#E0F3F8","#FFFFBF","#FEE090", "#FDAE61", "#F46D43", "#D73027", "#A50026"];
    const colorScale = d3.scaleLinear()
        .domain(d3.extent(temperatures))
        .range(colorRange)
        

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
    console.log(colorScale.domain())
    // create legend axis
    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat((d) => `${d}°C`)
        .ticks(10);

    // add legend axis
    legendContainer
        .append("g")
        .attr("transform", `translate(${legendMargin.left},${legendMargin.top + legendHeight})`)
        .call(legendAxis);





    //const legend = d3.legendGroup()
});