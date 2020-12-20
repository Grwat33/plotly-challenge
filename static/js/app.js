function makePage() {
    // Use the D3 library to read in `samples.json`
    d3.json("static/js/samples.json").then((data) => {
        var names = data.names;
        var metadata = data.metadata;
        var samples = data.samples;
        //console.log(data);
    
        // Fill in dropdown menu and update page
        var dropdown = document.getElementById("selDataset");
        for (var i = 0; i < names.length; ++i) {
        dropdown[dropdown.length] = new Option(names[i], names[i]);
        }

        // Call getData()
        d3.selectAll("#selDataset").on("change", getData);

        // Create getData()
        function getData() {
            var dropdownMenu = d3.select("#selDataset");
            var dataset = dropdownMenu.property("value");
            var index = names.indexOf(dataset); 
            var sample_values = samples.map(object => object.sample_values);
            var otu_ids = samples.map(object => object.otu_ids);
            var otu_labels = samples.map(object => object.otu_labels);
            var sample_value = sample_values[index];
            var otu_id = otu_ids[index];
            var otu_label = otu_labels[index];
            //console.log(sample_value);
            //console.log(otu_id);

            //1) combine the arrays:
            var list = [];
            for (var j = 0; j < sample_value.length; j++) 
            list.push({'otunumber': otu_id[j], 'samplevalue': sample_value[j], 'otuname': otu_label[j]});

            //2) sort:
            list.sort(function(a, b) {
            return ((a.samplevalue < b.samplevalue) ? 1 : ((a.samplevalue == b.samplevalue) ? 0 : 1));
            });

            list = list.slice(0,10);

            //3) separate them back out:
            for (var k = 0; k < list.length; k++) {
            otu_id[k] = list[k].otunumber;
            sample_value[k] = list[k].samplevalue;
            otu_label[k] = list[k].otuname;
            }
            //console.log(sample_value);

            for(var i=0;i<otu_id.length;i++){
                otu_id[i]="OTU "+otu_id[i];
            }
        
        // Create hbar chart w dropdown to display top 10 OTUs in an individual
        var hbar = [
            {
            x: sample_value.slice(0,10),
            y: otu_id.slice(0,10),
            type: 'bar',
            text: otu_label.slice(0,10),
            orientation: 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
          }];

          var layout = {
            xaxis: {title: 'Sample Value'},
            yaxis: {title: 'OTU ID'},
            title: 'Top 10 OTUs in an Individual',
            height: 500,
            width: 500
          };

          Plotly.newPlot("bar", hbar, layout);
        }
        }
    )};

makePage();