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
  lineColors: ["rgba(245,151,141,0.5)", "rgba(160,190,135,0.5)", "rgba(108,205,248,.5)", "rgba(253,174,107,0.5)",
               "rgba(245,151,141,0.8)", "rgba(160,190,135,0.8)", "rgba(108,205,248,.8)", "rgba(253,174,107,0.8)"],
  // dimensions: Ember.

  draw: Ember.on('didRender', function() {

    var minDate = this.get('dimension').bottom(1)[0].date;
    var maxDate = this.get('dimension').top(1)[0].date;

    var unitDates = [minDate, moment(minDate).add(1, 'weeks'), moment(minDate).add(2, 'weeks'), moment(minDate).add(4, 'weeks'), moment(minDate).add(7, 'weeks'),moment(minDate).add(9, 'weeks'), maxDate];

    // let maxDate = moment(minDate).add(14, 'weeks').toDate();

    let data = this.get('data');
    var compositeChart  = dc.compositeChart("#"+this.get('id'));
    var positiveStack = dc.barChart(compositeChart);
    var negativeStack = dc.barChart(compositeChart);

    let groups = this.get('groups');
    let counter=0;
    let charts = [];

    groups.forEach(function(group, i) {
      if (i === 0) {
        // debugger;
        positiveStack
          .group(group.group, group.name)
          .valueAccessor(function(d) {
            let hoursAboveMedian = d.value.gap*-1 > .1 ? d.value.gap*-1 : 0;
            let hoursAboveIQR = hoursAboveMedian - d.value.stdAvgSum;
            return hoursAboveIQR > 0 ? hoursAboveMedian - hoursAboveIQR : hoursAboveMedian;
          })
          .stack(group.group, group.name, function(d) {
            let hoursAboveMedian = d.value.gap*-1 > .1 ? d.value.gap*-1 : 0;
            let hoursAboveIQR = hoursAboveMedian - d.value.stdAvgSum;
            return hoursAboveIQR > 0 ? hoursAboveIQR : 0;
          })
        negativeStack
          .group(group.group, group.name)
          .valueAccessor(function(d) {
            let hoursBelowMedian = d.value.gap > .1 ? d.value.gap : 0;
            let hoursBelowIQR = hoursBelowMedian - d.value.stdAvgSum;
            return (hoursBelowIQR > 0 ? hoursBelowMedian - hoursBelowIQR : hoursBelowMedian)*-1;
          })
          .stack(group.group, group.name, function(d) {
            let hoursBelowMedian = d.value.gap > .1 ? d.value.gap : 0;
            let hoursBelowIQR = hoursBelowMedian - d.value.stdAvgSum;
            return hoursBelowIQR > 0 ? hoursBelowIQR*-1 : 0;
          })
      }
      else {
        positiveStack
        .stack(group.group, group.name, function(d) {
          let hoursAboveMedian = d.value.gap*-1 > .1 ? d.value.gap*-1 : 0;
          let hoursAboveIQR = hoursAboveMedian - d.value.stdAvgSum;
          return hoursAboveIQR > 0 ? hoursAboveMedian - hoursAboveIQR : hoursAboveMedian;
        })
        .stack(group.group, group.name, function(d) {
          let hoursAboveMedian = d.value.gap*-1 > .1 ? d.value.gap*-1 : 0;
          let hoursAboveIQR = hoursAboveMedian - d.value.stdAvgSum;
          return hoursAboveIQR > 0 ? hoursAboveIQR : 0;
        })
        negativeStack
        .stack(group.group, group.name, function(d) {
          let hoursBelowMedian = d.value.gap > .1 ? d.value.gap : 0;
          let hoursBelowIQR = hoursBelowMedian - d.value.stdAvgSum;
          return (hoursBelowIQR > 0 ? hoursBelowMedian - hoursBelowIQR : hoursBelowMedian)*-1;
        })
        .stack(group.group, group.name, function(d) {
          let hoursBelowMedian = d.value.gap > .1 ? d.value.gap : 0;
          let hoursBelowIQR = hoursBelowMedian - d.value.stdAvgSum;
          return hoursBelowIQR > 0 ? hoursBelowIQR*-1 : 0;
        })
      }
    })

    negativeStack
      .dimension(this.get('dimension'))
      .xUnits(d3.time.days)
      .x(d3.time.scale().domain([minDate,maxDate]))
      .colors(this.get('lineColors'))
      .renderHorizontalGridLines(true)
      // .colors(["black"])
      .centerBar(true)
      .title(function(d) {
        let actualHours = +(d.data.value.totalHours).toFixed(1);
        // let avgHours = d.data.value.totalAvgHours;
        // let distanceFromMedian = +(100*(avgHours - actualHours)/avgHours).toFixed(0);
        // let percentile = distanceFromMedian > 50 ? 50 + distanceFromMedian : 50 - distanceFromMedian;
        return d.data.value.key;
        return d3.time.format("%x: ")(d.x) + actualHours + " hours ~ "
        return d3.time.format("%a %b %d:  ")(d.x) + "Student Hours: " + actualHours;
      })
      .colorAccessor(function(d, i) {
        let colorKey = null;
        switch(d.data.value.key) {
            case "js":
                colorKey = 0; break;
            case "python":
                colorKey = 1; break;
            case "sql":
                colorKey = 2; break;
            case "html_css":
                colorKey = 3; break;
        }
        let layer = d.layer;
        // return i + 1;
        if (d.layer%2) {
          return colorKey + 4;
        //   //if layer is odd num then it is the gap stack
        //   // if gap is positive then show lighter color
        //   return d.data.value.gap > 0 ? d.layer - 1: d.layer;
        }
        return colorKey;
      })


    positiveStack
      .dimension(this.get('dimension'))
      .renderHorizontalGridLines(true)
      .xUnits(d3.time.days)
      .x(d3.time.scale().domain([minDate,maxDate]))
      .colors(this.get('lineColors'))
      .centerBar(true)
      .title(function(d) {
        // let std = +(d.data.value.stdAvgSum).toFixed(1);
        let avgStd = d.data.value.stdAvgSum;
        let actualHours = d.data.value.totalHours;
        let avgHours = d.data.value.totalAvgHours;
        return d.data.value.key;
        return d3.time.format("%x: ")(d.x) + "outside boxplot? " + (Math.abs(avgHours - actualHours) > avgStd).toString();
        return d3.time.format("%a %b %d:  ")(d.x) + "Median Hours: " + totalAvgHours + " Stnd Dev: " + std;
      })
      .colorAccessor(function(d, i) {
        let colorKey = null;
        switch(d.data.value.key) {
            case "js":
                colorKey = 0; break;
            case "python":
                colorKey = 1; break;
            case "sql":
                colorKey = 2; break;
            case "html_css":
                colorKey = 3; break;
        }
        let layer = d.layer;
        // return i + 1;
        if (d.layer%2) {
          return colorKey + 4;
        //   //if layer is odd num then it is the gap stack
        //   // if gap is positive then show lighter color
        //   return d.data.value.gap > 0 ? d.layer - 1: d.layer;
        }
        return colorKey;
      })

      charts.push(positiveStack);
      charts.push(negativeStack);


    compositeChart
      .renderHorizontalGridLines(true)
      // .brushOn(false)
      .width(this.get('width')).height(this.get('height'))
      .dimension(this.get('dimension'))
      .xUnits(d3.time.days)
      // .y(d3.scale.linear().domain([-4, 4]))
      .elasticY(true)
      .elasticX(true)
      .xAxisPadding(1)
      .legend(dc.legend().x(60).y(10).itemHeight(13).gap(-5))
      .x(d3.time.scale().domain([minDate,maxDate]))
      .yAxisLabel("Hours From Median")
      .compose(charts)
      .on('postRender', function(chart) {
        $(chart.anchor() + ' .dc-legend .dc-legend-item:nth-child(odd)').remove();
        let remaining = $(chart.anchor() + ' .dc-legend .dc-legend-item').splice(4);
        $(remaining).remove();

        $(chart.anchor() + ' .dc-legend .dc-legend-item').each(function(index, el) {
          let color = null;
          switch(el.textContent) {
              case "js":
                  color = "rgba(245,151,141,0.5)"; break;
              case "python":
                  color = "rgba(160,190,135,0.5)"; break;
              case "sql":
                  color = "rgba(108,205,248,0.5)"; break;
              case "html_css":
                  color = "rgba(253,174,107,0.5)"; break;
          }
          $(el.firstChild).css("fill", color);
          el.onmouseenter = function(e) {
            let color = e.currentTarget.firstChild.attributes.fill;
            let language = e.currentTarget.textContent;
            let chartEl = e.currentTarget.parentNode.parentNode;
            $(chartEl).find("rect").addClass("hoverHide");
            $(chartEl).find("rect title:contains('" + language + "')").parent().removeClass("hoverHide");
          };
          el.onmouseleave = function(e) {
            let chartEl = e.currentTarget.parentNode.parentNode;
            $(chartEl).find("rect").removeClass("hoverHide");
          }
        });
        let $newEl = $(chart.anchor() + ' .dc-legend .dc-legend-item:first').clone();
        $newEl.find("rect").remove();
        $newEl.find("text").text("Bolder Colors = Portion outside IQR").attr("x",0).attr("y",0);
        $newEl.attr("transform", "");
        $(chart.anchor() + ' .dc-legend').prepend($newEl);
      })
      .on('postRedraw', function(chart) {
        ga('send', 'event', 'charts', 'redrawn');
      })
        .xAxis().tickValues(unitDates)
        .tickFormat(function(v, i) {
          let units = ["Prep Phase", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Presentations"];
          return units[i];
        })
  })

});
