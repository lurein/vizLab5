
// CHART INIT ------------------------------**
let type = d3.select('select').node().value
let prevY = 0

// create svg with margin convention
const margin = ({top: 20, right: 20, bottom: 20, left: 60});
const width = 700 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;
const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales without domains
const xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)

const yScale = d3
    .scaleLinear()
    .range([height, 0])

// create axes and axis title containers
const xAxis = d3.axisBottom()
    .scale(xScale)
    
// drawing the x-axis
var bottomAxis = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

const yAxis = d3.axisLeft()
    .scale(yScale)

var leftAxis = svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0, 0)`)
    .call(yAxis);


svg.append("text")
    .attr("class", "y-axis-title")
    .attr('x', 0)
    .attr('y', 0)
    .text("Stores");

// (Later) Define update parameters: measure type, sorting direction

// CHART UPDATE FUNCTION -------------------**
function update(data, type){
    console.log(data)
    data.sort(ascendingSort)
    // update domains
    xScale.domain(data.map(function(d) { return d.company; }));
    yScale.domain([0, d3.max(data, function(d) { return d[type]; })]);
    // update bars
    svg.selectAll(".bar").remove()

    const bars = svg.append('g')
        .selectAll(".bar")
        .data(data)
        .enter()
        .append('rect')
            .attr("class", "bar")
            .attr('x', d=>xScale(d.company) )
            .attr('y', function(d) { return yScale(d[type]) } )
            .transition()
            .duration(1000)
            .attr('width', xScale.bandwidth())
            .attr('height', d=>height - yScale(d[type]))
            .style("fill", 'steelblue');

    // update axes and axis title
    const xAxis = d3.axisBottom()
    .scale(xScale)

    const yAxis = d3.axisLeft()
    .scale(yScale)

    bottomAxis.call(xAxis)
    leftAxis.call(yAxis)

    function ascendingSort(a, b) {
        let comparison = 0;
        if (a[type] > b[type]) {
            comparison = 1;
        } else if (a[type] < b[type]) {
            comparison = -1;
        }
        return comparison;
    }

    function descendingSort(a, b) {
        let comparison = 0;
        if (a[type] < b[type]) {
            comparison = 1;
        } else if (a[type] > b[type]) {
            comparison = -1;
        }
        return comparison;
    }

}

// CHART UPDATES ---------------------------**

// Loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
	update(data, type); // simply call the update function with the supplied data**
});

// (Later) Handling the type change
function selectorChanged() {
    type = d3.select('select').node().value
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
        update(data, type); // simply call the update function with the supplied data**
    });

    d3.selectAll(".bar")
}

// (Later) Handling the sorting direction change
