import Ember from 'ember';

export default Ember.Component.extend({

  dimension: null,
  group: null,
  width: 500,
  height: 200,
  order: null,
  languageColors: ["#6CCDF8","#F5978D","#53F2AD","#A0BE87"].reverse(),
  // colors: ["rgba(108,205,248,.5)", "#6CCDF8", "rgba(245,151,141,0.5)", "#F5978D", "rgba(83,242,173,0.5)", "#53F2AD", "rgba(160,190,135,0.5)", "#A0BE87"].reverse(),
  barColors: ["#A0BE87", "#53F2AD", "#F5978D", "#6CCDF8", "rgba(160,190,135,0.5)", "rgba(83,242,173,0.5)", "rgba(245,151,141,0.5)", "rgba(108,205,248,.5)"],


  draw: Ember.on('didRender', function() {
    // let colors = ["white", "#C1DD79", "#CBBCDC", "#80DEC3", "#E8B172"];

    var barChart = dc.barChart("#"+this.get('id'));
      barChart
        .width(this.get('width'))
        .height(this.get('height'))
        // .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(this.get('group'), "Total Hours")
        // .stack(this.get('group'), "Gap", function(d) {
        //   return Math.abs(d.value.gap);
        // })
        .valueAccessor(function(d) {
          return +d.value.totalHours.toFixed(1);
          // +p.totalHours.toFixed(1);
        })
        .colorAccessor(function(d, i) {
          // if (d.layer%2) {
          //   //if layer is odd num then it is the gap stack
          //   // if gap is positive then show lighter color
          //   return d.data.value.gap > 0 ? i + 4 : i;
          // }
          return i;
        })
        .title(function(d) {
          let gap = d.data.value.gap;
          let totalHours = +(d.data.value.totalHours).toFixed(1);
          let name = d.data.key || d.data.value.key;
          // negative gap means above median
          if (gap < 0) {
            return totalHours + " hours of " + name + " (" + -1*gap + " above median)";
          }
          else {
            return totalHours + " hours of " + name + " (" + gap + " below median)";
          }
        })
        .dimension(this.get('dimension'))
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .centerBar(true)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .elasticX(true)
        .xAxisPadding('5%')
        .yAxisLabel("Hours")
        // .x(d3.scale.ordinal())
        // Assign colors to each value in the x scale domain
        .colors(this.get('colors'))
        // .colors(['salmon'])
        .ordering(function(d) {return  -d.value.totalHours; })
        .elasticY(true)
        .gap(5)
        .yAxisPadding('5%')
        .margins({top: 20, right: 0, bottom: 20, left: 50})
        .on('postRender', function(chart) {
          $(chart.selectAll('.stack rect')[0]).addClass("bar-chart");
          let rects = chart.selectAll('.stack:nth-child(even) rect');
          rects[0].forEach(function(rect, i) {
            let $r = $(rect);
            let color = $r.attr('fill');
            let width = $r.attr('width');
            let belowMedian = $r.find('title').text().indexOf("above") === -1;
            if (belowMedian) {
              $r.addClass("gap")
                // .attr('fill','rgb(245, 245, 245)')
                .css('stroke', color)
                // .attr('stroke-width', '3px')
                // .attr('transform', 'translate(2px, -1px)')
                .attr('width', width - 4);
            }
            else if (!belowMedian) {
              $r.addClass('above')
              // .attr('fill',color.replace('.5',1.0));
            }
          })
        })
        .on('postRedraw', function(chart) {
          let rects = chart.selectAll('.stack:nth-child(even) rect');
          rects[0].forEach(function(rect, i) {
            let $r = $(rect);
            let fillColor = $r.attr('fill');
            let hackedFillColor = $r.attr('fill');
            let belowMedian = $r.find('title').text().indexOf("above") === -1;
            if (belowMedian) {
              let width = $r.attr('width');
              $r.removeClass("above").addClass("gap")
                .css('stroke', fillColor)
                .attr('width', width - 4);
                // .attr('stroke-width', '3px')
                // .attr('transform', 'translate(2px, -1px)')
                // .attr('width', width - 4);
            } else if (!belowMedian) {
                let width = +$r.attr('width');
                $r.removeClass("gap").addClass('above')
                  .attr('width', width)
                  .css('stroke', 'none')
            };
            // debugger;
          })
        })

      // debugger;
    if (this.get('order')) {
      barChart
        .x(d3.scale.ordinal().domain(this.get('order')))

    }


  })

});
