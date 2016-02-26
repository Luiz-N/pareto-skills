import Ember from 'ember';

export default Ember.Component.extend({

  rawData: null,
  longWidth: null,
  longHeight: null,
  shortWidth: null,
  shortHeight: null,
  // cfData: null,
  unitColors: ["black", "rgba(160,190,135,.75)","rgba(160,190,135,1)"],
  // ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0']
  // languageColors: ["rgba(108,205,248,.5)", "#6CCDF8", "rgba(245,151,141,0.5)", "#F5978D", "rgba(83,242,173,0.5)", "#53F2AD", "rgba(160,190,135,0.5)", "#A0BE87", "black", "rgb(255,105,97)"],
  languageColors: ["rgba(245,151,141,0.5)", "#F5978D", "rgba(160,190,135,0.5)", "#A0BE87", "rgba(108,205,248,.5)", "#6CCDF8", "rgba(253,174,107,0.5)", "#fdae6b", "black", "rgb(255,105,97)"],

  // projectColors: ['rgba(127,201,127,0.5)','#7fc97f','rgba(190,174,212,0.5)','#beaed4','rgba(253,192,134,0.5)', '#fdc086', 'rgba(251,154,153,0.5)', "#fb9a99", 'rgba(56,108,176,0.5)', "#386cb0"],
  // langaugeBarColors: ["#A0BE87", "#53F2AD", "#F5978D", "#6CCDF8", "rgba(160,190,135,0.5)", "rgba(83,242,173,0.5)", "rgba(245,151,141,0.5)", "rgba(108,205,248,.5)"],

  langaugeBarColors: ["#A0BE87", "#53F2AD", "#F5978D", "#6CCDF8", "rgba(160,190,135,0.5)", "rgba(83,242,173,0.5)", "rgba(245,151,141,0.5)", "rgba(108,205,248,.5)", "black"],
  // langaugeBarColors: ["#A0BE87", "#53F2AD", "#F5978D", "#6CCDF8"],
  // 83,242,173
  languageBoxColors: ["black", "rgba(253,174,107,1)", "rgba(245,151,141,1)", "rgba(160,190,135,1)", "rgba(108,205,248,1)"],

  // projectColors: ['rgba(127,201,127,0.5)','#7fc97f','rgba(190,174,212,0.5)','#beaed4','rgba(141,160,203,0.5)', "#8da0cb", 'rgba(231,138,195,0.5)', "#e78ac3", 'rgba(253,192,134,0.5)', '#fdc086'],
  // projectColors: ['black','black','rgba(190,174,212,0.5)','#beaed4','rgba(56,108,176,0.5)', "#386cb0", 'rgba(253,192,134,0.5)', '#fdc086', 'rgba(251,154,153,0.5)', "#fb9a99"],
  projectColors: ["black", "rgba(141,160,203,.75)","rgba(141,160,203,1)"],
  unitOrder: ["Prep Phase", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
  projectOrder: ["Exercises", "Benson", "Luther", "Mcnulty", "Fletcher", "Kojak"],
  languageOrder: ["js", "python", "html_css", "sql"],
  languageCdfColors: ["#A0BE87", "#F5978D","#fdae6b","#6CCDF8", "black", "rgb(255,105,97)"],

  cfData: Ember.computed('rawData',
    function() {

    let parseDate = d3.time.format("MM-DD-YYYY").parse;
    let parseDate2 = d3.time.format("%m/%d").parse;

    let rawData = this.get('rawData');

    // rawData.forEach(function(d) {
    //   // d.date = parseDate(d.date);
    //   // d.date = new Date(d.date);
    //   // d.qtime = parseDate2((d.date.getMonth()+1)+"/"+d.date.getDate());
    //   // d.Year=d.date.getFullYear();
    // });
    // this.set('cfData', crossfilter(rawData));
    return crossfilter(rawData);
  }),

  weekDayDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.dayOfWeek;});
  }),

  unitDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.unit;});
  }),

  projectDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.project;});
  }),

  toolDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.tool;});
  }),

  dailyDateDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.date;});
  }),

  monthlyDateDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.month;});
  }),

  languageDim: Ember.computed('cfData', function() {
    return this.get('cfData').dimension(function(d) {return d.language;})
  }),

  monthlyHoursGroup: Ember.computed('cfData', function() {
    return this.get('monthlyDateDim').group().reduceSum(function(d) {return d.hours;});
  }),

  projectGroupsOverTime: Ember.computed('cfData', function() {
    let dateDim = this.get('dailyDateDim');
    let diffGroup = this.get('diffGroup');

    // return this.get('projectDim').group().top(Infinity).map(function(project) {
      return [ {
        group: diffGroup(dateDim,"project" , true),
        name: "Historical IQR"
      }]
    // });

  }),


  toolGroupsOverTime: Ember.computed('cfData', function() {
    let dateDim = this.get('dailyDateDim');
    let diffGroup = this.get('diffGroup');

    return this.get('toolDim').group().top(Infinity).map(function(tool) {
      return {
        group: diffGroup(dateDim,"tool" ,tool.key),
        name: tool.key
      };
    });

  }),

  languageGroupsOverTime: Ember.computed('cfData', function() {
    let dateDim = this.get('dailyDateDim');
    let diffGroup = this.get('diffGroup');

    return this.get('languageDim').group().top(Infinity).map(function(language) {
      return {
        group: diffGroup(dateDim,"language",language.key),
        name: language.key
      };
    });
  }),

  cdfGroup: Ember.computed('cfData', function() {
    let dateDim = this.get('dailyDateDim');
    let result = {}
    // let summedDailyHours = this.get('languageGroupsOverTime')[5].group;

    let dailyTotalHours = dateDim.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours += v.hours
            p[v.language] ? p[v.language] += v.hours : p[v.language] = v.hours
          }
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours -= v.hours
            p[v.language] ? p[v.language] -= v.hours : p[v.language] = v.hours
          }
            return p;
        },
        /* initialize p */
        function () {
            return {
              totalHours: 0,
            };
      });

    result.python = this.get('accumulate_group')(dailyTotalHours, 'python');
    result.js = this.get('accumulate_group')(dailyTotalHours, 'js');
    result.html_css = this.get('accumulate_group')(dailyTotalHours, 'html_css');
    result.sql = this.get('accumulate_group')(dailyTotalHours, 'sql');
    // result.total = this.get('accumulate_group')(dailyTotalHours);

    return result;
    // return this.get('accumulate_group')(dailyTotalHours);

  }),

  accumulate_group: function(sourceGroup, sourceLanguage) {
      return {
        all:function () {
            var totalPercent = 0;
            let totalHours = 0;
            return sourceGroup.all().map(function(d) {
              // let newHours = Math.round(d.value.totalHours);
              // let newTime = sourceLanguage ? d.value[sourceLanguage] : d.value.totalHours;
              let newTime = d.value[sourceLanguage];
              for (var i = 0; i < newTime; i++) {
                let crntTime = ++totalHours
                let percentGain = ((1/Math.pow(crntTime,0.949588))/(Math.pow(1.9998,0.949588)))/6.366920 * 100;
                // debugger;
                totalPercent += percentGain;
              };
              return {key:d.key, value: [totalHours, totalPercent, sourceLanguage]};
            });
        }
    };
  },

  languageGroupsBarChart: Ember.computed('cfData', function() {
    let languages = this.get('languageDim');
    let diffGroup = this.get('diffGroup');
    return [ {
      group: diffGroup(languages,"language", true, true),
      name: "Languages"
    }]

    // let diffGroup = this.get('diffGroup');
    // diffGroup(languages, "hours", typeof "number")
    return languages.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours += v.hours;
            p.totalAvgHours += v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours -= v.hours;
            p.totalAvgHours -= v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* initialize p */
        function (p,v) {
          return {
            totalHours: 0,
            totalAvgHours: 0,
            gap: 0
          };
      })
  }),

  toolGroupsBarChart: Ember.computed('cfData', function() {
    let units = this.get('toolDim');
    // let diffGroup = this.get('diffGroup');
    // diffGroup(units, "hours", typeof "number")
    return units.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours += v.hours;
            p.totalAvgHours += v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours -= v.hours;
            p.totalAvgHours -= v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* initialize p */
        function () {
          return {
            totalHours: 0,
            totalAvgHours: 0,
            gap: 0
          };
      })
  }),

  projectGroupsBarChart: Ember.computed('cfData', function() {
    let projects = this.get('projectDim');
    let diffGroup = this.get('diffGroup');

    return [ {
      group: diffGroup(projects,"project", true, true),
      name: "Projects"
    }]
    // diffGroup(projects, "hours", typeof "number")
    return projects.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours += v.hours;
            p.totalAvgHours += v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours -= v.hours;
            p.totalAvgHours -= v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* initialize p */
        function () {
          return {
            totalHours: 0,
            totalAvgHours: 0,
            gap: 0
          };
      })
  }),

  unitGroupsBarChart: Ember.computed('cfData', function() {
    let units = this.get('unitDim');
    let diffGroup = this.get('diffGroup');

    return [ {
      group: diffGroup(units,"unit", true, true),
      name: "Units"
    }]
    // let diffGroup = this.get('diffGroup');
    // diffGroup(units, "hours", typeof "number")
    return units.group().reduce(
        /* callback for when data is added to the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours += v.hours;
            p.totalAvgHours += v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
          if (v.hours) {
            p.totalHours -= v.hours;
            p.totalAvgHours -= v.avgHours;
            p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
          }
          return p;
        },
        /* initialize p */
        function () {
          return {
            totalHours: 0,
            totalAvgHours: 0,
            gap: 0
          };
      })
  }),

  projectDeviationGroups: Ember.computed('cfData', function() {
    let dailyDim = this.get('dailyDateDim');
    let diffGroup = this.get('diffGroup');

    // let reducer = function(filter) {
    //   return reductio().std(function(d) {
    //     debugger;
    //   return d.avgHours;
    //   })(dailyDim);
    // }

    return this.get('projectDim').group().top(Infinity).map(function(project) {
      return {
        group: diffGroup(dailyDim, "project", project.key),
        name: project.key
      };
    });
  }),

  diffGroup: function(sourceDim, filterKey, filterValue, isOrdinal) {
    return sourceDim.group().reduce(
    // return sourceDim.group().reduce(
      /* callback for when data is added to the current filter results */
      function (p, v) {
        if (isOrdinal && !v.hours) {return p;}
        else if (filterValue === true || v[filterKey] === filterValue) {
          // debugger;
          // p.count++;
          p.totalHours += v.hours;
          p.totalAvgHours += v.avgHours;
          p.stdAvgSum += v.avgStd;
          // p.sumOfSq += v.avgHours*v.avgHours;
          // p.std = p.sumOfSq - (p.totalAvgHours*p.totalAvgHours/p.count);
          p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
        }
        return p;
      },
      /* callback for when data is removed from the current filter results */
      function (p, v) {
        if (isOrdinal && !v.hours) {return p;}
        else if (filterValue === true || v[filterKey] === filterValue) {
          // p.count--;
          p.totalHours -= v.hours;
          p.totalAvgHours -= v.avgHours;
          p.stdAvgSum -= v.avgStd;
          // p.sumOfSq -= v.avgHours*v.avgHours;
          // p.std = p.sumOfSq - (p.totalAvgHours*p.totalAvgHours/p.count);
          p.gap = +(p.totalAvgHours - p.totalHours).toFixed(1);
        }
        return p;
      },
      /* initialize p */
      function () {
        return {
          key: filterValue,
          stdAvgSum: 0,
          totalHours: 0,
          totalAvgHours: 0,
          gap: 0
        };
    })
  },

  weekDayBarGroups: Ember.computed('cfData', function() {
    let weekDayDims = this.get('weekDayDim');
    return weekDayDims.group().reduceSum(function(d) {return d.hours;});
  }),

  // fluctuationDim: Ember.computed('cfData', function() {
  //   // debugger;
  //   return this.get('cfData').dimension(function (d) {
  //     return d.hours? (avgHours - actualHours)
  //     return d.hours ? +(d.hours - d.avgHours).toFixed(1) : undefined;
  //   });
  // }),

  // fluctuationGroup: Ember.computed('fluctuationDim', function() {
  //     return this.get('fluctuationDim').group();
  // // }),
  //   // return reductio().histogramBins([0,2,6,10])
  //   //   .histogramValue( (d) => {
  //   //     // return d.hours;
  //   //     return d.hours - d.avgHours;
  //   //     // return +d.number;
  //   // })
  //   // (group);
  //   // return this.get('fluctuationDim').group();
  //   // return this.get('dailyDateDim').group().reduceSum(function(d) {return d.hours;});
  // }),

  renderAll: Ember.on('didRender', function() {
      this.set('longWidth', $(".long-chart").outerWidth());
      this.set('longHeight', $(".long-chart").outerWidth()/3);
      this.set('shortWidth', $(".short-chart").outerWidth()*1.2);
      this.set('shortHeight', $(".short-chart").outerWidth()/1.5);
      dc.renderAll();
  }),

  actions: {
    resetCharts: function() {
      dc.filterAll();
      dc.redrawAll();
      let d3Click = new MouseEvent("click");
      $("rect.selected").each(function(i, e) {
        $(e).attr("display") ? e.dispatchEvent(d3Click) : null;
      })
    }
  }

});
