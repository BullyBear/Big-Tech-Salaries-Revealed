// fornat tooltip
var formatTooltip = d3.format(",");

const isCircle = (d) => {
  return d.QTHREE - d.QONE == 0 ? "circle" : "rect"
}

// create a tooltip
var tooltip = d3.select("#boxplot")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("font-size", "12px")
    .style("background-color", "white")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "black")
    .style("width", "135px")
    .style("height", "155px")
    .style("position", "absolute")
    .style("z-index", "10")
    //.style("visibility", "hidden")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  d3.selectAll(".element_opacity_toggle").style("opacity", "0.2")
  d3.selectAll("." + d.COMPANY + "_identifier").style("opacity", "0.9")
  tooltip
    .transition()
    .duration(200)


  htmlText = "<span style='font-weight:bold; font-size:14px;'>" + d.COMPANY + "</span>" + "<br/>" +
              "Min:" + " " + "$" + formatTooltip(d.MIN) + "<br/>" +
              "25%:" + " " + "$"  + formatTooltip(d.QONE) + "<br/>" +
              "Median:" + " " + "$" + formatTooltip(d.QTWO) + "<br/>" +
              "Mean:" + " " + "$" + formatTooltip(d.MEAN) + "<br/>" +
              "75%:" + " " + "$" + formatTooltip(d.QTHREE) + "<br/>" +
              "Max:" + " " + "$" + formatTooltip(d.MAX)  

  d3.select(".tooltip").style("height", "155px")
  if(isCircle(d) !== "rect"){
    //htmlText = "<strong>" + d.COMPANY + "</strong>" + "<br/>" +
    htmlText = "<span style='font-weight:bold; font-size:14px;'>" + d.COMPANY + "</span>" + "<br/>" +
              "Mean:" + " " + "$" + formatTooltip(d.MEAN) + "<br/>"
    d3.select(".tooltip").style("height", "60px")
  }

  tooltip
      .style("opacity", 1)
      .html(htmlText)
      .style("left", (d3.mouse(this)[0]+100) + "px")
      .style("top", (d3.mouse(this)[1]+100) + "px")

  }


  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+100) + "px")
      .style("top", (d3.mouse(this)[1]+100) + "px")
      //.style("left", "300px")
      //.style("top", "750px")
  }

  var mouseleave = function(d) {
    d3.selectAll(".element_opacity_toggle").style("opacity", "0.7")
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }



// set the dimensions and margins of the graph
//var margin = {top: 10, right: 30, bottom: 50, left: 70},
var boxPlotWidth = d3.select('#boxplot').node().getBoundingClientRect().width;
if (boxPlotWidth < 600) {
    boxPlotWidth = 600;
} else if (boxPlotWidth > 1200) {
    boxPlotWidth = 1200;
}

var margin = {top: 20, right: 150, bottom: 150, left: 30},
    //width = 460 - margin.left - margin.right,
    width = boxPlotWidth - margin.left - margin.right,
    //height = 400 - margin.top - margin.bottom;
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#boxplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    //.attr("transform",
          //"translate(" + margin.left + "," + margin.top + ")");
    // .attr("transform",
    //       "translate(" + 100 + "," + 30 + ")");
    .attr("transform",
          "translate(" + 100 + "," + 75 + ")");



// Set Ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0])


// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5)
}



// Read the data and compute summary statistics for each specie
d3.csv("../static/data/business_insider_jobs/Soc_Sorted_Data.csv").then(function(data) {


  // Read in Data
  data.forEach(function(d) {
        d["COMPANY"] = d["COMPANY"];
        d["CATEGORY"] = d["CATEGORY"];
        d["SOC_TITLE"] = d["SOC_TITLE"];
        d["COUNT"] = +d["COUNT"];
        d["MIN"] = +d["MIN"];
        d["QONE"] = +d["QONE"];
        d["QTWO"] = +d["QTWO"];
        d["QTHREE"] = +d["QTHREE"];
        d["MEAN"] = +d["MEAN"];
        d["MAX"] = +d["MAX"];
        d["STD"] = +d["STD"];
  });


  // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function(d){return(d.SOC_TITLE)}).keys()
 


  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

var colorScheme = d3.scaleOrdinal()
                    .domain(["Airbnb", "Amazon", "Apple", "Facebook", "Google", "Lyft", "Microsoft", "Netflix", "Salesforce", "Snap", "Tesla", "Twitter", "Uber"])
                    .range(["#FFADAF", "#FFC980", "#D9D9D9", "#9DACCB", "#95D1A5", "#F586C6", "#BFDD81", "#F18489", "#80BCEC", "#FEFEA9", "#EB465F", "#80DCF6", "#84CDCE"]);


//var domainData = data.filter(function(d) { return d.SOC_TITLE === allGroup[0]})

x.domain([d3.min(data, function(d) { return +d.MIN; }), d3.max(data, function(d) { return +d.MAX; })]);

  // Scale the range of the data
  //x.domain([0, d3.max(data, function(d) { return +d.MAX; })]);
  //x.domain([d3.extent(data)])
  //x.domain([d3.min(dataFilter, function(d) { return +d.MIN; }), d3.max(dataFilter, function(d) { return +d.MAX; })]);
  //x.domain([d3.min(data, function(d) { return +d.MIN; }), d3.max(data, function(d) { return +d.MAX; })]);



  y.domain(["Uber", "Twitter", "Tesla", "Snap", "Salesforce", "Netflix", "Microsoft", "Lyft", "Google", "Facebook", "Apple", "Amazon", "Airbnb"])
    .padding(.4);




  // add the X gridlines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  // add Left Axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

var formatAxis = d3.format("$.0s");

  // add Bottom Axis
  svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(formatAxis).ticks(8))
    //.call(d3.axisBottom(x).ticks(8))
    .select(".domain").remove()

  // add Top Axis
  svg.append("g")
    .attr("class", "xaxis")
    //.attr("transform", "translate(0," + height + ")")
    .call(d3.axisTop(x).tickFormat(formatAxis).ticks(8))
    .select(".domain").remove()




  // Show the main horizontal line
  svg.append('g')
    .selectAll("vertLines")
    //.data(sumstat)
    //.data(data)
    //.datum(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    .append("line")
    .attr("class", "verts")
    //.attr("class", "lines")
      .attr("x1", function(d){return(x(d.MIN))})
      .attr("x2", function(d){return(x(d.MAX))})
      .attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



  // Show first whisker
  svg.append('g')
    .selectAll("whiskerOne")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    .append("line")
    .attr("class", "whiskerOnes")
    //.attr("class", "lines")
      .attr("x1", function(d){return(x(d.MIN))})
      .attr("x2", function(d){return(x(d.MIN))})
      .attr("y1", function(d) { return y(d.COMPANY) +5; })
      .attr("y2", function(d) { return y(d.COMPANY) +20; })
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



  // Show second whisker
  svg.append('g')
    .selectAll("whiskerTwo")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0] && isCircle(d) == "rect"}))
    .enter()
    .append("line")
    .attr("class", "whiskerTwos")
    //.attr("class", "lines")
      .attr("x1", function(d){return(x(d.MAX))})
      .attr("x2", function(d){return(x(d.MAX))})
      .attr("y1", function(d) { return y(d.COMPANY) +5; })
      .attr("y2", function(d) { return y(d.COMPANY) +20; })
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



/*
  // rectangle for the main box
  svg.append('g')
    .selectAll("boxes")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    .append("rect")
    .attr("class", "rects")
        .attr("x", function(d){return(x(d.QONE))})
        .attr("width", function(d){ ; return(x(d.QTHREE)-x(d.QONE))})
        .attr("y", function(d) { return y(d.COMPANY); })
        .attr("height", y.bandwidth() )
        .attr("stroke", "black")
        .style("fill", function (d) { return colorScheme(d.COMPANY); } )
        .style("opacity", .7)
          .on("mouseover", mouseover)
          // .on('mouseover', function(d) {
          //   d3.select(this).moveToFront();
          //  })
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
*/


  // Show q2
  svg.append('g')
    .selectAll("medianLines")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    .append("line")
    .attr("class", "lines")
      .attr("y1", function(d){return(y(d.COMPANY))})
      .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
      .attr("x1", function(d){return(x(d.QTWO))})
      .attr("x2", function(d){return(x(d.QTWO))})
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .style("width", 80)
      .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



/*
  // Show mean as circle
  svg.append('g')
    .selectAll("meanCircles")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    //.append("line")
    .append("circle")
    .attr("class", "circlesTwo")
      .attr("cx", function(d){return(x(d.MEAN))})
      .attr("cy", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      //.attr("cy", function(d){return(y(d.COMPANY))})
      //.attr("r", function(d){return(d.MEAN)})
      .attr("r", 3)
      .style("fill", "black")
      .attr("stroke", "black")
      //.style("width", 80)
      .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
*/


  // Show mean as line
  svg.append('g')
    .selectAll("meanLines")
    .data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    .enter()
    .append("line")
    .attr("class", "linesTwo")
    .attr("y1", function(d){return(y(d.COMPANY))})
    .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
    .attr("x1", function(d){return(x(d.MEAN))})
    .attr("x2", function(d){return(x(d.MEAN))})
    .attr("stroke", "black")
    .attr("stroke-width", 3)
      //.style("width", 80)
    .style("stroke-dasharray", ("2, 2"))
    .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)





  d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

  d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };


////////////////////////////////////////////////// Create Dropdowns

  var nested = d3.nest()
    .key(function(d) {
      return d.CATEGORY;
    })
    .key(function(d) {
      return d.SOC_TITLE;
    })
    .entries(data);

  console.log('nested', nested);




  // Set up data selection box for group1
  var select1 = d3.select("#industry-dropdown")
    .append("select")
    .attr("class", "select")
    .attr("id", "select1")
    .on("change", function() {

      // Change the selection box for group2, dependent on the group1 selection
      var g = this.value;
      var filtered = nested.filter(function(d) {
        return d.key == g;
      });

      var options2 = d3.select("#select2")
        .selectAll("option")
        .data(filtered[0].values.map(function(d) {
          return d.key;
        }));

      options2.exit().remove();

      options2.enter()
        .append("option")
        .merge(options2)
        .text(function(d) {
          return d;
        });
      sel2 = d3.select("#select2").property("value");
    updateGraph(sel2);

    });


  // Options for group 1 selection menu
  var options1 = d3.select("#select1")
    .selectAll("option")
    .data(nested.map(function(d) {
      return d.key;
    })).enter()
    .append("option")
    .text(function(d) {
      return d;
    });




  // Setup initial selection box for group 2
  var select2 = d3.select("#category-dropdown")
    .append("select")
    .attr("class", "select")
    .attr("id", "select2")
    .on("change", onchange);

  // Initial options for group 2 selection menu
  var filtered = nested.filter(function(d) {
    //return d.key == "A";
    return d.key == "Advertising, Marketing, Sales";
    //return d.key == "Category";
  });

  var options2 = d3.select("#select2")
    .selectAll("option")
    .data(filtered[0].values.map(function(d) {
      return d.key;
    })).enter()
    .append("option")
    .text(function(d) {
      return d;
    });






// }) // d3.csv




///////////////////////////////////////////////////////// UPDATE GRAPH


  //function updateGraph(nested, sel1, sel2) {
  //function updateGraph(sel1, sel2) {
  function updateGraph(sel2) {
  d3.selectAll(".circles").remove()
  d3.selectAll(".rects").remove()
  //var dataFilter = data.filter(function(d){return d.COMPANY==selectedGroup})
  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})



  // Show q2
  svg
    .selectAll(".lines")
    .datum(dataFilter)
    .transition()
    .duration(1000)
    .attr("class", "lines")
    .attr("y1", function(d){return(y(d.COMPANY))})
    //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
    .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
    .attr("x1", function(d){return(x(d.QTWO))})
    .attr("x2", function(d){return(x(d.QTWO))})
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .style("width", 80)
    .style("opacity", 1)


    // Make a graph based on selections
    //var dataFilter = data.filter(function(d){return d.Category==sel1})
    //var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2})
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"}) // do not remove


    var newLine = svg
              .selectAll("medianLines")
              .data(dataFilterTwo)



    newLine
          .enter()
          .append("line")
          .attr("class", (d) => "lines element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          .attr("y1", function(d){return(y(d.COMPANY))})
          //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
          //.attr("x1", function(d){return(x(d.MEAN))})
          //.attr("x2", function(d){return(x(d.MEAN))})
          .attr("x1", function(d){return(x(d.QTWO))})
          .attr("x2", function(d){return(x(d.QTWO))})
          .attr("stroke", "black")
          .attr("stroke-width", 3)
          .style("width", 80)
          .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



    newLine.exit().remove();


  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})


  // Show mean as line
  svg
    .selectAll(".linesTwo")
    .datum(dataFilter)
    //.data(nested)
    //.enter()
    //.append("line")
    .transition()
    .duration(1000)
    .attr("class", "linesTwo")
    .attr("y1", function(d){return(y(d.COMPANY))})
    //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
    .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
    .attr("x1", function(d){return(x(d.MEAN))})
    .attr("x2", function(d){return(x(d.MEAN))})
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .style("width", 80)
    .style("stroke-dasharray", ("2, 2"))
    .style("opacity", 1)


    // Make a graph based on selections
    //var dataFilter = data.filter(function(d){return d.Category==sel1})
    //var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2})
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"}) // do not remove


    var newLineTwo = svg
              .selectAll("meanLines")
              .data(dataFilterTwo)



    newLineTwo
          .enter()
          .append("line")
          .attr("class", (d) => "linesTwo element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          .attr("y1", function(d){return(y(d.COMPANY))})
          //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth())})
          .attr("x1", function(d){return(x(d.MEAN))})
          .attr("x2", function(d){return(x(d.MEAN))})
          .attr("stroke", "black")
          .attr("stroke-width", 3)
          .style("stroke-dasharray", ("2, 2"))
          .style("width", 80)
          .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



    newLineTwo.exit().remove();





/*
  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})


  // Show mean as circle
  svg
    .selectAll(".circlesTwo")
    //.data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
    //.data(dataFilterTwo)
    .datum(dataFilter)
    //.data(nested)
    //.enter()
    //.append("line")
    .transition()
    .duration(1000)
    .attr("class", "circlesTwo")
    .attr("cx", function(d){return(x(d.MEAN))})
    .attr("cy", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
    //.attr("r", function(d){return(d.MEAN)})
    .attr("r", 3)
    .style("fill", "black")
    .attr("stroke", "black")
    .style("opacity", 1)
      //.on("mouseover", mouseover)
      //.on("mousemove", mousemove)
      //.on("mouseleave", mouseleave)


    // Make a graph based on selections
    //var dataFilter = data.filter(function(d){return d.Category==sel1})
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2})


    var newCircleTwo = svg
              .selectAll("meanCircles")
              .data(dataFilterTwo)



    newCircleTwo
          .enter()
          .append("circle")
          .attr("class", "circlesTwo")
          .attr("cx", function(d){return(x(d.MEAN))})
          .attr("cy", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          //.attr("r", function(d){return(d.MEAN)})
          .attr("r", 3)
          .style("fill", "black")
          .attr("stroke", "black")
          .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



    newCircleTwo.exit().remove();
*/



  //var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})
  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"})


  // Show whisker one as line
  svg
    .selectAll(".whiskerOnes")
    .datum(dataFilter)
    .transition()
    .duration(1000)
    .attr("class", "whiskerOnes")
      .attr("x1", function(d){return(x(d.MIN))})
      //.attr("x2", function(d){return(x(d.value.max))})
      .attr("x2", function(d){return(x(d.MIN))})
      //.attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y1", function(d) { return y(d.COMPANY) +5; })
      //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y2", function(d) { return y(d.COMPANY) +20; })
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", 0.3)


    // Make a graph based on selections
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"})


    var whiskerStart = svg
              .selectAll("whiskerOne")
              .data(dataFilterTwo)



    whiskerStart
          .enter()
          .append("line")
          .attr("class", (d) => "whiskerOnes element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          .attr("x1", function(d){return(x(d.MIN))})
          //.attr("x2", function(d){return(x(d.value.max))})
          .attr("x2", function(d){return(x(d.MIN))})
          //.attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y1", function(d) { return y(d.COMPANY) +5; })
          //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y2", function(d) { return y(d.COMPANY) +20; })
          .attr("stroke", "black")
          .style("width", 40)
          .style("opacity", 0.3)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



    whiskerStart.exit().remove();




//var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})
var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"})  

  // Show whisker two as line
  svg
    .selectAll(".whiskerTwos")
    .datum(dataFilter)
    .transition()
    .duration(1000)
    .attr("class", "whiskerTwos")
      .attr("x1", function(d){return(x(d.MAX))})
      //.attr("x2", function(d){return(x(d.value.max))})
      .attr("x2", function(d){return(x(d.MAX))})
      //.attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y1", function(d) { return y(d.COMPANY) +5; })
      //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y2", function(d) { return y(d.COMPANY) +20; })
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", 0.3)


    // Make a graph based on selections
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2 && isCircle(d) == "rect"})


    var whiskerEnd = svg
              .selectAll("whiskerTwo")
              .data(dataFilterTwo)



    whiskerEnd
          .enter()
          .append("line")
          .attr("class", (d) => "whiskerTwos element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          .attr("x1", function(d){return(x(d.MAX))})
          //.attr("x2", function(d){return(x(d.value.max))})
          .attr("x2", function(d){return(x(d.MAX))})
          //.attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y1", function(d) { return y(d.COMPANY) +5; })
          //.attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y2", function(d) { return y(d.COMPANY) +20; })
          .attr("stroke", "black")
          .style("width", 40)
          .style("opacity", 0.3)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



    whiskerEnd.exit().remove();



  //var dataFilter = data.filter(function(d){return d.COMPANY==selectedGroup})
  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})

// // rectangle for the main box
//   svg
//     .selectAll(".rects")
//     //.data(data.filter(function(d){return d.SOC_TITLE==allGroup[0]}))
//     //.data(dataFilter)
//     .datum(dataFilter)
//     //.data(nested)
//     //.enter()
//     //.append("rect")
//     .transition()
//     .duration(1000)
//     .attr("class", "rects")
//     .attr("x", function(d){return(x(d.QONE))})
//     .attr("width", function(d){ ; return(x(d.QTHREE)-x(d.QONE))})
//     .attr("y", function(d) { return y(d.COMPANY); })
//     .attr("height", y.bandwidth() )
//     .attr("stroke", "black")
//     .style("fill", function (d) { return colorScheme(d.COMPANY); } )
//     //.style("fill", "#69b3a2")
//     .style("opacity", .7)
//       //.on("mouseover", mouseover)
//       //.on("mousemove", mousemove)
//       //.on("mouseleave", mouseleave)


    // Make a graph based on selections
    //var dataFilter = data.filter(function(d){return d.Category==sel1})
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2})


    var newRect = svg
              .selectAll("boxes")
              .data(dataFilterTwo)


    newRect
          .enter()
          .append((d) => document.createElementNS(d3.namespaces.svg, isCircle(d)))
          .attr("class", (d) => "element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          .attr("x", function(d){return(x(d.QONE))})
          .attr("width", function(d){ ; return(x(d.QTHREE)-x(d.QONE))})
          .attr("y", function(d) { return y(d.COMPANY); })
          .attr("height", y.bandwidth() )
          .attr("stroke", "black")
          .style("fill", function (d) { return colorScheme(d.COMPANY); } )
          .attr("r", 8)
          .attr("cx", function(d){return(x(d.QONE))})
          .attr("cy", function(d) { return y(d.COMPANY) + 12 })
          .style("opacity", .7)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)



    newRect.exit().remove();




  //var dataFilter = data.filter(function(d){return d.COMPANY==selectedGroup})
  var dataFilter = data.filter(function(d){return d.SOC_TITLE==sel2})


 // Show the main horizontal line
  svg
    .selectAll(".verts")
    .datum(dataFilter)
    //.enter()
    //.append("line")
      .transition()
      .duration(1000)
      .attr("class", "verts")
      //.class("class", "lines")
      .attr("x1", function(d){return(x(d.MIN))})
      .attr("x2", function(d){return(x(d.MAX))})
      .attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
      .attr("stroke", "black")
      .style("width", 40)
      .style("opacity", .3)

    // Make a graph based on selections
    //var dataFilter = data.filter(function(d){return d.Category==sel1})
    var dataFilterTwo = data.filter(function(d){return d.SOC_TITLE==sel2})


    var newVert = svg
                  .selectAll("vertLines")
                  .data(dataFilterTwo)


    newVert
          .enter()
          .append("line")
          .attr("class", (d) => "verts element_opacity_toggle " + d.COMPANY + "_identifier " + isCircle(d) + "s")
          //.attr("class", "lines")
          .attr("x1", function(d){return(x(d.MIN))})
          .attr("x2", function(d){return(x(d.MAX))})
          .attr("y1", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("y2", function(d){return(y(d.COMPANY) + y.bandwidth()/2)})
          .attr("stroke", "black")
          .style("width", 40)
          .style("opacity", .3)
            .on("mouseover", mouseover )
            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave )


      newVert.exit().remove();




  } //updateGraph




/////////////////////////////////////////////////////////////////////


//onChange()
  function onchange() {
    sel1 = d3.select("#select1").property("value");
    sel2 = d3.select("#select2").property("value");



    //updateGraph(nested, sel1, sel2);
    //updateGraph(sel1, sel2);
    updateGraph(sel2);

  }


  // Set up the initial graph
  //updateGraph(nested, "Category", "SOC_TITLE");
  //updateGraph(nested, "Advertising, Marketing, Sales", "Market Research Analysts And Marketing Specialists");
  //updateGraph("Advertising, Marketing, Sales", "Market Research Analysts And Marketing Specialists");
  updateGraph("Market Research Analysts And Marketing Specialists");





}) // d3.csv