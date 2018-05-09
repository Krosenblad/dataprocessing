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
			console.log(happy['0']["Average Wellbeing(0-10)"])
			
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
		
		fills: { defaultFill: '#F5F5F5' }
	});


		wellbeing.onclick = function(d){
			document.getElementById('container').innerHTML = "";
			update(values_well, rank_wellbeing)
		}

		hpi.onclick = function(e){
			console.log("hoi")
			document.getElementById('container').innerHTML = "";
			HPI(values, rank)
		}

		// End of queue
		};
	
// End of file	
}; 
