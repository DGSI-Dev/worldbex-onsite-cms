var enumerateDaysBetweenDates = function(startDate, endDate) {
  var now = startDate, dates = [];
  
  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('YYYY-MM-DD'));
    now.add(1, 'days');
  }
  return dates;
};

let dateRange = (currentValue)=>{
  let splitted = currentValue.split(",")
  let splittedDates = splitted[0].split(" - ")

  if( splittedDates[1] ){
    let date1 = moment([splittedDates[0],splitted[1]].join(" "))
    let date2 = moment([splittedDates[0].split(" ")[0] ,splittedDates[1],splitted[1]].join(" "))
    let result = enumerateDaysBetweenDates(
      date1,
      date2
    )
    return result
  }else{
    
    let split = currentValue.split("-")
    let year = moment(split[1]).format('YYYY')
  
    let date1 = moment([split[0], year].join(" "))
    let date2 = moment(split[1])
    let result = enumerateDaysBetweenDates(
      date1,
      date2
    )
    return result
  }
}

  //Multiple date Formatting
let date = (dates) =>{
  // dates = ['2022-04-07','2022-04-08','2022-04-09']
  let monthDay = dates.map((obj,i)=> {
    let formatted = moment(obj).format('MMM DD')
    if(i == 0){
      return formatted
    }else{
      return formatted.replace(moment(dates[0]).format('MMM'), '') 
    }
  });
  return monthDay.join(", ") + ', ' + moment(dates[dates.length-1]).format('YYYY')
}