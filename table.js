

var colorScheme = d3.scaleOrdinal()
                    .domain(["Airbnb", "Amazon", "Apple", "Facebook", "Google", "Lyft", "Microsoft", "Netflix", "Salesforce", "Snap", "Tesla", "Twitter", "Uber"])
                    .range(["#FFADAF", "#FFC980", "#D9D9D9", "#9DACCB", "#95D1A5", "#F586C6", "#BFDD81", "#F18489", "#80BCEC", "#FEFEA9", "#EB465F", "#80DCF6", "#84CDCE"]);


var jobsCsvData = null;
d3.csv("../static/data/business_insider_jobs/Job_Sorted_Data.csv").then(function(data) {

  // Read in Data
  data.forEach(function(d) {
        d["COMPANY"] = d["COMPANY"];
        d["CATEGORY"] = d["CATEGORY"];
        d["SOC_TITLE"] = d["SOC_TITLE"];
        d["JOB_TITLE"] = d["JOB_TITLE"];
        d["COUNT"] = +d["COUNT"];
        d["MIN"] = +d["MIN"];
        d["QONE"] = +d["QONE"];
        d["QTWO"] = +d["QTWO"];
        d["QTHREE"] = +d["QTHREE"];
        d["MEAN"] = +d["MEAN"];
        d["MAX"] = +d["MAX"];
        d["STD"] = +d["STD"];
  });


  JobsCsvData = data;



//})



////////////////////////////////////////////////// Create Dropdowns


  var nestedTwo = d3.nest()
    .key(function(d) {
      return d.COMPANY;
    })
    .key(function(d) {
      return d.CATEGORY;
    })
    .key(function(d) {
      return d.SOC_TITLE;
    })
    .entries(data);

  console.log('nestedTwo', nestedTwo);

  function updateIndustryValues(g) {
    var filtered = filtered2[0].values.filter(function(d) {
        return d.key == g;
      });

      var options5 = d3.select("#select5")
        .selectAll("option")
        .data(filtered[0].values.map(function(d) {
        //.data(filtered3[0].values.map(function(d) {
          return d.key;
        }));

      options5.exit().remove();

      options5.enter()
        .append("option")
        .merge(options5)
        .text(function(d) {
          return d;
        });
        tabulate(data);

  }


  // Set up data selection box for group1
  var select3 = d3.select("#table-company-dropdown")
    .append("select")
    .attr("class", "selectTable")
    .attr("id", "select3")
    .on("change", function() {

      // Change the selection box for group2, dependent on the group1 selection
      var g = this.value;
      filtered2 = nestedTwo.filter(function(d) {
        return d.key == g;
      });

      var options4 = d3.select("#select4")
        .selectAll("option")
        .data(filtered2[0].values.map(function(d) {
        //.data(filtered2[0].values.map(function(d) {
          return d.key;
        }));

      options4.exit().remove();

      options4.enter()
        .append("option")
        .merge(options4)
        .text(function(d) {
          return d;
        });
       updateIndustryValues($('#select4').val());

    });




  // Options for group 1 selection menu
  var options3 = d3.select("#select3")
    .selectAll("option")
    .data(nestedTwo.map(function(d) {
      return d.key;
    })).enter()
    .append("option")
    .text(function(d) {
      return d;
    });




  // Setup initial selection box for group 2
  //var select4 = d3.select("#selectButton")
  var select4 = d3.select("#table-industry-dropdown")
    .append("select")
    .attr("class", "selectTable")
    .attr("id", "select4")
    .on("change", function(){
       // Change the selection box for group2, dependent on the group1 selection
      var g = this.value;
      updateIndustryValues(g);
    });



  var select5 = d3.select("#table-category-dropdown")
  //var select5 = d3.select("#selectButton")
    .append("select")
    .attr("class", "selectTable")
    .attr("id", "select5")
    //.on("change", onchange);
    .on("change", tabulate);



  // Initial options for group 2 selection menu
  var filtered2 = nestedTwo.filter(function(d) {
    return d.key == "Airbnb";
  });



  var filtered3 = filtered2[0].values.filter(function(d) {
    return d.key == "Advertising, Marketing, Sales";
  });




  var options4 = d3.select("#select4")
    .selectAll("option")
    .data(filtered2[0].values.map(function(d) {
      return d.key;
    })).enter()
    .append("option")
    .text(function(d) {
      return d;
    });

 var options5 = d3.select("#select5")
    .selectAll("option")
    .data(filtered3[0].values.map(function(d) {
      return d.key;
    })).enter()
    .append("option")
    .text(function(d) {
      return d;
    });






///////////////////////////////////////////////////////////////////// Render Table



var socTitleMetrics = d3.nest()
            .key(function(d) { return d.SOC_TITLE; })
            //.rollup(function(v) { return {
            .rollup(function(v) {
              return {
                 count: v.length,
                 min: d3.min(v, function(d) { return d.MIN; }),
                 // q1: d.QONE,
                 // q2: d.QTWO,
                 // q3: d.QTHREE,
                mean: d3.mean(v, function(d) { return d.MEAN; }),
                max: d3.max(v, function(d) { return d.MAX; })
              };
            })
            .entries(data);




var allGroupTwo = d3.map(data, function(d){return(d.SOC_TITLE)}).keys()
var allGroupThree = d3.map(data, function(d){return(d.JOB_TITLE)}).keys()



console.log('allGroupTwo[0]', allGroupTwo[0]);
console.log('allGroupThree[0]', allGroupThree[0]);




function formatKey(value, key) {
    if (['JOB_TITLE', 'COUNT'].indexOf(key) > -1 || value === ' - ') {
        return value;
    }
    // return '$ ' + value.toString().replace(/(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g, ",");
    return '$ ' + value.toLocaleString('en');
}


//function tabulate(data, newColumn) {
function tabulate(data, columns) {
    var company = $('#select3').val();
    var category = $('#select4').val();
    var socTitle = $('#select5').val();
    var rows = [];
    var intMax = 9007199254740991
    var sumRow = {
        'JOB_TITLE': socTitle,
        'COUNT': 0,
        'MIN': intMax,
        'QONE': intMax,
        'QTWO': intMax,
        'MEAN': 0,
        'QTHREE': intMax,
        /*'MEAN': 0,*/
        'MAX': 0
    };
    JobsCsvData.forEach(function(row) {
        if (row['COMPANY'] === company && row['CATEGORY'] === category && row['SOC_TITLE'] === socTitle) {
            rows.push(row);
            sumRow.COUNT += row.COUNT;
            ['MIN', 'QONE', 'QTWO', 'QTHREE'].forEach(function(key) {
                if (row[key] < sumRow[key]) {
                    sumRow[key] = row[key]
                }
            });
            sumRow.MEAN += row['MEAN'];
            if (row.MAX > sumRow.MAX) {
                sumRow.MAX = row.MAX;
            }
        }
    });
    if (rows.length > 0) {
    sumRow.MEAN = Math.round(sumRow.MEAN / rows.length);
    }
    rows.unshift(sumRow);
    $('.csv-data-body').html('');
    rows.forEach(function(row, index) {
        var content = '<tr>';
        if (index == 0) {
          backgroundColor = colorScheme($('#select3').val())
            content = '<tr style="background:' + backgroundColor + '">'
            
        } 

        /*['JOB_TITLE', 'COUNT', 'MIN', 'QONE', 'QTWO', 'QTHREE', 'MEAN', 'MAX'].forEach(function(key) {*/
        ['JOB_TITLE', 'COUNT', 'MIN', 'QONE', 'QTWO', 'MEAN', 'QTHREE', 'MAX'].forEach(function(key) {
          value = ' - ';
          if (row.COUNT > 1 || ['MEAN', 'JOB_TITLE', 'COUNT'].indexOf(key) > -1) {
            value = row[key];
          }
            content += '<td>' + formatKey(value, key) + '</td>';
        });
        content += '</tr>'
        $('.csv-data-body').append(content);
    })
}



tabulate(data);
//tabulate(data, ['JOB_TITLE', 'COUNT', 'MIN', 'QONE', 'QTWO', 'QTHREE', 'MEAN', 'MAX']);




}) // d3.csv




