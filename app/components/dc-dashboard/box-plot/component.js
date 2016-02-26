import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  data: null,
  classNames: ["col-md-12"],

  // colors: ["rgba(232,177,114,0.5)", "#E8B172", "rgba(128,222,195,0.5)", "#80DEC3", "rgba(203,188,220,0.5)", "#CBBCDC", "rgba(193,221,121,0.5)", "#C1DD79", "black", "rgb(255,105,97)"],
  // colors: ["rgba(101,144,62,.75)", "#65903E", "rgba(193,82,170,0.75)", "#C152AA", "rgba(198,88,62,0.75)", "#C6583E", "rgba(106,120,185,0.75)", "#6A78B9", "black", "rgb(255,105,97)"],
  // colors: ["rgba(108,205,248,0)", "#6CCDF8", "rgba(245,151,141,0)", "#F5978D", "rgba(83,242,173,0)", "#53F2AD", "rgba(160,190,135,0)", "#A0BE87", "black", "rgb(255,105,97)"],
  // colors: ["rgba(108,205,248,.7)", "#66c2a5", "rgba(245,151,141,.7)", "#fc8d62", "rgba(83,242,173,.7)", "#8da0cb", "rgba(160,190,135,.7)", "#e78ac3", "black", "#a6d854"],
  // colors: ['rgba(102,194,165,.5)','rgba(102,194,165,.8)', 'rgba(252,141,98,.5)','rgba(252,141,98,.8)', 'rgba(141,160,203,.5)','rgba(141,160,203,.8)', 'rgba(231,138,195,.5)','rgba(231,138,195,.8)', 'rgba(166,216,84,.5)','rgba(166,216,84,.8)', 'rgba(64,64,64,.5)','rgba(64,64,64,.8)', 'black'],
  colors: ['rgba(160,190,135,.75)','rgba(160,190,135,.9)', 'rgba(231,138,195,.5)','rgba(231,138,195,.8)', 'rgba(166,216,84,.5)','rgba(166,216,84,.8)', 'rgba(64,64,64,.5)','rgba(64,64,64,.8)', 'black'],

  // ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854']
  // colors: ["#6CCDF8", "#F5978D", "#53F2AD", "#A0BE87", "black"],
  // colors: ['rgba(127,201,127,0)','#7fc97f','rgba(190,174,212,0)','#beaed4','rgba(141,160,203,0)', "#8da0cb", 'rgba(231,138,195,0)', "#e78ac3", 'rgba(253,192,134,0)', '#fdc086'],
  lineColors: ["rgba(232,177,114,0.5)", "rgba(128,222,195,0.5)", "rgba(203,188,220,0.5)", "rgba(193,221,121,0.5)"],
  // dimensions: Ember.

  draw: Ember.on('didRender', function() {

    var minDate = this.get('dimension').bottom(1)[0].date;
    var maxDate = this.get('dimension').top(1)[0].date;

    var unitDates = [minDate, moment(minDate).add(1, 'weeks'), moment(minDate).add(2, 'weeks'), moment(minDate).add(4, 'weeks'), moment(minDate).add(7, 'weeks'),moment(minDate).add(9, 'weeks'), maxDate];

    // let maxDate = moment(minDate).add(14, 'weeks').toDate();

    let data = this.get('data');
    var compositeChart  = dc.compositeChart("#"+this.get('id'));
    var boxPlots = dc.barChart(compositeChart);
    var actualPoints = dc.barChart(compositeChart);

    let groups = this.get('groups');
    let counter=0;
    let charts = [];

    groups.forEach(function(group, i) {
      if (i === 0) {
        // debugger;
        boxPlots
          .group(group.group, group.name)
          .valueAccessor(function(d) {
            return d.value.totalAvgHours - d.value.stdAvgSum;
          })
          .stack(group.group, group.name, function(d) {
            return d.value.stdAvgSum * 2;
          })
        actualPoints
          .group(group.group, group.name)
          .valueAccessor(function(d) {
            return d.value.totalHours;
          })
          .stack(group.group, group.name, function(d) {
            return d.value.totalHours ? .04 : null;
          })
      }
      else {
        boxPlots
        .stack(group.group, group.name, function(d) {
            return d.value.totalAvgHours - d.value.stdAvgSum;
          })
        .stack(group.group, group.name, function(d) {
          return d.value.stdAvgSum * 2;
        })
        actualPoints
        .stack(group.group, group.name, function(d) {
            return d.value.totalHours;
          })
        .stack(group.group, group.name, function(d) {
          return d.value.totalHours ? .04 : null;
        })
      }
    })

    actualPoints
      .dimension(this.get('dimension'))
      .xUnits(d3.time.days)
      .x(d3.time.scale().domain([minDate,maxDate]))
      .colors(this.get('colors'))
      .renderHorizontalGridLines(true)
      // .colors(["black"])
      .centerBar(true)
      .title(function(d) {
        let actualHours = +(d.data.value.totalHours).toFixed(1);
        // let avgHours = d.data.value.totalAvgHours;
        // let distanceFromMedian = +(100*(avgHours - actualHours)/avgHours).toFixed(0);
        // let percentile = distanceFromMedian > 50 ? 50 + distanceFromMedian : 50 - distanceFromMedian;
        return d3.time.format("%x: ")(d.x) + actualHours + " hours ~ "
        return d3.time.format("%a %b %d:  ")(d.x) + "Student Hours: " + actualHours;
      })
      .colorAccessor(function(d, i) {
        let avgStd = d.data.value.stdAvgSum;
        let avgHours = d.data.value.totalAvgHours;
        let actualHours = d.data.value.totalHours;
        if (Math.abs(avgHours - actualHours) > avgStd) {
          return 0;
        }
        return 1;
        return d.layer;
      })


    boxPlots
      .dimension(this.get('dimension'))
      .renderHorizontalGridLines(true)
      .xUnits(d3.time.days)
      .x(d3.time.scale().domain([minDate,maxDate]))
      .colors(this.get('colors'))
      .centerBar(true)
      .title(function(d) {
        // let std = +(d.data.value.stdAvgSum).toFixed(1);
        let avgStd = d.data.value.stdAvgSum;
        let actualHours = d.data.value.totalHours;
        let avgHours = d.data.value.totalAvgHours;
        return d3.time.format("%x: ")(d.x) + "outside boxplot? " + (Math.abs(avgHours - actualHours) > avgStd).toString();
        return d3.time.format("%a %b %d:  ")(d.x) + "Median Hours: " + totalAvgHours + " Stnd Dev: " + std;
      })
      .colorAccessor(function(d, i) {
        return 1;
        return d.layer - 1;
      })

      charts.push(boxPlots);
      charts.push(actualPoints);


    compositeChart
      .renderHorizontalGridLines(true)
      .brushOn(false)
      .width(this.get('width')).height(this.get('height'))
      .dimension(this.get('dimension'))
      .xUnits(d3.time.days)
      .y(d3.scale.linear().domain([0, 14]))
      .elasticX(true)
      .xAxisPadding(1)
      .legend(dc.legend().x(60).y(10).itemHeight(13).gap(-5))
      .x(d3.time.scale().domain([minDate,maxDate]))
      .yAxisLabel("Hours")
      .compose(charts)
      .on('postRender', function(chart) {
        let rects = chart.selectAll('.stack:nth-child(even) rect');
        chart.selectAll('.stack:nth-child(odd) rect').attr("display", "none");
        rects[0].forEach(function(rect, i) {
          let $r = $(rect);
          let color = $r.attr('fill');
          let width = $r.attr('width');
            $r
              .css('fill','white')
              .css('stroke', color)
              .css('stroke-width', '1px')
              .css('transform', 'translateX(1px)')
              .attr('width', width - 1)
              .css('width', width - 1)
          })
        $(chart.anchor() + ' .dc-legend').remove();
        let remaining = $('#boxsOverTime .dc-legend .dc-legend-item').splice(1);
        $(remaining).remove();
      })
      .on('postRedraw', function(chart) {
        let allBoxes = $(chart.anchor() + " rect title:contains('boxplot')").filter(function(i, e) {return $(e).parent().attr("display") != "none" ;});
        let boxPlots = allBoxes.filter(function(i, e) {return $(e).parent().attr("height") != "0" ;});
        let allActuals = $(chart.anchor() + " rect title:contains('student')").filter(function(i, e) {return $(e).parent().attr("display") != "none" ;});
        let actualLines = allActuals.filter(function(i, e) {return $(e).parent().attr("height") != "0" ;});

        boxPlots.filter(function(i, titleHtml) {
          let date = titleHtml.innerHTML.split(":")[0];
          let boxPlotColor = $(titleHtml).parent().attr("fill");
          let actualShouldBeBlack = titleHtml.innerHTML.split("? ")[1] === "true";
          let actualLine = actualLines.filter(function(i, e) {return e.innerHTML.split(":")[0] === date;})[0];
          if (actualLine && actualShouldBeBlack) {
            $(actualLine).parent().css("stroke", "black");
          }
          else if(actualLine) {
            $(actualLine).parent().css("stroke", boxPlotColor.replace(".4", ".75"));
          }
        })
      })
        .xAxis().tickValues(unitDates)
        .tickFormat(function(v, i) {
          let units = ["Prep Phase", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Presentations"];
          return units[i];
        })
  })

});
