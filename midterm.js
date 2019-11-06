'use strict';

(function() {
    const colors = {

        "Bug": "#4E79A7",
    
        "Dark": "#A0CBE8",
    
        "Electric": "#F28E2B",
    
        "Fairy": "#FFBE&D",
    
        "Fighting": "#59A14F",
    
        "Fire": "#8CD17D",
    
        "Ghost": "#B6992D",
    
        "Grass": "#499894",
    
        "Ground": "#86BCB6",
    
        "Ice": "#86BCB6",
    
        "Normal": "#E15759",
    
        "Poison": "#FF9D9A",
    
        "Psychic": "#79706E",
    
        "Steel": "#BAB0AC",
    
        "Water": "#D37295"
    
        
    }
  let data = "no data";
  let svgContainer = ""; // keep SVG reference in global scope

  let dropdown;
  // load data and make scatter plot after window loads
  window.onload = function() {
    svgContainer = d3.select('body')
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);
    

       
    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    d3.csv("pokemon.csv")
      .then((data) => makeScatterPlot(data));
  }

  // make scatter plot with trend line
  function makeScatterPlot(csvData) {
    data = csvData // assign data as global variable



    // get arrays of fertility rate data and life Expectancy data
    let special_defense = data.map((row) => parseFloat(row["Sp. Def"]));
    let total_stats = data.map((row) => parseFloat(row["Total"]));
    // find data limits
    let axesLimits = findMinMax(special_defense, total_stats);
    // console.log(axesLimits) 
    // draw axes and return scaling + mapping functions
    let mapFunctions = drawAxes(axesLimits, "Sp. Def", "Total");

    // plot data as points and add tooltip functionality
    plotData(mapFunctions);

    // draw title and axes labels
    makeLabels();
  }

  // make title and axes labels
  function makeLabels() {
    svgContainer.append('text')
      .attr('x', 100)
      .attr('y', 40)
      .style('font-size', '14pt')
      .text("Countries by Life Expectancy and Fertility Rate");

    svgContainer.append('text')
      .attr('x', 130)
      .attr('y', 490)
      .style('font-size', '10pt')
      .text('Fertility Rates (Avg Children per Woman)');

    svgContainer.append('text')
      .attr('transform', 'translate(15, 300)rotate(-90)')
      .style('font-size', '10pt')
      .text('Life Expectancy (years)');

  }

  function filtersvg(genValue, legValue, display, displayOthers) {
    console.log(genValue);
    console.log(legValue);
    console.log(display);
    console.log(displayOthers);

    svgContainer.selectAll("circle")
        .filter(function(d) {return !(genValue == d.Generation && legValue == d.Legendary);})
        .attr("display", displayOthers);
              
    svgContainer.selectAll("circle")
        .filter(function(d) {return genValue == d.Generation && legValue == d.Legendary;})
        .attr("display", display);
        

  }
  // plot all the data points on the SVG
  // and add tooltip functionality
  function plotData(map) {
    // get population data as array
    // let pop_data = data.map((row) => +row["pop_mlns"]);
    // let pop_limits = d3.extent(pop_data);
    // // make size scaling function for population
    // let pop_map_func = d3.scaleLinear()
    //   .domain([pop_limits[0], pop_limits[1]])
    //   .range([3, 20]);

    // mapping functions
    let xMap = map.x;
    let yMap = map.y;

    // make tooltip
    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



    // append data to SVG and plot as points
    svgContainer.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
        .attr('cx', xMap)
        .attr('cy', yMap)
        .attr('r', 3)
        .attr('fill', (d) => colors[d["Type 1"]])
        // add tooltip functionality to points
        .on("mouseover", (d) => {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(d.Name + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

        let dropdown =  d3.select("#filter").append("select").attr("name", "generation").attr("id", "generation");

        let dropdown2 =  d3.select("#legendary").append("select").attr("name", "legendary").attr("id", "legendaryid");


        let options = dropdown.selectAll("option")
            .data([1,2,3,4,5,6, "all"])
            .enter()
            .append("option");
    
        options.text(function (d) { return d ; })
           .attr("value", function (d) { return d; });

        //generation
        dropdown.on("change", function() {
          let selected = this.value;
          let displayOthers = this.checked ? "inline" : "none";
          let display = this.checked ? "none" : "inline";
          let selected3 = document.getElementById('legendaryid');
          let legValue = selected3.options[selected3.selectedIndex].value;
          console.log(selected)
          console.log(legValue)

          filtersvg(selected,legValue, display, displayOthers);
          // svgContainer.selectAll("circle")
          //     .filter(function(d) {return selected != d.Generation && legValue != d.legendary;})
          //     .attr("display", displayOthers);
              
          // svgContainer.selectAll("circle")
          //     .filter(function(d) {return selected == d.Generation && legValue == d.legendary;})
          //     .attr("display", display);
          });


        let options2 = dropdown2.selectAll("option")
                .data(['True', 'False', 'All'])
                .enter()
                .append("option");
    
        options2.text(function (d) { return d; })
            .attr("value", function (d) { return d; });

        dropdown2.on("change", function() {
            let selected = this.value;
            
            let selected2 = document.getElementById('generation');
            let genValue = selected2.options[selected2.selectedIndex].value;
            console.log(selected)
            console.log(genValue)
            // console.log(selected2Value) 


            // let selected3 = d3.select("#generation").value;
            // console.log(selected3)

            let displayOthers = this.checked ? "inline" : "none";
            let display = this.checked ? "none" : "inline";
            // filter(genValue, selected, display, displayOthers);

            if(selected == "All") {
                display = "inline";
                displayOthers = "inline";
            }

            filtersvg(genValue, selected, display, displayOthers);
            // svgContainer.selectAll("circle")
            //     .filter(function(d) {return selected != d.Legendary && selected2Value != d.generation;})
            //     .attr("display", displayOthers);
                
            // svgContainer.selectAll("circle")
            //     .filter(function(d) {return selected == d.Legendary && selected2Value == d.generation;})
            //     .attr("display", display);
        });


  }

  // function filter(genValue, legValue, display, displayOthers) {
  //   console.log(genValue);
  //   console.log(legValue);
  //   console.log(display);
  //   console.log(displayOthers);

  //   svgContainer.selectAll("circle")
  //       .filter(function(d) {return genValue != d.Generation && legValue != d.legendary;})
  //       .attr("display", displayOthers);
              
  //   svgContainer.selectAll("circle")
  //       .filter(function(d) {return genValue == d.Generation && legValue == d.legendary;})
  //       .attr("display", display);
        

  // }
  // draw the axes and ticks
  function drawAxes(limits, x, y) {
    // return x value from a row of data
    let xValue = function(d) { return +d[x]; }

    // function to scale x value
    let xScale = d3.scaleLinear()
      .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
      .range([50, 450]);

    // xMap returns a scaled x value from a row of data
    let xMap = function(d) { return xScale(xValue(d)); };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer.append("g")
      .attr('transform', 'translate(0, 450)')
      .call(xAxis);

    // return y value from a row of data
    let yValue = function(d) { return +d[y]}

    // function to scale y
    let yScale = d3.scaleLinear()
      .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
      .range([50, 450]);

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) { return yScale(yValue(d)); };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  // find min and max for arrays of x and y
  function findMinMax(x, y) {

    // get min/max x values
    let xMin = d3.min(x);
    let xMax = d3.max(x);

    // get min/max y values
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    // return formatted min/max data as an object
    return {
      xMin : xMin,
      xMax : xMax,
      yMin : yMin,
      yMax : yMax
    }
  }

  // format numbers
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // function filter(generation, legendary) {

  // }


})();
