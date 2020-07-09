.catch((err) => {
    console.log(err)
});

//why do I need this for them to be defined
console.log(`id: ${id}, 
                        otu_ids:${otu_ids}
                        sample_values:${sample_values}
                        otu_labels: ${otu_labels}`)

sampleData.forEach(d => {
    var id = d.id;
    var otu_ids = d.otu_ids;
    var sample_values = d.sample_values;
    var otu_labels = d.otu_labels;
    });

  // clear the input value
  d3.select("#selDataset").node().value = "";



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

    console.log(`x: ${x}`)

    var trace2 = {
        type: 'scatter',
        

    }

    var layout = {
        title: 'Average Number of Washes Per Week',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
    };

    
    var data = [trace, trace2];
    
    Plotly.plot('gauge', data, layout, {staticPlot: true});

}

domain: {"x": [0, .48]},