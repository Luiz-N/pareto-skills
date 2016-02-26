import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  width: 500,
  height: 200,
  data: null,

  draw: Ember.on('didRender', function() {

    var minDate = this.get('dimension').bottom(1)[0].date;
    var maxDate = this.get('dimension').top(1)[0].date;
    var unitDates = [minDate, moment(minDate).add(1, 'weeks'), moment(minDate).add(2, 'weeks'), moment(minDate).add(4, 'weeks'), moment(minDate).add(7, 'weeks'),moment(minDate).add(9, 'weeks'), maxDate];

    var cdfChart  = dc.compositeChart("#"+this.get('id'));
    let charts = [];
    let counter = 0;
    for (var key in this.get('group')) {
      let color = this.get('colors')[counter++];
      // charts.push(
      //   dc.lineChart(cdfChart)
      //     .colors([color])
      //     .group(this.get('group')[key], key + "hours")
      //     .valueAccessor(function(d) {
      //       return d.value[0];
      //     })
      // );
      charts.push(
        dc.lineChart(cdfChart)
          .colors([color])
          .group(this.get('group')[key], key)
          .valueAccessor(function(d) {
            return d.value[1];
          })
          .title(function(d) {
            return +(d.data.value[1]).toFixed(1) + '% of a ' + d.data.value[2] + ' "master"';
            return d3.time.format("%x: ")(d.x) + "actual";
            return d3.time.format("%a %b %d:  ")(d.x) + "Student Hours: " + actualHours;
          })
      );
    }

    cdfChart
      .width(this.get('width')).height(this.get('height'))
      .dimension(this.get('dimension'))
      .x(d3.time.scale().domain([minDate,maxDate]))
      .xUnits(d3.time.days)
      // .x(d3.scale.linear().domain([0, 10000]))
      // .group(this.get('group'))
      // .valueAccessor(function(d) {
      //   debugger;
      //   return d.value.totalPercent;
      // })
      .margins({top: 10, right: 50, bottom: 20, left: 60})
        .brushOn(false)
        .legend(dc.legend().x(70).y(10).itemHeight(13).gap(5))
      // .yAxisLabel('% of a "master"')
      .y(d3.scale.linear().domain([0, 100]))
      // .brushOn(true)
      // .interpolate('basis-open')
      .compose(charts)
      .xAxis().tickValues(unitDates)
      .tickFormat(function(v, i) {
        let units = ["Prep Phase", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Presentations"];
        return units[i];
      })

      cdfChart
      .yAxis().tickValues([30,50,80,100]).tickFormat(function(v) {
        if (v === 30) {
          return "Novice"
        }
        else if (v === 50) {
          return "Competent";
        }
        else if (v === 80) {
          return "Pro"
        }
          return "Master";
      })
      // .renderlet(function(chart) {
      //   chart.selectAll("g.sub._1 path").style("stroke-dasharray",3)
      // })
  })

});
