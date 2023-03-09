
function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete"
    || document.readyState === "interactive") {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

$(".backtoScanner").on('click', function () {
  $(".main").toggle('slide')
  $(".scannedDiv").toggle('slide')
  lastResult = ''
})

docReady(function () {
  lastResult, countResults = 0;
  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;
      if (currentEventId) {
        let splitted = decodedText.split(":")
        if (splitted.length >= 2) {
          
          let body = {
            userId: splitted[0],
            firstName: splitted[1],
            lastName: splitted[2]
          }
          currentUserId = splitted[0]
          checkSurvey( currentEventId, body )
          
          $(".main").toggle('slide')
          $(".scannedDiv").toggle('slide')
          
        } else {
          Swal.fire({
            title: 'INVALID QRCODE',
            text: '',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'CLOSE',
            confirmButtonColor: '#df731b'
          }).then(function (result) {
            if (result.value) {
              lastResult = ''
            }
          })
        }
      } else {
        Swal.fire({
          title: 'No Event Selected',
          text: 'Please select an event',
          icon: 'warning',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'CLOSE',
          confirmButtonColor: '#df731b'
        }).then(function (result) {
          if (result.value) {
            lastResult = ''
          }
        })
      }

    }
  }

  html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 20, qrbox: 300 });
  html5QrcodeScanner.render(onScanSuccess);

});

const sortArrayObject = (arr, key) => {
  return arr.sort(function (a, b) {
    if (a[key] < b[key]) { return -1; }
    if (a[key] > b[key]) { return 1; }
    return 0;
  })
}

const generateQuestion = (type, options = [], surveyId) => {
  var choicesField = []
  switch (type) {
    case 'radio': {
      options = sortArrayObject(options, 'orderNumber')
      options.forEach((choice, i) => {
        const { value, label, surveyOptionId } = choice
        if (choice) {
          choicesField.push(
            `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${surveyId}" id="${surveyOptionId}" value="${surveyOptionId}" required>
            <label class="form-check-label" for="${surveyOptionId}">
              ${value}
            </label>
          </div>
          `
          );
        }
      })
    }; break;
    case 'checkbox': {
      options = sortArrayObject(options, 'orderNumber')
      options.forEach((choice, i) => {
        const { surveyId, value, surveyOptionId } = choice
        if (choice) {
          choicesField.push(
            `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="${surveyId}" id="${surveyOptionId}" value="${surveyOptionId}">
            <label class="form-check-label" for="${surveyOptionId}">
              ${value}
            </label>
          </div>
          `
          );
        }
      })
    }; break;
    case 'input': {
      choicesField.push(`
      <input name="${surveyId}" class="form-control" placeholder="Enter answer" required>
    `)

    }; break;
  }

  return choicesField
}

const formatSurveyBody = async (params) => {
  let body = []
  await params.forEach(({ name: surveyId, value: surveyOptionId }) => {
    //find option value
    const optionValue = survey.find(obj => obj.surveyId == surveyId)
      ?.option.find(obj => obj.surveyOptionId == surveyOptionId)

    let isPushed = body.findIndex(({ surveyId: id }) => id == surveyId)
    if (isPushed >= 0) {
      let data = body[isPushed]
      data.surveyOptionId = [data.surveyOptionId, surveyOptionId].join(";")
      data.response = [data.response, optionValue?.value].join(";")
      body[isPushed] = data
    } else {
      body.push({
        eventId: currentEventId,
        surveyId: surveyId,
        surveyOptionId: optionValue?.value ? surveyOptionId : '',
        response: optionValue?.value ?? surveyOptionId
      })
    }
  })
  return body
}

const validateSurvey = (userId, eventId, rules) => {
  $("#form-survey").validate({
    rules: rules,
    focusInvalid: true,
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.addClass('text-danger')
        error.insertAfter($(element).parent().parent().find('.err'));
      }
    },
    submitHandler: function (form) {
      var $form = $(form),
        params = $form.serializeArray();
      formatSurveyBody(params)
        .then(formatted => {
          $.ajax({
            type: 'POST',
            url: '/api/answerEventSurvey',
            dataType: 'JSON',
            data: {
              qrCode: userId,
              response: formatted
            },
            beforeSend: function () {
              Swal.fire({
                title: "Saving survey",
                text: "Please wait",
                imageUrl: "img/loading.gif",
                imageWidth: 200,
                imageHeight: 200,
                showConfirmButton: false,
                allowOutsideClick: false
              })
            },
            success(res) {
              // Swal.fire('Success', 'Answered successfully', 'success').then(function (result) {
              //   if (result.value) {
              //     $(".backtoScanner").click()
              //   }
              // })
              Swal.close()
              loadPrizes(eventId, $('.areaCode').val())
            },
            error(err) {
              if (err.status == 500) {
                if (
                  err?.responseJSON?.message == 'No record found. ' ||
                  err?.responseJSON?.message == 'Already answered survey.'
                ) {
                  Swal.fire('INFORMATION', err.responseJSON.message, 'warning')
                } else {
                  Swal.fire('Request Failed', "Internal server error. Please contact suppport.", 'warning')
                }
              } else if (err.status == 404) {
                Swal.fire('Survey not loaded', "Failed to send request. Please contact suppport", 'warning')
              } else {
                Swal.fire('INFORMATION', err.responseJSON.message, 'warning')
              }
            }

          })
        })
    }
  })
}

var checkSurvey = (eventId, { userId, firstName, lastName } = qrcodeValues) => {
  $(".userFullName").text([firstName, lastName].join(" ").toUpperCase())
  surveyContent.empty()
  $.ajax({
    type: 'POST',
    url: '/api/getEventSurvey',
    dataType: 'JSON',
    data: { eventId: eventId, qrCode: userId},
    beforeSend: function () {
      Swal.fire({
        title: "Loading Survey Questions",
        text: "Please wait...",
        imageUrl: "img/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        allowOutsideClick: false
      })
    },
    success(res) {
      Swal.close()
      if (res.length) {
        survey = sortArrayObject(res, 'orderNumber')
          let rules = {}
          var questions = survey.map((obj, i) => {
            const { label, surveyId, option, type } = obj
            rules[surveyId] = {
              required : true
            }
          const choices = generateQuestion(type, option, surveyId)
          return (
            ` <div class="col-md-6">
                <div class="card" style="padding: 10px;">
                  <div class="question">
                    <span class="h6" style="color: #df731b;">${ i+1 }. ${ label } 
                  </div>
                  <div class="answers">
                    ${ choices.join("") }
                    <span class="err" style="color:red;"></span>
                  </div>
                </div>
              </div>
            `
          );
        })
        surveyContent.append(questions.join(''))
        validateSurvey(userId, eventId, rules)
      } else {
        Swal.fire('Empty Survey', "", 'warning').then(function () {
          $(".main").toggle('slide')
          $(".scannedDiv").toggle('slide')
          lastResult = ''
        })
      }
    },
    error(err) {
      console.log(err, err.responseJSON.status)
      if (err.status == 500) {
        Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
      } else if (err.status == 403 && err.responseJSON.code == 1) {
        Swal.close()
        loadPrizes(eventId, $('.areaCode').val())
        
      } else {
        Swal.fire('INFORMATION',err.responseJSON.message,'warning')
      }
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
      lastResult = ''
      
      let endAudio = new Audio('/audio/error.mp3');
      endAudio.play();
    }
  })
}

$("#scanner").validate({
  focusInvalid: true,
  errorPlacement: function (error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.addClass('text-danger')
      error.insertAfter($(element));
    }
  },
  submitHandler: function (form) {
    var $form = $(form),
    params = $form.serializeArray();
    let decodedText = $('[name="scannedQr"]').val()
    if (currentEventId) {
      let splitted = decodedText.split(":")
      if (splitted.length >= 2) {
        
        let body = {
          userId: splitted[0],
          firstName: splitted[1],
          lastName: splitted[2]
        }
        currentUserId = splitted[0]
        checkSurvey( currentEventId, body )
        
        $(".main").toggle('slide')
        $(".scannedDiv").toggle('slide')
        
      } else {
        Swal.fire({
          title: 'INVALID QRCODE',
          text: '',
          icon: 'warning',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'CLOSE',
          confirmButtonColor: '#df731b'
        }).then(function (result) {
          if (result.value) {
            lastResult = ''
          }
        })
      }
      $('[name="scannedQr"]').val('')
    } else {
      Swal.fire({
        title: 'No Event Selected',
        text: 'Please select an event',
        icon: 'warning',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'CLOSE',
        confirmButtonColor: '#df731b'
      }).then(function (result) {
        if (result.value) {
          lastResult = ''
        }
      })
    }
  }
})

$("#typeQrCode").validate({
  focusInvalid: true,
  errorPlacement: function (error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.addClass('text-danger')
      error.insertAfter($(element));
    }
  },
  submitHandler: function (form) {
    if (currentEventId) {
      let body = {
        userId: $('[name="typedQr"]').val(),
        firstName: '',
        lastName: ''
      }
      
      currentUserId = $('[name="typedQr"]').val()
      checkSurvey( currentEventId, body )
      
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
    } else {
      Swal.fire({
        title: 'No Event Selected',
        text: 'Please select an event',
        icon: 'warning',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'CLOSE',
        confirmButtonColor: '#df731b'
      }).then(function (result) {
        if (result.value) {
          lastResult = ''
        }
      })
    }
    
    $('[name="typedQr"]').val('')
  }
})
