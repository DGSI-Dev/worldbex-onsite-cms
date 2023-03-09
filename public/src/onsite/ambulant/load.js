$(function(){
  $.when(
    $.ajax("/src/utilities/mobileCountryCodes.js"),
    // $.ajax("/src/utilities/loadCountries.js"),
    $.ajax("/src/utilities/loadAddress.js"),
    $.ajax("/src/utilities/basicInfoValidation.js"),
  ).then(function(){
    $.when(
      $.ajax("/src/onsite/ambulant/constants.js"),
      $.ajax("/src/onsite/ambulant/getEventInfo.js")
    ) 
  })
})