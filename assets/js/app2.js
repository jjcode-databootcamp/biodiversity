//This file does refactor the charts and seperates it out into their own function for readability purposes 

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
    baseBuildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Evoke the function Initialize the dashboard
init();

// optional 
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  baseBuildCharts(newSample);

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



//Step 3 - Create the Build Chart Base Function 

function baseBuildCharts(sample) {
  //Use d3.json to load and retrieve the samples.json file 
  d3.json("assets/data/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    //Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    //Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels.slice(0, 10).reverse();
    var values = result.sample_values.slice(0, 10).reverse();

    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;

    //Evoke the function to build bar, bubble, gauge chart and pass the values it needs 
    buildBarChart(ids, labels, values)
    buildBubbleChart(ids, bubbleLabels, bubbleValues)
    buildGaugeChart(data, sample)

  });
}


// Step 3a - Build Bar Chart  
function buildBarChart(inputIds, inputLabels, inputValues ) {
   // Create the yticks for the bar chart.  Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
  var yticks = inputIds.map(sampleObj => "OTU " + sampleObj).slice(0, 10).reverse();

    console.log(yticks)

    //Create the trace for the bar chart. 
    var barData = [{
      x: inputValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: inputLabels,
      marker: {
        color: 'rgb(158,202,225)',
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5,
        }
      }
    }];
    //Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };
    //Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


}


// Step 3b - Build Bubble Chart 
function buildBubbleChart(inputIds, inputBubbleLabels, inputBubbleValues) {
  //Create the trace for the bubble chart.
  var bubbleData = [{
    x: inputIds,
    y: inputBubbleValues,
    text: inputBubbleLabels,
    mode: "markers",
    marker: {
      size: inputBubbleValues,
      color: inputBubbleValues,
      colorscale: "Portland"
    }
  }];

  //Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "<b>Bacteria Cultures Per Sample</b>",
    xaxis: { title: "OTU ID" },
    automargin: true,
    hovermode: "closest"
  };

  //Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout)


}

// Step 3c - Build Gauge Chart 
function buildGaugeChart(inputData, inputSample) {
  //Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = inputData.metadata;
  var gaugeArray = metadata.filter(metaObj => metaObj.id == inputSample);

  //Create a variable that holds the first sample in the metadata array.
  var gaugeResult = gaugeArray[0];

  //Create a variable that holds the washing frequency.  
  var wfreqs = gaugeResult.wfreq;
  console.log(wfreqs)

  // 4. Create the trace for the gauge chart.
  var gaugeData = [{
    value: wfreqs,
    type: "indicator",
    mode: "gauge+number",
    title: { text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week" },
    gauge: {
      axis: { range: [null, 10], dtick: "2" },

      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8, 10], color: "green" }
      ],
      dtick: 2
    }
  }];

  //Create the layout for the gauge chart.
  var gaugeLayout = {
    automargin: true
  };

  //Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)

}




