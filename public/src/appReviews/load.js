$(function () {
  $.when(
    $.ajax("/src/appReviews/constants.js"),
    $.ajax("/src/appReviews/initLoad.js"),
    $.ajax("/src/appReviews/survey.js"),
  )
}) 
  