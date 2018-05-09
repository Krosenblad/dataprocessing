function HPI (values, index){
		// Set map to display HPI as default
		var dataset = {};
		
		console.log("")
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


		var map = new Datamap({
		
		element: document.getElementById('container'),
		//projection: 'mercator',
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
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',

         popupTemplate: function(geo, data) {
            
            // don't show tooltip if country don't present in dataset
            if (!data) { return ; }

            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>HPI (out of 140): <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');

            }
		}
	});
}





function update (values, index){
		
		var dataset = {};
		
		
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


		var map = new Datamap({
		
		element: document.getElementById('container'),
		//projection: 'mercator',
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
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',

         popupTemplate: function(geo, data) {
            
            // don't show tooltip if country don't present in dataset
            if (!data) { return ; }

            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Wellbeing: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');

            }
		}
	});

}