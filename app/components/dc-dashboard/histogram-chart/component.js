import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  width: 500,
  height: 200,

  draw: Ember.on('didRender', function() {
    // debugger;
    var barChart = dc.barChart("#"+this.get('id'));
      barChart
        .width(this.get('width'))
        .height(this.get('height'))
        // .margins({top: 20, left: 10, right: 10, bottom: 20})
        // group.histogram[0];
        .group(this.get('group'))
        // .valueAccessor(function(d) {
        //   debugger;
        //   return d.histogram[0];
        // })
        .dimension(this.get('dimension'))
        // .x(d3.scale.ordinal())
        // Assign colors to each value in the x scale domain
        // .colors(this.get('colors'))
        .colors(['teal'])
        // .elasticX(true)
        .centerBar(true)
        // .gap(5)
        // .brushOn(false)
        // .y(d3.scale.linear().domain([0,10]))
        // .round(dc.round.floor)
        // .ordering(function(d) { return -d.value; })
        .round(dc.round.floor)
        // .alwaysUseRounding(true)
        .xUnits(dc.units.fp.precision(.1))
        .x(d3.scale.linear().domain([-3,3]))
        .renderlet(function (chart) {
          // chart.selectAll('g.stack._0 rect').style("width", 10);
          // chart.selectAll('g.stack._0').transform('translateX(50)')
          // debugger;
          // chart.redraw();
        })
        // .label(function (d) {
        //     return d.key.split('.')[1];
        // })
        // Title sets the row text
        // .title(function (d) {
        //     return d.value;
        // })
        // .elasticX(true)
        // .xAxis()
    if (this.get('colors')) {
      barChart.colors(this.get('colors'))
    }

  })

});
