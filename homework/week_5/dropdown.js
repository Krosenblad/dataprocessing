/*	Kajsa Rosenblad
	11361840
	This javascript document contains two functions, one to draw the HPI map, and one to draw the map
	displaying average wellbeing. 
*/

function HPI (values, index){
		console.log(index)
		var dataset = {};
		
		// Get min and max values for colours showing how well the countries are doing
		var min = Math.min.apply(null, values),
			max = Math.max.apply(null, values);

		var colours = d3.scale.linear()
			.domain([min, max])
			.range(["#9370DB","#4B0082"]);

		index.forEach(function(item){
			var iso = item[0],
				value = item[1]
			dataset[iso] = {numberOfThings: value, fillColor: colours(value)};
		});

		// Create new map, fill the div container
		var map = new Datamap({
		element: document.getElementById("container"),

		// Projection of map (mercator), plus coordinates centred on Stockholm 
		setProjection: function(element){
			var projection = d3.geo.mercator()
				.center([18.0685808, 59.3293235])
				.scale(900)

			var path = d3.geo.path()
				.projection(projection)

			return {path: path, projection: projection};
		},
		fills: {defaultFill: '#F5F5F5'},

		// Highlight border when hovered
		data: dataset,
		geographyConfig:{
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        
        highlightFillColor: function(geo){
            return geo["fillColor"] || "#F5F5F5";
        },
        highlightBorderColor:"#B7B7B7",

        // Popup showing information about HPI, link to other dataset
        popupTemplate: function(geo, data){                   
            if(!data){return;}

            // Get data from the hover, restore all possible inflated circles
            var country = geo.properties.name
            
            d3.selectAll("."+ "Norway")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Sweden")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Finland")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Denmark")
            	.attr("r", 5)
            	.style("stroke", "none")

            // Inflate the circles of the scatterplot corresponding with the mousehover
            var bigger = d3.selectAll("." + country)
            .attr("r", 10)
            .style("stroke", "red");

            return['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>HPI rank: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');
            }
		}
	});
}


// Function to set map to display wellbeing
function update (values, index){
		
		var dataset = {};
		
		// Min and max values for colours
		var min= Math.min.apply(null, values),
			max = Math.max.apply(null, values);

		
		var colours = d3.scale.linear()
			.domain([min, max])
			.range(["#CCCCFF","#2A52BE"]);

		index.forEach(function(item){
			var iso = item[0],
				value = item[1]
			dataset[iso] = {numberOfThings: value, fillColor: colours(value)};
		});

		// New Map, fill it with new data
		var map = new Datamap({
		element: document.getElementById("container"),
		
		setProjection: function(element){
			var projection = d3.geo.mercator()
				.center([18.0685808, 59.3293235])
				.scale(900)

			var path = d3.geo.path().projection(projection);
				return {path: path, projection: projection};
		},
		
		fills: { defaultFill:"#F5F5F5"},
		data: dataset,
		geographyConfig:{
        borderColor:"#DEDEDE",
        highlightBorderWidth: 2,
        
        highlightFillColor: function(geo){
            return geo["fillColor"] || "#F5F5F5";
        }, 
        highlightBorderColor:"#B7B7B7",

        popupTemplate: function(geo, data){
            if(!data){return;}
            
            // Get data from hover, restore any inflated circles
            var country = geo.properties.name
            
            d3.selectAll("."+ "Norway")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Sweden")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Finland")
            	.attr("r", 5)
            	.style("stroke", "none")
            d3.selectAll("."+ "Denmark")
            	.attr("r", 5)
            	.style("stroke", "none")

            // Inflate the circles corresponding with the mouseover
            var bigger = d3.selectAll("." + country)
	            .attr("r", 10)
	            .style("stroke", "red");

            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Wellbeing: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');

            }
		}
	});
}

