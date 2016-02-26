import Ember from 'ember';

export default Ember.Route.extend({

  // randomNumber: function(min, max) {
  //   return Math.floor(Math.random()*max) + min;
  // },

  randomNumber: function(min, max) {
    min = min || -1;
    max = max || 2;
    return +(Math.random()*max + min).toFixed(1);
  },

  model () {
    let randomNumber = this.get('randomNumber');

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let languageHours = {
      python: 2.5,
      js: 1.75,
      html_css: 1.25,
      sql: 1,
    }
    let firstDate = new Date("01/03/2016");
    let currentDate = moment(firstDate);
    let lastDate = currentDate.clone().add(13, 'weeks')
    let daysCounter = 0;

    let data = [];

    while (currentDate.valueOf() <= lastDate.valueOf()) {
      let project = null;
      let date = currentDate.add(1, 'day').clone()
      daysCounter++;
      let dayOfWeek = currentDate.weekday();

      for (var languageKey in languageHours) {

        let record = {
          avgHours: 0,
          avgStd: 0,
          language: null,
          hours: false,
          date: date.toDate(),
          dayOfWeek: days[dayOfWeek],
          project: "Exercises",
          option: "Exercises",
          unit: null,
        }
        let tools = [];
        record.language = languageKey;
        // let currentLanguageHours = randomNumber(languageHours[languageKey]-.2,languageHours[languageKey]);
        let currentLanguageHours = 0;
        // let avgLanguageHours = languageHours[languageKey];
        // let currentLanguageHours = randomNumber(languageHours[languageKey]-.2,languageHours[languageKey]);
        let avgLanguageHours = randomNumber(languageHours[languageKey]-.2,languageHours[languageKey]);

        if (daysCounter <= 7) {
          // unit 0
          record.unit = "Prep Phase";
          if (languageKey === "python") {
            avgLanguageHours = avgLanguageHours/2;
            currentLanguageHours = avgLanguageHours*.35;
            // record.library = "scipy/pandas";
            tools.push("pandas");
            tools.push("scipy");
            tools.push("scikit");
            tools.push("numpy");
          }
          else {
            currentLanguageHours = 0;
            avgLanguageHours = 0;
          }
        }
        else if (daysCounter <= 14) {
          // unit 1
          //week 1
          record.unit = "Unit 1";
          record.project = "Benson"
          record.option = "Benson"
          if (languageKey === "python") {
            avgLanguageHours = avgLanguageHours*1.75;
            currentLanguageHours = avgLanguageHours * 1.35;
            tools.push("pandas");
            tools.push("flask");
            tools.push("matplotlib");
          }
          else {
            // record.project = "Benson"
            avgLanguageHours = 0;
            currentLanguageHours = 0;
          }
        }
        else if (daysCounter <= 28){
          // unit 2
            record.unit = "Unit 2";
          if (daysCounter > 21) {
            record.project = "Luther";
            record.option = "Luther";
          }
          if (languageKey === "python") {
            avgLanguageHours = avgLanguageHours*1.75;
            currentLanguageHours = avgLanguageHours + randomNumber();
            tools.push("pandas");
            tools.push("numpy");
            // tools.push("Beautiful Soup");
            // tools.push("Requests");
          }
          else {
            avgLanguageHours = 0;
            currentLanguageHours = 0;
          }
        }
        else if (daysCounter <= 49) {
          // unit 3
          record.unit = "Unit 3";

          if (daysCounter < 35) {
            //week 1
            if (languageKey === "sql") {
              tools.push("postgres");
              tools.push("flask");
              avgLanguageHours = avgLanguageHours*2.25;
              currentLanguageHours = avgLanguageHours + randomNumber(-.5,1);
            }
            else if (languageKey === "python") {
              avgLanguageHours = avgLanguageHours*1.25;
              currentLanguageHours = avgLanguageHours + randomNumber();
              tools.push("pandas");
              tools.push("numpy");
              tools.push("scipy");
              tools.push("statsmodels");
            }
            else {
              avgLanguageHours = 0;
              currentLanguageHours = 0;
            }
          }
          else if (daysCounter >= 35) {
            record.project = "Mcnulty";
            record.option = "Mcnulty";
            if (languageKey === "js") {
              avgLanguageHours = avgLanguageHours*1.1;
              currentLanguageHours = avgLanguageHours - randomNumber(0,1);
              tools.push("D3");
              tools.push("jQuery");
            }
            else if (languageKey === "html_css") {
              avgLanguageHours = avgLanguageHours*1.1;
              currentLanguageHours = avgLanguageHours - randomNumber(0,1);
              tools.push("Bootstrap");
            }
            else {
              tools.push("flask");
              tools.push("pandas");
              tools.push("scipy");
              avgLanguageHours = avgLanguageHours/2;
              currentLanguageHours = avgLanguageHours + randomNumber(0,1);
            }
          }
        }
        else if (daysCounter <= 63) {
          // unit 4
          record.unit = "Unit 4";
          // record.project = "Fletcher";
          if (languageKey == "python") {
            avgLanguageHours = avgLanguageHours;
            currentLanguageHours = avgLanguageHours + randomNumber();
            tools.push("flask");
            tools.push("pandas");
            tools.push("numpy");
            tools.push("scipy");
          }
          else if (languageKey == "js") {
            avgLanguageHours = avgLanguageHours;
            currentLanguageHours = avgLanguageHours;
            tools.push("D3");
            tools.push("jQuery");
          }
          else if (languageKey = "html_css") {
            avgLanguageHours = avgLanguageHours;
            currentLanguageHours = avgLanguageHours;
            tools.push("Bootstrap");
          }
          else {
            avgLanguageHours = avgLanguageHours*.75;
            currentLanguageHours = avgLanguageHours;
          }
          if (daysCounter > 56) {
            // currentLanguageHours = null;
            record.project = "Fletcher";
            // tools.push("flask");
            // tools.push("pandas");
            // tools.push("D3");
            // tools.push("Bootstrap");
            record.option = "Fletcher";
          }
        }
        else {
          record.option = "Kojak"
          record.unit = "Unit 5";
          record.project = "Kojak";
          currentLanguageHours = avgLanguageHours + randomNumber();
          if (daysCounter > 75) {
          // currentLanguageHours = null;
          }
          if (daysCounter === 92) {
            avgLanguageHours = avgLanguageHours/5;
            currentLanguageHours = avgLanguageHours + randomNumber();
          }
        }

        if (currentLanguageHours) {
          // if hours did not equal 0...
          if (dayOfWeek == 6 || dayOfWeek == 0) {
            // record.project = null;
            currentLanguageHours = currentLanguageHours / 2;
            avgLanguageHours = avgLanguageHours / 2;
          }
          record.hours = currentLanguageHours;
          if (record.project === "Exercises" && record.option === "Exercises") {
            record.hours = record.hours* 1.1
          }
        }
        record.avgHours = avgLanguageHours;
        record.avgStd = avgLanguageHours * .2;
        // if (tools.length) {
        //   for (var i = 0; i < tools.length; i++) {
        //     data.push({
        //         avgHours: record.avgHours/tools.length,
        //         avgStd: record.avgStd/tools.length,
        //         language: record.language,
        //         hours: record.hours ? record.hours/tools.length : record.hours,
        //         date: record.date,
        //         dayOfWeek: record.dayOfWeek,
        //         project: randomNumber(1,10) > 5 ? record.option : record.project,
        //         unit: record.unit,
        //         tool: tools[i]
        //       })
        //   }
        // }
        // else {
            data.push({
                avgHours: record.avgHours,
                avgStd: record.avgStd,
                language: record.language,
                hours: record.hours,
                date: record.date,
                dayOfWeek: record.dayOfWeek,
                project: randomNumber(1,10) > 5 ? record.option : record.project,
                unit: record.unit,
                // tool: null
              })
        // }
      }
    }

    return data;
  }
});
