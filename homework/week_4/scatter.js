/* Kajsa Rosenblad 11361840
Thanks to https://github.com/d3/d3-request for the documentation on the get request,
http://bl.ocks.org/d3noob/7030f35b72de721622b8 for the update function, https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9 for the color scheme,
and a special thanks to the assistants who helped me tackle this mountain of data.
*/

window.onload = function(){

// Data covering wellbeing in the scandinavian countries
var scandinavia = "https://stats.oecd.org/SDMX-JSON/data/RWB/DK01+DK02+DK03+DK04+DK05+FI19+FI1B+FI1C+FI1D+FI20+NO01+NO02+NO03+NO04+NO05+NO06+NO07+SE11+SE12+SE21+SE22+SE23+SE31+SE32+SE33.UNEM_RA+LIFE_EXP.VALUE/all?startTime=2000&endTime=2014"

function callback(data){

	// Create empty arrays to store values per year
	var year00 = []
	var year14 = []
	
	// Dive into data, push all value pairs to separate lists
	var keys = Object.keys(data.dataSets["0"].series);
	
	keys.forEach(function(d){
		var dx = d.substring(0,2);
		keys.forEach(function(e){
			var ex = e.substring(0,2);
			if (dx === ex){
				var coordinates00 = []
				var coordinates14 = []
				coordinates00.push(data.dataSets["0"].series[d].observations[0][0])
				coordinates00.push(data.dataSets["0"].series[e].observations[0][0])
				year00.push(coordinates00)
				coordinates14.push(data.dataSets["0"].series[d].observations[1][0])
				coordinates14.push(data.dataSets["0"].series[e].observations[1][0])
				year14.push(coordinates14)
			}	

		})})
	
	// Since my data is being stored twice (for some inexplicable reason,
	// I need to create proper coordinates for the year 2000 and 2014, and remove repetative value pairs
	var coordinates00 = []
	var coordinates14 = []
	
	for (var i = 0; i < year00.length/2; i++) {
		
		if (i % 2 != 0) {
			
			coordinates00.push(year00[i])
			coordinates14.push(year14[i])	
		}
	}

	// I was unable to access the specific countrycodes. I tried using this object path: Object.keys(data.structure.dimensions.series["0"].values["0"].id); 
	// but all I got back was an array with numbers 0-3, regardless of the country. I decided to hardcode which data items belong to which countries. 
	norway = [0, 1, 7, 15, 18, 20, 21]
	sweden = [4, 5, 8, 10, 11, 14, 17, 19]
	denmark = [2, 9, 16, 23, 24]
	finland = [3, 6 , 12, 13, 22]
	no00 = []
	no14 = []
	se00 = []
	se14 = []
	de00 = []
	de14 = []
	fi00 = []
	fi14 = []

	// Looping throught the data, pushing the coordinates and their respective country to lists, one per year and country.
	for (var i = 0; i < coordinates00.length; i ++){

		for (var k = 0; k < coordinates00.length; k++){
			if (norway[i] == k) {
				coordinates00[k].push("norway")
				no00.push(coordinates00[k])
				coordinates14[k].push("norway")
				no14.push(coordinates14[k])
			}
			if (sweden[i] == k){
				coordinates00[k].push("sweden")
				se00.push(coordinates00[k])
				coordinates14[k].push("sweden")
				se14.push(coordinates14[k])
			}
			if (denmark[i] == k){
				coordinates00[k].push("denmark")
				de00.push(coordinates00[k])
				coordinates14[k].push("denmark")
				de14.push(coordinates14[k])
			}
			if (finland[i]== k) {
				coordinates00[k].push("finland")
				fi00.push(coordinates00[k])
				coordinates14[k].push("finland")
				fi14.push(coordinates14[k])
			}
		}
	}

	// Create outer boundry for my svg canvas
	var marigin = {top: 20, right: 20, bottom: 30, left: 40},
		w = 900 - marigin.left - marigin.right,
		h = 450 - marigin.top - marigin.bottom;

    // Set x scale to capture life expectancy
    var xScale = d3.scaleLinear()
         .domain([d3.min(coordinates00, function(d) { return d[0]; }), d3.max(coordinates00, function(d) { return d[0]; })])
         .range([0, w]);
    
    // Set y scale to measure unemployement
    var yScale = d3.scaleLinear()
         .domain([d3.min(coordinates00, function(d) { return d[1]; }), d3.max(coordinates00, function(d) { return d[1]; })])
         .range([0, h]);

    // Initiate svg canvas
    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", w + marigin.left + marigin.right)
    	.attr("height", h + marigin.top + marigin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + marigin.left + "," + marigin.top + ")");

    //Circles for the entire year 2000, colored according to their country
    svg.selectAll("circle")
    	.data(coordinates00)
    	.enter()
    	.append("circle")
    	.attr("class", function(d) { return d[2]})
    	// x axis measures life expectancy
    	.attr("cx", function(d) {
    		return xScale(d[0]) + 7;
    		})
    	// y axis measures unemployement
    	.attr("cy", function(d){
    		return yScale(d[1])- 7;
    	})
    	.attr("r", 5);
    
    // Scale for the yAxe
    var yAxe = d3.scaleLinear()
        	.domain([d3.max(coordinates00, function(d) { return d[1]; }), d3.min(coordinates00, function(d) { return d[1]; })])
        	.range([0, h]);
    
    // Scale for the xAxe
    var xAxe = d3.scaleLinear()
    		.domain([d3.min(coordinates00, function(d) { return d[0]; }), d3.max(coordinates00, function(d) { return d[0]; })])
         	.range([0, w]);
    
    // Y axis, displaying values from 0-15
    var yAxis = d3.axisLeft(yAxe)
			.ticks(3);	
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (0) + ",0)")
		.call(yAxis);

	// Text for y axis
	svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 30)
	.attr("x", -170)
	.style("text-anchor", "middle")
	.text("Unemployement Rate (%)");

	// X axis, displaying life expectancy
	var xAxis = d3.axisBottom(xAxe)
		.ticks(5);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h) + ")")
		.call(xAxis);

	// Text for y axis
	svg.append("text")
	.attr("y", 390)
	.attr("x", 400)
	.style("text-anchor", "middle")
	.text("Life Expectancy");

	// Create array of countries for the legend
	var land = ["Sweden", "Norway", "Denmark", "Finland"]
	
	// Import color scheme
	var color = d3.scaleOrdinal(d3.schemeCategory20);

	// Create legend with country names and country color
	var legend = svg.selectAll('legend')
		.data(land)
		.enter().append('g')
		.attr('class', 'legend')
		.attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

	legend.append('rect')
		.attr('x', w)
		.attr("y", 300)
		.attr('width', 18)
		.attr('height', 18)
		.style('fill', color);

	// Add text to the legend elements
	legend.append('text')
		.attr('x', w - 6)
		.attr('y', 305)
		.attr('dy', '.35em')
		.style('text-anchor', 'end')
		.text(function(d){ return d;});

	svg.append("text")
		.attr("x", 860)
		.attr("y", 280)
		.attr('dy', '.35em')
		.style('text-anchor', 'end')
		.text("Countries, per region");


	// Update function, linked to button "2014"
	function updateData() {
    	
    svg.selectAll("circle").remove();
    
    // Set x scale to capture new life expectancy
    var newxScale = d3.scaleLinear()
         .domain([d3.min(coordinates14, function(d) { return d[0]; }), d3.max(coordinates14, function(d) { return d[0]; })])
         .range([0, w]);
    
    // Set y scale to capture new unemployement rate
    var newyScale = d3.scaleLinear()
         .domain([d3.min(coordinates14, function(d) { return d[1]; }), d3.max(coordinates14, function(d) { return d[1]; })])
         .range([0, h]);
 
    // Append new circles for year 2014
    svg.selectAll("circle")
    	.data(coordinates14)
    	.enter()
    	.append("circle")
    	.attr("class", function(d) { return d[2]})
    	// x axis measures life expectancy
    	.attr("cx", function(d) {
    		return newxScale(d[0]) + 7;
    		})
    	// y axis measures unemployement
    	.attr("cy", function(d){
    		return newyScale(d[1])- 7;
    	})
    	.attr("r", 5);
    
	}

	document.getElementById("updateButton").onclick = updateData;

	// Restore function, linked to button "2000"
	function restoreData(){
	
	svg.selectAll("circle").remove();

    // Set x scale to capture life expectancy
    var xScale = d3.scaleLinear()
         .domain([d3.min(coordinates00, function(d) { return d[0]; }), d3.max(coordinates00, function(d) { return d[0]; })])
         .range([0, w]);
    
    // Set y scale to measure unemployement
    var yScale = d3.scaleLinear()
         .domain([d3.min(coordinates00, function(d) { return d[1]; }), d3.max(coordinates00, function(d) { return d[1]; })])
         .range([0, h]);

    //Circles for the entire year 2000
    svg.selectAll("circle")
    	.data(coordinates00)
    	.enter()
    	.append("circle")
    	.attr("class", function(d) { return d[2]})
    	.attr("cx", function(d) {
    		return xScale(d[0]) + 7;
    		})
    	.attr("cy", function(d){
    		return yScale(d[1])- 7;
    	})
    	.attr("r", 5);

	}
	document.getElementById("restore").onclick = restoreData;

}

// Callback for data request
d3.request(scandinavia)
    .get(function(xhr) {callback(JSON.parse(xhr.responseText))});
};   


