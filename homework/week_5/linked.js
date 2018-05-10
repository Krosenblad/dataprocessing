window.onload = function() {

  // Import data from oecd 
  var scandinavia = "https://stats.oecd.org/SDMX-JSON/data/RWB/DK01+DK02+DK03+DK04+DK05+FI19+FI1B+FI1C+FI1D+FI20+NO01+NO02+NO03+NO04+NO05+NO06+NO07+SE11+SE12+SE21+SE22+SE23+SE31+SE32+SE33.UNEM_RA+LIFE_EXP.VALUE/all?startTime=2000&endTime=2014"
	
  // Queue data with happiness index
  	var q = d3.queue()
		.defer(d3.request, scandinavia)
		.defer(d3.json, "scandi.json")
		.awaitAll(queued);
		  

		function queued(error, response) {
		  if (error) throw error;

			var happy = response[1]
			
			
			names = ["SWE", "DNK", "FIN", "NOR"]
			
			//HPI rank + values
			rank = []
			values = []
			
			// Average well being + values
			values_well=[]
			rank_wellbeing = []
			
			for (let i = 0; i < happy.length; i ++){
				push = []
				push_it=[]
				
				push.push(names[i])
				push.push(Number(happy[i]["HPI Rank"]))
				values.push(Number(happy[i]["HPI Rank"]))
				rank.push(push)
				
				push_it.push(names[i])
				push_it.push(Number(happy[i]["Average Wellbeing(0-10)"]))
				values_well.push(Number(happy[i]["Average Wellbeing(0-10)"]))
				rank_wellbeing.push(push_it)
			}

			// Parse data from response
			var scand = JSON.parse(response[0].responseText)

		// Initiate start map
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

		/* Try to get interaction going, only thing I've managaed so far is to remove regions 
		from the scatterplot (not my intention), I want to be able to resize and re-colour them*/
 		done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            country = geography.properties.name

            bigger = document.getElementsByClassName(country)
            console.log(bigger)


            for (let i = 0; i < bigger.length; i ++){
            	console.log(bigger[i])
            	bigger[i].remove();

            }
        });
    }
	});


		// Function for initiating wellbeing map
		wellbeing.onclick = function(d){
			document.getElementById('container').innerHTML = "";
			update(values_well, rank_wellbeing)
		}

		// Function for initiating hpi map
		hpi.onclick = function(e){
			console.log("hoi")
			document.getElementById('container').innerHTML = "";
			HPI(values, rank)
		}
		// Callback for creation of scatterplot
		final = JSON.parse(response[0].responseText)
		callback(final)
		// End of queue
		};

		
	
// End of file	
}; 
