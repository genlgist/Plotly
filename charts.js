function init() {
  let selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let resultM = resultArray[0];
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    PANEL.append("h6").text('ID: ' +resultM.id);
    PANEL.append("h6").text('Ethnicity: ' +resultM.ethnicity);
    PANEL.append("h6").text('Gender: ' +resultM.gender);
    PANEL.append("h6").text('Age: ' +resultM.age);
    PANEL.append("h6").text('BBType: ' +resultM.bbtype);
    PANEL.append("h6").text('Location: ' +resultM.location);
    PANEL.append("h6").text('W.Freq: ' +resultM.wfreq);
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let otuLabels = result.otu_labels.slice(0,10);
    let xaxis = result.sample_values.slice(0,10);
    let ym = result.otu_ids.slice(0,10);
    let yaxis = ym.map((item) => {
      return ('OTU ' + item);
    });

    let trace1 = {
      x: xaxis,
      y: yaxis,
      type: "bar",
      orientation: 'h',
      text: otuLabels,
      marker: {
        color: ym,
        colorscale: 'Blues'
        },
      //descending on the bar graph
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
    };
    let data1 = [trace1];
    let layout = {
        title: "Top 10 Bacterial Cultures Found",
        "titlefont": { "size": 24, color: '#FF0000'},
        xaxis: { title: "Count"},
        yaxis: { title: "Bacteria ID"}
      };
      Plotly.newPlot("bar", data1, layout);

    //bubble chart below
    let trace2 = {
      x: ym,
      y: xaxis,
      mode: 'markers',
      marker: {
        size: xaxis,
        color: ym,
        colorscale: 'Earth'
        },
      text: otuLabels,
      type: 'scatter'
    };
    let data2 = [trace2];
    let layout2 = {
      title: "Bacterial Cultures Per Sample",
      "titlefont": { "size": 24, color: '#ffa500'},
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Value"}
    };
    Plotly.newPlot("bubble", data2, layout2);

    // gauge chart below
    d3.json("samples.json").then((data) => {
       let metadata = data.metadata;
       let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
       let result = resultArray[0];
       let wash = result.wfreq;
       let trace3 = [{
      		domain: { x: [0, 1], y: [0, 1] },
      		value: wash,
      		title: { text: "Belly Button Washing Frequency" },
          "titlefont": { "size": 26, color: '#008000'},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis : {range: [null, 10]},
            bar: {color: "black"},
            steps:[
              {range: [0, 2], color: "green"},
              {range:[2, 4], color: "purple"},
              {range:[4, 6], color: "orange"},
              {range:[6, 8], color: "red"},
              {range:[8, 10], color: "yellow"}],
          },
      	}];
       let layout3 = {width: 600, height: 500, margin: { t: 0, b: 0 } };
       Plotly.newPlot('gauge', trace3, layout3);
    });
  });
}


init();
//loading script call 940 as default
optionChanged(940);
