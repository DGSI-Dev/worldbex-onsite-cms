
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
  html5QrcodeScanner.html5Qrcode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
})

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;
          
      checkSurvey( decodedText )
          
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
    }
};

docReady(function () {
  lastResult, countResults = 0;
  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;
          
      checkSurvey( decodedText )
          
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
    }
  }

  html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 20, qrbox: 300 });
  html5QrcodeScanner.render(onScanSuccess);

});

const groupBy = (key, array) => {
  let grouped = array.reduce((acc, obj) => {
    const property = obj[key];
    acc[property] = acc[property] || []
    acc[property].push(obj);
    return acc
  }, [])
  return Object.entries(grouped).map(obj => ( {label: obj[0], values: obj[1]} ))
}

const sortArrayObject = (arr, key) => {
  return arr.sort(function (a, b) {
    if (a[key] < b[key]) { return -1; }
    if (a[key] > b[key]) { return 1; }
    return 0;
  })
}

const generateQuestion = (type, choicess = [], id) => {
  var choicesField = []
  switch (type) {
    case 'RB': {
      // choicess = sortArrayObject(choicess, 'orderNumber')
      choicess = choicess.split(';')
      choicess.forEach((choice, i) => {
        const { value, label, surveychoicesId } = choice
        if (choice) {
          choicesField.push(
            `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="test${id}" id="choice${id}-${ i}" value="${ choice }" required>
            <label class="form-check-label" for="choice${id}-${ i}">
              ${choice}
            </label>
          </div>
          `
          );
        }
      })
    }; break;
    case 'CB': {
      choicess = sortArrayObject(choicess, 'orderNumber')
      choicess.forEach((choice, i) => {
        if (choice) {
          choicesField.push(
            `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="${id}" id="choice${id}-${ i}" value="${choice}">
            <label class="form-check-label" for="choice${id}-${ i}">
              ${choice}
            </label>
          </div>
          `
          );
        }
      })
    }; break;
    case 'INPUT': {
      choicesField.push(`
      <input name="test${id}" class="form-control" placeholder="Enter answer" required>
    `)

    }; break;
  }
  return choicesField
}

const formatSurveyBody = async (params) => {
  let body = []
  await params.forEach(({ name, value }) => {
    body.push({
      surveyId: name.replace('test',''),
      answer: value
    })
  })
  return body
}

const validateSurvey = (exhibitorUid,  rules) => {
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
      console.log(params)
      formatSurveyBody(params)
        .then(formatted => {
          console.log('FORMATTED',formatted)
          $.ajax({
            type: 'POST',
            url: '/api/appReview/answerAppSurvey',
            dataType: 'JSON',
            data: {
              exhibitorUid,
              survey: formatted
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
              Swal.fire('Success', 'Answered successfully', 'success').then(function (result) {
                if (result.value) {
                  $(".backtoScanner").click()
                }
              })
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

var checkSurvey = (exhibitorUid) => {
  
  console.log(html5QrcodeScanner)
  html5QrcodeScanner.html5Qrcode.pause()
  console.log(html5QrcodeScanner)

  $(".userFullName").empty()
  surveyContent.empty()
  $.ajax({
    type: 'GET',
    url: '/api/appReview/getExhibitorAppSurvey/'+exhibitorUid,
    dataType: 'JSON',
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
      if (res.questions.length) {
        userInfo = res.exhibitor[0]
              
        $(".userFullName").html(userInfo.companyName + `<br><small class="fs-5">${userInfo.companyAddress}</small>`)
        survey = groupBy('label', res.questions)
        
        let rules = {}
        var questions = survey.map(({ label, values }, i) => {
          if (values.length > 1) {

            let groupedQuestion = values.map(({ question, id, choices, type }, subIndex) => {
              rules[`test${id}`] = {
                required : true
              }
              const ch = generateQuestion(type, choices, id)
              return (
                `<div class="col-md-4 p-2">
                  <div class="question">
                    <span class="h6" style="color: #df731b;">${ i+1 }.${ subIndex+1 } ${ question } 
                  </div>
                  <div class="answers">
                    ${ ch.join("") }
                    <span class="err" style="color:red;"></span>
                 </div>
                </div>
                `
              );
            })

             return (
                `<div class="card" style="padding: 10px;">
                  <div class="question">
                    <span class="h6" style="color: #df731b;">${ i+1 }. ${ label } 
                  </div>
                  <div class="row">
                    ${groupedQuestion.join('')}
                  </div>
                </div>
                `
              );
          } else {
            return values.map(({ question, id, choices, type }) => {
              rules[`test${id}`] = {
                required : true
              }
              const ch = generateQuestion(type, choices, id)
              return (
                `<div class="card" style="padding: 10px;">
                  <div class="question">
                    <span class="h6" style="color: #df731b;">${ i+1 }. ${ label } 
                  </div>
                  <div class="answers">
                    ${ ch.join("") }
                    <span class="err" style="color:red;"></span>
                  </div>
                </div>
                `
              );
            })
          }

        })
        surveyContent.append(questions.join(''))
        validateSurvey(exhibitorUid, rules)
      } else {
        userInfo = ''
        Swal.fire('Empty Survey', "", 'warning').then(function () {
          $(".main").toggle('slide')
          $(".scannedDiv").toggle('slide')
          lastResult = ''
        })
      }
    },
    error(err) {
      if (err.status == 500) {
        Swal.fire('Warning', "Internal server error. Please try again later.", 'warning').then(function () {
          html5QrcodeScanner.html5Qrcode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        })
      } else {
        Swal.fire('INFORMATION', err.responseJSON.message, 'warning').then(function () {
          html5QrcodeScanner.html5Qrcode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        })
      }
      lastResult = ''
      
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
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
    let decodedText = $('[name="scannedQr"]').val()
    checkSurvey( decodedText )
    $('[name="scannedQr"]').val('')
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
      currentUserId = $('[name="typedQr"]').val()
      checkSurvey(  currentUserId )
      
      $(".main").toggle('slide')
      $(".scannedDiv").toggle('slide')
    
    $('[name="typedQr"]').val('')
  }
})
