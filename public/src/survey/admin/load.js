$(function () {
  $.when(
    $.ajax("/src/survey/admin/constants.js"),
    $.ajax("/src/survey/admin/init.js"),
  )
}) 
  