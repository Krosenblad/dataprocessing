/*	Kajsa Rosenblad
	11361840
	This javascript document collects the two datasets and puts them in a queue. It processes the 
	JSON doc, and sends the oecd data to the callback function. Two eventlisteners listen for clicks to change
	the datasets of the world map. 
*/

window.onload = function(){

	// Import data from OECD
	var scandinavia = "https://stats.oecd.org/SDMX-JSON/data/RWB/DK01+DK02+DK03+DK04+DK05+FI19+FI1B+FI1C+FI1D+FI20+NO01+NO02+NO03+NO04+NO05+NO06+NO07+SE11+SE12+SE21+SE22+SE23+SE31+SE32+SE33.UNEM_RA+LIFE_EXP.VALUE/all?startTime=2000&endTime=2014"
	
  	// Queue data with happiness index
	var q = d3.queue()
		.defer(d3.request, scandinavia)
		.defer(d3.json, "scandi.json")
		.awaitAll(queued);
		  
	// Initiate queue function, processes json file
	function queued(error, response){
	  if (error) throw error;
		
		var happy = response[1]
		var names = ["SWE", "DNK", "FIN", "NOR"]
		
		// Lists for HPI rank + values
		var rank = []
		var values = []
		
		// Lists for Average well being + values
		var rankWellbeing = []
		var valuesWell=[]
		
		for (var i = 0; i < happy.length; i ++){
			
			// Create two temporary lists
			var push = []
			var pushWell=[]
			
			//Push data for HPI rank
			push.push(names[i])
			push.push(Number(happy[i]["HPI Rank"]))
			values.push(Number(happy[i]["HPI Rank"]))
			rank.push(push)
			
			// Push data for wellbeing
			pushWell.push(names[i])
			pushWell.push(Number(happy[i]["Average Wellbeing(0-10)"]))
			valuesWell.push(Number(happy[i]["Average Wellbeing(0-10)"]))
			rankWellbeing.push(pushWell)
		}
	
	// Parse data from response
	var scand = JSON.parse(response[0].responseText)

	// Call HPI map with the appropriate values
	HPI(values, rank)

	// Function for initiating wellbeing map
	wellbeing.onclick = function(d){
		document.getElementById('container').innerHTML = "";
		update(values_well, rank_wellbeing)
		document.getElementById("name").innerHTML = "Average Wellbeing (0-10)";
	}

	// Function for initiating hpi map
	hpi.onclick = function(e){
		document.getElementById('container').innerHTML = "";
		HPI(values, rank)
		document.getElementById("name").innerHTML= "Happy Planet Index, rank out of 140 countries";
	}
	
	// Callback for creation of scatterplot
	final = JSON.parse(response[0].responseText)
	callback(final)
	
	// End of queue
	};			
// End of file	
}; 
