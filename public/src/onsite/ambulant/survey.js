$(".cardBack").on('click', function () {
  $('.contentDiv').addClass('d-none')
  if (eventInfo.surveys.length) {
    $(".surveyDiv").removeClass('d-none').hide().show('slide')
  } else {
    $(".attendeesDiv").removeClass('d-none').hide().show('slide')
  }
})

$(".surveyBack").on('click', function () {
  $('.contentDiv').addClass('d-none')
  $(".attendeesDiv").removeClass('d-none').hide().show('slide')
})

let submitRegister = (params) => {
  Swal.fire({
    title: 'Confirmation',
    html: `Are you sure that all information you provided are correct?`,
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonColor: '#df731b',
    confirmButtonText: 'PROCEED',
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: 'POST',
        url: '/api/citizen/signup',
        data: params,
        dataType: 'JSON',
        beforeSend: function () {
          Swal.fire({
            title: "Validating",
            text: "Please wait...",
            imageUrl: "img/loading.gif",
            imageWidth: 200,
            imageHeight: 200,
            showConfirmButton: false,
            allowOutsideClick: false
          })
        },
        success: function (response) {
          Swal.fire({
            title: "SUCCESS",
            text: "Signed up",
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#df731b',
            confirmButtonText: 'CLOSE'
          }).then(function () {
            $("#modal-survey").modal('show')
          })
        },
        error: function (err) {
          console.log(err)
          if (err.status == 502) {
            Swal.fire('Account Login Full', "Please logout other WORLDBEX. Login.", 'warning')
          } else if (err.status == 500) {
            Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
          } else if (err.status == 404) {
            Swal.fire('Warning', "Failed to send request.", 'warning')
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire('Warning', err.responseJSON.message, 'warning')
            } else {
              Swal.close()
            }
          }
        }
      })
    }
  })
}

if (surveys.length) {
  let rules = {}, messages = {}, surveyResult = '', isTakeSurvey = false
  let prevChoice = ''

  function createRadio(choice, questionIndex) {
    let { id: choiceId, label } = choice
    prevChoice = 'radio'
    return `
      <div class="form-check mx-1">
        <input class="form-check-input" data-id="choice${choiceId}" type="radio" name="question${questionIndex}" id="choice${choiceId}" value="${label}">
        <label class="form-check-label text-wrap" for="choice${choiceId}">
          ${label}
        </label>
      </div>
    `
  }

  function createCheckbox(choice, questionIndex) {
    let { id: choiceId, label } = choice
    prevChoice = 'checkbox'
    return `
      <div class="form-check mx-1">
        <input class="form-check-input" data-id="choice${choiceId}" type="checkbox" name="question${questionIndex}" id="choice${choiceId}" value="${label}">
        <label class="form-check-label" for="choice${choiceId}">
        ${label}
        </label>
      </div>
    `
  }

  function createInput(choice, questionIndex) {
    let { id: choiceId, label, category } = choice
    let otherChoice = ''

    if (label == 'Others' && prevChoice) {
      otherChoice = `
      <div class="form-check mx-1">
        <input class="form-check-input otherCheckChoice${choiceId}" type="${prevChoice}" name="question${questionIndex}" id="choice${choiceId}" value="Others">
        <label class="form-check-label text-wrap" for="choice${choiceId}">
          ${label}
        </label>
      </div>
    `
    }

    return `
      ${otherChoice}
      <div class="otherField" style="display: none">
        <label>${label}</label>
        <input type="text" class="form-control" name="other-field${questionIndex}" placeHolder="Enter your answer">
      </div>

    `
  }

  function createQuestion(question, index) {
    let category = question[0]
    let choices = question[1]
    let generateChoices = (obj) => {

      switch (obj.type) {
        case 'radio': return createRadio(obj, index);
          break;
        case 'checkbox': return createCheckbox(obj, index);
          break;
        case 'check': return createCheckbox(obj, index);
          break;
        case 'input': return createInput(obj, index);
          break;
      }
    }

    let choicesElements = choices.map(obj => {
      return generateChoices(obj)
    })

    return `
      <div class="col-md-4 p-1 displayQuestion${question.surveyId}" ${question.dependency ? 'style="display:none"' : ''}>
        <div class="border rounded p-3">
          <label>${index + 1}. ${category}</label>
          ${choicesElements.join('')}
          <span class="err"></span>
        </div>
      </div>
    `
  }

  function getSurveyResult() {
    return {
      resultPoints: surveyResult,
      isTakeSurvey: isTakeSurvey
    }
  }

  let handlequestions = surveys.sort((a, b) => {
    if (parseInt(a.orderNumber) < parseInt(b.orderNumber)) { return -1; }
    if (parseInt(a.orderNumber) > parseInt(b.orderNumber)) { return 1; }
    return 0;
  }).reduce((prev, curr) => {
    if (curr['category'] === undefined) return prev
    return Object.assign(prev, { [curr['category']]: (prev[curr['category']] || []).concat(curr) })
  }, [])

  let formattedSurveyResponse = Object.entries(handlequestions)

  $(".questions").empty().append(
    formattedSurveyResponse.map((obj, i) => {
      return createQuestion(obj, i)
    }).join("")
  )

  formattedSurveyResponse.forEach((obj, i) => {
    let isOther = obj[1].find(({ label }) => label == 'Others')
    if (isOther) {
      // rules["question" + i] = { required: true }

      $(`[name="question${i}"]`).on('click change', function () {
        const otherField = $(this).parent().parent().find('.otherField')
        let currentField = $(this)
        if (currentField.attr('type') == 'radio') {
          if (currentField.val() == 'Others') {
            otherField.show('slide')
          } else {
            otherField.hide('slide')
          }
        } else if (currentField.val() == 'Others') {
          if (currentField.is(':checked')) {
            otherField.show('slide')
          } else {
            otherField.hide('slide')
          }
        }
      })

    } else {
      // rules["question"+i] = { required: true}
    }
    // messages["question" + i] = { required: "This field is required" }
  })


  $(".skipSurvey").on('click', function () {
    $("#modal-survey").modal('hide')
    submitRegister(bodyFormat)
  })

  // registration
  $("#registration").validate({
    errorElement: 'span',
    errorClass: 'help-block text-danger',
    rules: {
      mobileNumber: {
        mobileNumber: true,
      },
      email: {
        email: true,
        required: true
      }
    },
    messages: {
      mobileNumber: {
        mobileNumber: "Invalid mobile number",
      },
      email: {
        email: 'Invalid email format',
        required: "This field is required"
      }
    },
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {

        if ($(element).attr('name') == "mobileNumber") {
          error.insertAfter($(element).parent())
        } else {
          error.insertAfter($(element));
        }
      }
    },
    submitHandler: function (form) {
      var $form = $(form),
        params = $form.serializeArray();

      let tosend = []
      params.forEach(obj => {
        if (obj.value) {
          if (obj.name == 'mobileNumber') {
            tosend.push({ name: obj.name, value: $(".countryMobile").val().replace("+", "") + obj.value })
          } else if (obj.name == 'privacyPolicy') {
          } else {
            tosend.push(obj)
          }
        }
      })
      
      if ($('#isStudent').prop('checked')) {
        tosend.push({ name: 'designation', value: 'student' })
      }
      
      bodyFormat.attendees = [tosend]

      let newBody = []
      params.forEach(({ name, value }) => {
        if (value && value != "Others") {
          if (name.includes('question')) {
            let index = name.replace('question', '')
            newBody.push({
              category: formattedSurveyResponse[index][0],
              answer: value
            })
          } else {
            if (name.includes('other-field')) {
              let index = name.replace('other-field', '')
              newBody.push({
                category: formattedSurveyResponse[index][0],
                answer: `otherAnswer:${value}`
              })
            }
          }
        }
      })

      const formattedBody = newBody.reduce((group = [], ans) => {
        const { category, answer } = ans;
        const index = group.findIndex(({ category: prevCategory }) => prevCategory == category)

        if (group.find(({ category: prevCategory }) => prevCategory == category)) {
          group[index].answer += (';' + answer)
        } else {
          group.push(ans)
        }
        return group
      }, []);

      tosend.push({ name: 'survey', value: formattedBody })

      tosend = tosend.filter(obj => {
        let { name, value } = obj
        if (value && !name.includes('question') && !name.includes('other-field')) {
          return obj
        }
      })
      let body = tosend.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {});

      Swal.fire({
        title: 'Confirmation',
        html: `Are you sure that all information you provided are correct?`,
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: '#df731b',
        confirmButtonText: 'PROCEED',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          $.ajax({
            type: 'POST',
            url: '/api/onsite/createAttendee',
            dataType: 'JSON',
            data: body,
            beforeSend: function () {
              Swal.fire({
                title: "Validating",
                text: "Please wait...",
                imageUrl: "img/loading.gif",
                imageWidth: 200,
                imageHeight: 200,
                showConfirmButton: false,
                allowOutsideClick: false
              })
            },
            success: function (res) {
              let { qrCode, firstName, lastName, companyName } = res
              
              let exName = [firstName, lastName].join(" ")
              let fullName =  Boolean(exName.trim()) ? exName.toLocaleUpperCase() : companyName
              $('.fullName').text(fullName)
              $(".qrCode").qrcode(qrCode,200,200)
              Swal.close()
              $("#registration")[0].reset()
              $("#noPrc").change()
              $("#modal-sticker").modal('show')
              $("#isStudent").change()

            },
            error: function (err) {
              console.log(err)
              if (err.status == 502) {
                Swal.fire('Account Login Full', "Please logout other WORLDBEX. Login.", 'warning')
              } else if (err.status == 500) {
                Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
              } else if (err.status == 404) {
                Swal.fire('Warning', "Failed to send request.", 'warning')
              } else if (err.status == 400 && err.responseJSON.message == 'Invalid parameters') {
                let { stack } = err.responseJSON
                if (stack.length > 1) {
                  let followingErr = stack.map(({ msg, value }) => `<li>${msg} : ${value}</li>`).join('')
                  Swal.fire({
                    title: "Invalid Information",
                    html: `
                      <h4>the following is not valid :</h4>
                      <ul>
                      ${followingErr}
                      </ul>
                    `,
                    icon: 'warning'
                  })
                } else {
                  Swal.fire(stack[0].msg, `"${stack[0].value}" is not valid.`, 'warning')
                }

              } else {
                if (err.responseJSON.message != "No record found.") {
                  Swal.fire('Warning', err.responseJSON.message, 'warning')
                } else {
                  Swal.close()
                }
              }
            }
          })
        }
      })

    }
  })

  $('[type="checkbox"][value="Others"]').on('change click', function () {
    $(this).closest('.form-check').parent().find('.otherField input').val('')
  })

  $('.closeSticker').on('click', function () {
    Swal.fire({
      title: 'NEW GUEST?',
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#df731b',
      confirmButtonText: 'PROCEED',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        $("#modal-sticker").modal('hide')
      }
    })
  })

  $('.clearButton').on('click', function () {

    Swal.fire({
      title: 'Clear Entire Form',
      // html: ``,
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#df731b',
      confirmButtonText: 'PROCEED',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        $("#registration")[0].reset()
        $("#noPrc").change()
        $("#isStudent").change()
      }
    })
  })

}
