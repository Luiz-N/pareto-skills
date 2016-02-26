import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  width: 500,
  height: 200,
  data: null,
  classNames: ["col-md-12"],

  // colors: ["rgba(232,177,114,0.5)", "#E8B172", "rgba(128,222,195,0.5)", "#80DEC3", "rgba(203,188,220,0.5)", "#CBBCDC", "rgba(193,221,121,0.5)", "#C1DD79", "black", "rgb(255,105,97)"],
  // colors: ["rgba(101,144,62,.75)", "#65903E", "rgba(193,82,170,0.75)", "#C152AA", "rgba(198,88,62,0.75)", "#C6583E", "rgba(106,120,185,0.75)", "#6A78B9", "black", "rgb(255,105,97)"],
  // colors: ["rgba(108,205,248,0)", "#6CCDF8", "rgba(245,151,141,0)", "#F5978D", "rgba(83,242,173,0)", "#53F2AD", "rgba(160,190,135,0)", "#A0BE87", "black", "rgb(255,105,97)"],
  // colors: ["rgba(108,205,248,.7)", "#66c2a5", "rgba(245,151,141,.7)", "#fc8d62", "rgba(83,242,173,.7)", "#8da0cb", "rgba(160,190,135,.7)", "#e78ac3", "black", "#a6d854"],
  // colors: ['rgba(102,194,165,.5)','rgba(102,194,165,.8)', 'rgba(252,141,98,.5)','rgba(252,141,98,.8)', 'rgba(141,160,203,.5)','rgba(141,160,203,.8)', 'rgba(231,138,195,.5)','rgba(231,138,195,.8)', 'rgba(166,216,84,.5)','rgba(166,216,84,.8)', 'rgba(64,64,64,.5)','rgba(64,64,64,.8)', 'black'],
  colors: ['rgba(77,175,74,.4)','rgba(77,175,74,.75)', 'rgba(231,138,195,.5)','rgba(231,138,195,.8)', 'rgba(166,216,84,.5)','rgba(166,216,84,.8)', 'rgba(64,64,64,.5)','rgba(64,64,64,.8)', 'black'],

  // ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854']
  // colors: ["#6CCDF8", "#F5978D", "#53F2AD", "#A0BE87", "black"],
  // colors: ['rgba(127,201,127,0)','#7fc97f','rgba(190,174,212,0)','#beaed4','rgba(141,160,203,0)', "#8da0cb", 'rgba(231,138,195,0)', "#e78ac3", 'rgba(253,192,134,0)', '#fdc086'],
  lineColors: ["rgba(232,177,114,0.5)", "rgba(128,222,195,0.5)", "rgba(203,188,220,0.5)", "rgba(193,221,121,0.5)"],
  // dimensions: Ember.

  draw: Ember.on('didRender', function() {

    // var minDate = this.get('dimension').bottom(1)[0].date;
    // var maxDate = this.get('dimension').top(1)[0].date;

    // var unitDates = [minDate, moment(minDate).add(1, 'weeks'), moment(minDate).add(2, 'weeks'), moment(minDate).add(4, 'weeks'), moment(minDate).add(7, 'weeks'),moment(minDate).add(9, 'weeks'), maxDate];

    // let maxDate = moment(minDate).add(14, 'weeks').toDate();

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
            let line = +(d.value.totalAvgHours).toFixed(1) * .009;
            if (line === 0) {
              return line;
            }
            return 1;
            return line < .15 ? 1 : line;
            return d.value.totalAvgHours * .01;
            return d.value.totalHours ? 1.5 : null;
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
          return d.value.totalHours ? 1 : null;
        })
      }
    })

    actualPoints
      .dimension(this.get('dimension'))
      .x(d3.scale.ordinal().domain(this.get('order')))
      .xUnits(dc.units.ordinal)
      .ordering(function(d) {return  -d.value.totalHours; })
      .centerBar(true)
      // .margins({top: 0, right: 50, bottom: 20, left: 40})
      // .elasticX(true)
      // .xAxisPadding('5%')
      // .yAxisLabel("Hours")
      .colors(this.get('colors'))
      // .elasticY(true)
      .gap(50)
      .yAxisPadding('5%')
      .title(function(d) {
        let actualHours = +d.data.value.totalHours.toFixed(1);
        let avgHours = d.data.value.totalAvgHours;
        let avgStd = d.data.value.stdAvgSum;
        let distanceFromMean = +Math.abs(avgHours - actualHours).toFixed(1);
        // isOutsideRange = Math.abs(avgHours - actualHours) > avgStd;
        if (distanceFromMean > avgStd) {
          return actualHours + " hours ~";
        }
        else {
          return actualHours + " hours";
        }
        // return d3.time.format("%x: ")(d.x) + "actual";
        // return d3.time.format("%a %b %d:  ")(d.x) + "Student Hours: " + actualHours;
      })
      .colorAccessor(function(d, i) {
        let avgStd = d.data.value.stdAvgSum;
        let avgHours = d.data.value.totalAvgHours;
        let actualHours = d.data.value.totalHours;
        if (Math.abs(avgHours - actualHours) > avgStd) {
          // return 3;
        }
        return i + 1;
        return d.layer - 1;
      })


    boxPlots
      .dimension(this.get('dimension'))
      .x(d3.scale.ordinal().domain(this.get('order')))
      .xUnits(dc.units.ordinal)
      .ordering(function(d) {return  -d.value.totalHours; })
      // .centerBar(true)
      // .elasticX(true)
      .gap(50)
      .renderHorizontalGridLines(true)
      .colors(this.get('colors'))
      // .ordering(function(d) {return  -d.value.totalHours; })
      .title(function(d) {
        // let std = +(d.data.value.stdAvgSum).toFixed(1);
        let avgStd = d.data.value.stdAvgSum;
        let actualHours = d.data.value.totalHours;
        let avgHours = d.data.value.totalAvgHours;
        return d.data.key + ": boxplot";
        // return d3.time.format("%x: ")(d.x) + "witin boxplot? " + (Math.abs(avgHours - actualHours) > avgStd).toString();
        // return d3.time.format("%a %b %d:  ")(d.x) + "Median Hours: " + totalAvgHours + " Stnd Dev: " + std;
      })
      .colorAccessor(function(d, i) {
        return i + 1;

        return d.layer - 1;
      })

      charts.push(boxPlots);
      charts.push(actualPoints);


    compositeChart
      // .renderHorizontalGridLines(true)
      // .legend(dc.legend().x(60).y(10).itemHeight(13).gap(-5))
      .width(this.get('width')).height(this.get('height'))
      .dimension(this.get('dimension'))
      .x(d3.scale.ordinal().domain(this.get('order')))
      .xUnits(dc.units.ordinal)
      .ordering(function(d) {return  -d.value.totalHours; })
      // .margins({top: 0, right: 50, bottom: 20, left: 40})
      // .elasticX(true)
      // .xAxisPadding('10')
      .yAxisLabel("Hours")
      // .colors(this.get('colors'))
      // .ordering(function(d) {return  -d.value.totalHours; })
      .elasticY(true)
      // .yAxisPadding('50')
      .compose(charts)
      .on('postRender', function(chart) {
        // debugger;
        let rects = chart.selectAll('.stack:nth-child(even) rect');
        chart.selectAll('.stack:nth-child(odd) rect').attr("display", "none");
        rects[0].forEach(function(rect, i) {
          let $r = $(rect);
          // debugger;
          let boxColor = $r.attr('fill');
          let isOutOfRange = $r.text().indexOf("~") != -1;
          let newColor = isOutOfRange ? "black" : boxColor;
          let width = $r.attr('width');
            $r.css('fill','white')
              .css('stroke', newColor)
              .css('stroke-width', '2px')
              .css('transform', 'translateX(1px)')
              .css('width', width - 5);
            $r.text().indexOf("hours") != -1 ? $r.attr("height", "1px").addClass('actual') : null;
          })
        $(chart.anchor()+' .dc-legend g:nth-child(even)').remove();
        let remaining = $('#boxsOverTime .dc-legend .dc-legend-item').splice(1);
        $(remaining).remove();
      })
      .on('postRedraw', function(chart) {
        let allBoxes = $(chart.anchor() + " rect title:contains('boxplot')").filter(function(i, e) {return $(e).parent().attr("display") != "none" ;});
        let boxPlots = allBoxes.filter(function(i, e) {return $(e).parent().attr("height") != "0" ;});
        let allActuals = $(chart.anchor() + " rect title:contains('hours')").filter(function(i, e) {return $(e).parent().attr("display") != "none" ;});
        let actualLines = allActuals.filter(function(i, e) {return $(e).parent().attr("height") != "0" ;});
        // let isSelected = $()
        // debugger;

        actualLines.filter(function(i, titleHtml) {
          let isOutOfRange = titleHtml.innerHTML.indexOf("~") != -1;
          let boxPlotColor = $(titleHtml).parent().attr("fill");
          $(titleHtml).parent().attr("height", "1px")
          if (isOutOfRange) {
            $(titleHtml).parent().css("stroke", "black");
          }
          else {
            $(titleHtml).parent().css("stroke", boxPlotColor.replace(".75", "1"));
          }
        })

        boxPlots.filter(function(i, title) {
          let rect = $(title).parent();
          let color = rect.attr("fill");

          if (rect.hasClass('selected')) {
            rect.css("fill", color);
            rect.css("opacity", .4);
          }
          else {
            rect.css("fill", "white");
            rect.css("opacity", "initial");
          }
        })
      })
  })

});
