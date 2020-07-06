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