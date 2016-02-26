import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  width: 500,
  height: 200,
  data: null,

  // colors: ["rgba(232,177,114,0.5)", "#E8B172", "rgba(128,222,195,0.5)", "#80DEC3", "rgba(203,188,220,0.5)", "#CBBCDC", "rgba(193,221,121,0.5)", "#C1DD79", "black", "rgb(255,105,97)"],
  // colors: ["rgba(101,144,62,.75)", "#65903E", "rgba(193,82,170,0.75)", "#C152AA", "rgba(198,88,62,0.75)", "#C6583E", "rgba(106,120,185,0.75)", "#6A78B9", "black", "rgb(255,105,97)"],
  // colors: ["rgba(108,205,248,.5)", "#6CCDF8", "rgba(245,151,141,0.5)", "#F5978D", "rgba(83,242,173,0.5)", "#53F2AD", "rgba(160,190,135,0.5)", "#A0BE87", "black", "rgb(255,105,97)"],

  lineColors: ["rgba(232,177,114,0.5)", "rgba(128,222,195,0.5)", "rgba(203,188,220,0.5)", "rgba(193,221,121,0.5)"],
  // dimensions: Ember.

  draw: Ember.on('didRender', function() {

    var minDate = this.get('dimension').bottom(1)[0].date;
    var maxDate = this.get('dimension').top(1)[0].date;

    var unitDates = [minDate, moment(minDate).add(1, 'weeks'), moment(minDate).add(2, 'weeks'), moment(minDate).add(4, 'weeks'), moment(minDate).add(7, 'weeks'),moment(minDate).add(9, 'weeks'), maxDate];

    // let maxDate = moment(minDate).add(14, 'weeks').toDate();

    let data = this.get('data');
    // var timeSeries  = dc.compositeChart("#hitsperday");
    var timeSeriesBar  = dc.barChart("#"+this.get('id'));

    let groups = this.get('groups');
    let counter=0;
    let charts = [];

    groups.forEach(function(group, i) {
      if (i === 0) {
        timeSeriesBar
          .group(group.group, group.name + " <= median")
          .valueAccessor(function(d) {
            if (d.value.gap < 0) {
              return d.value.totalHours + d.value.gap;
            }
            return d.value.totalHours;
          })
          .stack(group.group, group.name + " > median", function(d) {
            return Math.abs(d.value.gap);
          })
      }
      else {
        timeSeriesBar
        .stack(group.group, group.name + " <= median", function(d) {
            if (d.value.gap < 0) {
              return d.value.totalHours + d.value.gap;
            }
            return d.value.totalHours;
          })
        .stack(group.group, group.name  + " > median", function(d) {
          return Math.abs(d.value.gap);
        })
      }
    })

    // for (var key in this.get('cdfGroup')) {
    //   let color = this.get('lineColors')[counter++];
    //   charts.push(
    //     dc.lineChart(timeSeries)
    //       .legend(dc.legend().x(60).y(10).itemHeight(13).gap(5))
    //       .colors([color])
    //       .group(this.get('cdfGroup')[key], key)
    //       .y(d3.scale.linear().domain([0, 1]))
    //       .valueAccessor(function(d) {
    //         return d.value[1];
    //       })
    //   );
    // }


    // charts.push(
    // dc.barChart(timeSeries)
    timeSeriesBar
      // .renderArea(true)
      // .gap(3)
      .renderHorizontalGridLines(true)
      .width(this.get('width')).height(this.get('height'))
      .dimension(this.get('dimension'))
      .xUnits(d3.time.days)
      // .brushOn(false)
      .y(d3.scale.linear().domain([0, 14]))
      .elasticX(true)
      // .elasticY(true)
      .xAxisPadding(1)
      .yAxisPadding('5%')
      .legend(dc.legend().x(60).y(10).itemHeight(10).gap(5))
      .x(d3.time.scale().domain([minDate,maxDate]))
      .yAxisLabel("Hours")
      .colors(this.get('colors'))
      .title(function(d) {
        let gap = d.data.value.gap;
        let totalHours = +(d.data.value.totalHours).toFixed(1);
        let name = d.data.value.key;
        // negative gap means above median
        // debugger;
        if (gap < 0) {
          return d3.time.format("%a %b %d:  ")(d.x) + totalHours + " hours of " + name + " (" + -1*gap + " above median)";
        }
        else {
          return d3.time.format("%a %b %d:  ")(d.x) + totalHours + " hours of " + name + " (" + gap + " below median)";
        }
      })
      .colorAccessor(function(d, i) {
        let layer = d.layer;
        if (d.layer%2) {
          //if layer is odd num then it is the gap stack
          // if gap is positive then show lighter color
          return d.data.value.gap > 0 ? d.layer - 1: d.layer;
        }
        return d.layer;
      })
      // .x(d3.time.scale().domain([minDate,maxDate]))
      // .elasticX(true)
      .centerBar(true)
      .on('postRender', function(chart) {
        let rects = chart.selectAll('.stack:nth-child(even) rect');
        rects[0].forEach(function(rect, i) {
          let $r = $(rect);
          let color = $r.attr('fill');
          let width = $r.attr('width');
          if (color.indexOf("rgba") != -1){
            $r.css('fill','white')
              .css('stroke', color)
              .css('stroke-width', '2px')
              .css('transform', 'translateX(1px)')
              .attr('width', width - 2)
              .css('width', width - 2)
          }
        })
      })
      .on('postRedraw', function(chart) {
        let rects = chart.selectAll('.stack:nth-child(even) rect');
        rects[0].forEach(function(rect, i) {
          let $r = $(rect);
          let color = $r.attr('fill');
          let width = $r.attr('width');
          if (color.indexOf("rgba") != -1){
            $r.attr('width', width - 2);
          }
        })
      })
      .xAxis().tickValues(unitDates)
      .tickFormat(function(v, i) {
        let units = ["Prep Phase", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Presentations"];
        return units[i];
      })
    // )

    // timeSeries
    //   .width(this.get('width')).height(this.get('height'))
    //   .dimension(this.get('dimension'))
    //   .xUnits(d3.time.days)
    //   .y(d3.scale.linear().domain([0, 14]))
    //   .elasticX(true)
    //   .xAxisPadding(1)
    //   // .legend(dc.legend().x(60).y(10).itemHeight(13).gap(5))
    //   .x(d3.time.scale().domain([minDate,maxDate]))
    //   .yAxisLabel("Hours per day")
    //   // .brushOn(false)
    //   .compose(charts)
    //   .renderlet(function(chart) {
    //     let rects = chart.selectAll('.stack:nth-child(even) rect');
    //     rects[0].forEach(function(rect, i) {
    //       let $r = $(rect);
    //       let color = $r.attr('fill');
    //       let width = $r.attr('width');
    //       if (color.indexOf("rgba") != -1){
    //         $r.css('fill','whitesmoke')
    //           .css('stroke', color)
    //           .css('stroke-width', '2px')
    //           .css('transform', 'translateX(1px)')
    //           .css('width', width - 2);
    //       }
    //     })
    //   })



      // .renderlet(function(chart) {
        // chart.selectAll("g.sub._1 path").style("stroke-dasharray",3)
        // debugger;

// height = chart.xAxisY()
//     // max = _.max(_.pluck(@lastQueryResults,"value"))
//     x = chart.x()
//     y = d3.scale.linear().domain([0, max]).range([height, 0])


//     group = chart.g().append("g")
//             .attr("class","area")
//             .attr("transform", "translate(42,0)")


//     area = d3.svg.area()
//            .x( (d) -> x(d3.time.format("%Y-%m").parse(d.key)))
//            .y0(height )
//            .y1( (d) ->
//               // # debugger
//               if moment(d3.time.format("%Y-%m").parse(d.key)).year() < 2014
//                 y(d.value)
//               else
//                 y(0)
//             )
//            .interpolate("basis-open")
//            # .y( (d) -> 4000)
//     chart.g().select("g.area").append("path")
//            .datum()
//            .attr("d",area)
//            // .style("fill", "rgba(153,153,153,.25)" )

//     yAxisRight = d3.svg.axis().scale(y).orient("right").ticks(3)
//     group.append("g")
//             .attr("transform", "translate(" + (chart.xAxisLength()) + ",0)")
//             .attr("class","axis hack")
//             .call(yAxisRight)
      // })
  })

});
