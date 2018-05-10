// Set map to display HPI
function HPI (values, index){
		
		var dataset = {};
		
		// Get min and max values for colours
		var min= Math.min.apply(null, values),
			max = Math.max.apply(null, values);

		var colours = d3.scale.linear()
			.domain([min, max])
			.range(["#9370DB","#4B0082"]);

		rank.forEach(function(item){
			var iso = item[0],
				value = item[1]
			dataset[iso] = {numberOfThings: value, fillColor: colours(value)};
		});

		// Create new map...
		var map = new Datamap({
		
		element: document.getElementById('container'),

		
		setProjection: function(element){
			var projection = d3.geo.mercator()
			.center([18.0685808, 59.3293235])
			.scale(900)

		var path = d3.geo.path()
		.projection(projection)

		return {path: path, projection: projection};
		},
		
		fills: { defaultFill: '#F5F5F5' },

		// Highlight border when hovered
		data: dataset,
		
		geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        
        highlightBorderColor: '#B7B7B7',

        // Popup showing information about HPI
        popupTemplate: function(geo, data) {
            
            
            if (!data) { return ; }

            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>HPI (out of 140): <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');

            }


		}
	});
}




// Set map to display wellbeing
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

		// New Map
		var map = new Datamap({
		
		element: document.getElementById('container'),
		
		setProjection: function(element){
			var projection = d3.geo.mercator()
			.center([18.0685808, 59.3293235])
			.scale(900)

		var path = d3.geo.path().projection(projection);
		return {path: path, projection: projection};
		},
		
		fills: { defaultFill: '#F5F5F5' },
		data: dataset,
		
		geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        
        highlightBorderColor: '#B7B7B7',

         popupTemplate: function(geo, data) {
            
            
            if (!data) { return ; }

            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Wellbeing: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');

            }
		}
	});

}