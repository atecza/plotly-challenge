


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
        title: "<b> Top 10 Bacteria Cultures Found </b>",
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

    /*scale the size of the markers
    before I decided to use sizeref under markers I did this:

    var largestValue = Math.max.apply(Math, sampleValues)
    var resizeSV = sampleValues.map(d => (d/largestValue)*130)
    console.log(`resized sample values: ${resizeSV}`)
    */


    var trace1 = {
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuID,
            colorscale: 'Rainbow',
            // Sets the scale factor used to determine the rendered size of 
            // marker points. Use with `sizemin` and `sizemode`. 
            sizeref: .025,
            //Has an effect only if `marker.size` is set to a numerical array. 
            //Sets the rule for which the data in `size` is converted to pixels.
            sizemode: 'area'
        }
    };
      
    var data = [trace1];
      
    var layout = {
        title: '<b> Sample Values by ID </b>',
        font: {
            size: 18
        },
        showlegend: false,
        height: 600,
        width: 1300,
        xaxis: {
            title: {
              text: 'OTU ID',
              font: {
                size: 12,
              }
            }
        },
        yaxis: {
            title: {
              text: 'Sample Value',
              font: {
                size: 12,
              }
            }
        }
    };
    
    Plotly.newPlot('bubble', data, layout);
}

// build function for demographic info

function buildDemTable(mydata){

    var data = mydata[0]
    console.log(mydata)

    var data2 = Object.entries(data)
    console.log(data2);


    var div = d3.select('#sample-metadata')
    var selection = div.selectAll('p').data(data2)

    //need to style this
    selection
        .enter()
        .append('p')
        .merge(selection)
        .text(d => `${d[0]}: ${d[1]}`)
        .style("font-size", "9px");

    //removes selection at the end so not always appending
    selection.exit().remove();
}

//build the gauge chart

function buildGauge(myData){

    washFreq = myData[0].wfreq
    console.log(`wash frequency: ${washFreq}`)
    var degrees = washFreq*18, radius = .5;

    console.log(`degrees: ${degrees}`)
    var radians = degrees * Math.PI / 180;
    var x = -1 * radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var y2 = y/2 + .5;
    var x2 = x/2 + .5;

    console.log(`x: ${x2}`)
    console.log(`y: ${y2}`)


    // A rotated base chart creation
    base_chart = {
        values: [5,5,5,5,5,5,5,5,5,5,5,45],
        text: ["0", "", "2", "", "4","","6","","8","","10",""],
        marker: {
            colors:["white", "white", "white", "white", "white", "white","white","white","white","white","white","white"],
            line: {
                width: 0
            }
        },
        name: "gauge",
        hole: .4,  
        type: "pie",
        direction: "clockwise",
        rotation: 100,
        showlegend: false,
        textinfo: "text",
        textposition: "outside",
        hoverinfo: "none"
    }
 

    var colorWheel = {
        values: [10, 10, 10, 10, 10, 50],
        text: ["1", "3", "5", "7", "9", ""],
        labels: ["very rarely", "rarely", "moderate", "often", "very often", ""],
        marker: {
            colors:["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"],
            line: {
                width: 1
            }
        },
        name: "gauge",
        hole: .4,  
        type: "pie",
        direction: "clockwise",
        rotation: 90,
        showlegend: false,
        textinfo: "text",
        textposition: "inside",
        hoverinfo: "label"
    }

    layout = {
        title: {
            text: "<b>Belly Button Wash Frequency</b><br>Scrubs per Week",
            size: 18,
            family: 'Courier New, bold'

        },
        xaxis: {
            showticklabels: false,
            showgrid: false,
            zeroline: false,
        },
        yaxis: {
            showticklabels: false,
            showgrid: false,
            zeroline: false,
        },
    
        //Creating the dial using a line shape
        shapes: [
            {
                type: 'path',
                // triangle centered on x .5 at a height of .5
                path: `M 0.5 0.5 L ${x2} ${y2} Z`,
                fillcolor: 'rgba(44, 160, 101, 0.5)',
                line: {
                    width: 5
                },
                xref: 'paper',
                yref: 'paper'
            }
        ],
        height: '500',
        width: '500',
        
    }

    //get rid of boarders
    base_chart['marker']['line']['width'] = 0
    colorWheel['marker']['line']['width'] = 0

    var data = [base_chart, colorWheel];

    Plotly.newPlot('gauge', data, layout);

}


//put everything together
function getData() {
    //wait for the promise 
    d3.json("data/samples.json").then((data) => {

        console.log(`Data`, data)

        var sampleData = data.samples
        console.log(`sample Data`, sampleData)

        var metaData = data.metadata
        //myData is an array of dictionaries. One for each person in the study
        console.log(`meta Data`, metaData)
        
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
        
        console.log(`selectedData`, selectedData)

        console.log('selectedMeta', selectedMeta)

        //build the bar graph out of the selected dictionary
        buildBar(selectedData)

        buildBubble(selectedData)

        buildDemTable(selectedMeta)

        buildGauge(selectedMeta)

        

     });
}

getData()

