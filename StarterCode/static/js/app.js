// View data
d3.json("samples.json").then( (data)=>{
    console.log(data);
});

// Initialize Page
function init(){
    d3.json("samples.json").then((data)=>{

        // Create dropdown Menu 
        var dropdownMenu = d3.selectAll("#selDataset");
        var dataset = dropdownMenu.node().value;

        // Get the names from the datset
        var names = data.names;

        // Use select.append to add options w/ texts and value
        names.forEach((name) => dropdownMenu.append('option').text(name).attr("value",name));

        // Insert metadata into panel for first subject
        var sampMeta = data.metadata[0];
        var mData = d3.select("#sample-metadata");
        
        // Use Object.entries to iterate over selectedMetaData 
        Object.entries(sampMeta).forEach(([key, value]) => {
            mData.append("p").text(`${key} ${value}`);
        });


        // Build charts and metadata for the first sample aka first "name" in names array
        // Use slice to get the top 10 values & reverse to make bars stack greatest to smallest

        var values = data.samples[0].sample_values;
        var strValues = values.slice(0,10).reverse();

        var id = data.samples[0].otu_ids;
        var strID = id.slice(0,10).reverse();

        var label = data.samples[0].otu_labels;
        var strHover = label.slice(0,10).reverse();

        var scrubs = data.metadata[0].wfreq;

        
        // Create your bar chart using plotly
        var data = [{
            x: strValues,
            y: strID,
            type: "bar",
            text: strHover,
            orientation: "h"
        }];


        var layout = {
          title: "Top 10 Bio Attackers",
          xaxis: { title: "Amount"},
          yaxis: { title: "OTU IDs", type: "category"}
        };

        Plotly.newPlot("bar", data, layout);

        
        // Create bubble plot
        var trace1 = {
          x: id,
          y: values,
          mode: 'markers',
          marker: {
            color: id,
            size: values,
            text: label
          }
        };

        var data = [trace1];

        var layout = {
          title: 'Belly Button Bacteria',
          showlegend: false,
          height: 600,
          width: 1000
        };

        Plotly.newPlot('bubble', data, layout);

        // Create Gauge using Plotly 
        var data3 = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: scrubs,
            title: { text: "Belly Scrubs Per Day" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { range: [0, 9] },
              steps: [
                { range: [0, 2], color: "pink" },
                { range: [2, 4], color: "pink" },
                { range: [4, 6], color: "pink" },
                { range: [6, 8], color: "lightblue" },
                { range: [8, 10], color: "lightblue" },
                ],
            }
          }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data3, layout);

    });
}


// Update plots and metadata for newly selected value
function optionChanged(selectValue){
    d3.json("samples.json").then((data)=> {

        var mData = d3.select("#sample-metadata");
        var sampMeta = data.metadata;
        var filterMeta = sampMeta.filter(d => d.id.toString() === selectValue)[0];

        // Clear the previous entry
        mData.html("");

        // Get the new subject's data based the selected value input
        Object.entries(filterMeta).forEach(([key, value]) => {
            mData.append("p").text(`${key} ${value}`);
        });


        // Restyle plots
        var filterNames = data.samples.filter(d => d.id.toString() === selectValue)[0];

        // Get the filtered values and the then the slice
        var values = filterNames.sample_values;
        var strValues = values.slice(0,10).reverse();

        var id = filterNames.otu_ids;
        var strID = id.slice(0,10).reverse();

        var label = filterNames.otu_labels;
        var strLabel = label.slice(0,10).reverse();

        var scrubs = filterMeta.wfreq;

        var updateBarChart = {
            x: [strValues],
            y: [strID],
            text: [strLabel]
        };

        var layoutUpdate = {
          yaxis: { title: "OTU IDs", type: "category"}
        };

        // Use restyle to update bar chart
        Plotly.restyle("bar", updateBarChart);
        Plotly.relayout("bar", layoutUpdate)
        

        // Update values for bubbleplot
        var updateBubble = {
          x: [id],
          y: [values],
          mode: 'markers'
          
        };

        // Use restyle to update bubbleplot
        Plotly.restyle('bubble', updateBubble);


        // Update values for Gauge
        var updateGauge = {
            value: [scrubs]
        };
        
        // Use restyle to update Gauage
        Plotly.restyle('gauge', updateGauge);

    });
}

init();