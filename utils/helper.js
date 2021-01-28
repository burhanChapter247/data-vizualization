const moment = require("moment");

const getCurrentLastWeek = () => {
  var currentDate = moment();

  var weekStart = currentDate.clone().startOf("isoWeek");
  var weekEnd = currentDate.clone().endOf("isoWeek");

  var currentDays = [];
  //let dayOfCurrentWeek = moment().isoWeekday();
  for (var i = 0; i <= 6; i++) {
    currentDays.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
  }

  var lastDays = [];

  for (var i = 7; i > 0; i--) {
    lastDays.push(moment(weekStart).subtract(i, "days").format("YYYY-MM-DD"));
  }

  return {
    currentWeek: currentDays,
    lastWeek: lastDays,
  };
};

module.exports = {
  getCurrentLastWeek,
};
