

// Step 1 - function to initialize the dashboard 
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log("i ran");
  // Use the list of sample names to populate the select options
  d3.json("assets/data/samples.json").then((data) => {

    var sampleNames = data.names;
    console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildChart(firstSample);
    buildMetadata(firstSample);
  });
}

// Evoke the function Initialize the dashboard
init();

// optional 
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildChart(newSample);

}

// Step 2: Build a function for Demographics Panel 
function buildMetadata(sample) {
  d3.json("assets/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel. Inside the loop, you will need to use d3 to append new. tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}




//Step 3 - Create the Build Chart
function buildChart(sample) {
  //Use d3.json to load and retrieve the samples.json file 
  d3.json("assets/data/samples.json").then((data) => {
    //Create a variable that holds the samples array.
    var samples = data.samples;

    //Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
 
    //Create a variable that holds the first sample in the array.
    var result = resultArray[0]

    //Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels.slice(0, 10).reverse();
    var values = result.sample_values.slice(0, 10).reverse();

    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;

    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0, 10).reverse();

    console.log(yticks)

    //Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels
    }];
    //Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


  });
}



