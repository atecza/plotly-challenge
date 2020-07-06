


function addID(myData){
    //need to add a value
    d3.select("#selDataset").selectAll('option')
    .data(myData) //binding data to non existant tr
    .enter() //this takes account of the length of the data
    .append('option')
    .html(function(d){
        return `<option>${d}</option>`;
    });
}

function buildBar(data){
    //need to figure out how to sort ALL data in dictionary by one key's values
    
    //select only the top 10
    //sort((a,b) => b-a)
    var valuesTop = data[0].sample_values.slice(0,10).reverse();

    console.log(valuesTop)

    //need to figure out how to get the data that matches the above
    var labelsTop = data[0].otu_ids.slice(0,10).reverse();
    var yticks = labelsTop.map(otuID => `OTU ${otuID}`)

    //plug them into the graph
    var graphData = [{
        type: 'bar',
        x: valuesTop,
        y: yticks,
        text: labelsTop,
        orientation: 'h'
      }];
    
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 90 }
    };
  
      Plotly.newPlot('bar', graphData, barLayout);
}

// build the bubble chart function
function buildBubble(mydata) {
    
    var sampleValues = mydata[0].sample_values
    var otuID = mydata[0].otu_ids
    var otuLabels = mydata[0].otu_labels

    console.log(`sampleValues: ${sampleValues}`)
    console.log(`otuLabels: ${otuLabels}`)
    var largestValue = Math.max.apply(Math, sampleValues)

    //scale the sizes
    var resizeSV = sampleValues.map(d => (d/largestValue)*130)
    console.log(`resized sample values: ${resizeSV}`)


    var trace1 = {
        x: otuID,
        y: resizeSV,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: resizeSV,
            color: otuID,
            
        }
    };
      
    var data = [trace1];
      
    var layout = {
        title: 'Marker Size and Color',
        showlegend: false,
        height: 500,
        width: 1200
    };
    
    Plotly.newPlot('bubble', data, layout);
}

// build function for demographic info

function buildDemTable(mydata){

    var data = mydata[0]
    console.log(mydata)

    var selection = d3.select('#sample-metadata').selectAll('ul').data(data);

    
    selection.enter()
        .append('ul')
        .merge(selection)
        .classed('list-group', true)
        .html(function(d){
        return `<li> id:${d.id} </li><li> ethnicity:${d.ethnicity} </li><li> gender:${d.gender}</li>`;
    });

    //removes selection at the end so not always appending
    selection.exit().remove();
}

//build the gauge chart

function buildGauge(myData){

    washFreq = myData[0].wfreq
    console.log(`wash frequency: ${washFreq}`)

    var trace = {
    type: "pie",
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [100 / 5, 100 / 5, 100 / 5, 100 / 5, 100 / 5, 100],
    text: ["0-1", "2-3", "4-5", "6-7", "8-9", ""],
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: {
        colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"]
    },
    labels: ["very rarely", "rarely", "moderate", "often", "very often", ""],
    hoverinfo: "label"
    };


    var degrees = washFreq*9, radius = .5;
    console.log(`degrees: ${degrees}`)
    var radians = degrees * Math.PI / 180;
    var x = -1 * radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var layout = {
        shapes:[{
            type: 'line',
            x0: 0,
            y0: 0,
            x1: x,
            y1: y,
            line: {
                color: 'black',
                width: 8
            }
        }],
    
    title: 'Average Number of Washes Per Week',
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
    };
    
    var data = [trace];
    
    Plotly.plot('gauge', data, layout, {staticPlot: true});

}

//put everything together
function getData() {
    //wait for the promise 
    d3.json("data/samples.json").then((data) => {

        console.log(`Data`)
        console.log(data)

        var sampleData = data.samples
        console.log(`sample Data`)
        console.log(sampleData)

        var metaData = data.metadata
        //myData is an array of dictionaries. One for each person in the study
        console.log(`meta Data`)
        console.log(metaData)
        
        //get the unique ids into an array
        var subjectIDs = []

        sampleData.map(d => {subjectIDs.push(d.id)});

        //check to make sure everything is working
        console.log(`subject IDs: ${subjectIDs}`)

        //populate the selection table
        addID(subjectIDs)

        //get the selected value
        var selectedID = d3.select("#selDataset").property("value")
        console.log(`selectedID: ${selectedID}`)
        
        //pull only the data for the selected ID
        var selectedData = sampleData.filter(s => s.id === selectedID);

        //allowed it to look for number
        var selectedMeta = metaData.filter(s => s.id === parseInt(selectedID));
        
        console.log(`selectedData`)
        console.log(selectedData)

        console.log('selectedMeta')
        console.log(selectedMeta)

        //build the bar graph out of the selected dictionary
        buildBar(selectedData)

        buildBubble(selectedData)

        buildDemTable(selectedMeta)

        buildGauge(selectedMeta)

        

     });
}

getData()

