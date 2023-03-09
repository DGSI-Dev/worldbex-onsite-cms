var currentEventId = ''
var currentUserId = ''
var surveyContent = $("#surveyDiv")
let survey = []
let prizes = []
let prizeSelections = []
let toDisplayOnWheel = []
let fortheWin = 0
let myWheel = new bootstrap.Modal(document.getElementById('staticBackdrop'))

var lastResult
var html5QrcodeScanner
var userInfo