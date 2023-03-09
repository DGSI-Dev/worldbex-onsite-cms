$(function () {
  $.when(
    $.ajax("/src/survey/constants.js"),
    $.ajax("/src/survey/initLoad.js"),
  )
}) 
  