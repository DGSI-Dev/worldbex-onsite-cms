var context = document.getElementById('canvas').getContext('2d');
var qrlogo = new Image();

qrlogo.onload = function () {
  context.drawImage(qrlogo, 
    250,
    200,
    36,
    36
  );
}
qrlogo.src = '../src/logos/worldbex.png'

let eventTitle = $(".eventTitle")
let area = $(".eventArea")

$(".skipPrize").on('click', function () {
  window.location.reload()
})

$(".changeEvent").on('click', function(){
  $('.eventDiv').toggle('slide')
  $('.scannerDiv').toggle('slide')
})

$(".changeScannerType").on('click', function(){
  $('.cannerType').toggle('slide')
})

$(".areaCode").on('change', function(value){
  if (value) {
    area.text($(this).find('option:selected').text())
    localStorage.setItem('wbx2022ConfigPrizesAreaCode', $(this).val())
  } else {
    localStorage.removeItem('wbx2022ConfigPrizesAreaCode')
    area.text('NO AREA')
  }
})

$(".eventId").on('change', function(value){
  if (value) {
    currentEventId = $(this).val()
    $('.eventDiv').toggle('slide')
    $('.scannerDiv').toggle('slide')
    eventTitle.text($(this).find('option:selected').text())
    $(".currentEventId").text($(this).val())
    localStorage.setItem('wbx2022ConfigPrizesEventId', $(this).val())
  } else {
    localStorage.removeItem('wbx2022ConfigPrizesEventId')
  }
})

$('[name="scannedQr"]').focus()

let loadPrizes = (eventId, areaCode) => {
  Swal.close()
  $.ajax({
    type: 'POST',
    url: '/api/getEventPrices',
    dataType: 'JSON',
    data: {
      eventId,
      areaCode: areaCode
    },
    beforeSend: function () {
      Swal.fire({
        title: "Loading Prizes",
        text: "Please wait",
        imageUrl: "img/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        allowOutsideClick: false
      })
    },
    success(res) {
      prizes = res
      
      // //ADDING BOKYA
      // prizes.unshift({
      //   id: 0,
      //   isSelected: 1,
      //   isVisible: 1,
      //   name: "THANK YOU!",
      //   fillStyle: 'black',
      //   textFillStyle: 'white'
      // })

      prizeSelections = prizes.filter(({ isSelected }) => isSelected == 1)
      if (prizeSelections.length <= 0) {
        prizeSelections = prizes
      }

      $.when(
        $.ajax("/src/survey/wheel.js"),
      ).then(function () {
        myWheel.show()
        Swal.close()
      })
    },
    error(err){
      console.log(err)
      if (err.status == 500) {
        Swal.fire('Failed to send request', 'Please contact support', 'warning')
      } else if (err.status == 404) {
        Swal.fire('Request not found', 'Please contact support', 'warning')
      } else if (err.status == 401) {
        Swal.fire('Message', err.responseJSON.message, 'warning')
      } else {
        Swal.fire('Failed', err.statusText, 'warning')
      }
    },
    complete(res) {
    }
  })
}

$.ajax({
  type: 'GET',
  url: '/api/getEvent',
  dataType: 'JSON',
  beforeSend: function () {
    Swal.fire({
      title: "Checking available events",
      text: "Please wait",
      imageUrl: "img/loading.gif",
      imageWidth: 200,
      imageHeight: 200,
      showConfirmButton: false,
      allowOutsideClick: false
    })
  },
  success(res) {
    $.ajax("/src/survey/survey.js")

    res.forEach(({ eventId, imgSrc, name }) => {
      $(".eventId").append(`
        <option value="${eventId}" data-image="${imgSrc}">${ name }</option>
      `)
    })
    
    let wbx2022ConfigPrizesAreaCode = localStorage.getItem('wbx2022ConfigPrizesAreaCode')
    if (wbx2022ConfigPrizesAreaCode) {
      $(".areaCode").val(wbx2022ConfigPrizesAreaCode).change()
    }
    let wbx2022ConfigPrizesEventId = localStorage.getItem('wbx2022ConfigPrizesEventId')
    if (wbx2022ConfigPrizesEventId) {
      $(".eventId").val(wbx2022ConfigPrizesEventId).change()
    }

    Swal.close()
  },
  error(err){
    console.log(err)
    if (err.status == 500) {
      Swal.fire('Failed to send request', 'Please contact support', 'warning')
    } else if (err.status == 404) {
      Swal.fire('Request not found', 'Please contact support', 'warning')
    } else if (err.status == 401) {
      Swal.fire('Message', err.responseJSON.message, 'warning')
    } else {
      Swal.fire('Failed', err.statusText, 'warning')
    }
  }
})

let submitPrize = (eventId, qrCode, priceId, prizeWON) => {
  console.log('triggered')
  $.ajax({
    type: 'POST',
    url: '/api/claimEventPrice',
    dataType: 'JSON',
    data: {
      eventId, qrCode, priceId
    },
    beforeSend: function () {
      Swal.fire({
        title: "Loading Prizes",
        text: "Please wait",
        imageUrl: "img/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        allowOutsideClick: false
      })
    },
    success(res) {
      Swal.close()
    },
    error(err){
      console.log(err)
      if (err.status == 500) {
        Swal.fire('Failed to send request', 'Please contact support', 'warning')
      } else if (err.status == 404) {
        Swal.fire('Request not found', 'Please contact support', 'warning')
      } else if (err.status == 401) {
        Swal.fire('Message', err.responseJSON.message, 'warning')
      } else {
        Swal.fire('Failed', err.statusText, 'warning')
      }
    }
  })
}