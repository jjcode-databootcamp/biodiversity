//This file refactor into es6 and further refactor to include as little as possible duplicate code

// Step 1 - function to initialize the dashboard 
const init = ()=>{
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");
  console.log("i ran");
  // Use the list of sample names to populate the select options
  d3.json("assets/data/samples.json").then((data) => {

    let sampleNames = data.names;
    console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots. 
    let firstSample = sampleNames[0];
    buildBaseBarBubbleCharts(firstSample, data);
    buildMetadata(firstSample, data);
    buildGaugeChart(firstSample, data)

  });
}

// Evoke the function Initialize the dashboard
init();

// optional 
const optionChanged = (newSample)=> {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildBaseBarBubbleCharts(newSample);

}

// Step 2: Build a function for Demographics Panel 
const buildMetadata = (sample, data)=>{
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel. Inside the loop, you will need to use d3 to append new. tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
}



//Step 3 - Create the Build Chart Base Function 

const buildBaseBarBubbleCharts =(sample, data)=>{
    // Create a variable that holds the samples array. 
    let samples = data.samples;
    //Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    //Create variables that hold the otu_ids, otu_labels, and sample_values.
    let ids = result.otu_ids;
    let labels = result.otu_labels.slice(0, 10).reverse();
    let values = result.sample_values.slice(0, 10).reverse();

    let bubbleLabels = result.otu_labels;
    let bubbleValues = result.sample_values;

    //Evoke the function to build bar, bubble, gauge chart and pass the values it needs 
    buildBarChart(ids, labels, values)
    buildBubbleChart(ids, bubbleLabels, bubbleValues)
    

}


// Step 3a - Build Bar Chart  
const buildBarChart = (inputIds, inputLabels, inputValues )=>{
   // Create the yticks for the bar chart.  Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
  let yticks = inputIds.map(sampleObj => "OTU " + sampleObj).slice(0, 10).reverse();

    console.log(yticks)

    //Create the trace for the bar chart. 
    let barData = [{
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
    let barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };
    //Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


}


// Step 3b - Build Bubble Chart 
const buildBubbleChart =(inputIds, inputBubbleLabels, inputBubbleValues) => {
  //Create the trace for the bubble chart.
  let bubbleData = [{
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
  let bubbleLayout = {
    title: "<b>Bacteria Cultures Per Sample</b>",
    xaxis: { title: "OTU ID" },
    automargin: true,
    hovermode: "closest"
  };

  //Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout)


}

// Step 3c - Build Gauge Chart 
const buildGaugeChart = (inputSample, inputData)=> {
  //Create a variable that filters the metadata array for the object with the desired sample number.
  let metadata = inputData.metadata;
  let gaugeArray = metadata.filter(metaObj => metaObj.id == inputSample);

  //Create a variable that holds the first sample in the metadata array.
  let gaugeResult = gaugeArray[0];

  //Create a variable that holds the washing frequency.  
  let wfreqs = gaugeResult.wfreq;
  console.log(wfreqs)

  // 4. Create the trace for the gauge chart.
  let gaugeData = [{
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
  let gaugeLayout = {
    automargin: true
  };

  //Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)

}




