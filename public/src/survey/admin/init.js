let prizeList = []
let area = $(".eventArea")
let addPreview = $(".addPreview")
let editBackdrop = new bootstrap.Modal(document.getElementById('editBackdrop'))
let addBackdrop = new bootstrap.Modal(document.getElementById('addBackdrop'))
let multiChangeBackdrop = new bootstrap.Modal(document.getElementById('multiChangeBackdrop'))

$(".changeEvent").on('click', function(){
  $('.eventDiv').toggle('slide')
  $('.scannerDiv').toggle('slide')
})

$(".areaCode").on('change', function(value){
  if ( $(this).val()) {
    $('.eventDiv').toggle('slide')
    $('.scannerDiv').toggle('slide')
    area.text($(this).find('option:selected').text())
    localStorage.setItem('wbx2022ConfigPrizesAreaCodeAdmin', $(this).val())
    
    getPrizes($(this).val())
  } else {
    localStorage.removeItem('wbx2022ConfigPrizesAreaCodeAdmin')
    area.text('NO AREA')
  }
})

$('[name="isVisible"]').on('change', function (value) {
  if ($(this).val() == 0) {
    $(this).closest('form').find(`[name="isSelected"][value="0"]`).prop('checked', true).prop('readOnly', true)
    $(this).closest('form').find(`[name="isSelected"][value="1"]`).prop('disabled', true)
  } else {
    $(this).closest('form').find(`[name="isSelected"][value="1"]`).prop('disabled', false)
  }
})

$('[name="name"]').on('input change reset', function(value){
  let val = $(this).val()
  if (val) {
    $(this).closest('form').find(addPreview).text(val)
  } else {
    $(this).closest('form').find(addPreview).text('Item Name')
  }
})

$('[name="fillStyle"]').on('input change reset', function(value){
  let val = $(this).val()
  if (val) {
    $(this).closest('form').find(addPreview).css('background-color', val)
  } else {
    $(this).closest('form').find(addPreview).css('background-color', 'black')
  }
})

$('[name="textFillStyle"]').on('input change reset', function (value) {
  let val = $(this).val()
  if ( val ) {
    $(this).closest('form').find(addPreview).css('color', val)
  } else {
    $(this).closest('form').find(addPreview).css('color', 'black')
  }
})

$('[name="fillStyle"]').change()
$('[name="textFillStyle"]').change()

let dataTable, $tr, data
dataTable = $('#dataTable').DataTable({
  columns: [
    {
      data: null, title: "Action", class: "text-center", render(data) {
        return `
          <button class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></button>
        `
    }},
    {
      data: null, title: "Name", render({ name, fillStyle, textFillStyle }) {
      return `<h3 class="p-2 rounded text-center" style="background-color: ${fillStyle}; color: ${textFillStyle}; font-size: 15pt">${name}</h3>`
    }},
    {data: 'isVisible', title: "Visible to wheel", render(data){
      return `<span class="badge bg-${data == 1 ? 'success' : 'danger'}">${data == 1 ? 'TRUE' : 'FALSE'}</span>`
    }},
    {data: 'isSelected', title: "Added to random selection", render(data){
      return `<span class="badge bg-${data == 1 ? 'success' : 'danger'}">${data == 1 ? 'TRUE' : 'FALSE'}</span>`
    }},
    {data: 'remQuantity', title: "Remaining"},
    {data: 'totalQuantity', title: "Total"},
    {
      data: 'dateCreated', title: "Date Created", render(data) {
      return moment(data).format('llll')
    }},
  ]
});

$('#dataTable thead tr').clone().appendTo( '#dataTable thead' );
$('#dataTable thead tr:eq(1) th').each( function (i) {
  $(this).removeClass('sorting')
  var title = $(this).text();
 
  $(this).html(  i > 0 ? `
    <div class="input-group mb-3">
      <button class="input-group-text clearColumn"><i class="fas fa-eraser"></i></button>
      <input class="form-control-sm form-control" placeholder="Search ${title}" />
    </div>
  `  :
    '')
   ;

  $( 'input', this ).on( 'keyup change', function () {
    if ( dataTable.column(i).search() !== this.value ) {
      dataTable
      .column(i)
      .search( this.value )
      .draw();
    }
  });
  
});

const getPrizes = ( areaCode ) => {

  $.ajax({
    type: 'GET',
    url: '/api/surveyadmin/getEventPrices/'+areaCode,
    dataType: 'JSON',
    beforeSend(res){  
      Swal.fire({
        title: "Loading...",
        text: "Please wait",
        imageUrl: "../img/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        allowOutsideClick: false
      })
    },success(res){
      dataTable.clear()
      dataTable.rows.add(res)
      dataTable.draw()
      $(".multiChangeList").empty().append(
        res.map(obj => {
          if (obj.remQuantity >= 1) {
            return `
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="${obj.id}" value="${obj.id}" id="prize${obj.id}">
                <label class="form-check-label" for="prize${obj.id}">
                  (${obj.remQuantity}pc${obj.remQuantity > 1 ? 's' : ''}) : ${obj.name}
                </label>
              </div>
            `
          }
        }).join('')
      )
      prizeList = res
      Swal.close()
    }, error(err) {
      prizeList = []
      console.log(err)
      if(err.status == 500){
        Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
      }else if(err.status == 404){
        Swal.fire('Warning', "Failed to send request.", 'warning')
      }else{
        Swal.fire('Warning', err.responseJSON.message, 'warning')
      }
    }
  })
}

let wbx2022ConfigPrizesAreaCodeAdmin = localStorage.getItem('wbx2022ConfigPrizesAreaCodeAdmin')
if (wbx2022ConfigPrizesAreaCodeAdmin) {
  $(".areaCode").val(wbx2022ConfigPrizesAreaCodeAdmin).change()
}

let formEdit = $("#form-edit")
dataTable.on('click', 'tr td button:has("i.fa-edit")', function () {
  $tr = $(this).closest('tr');
  data = dataTable.row($tr).data();
  formEdit.find('[name="name"]').val(data.name).change()
  formEdit.find('[name="fillStyle"]').val(data.fillStyle).change()
  formEdit.find('[name="textFillStyle"]').val(data.textFillStyle).change()
  formEdit.find(`[name="isVisible"][value="${data.isVisible}"]`).prop('checked', true).change()
  formEdit.find(`[name="isSelected"][value="${data.isSelected}"]`).prop('checked', true)
  $('[name="addedQunatity"]').val(0)
  editBackdrop.show()
})

$("#form-add").validate({
  // onkeyup: true,
  // focusInvalid: true,
  errorElement: 'span',
  errorClass: 'help-block text-danger',
  errorPlacement: function(error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.insertAfter($(element));
    }
  },
  submitHandler: function (form) {
    var $form = $(form),
    params = $form.serializeArray();
      
    params.push({ name: 'remQuantity', value: $('#form-add [name="totalQuantity"]').val() })
    params.push({ name: 'areaCode', value: $('.areaCode').val() })
    $.ajax({
      type: 'POST',
      url: '/api/surveyadmin/addEventPrices',
      dataType: 'JSON',
      data: params,
      beforeSend: function () {
        Swal.fire({
          title: "Loading",
          text: "Please wait...",
          imageUrl: "img/loading.gif",
          imageWidth: 200,
          imageHeight: 200,
          showConfirmButton: false,
          allowOutsideClick: false
        })
      },
      success(res) {
        Swal.fire('Success', 'Added Successfully', 'success').then(function () {
          $(".areaCode").change()
        })
        addBackdrop.hide()
      },
      error(err) {
        console.log(err, err.responseJSON.status)
        if (err.status == 500) {
          Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
        } else {
          Swal.fire('INFORMATION',err.responseJSON.message,'warning')
        }
        let endAudio = new Audio('/audio/error.mp3');
        endAudio.play();
      }
    })
      
  }
})

$("#form-edit").validate({
  // onkeyup: true,
  // focusInvalid: true,
  errorElement: 'span',
  errorClass: 'help-block text-danger',
  errorPlacement: function(error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.insertAfter($(element));
    }
  },
  submitHandler: function (form) {
    var $form = $(form),
    params = $form.serializeArray();

    params.push({ name: 'areaCode', value: $('.areaCode').val() })
    let addedValue = parseInt($('[name="addedQunatity"]').val())
    let remValue = parseInt(data.remQuantity)
    let totalValue = parseInt(data.totalQuantity)
    if ( addedValue > 0 ) {
      params.push({ name: 'remQuantity', value: (remValue + addedValue) })
      params.push({ name: 'totalQuantity', value: (totalValue + addedValue) })
    } else {
      params.push({ name: 'remQuantity', value: remValue })
      params.push({ name: 'totalQuantity', value: totalValue })
    }

    params = params.filter(({ name }) => name != 'addedQunatity')
    
    $.ajax({
      type: 'POST',
      url: '/api/surveyadmin/editEventPrices/'+data.id,
      dataType: 'JSON',
      data: params,
      beforeSend: function () {
        Swal.fire({
          title: "Loading",
          text: "Please wait...",
          imageUrl: "img/loading.gif",
          imageWidth: 200,
          imageHeight: 200,
          showConfirmButton: false,
          allowOutsideClick: false
        })
      },
      success(res) {
        Swal.fire('Success', 'Updated Successfully', 'success').then(function () {
          $(".areaCode").change()
        })
        editBackdrop.hide()
      },
      error(err) {
        console.log(err, err.responseJSON.status)
        if (err.status == 500) {
          Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
        } else {
          Swal.fire('INFORMATION',err.responseJSON.message,'warning')
        }
        let endAudio = new Audio('/audio/error.mp3');
        endAudio.play();
      }
    })
      
  }
})

$('#multiChangeStatus').on('click', function () {
  multiChangeBackdrop.show()
})

// addRS
// removeRS
// hideR
// showR

$(".addRS").on('click', function () {
  let checkedValues = []
  let isChecked = []

  $(".multiChangeList input:checkbox:checked").each(function (e) {
    let info = prizeList.find(({id})=> id == $(this).val())
    if (info.isSelected != 1) {
      checkedValues.push( info  );
    }
    isChecked.push(info)
  });

  if (isChecked.length) {
    if (checkedValues.length) {
      Swal.fire({
        title: 'ADD TO RANDOM SELECTION',
        html: `
          <h5>Selected prizes will be added to random selection</h5>
          <ul class="text-left mx-5" >
            ${checkedValues.map(({ name })=> `<li>${name}</li>`).join('')}
          </ul>
        `,
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
        url: '/api/surveyadmin/updateSelectedPrices',
        data: { selected: checkedValues.map(({ id }) => ({ id: id, isSelected:1 }) )},
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
            text: "",
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#df731b',
            confirmButtonText: 'CLOSE'
          })

          multiChangeBackdrop.hide()
          $(".areaCode").change()

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

    } else {
      Swal.fire('Unable to proceed','All selected items already be added.','warning')
    }
  } else {
    Swal.fire('Unable to proceed','No items selected.','warning')
  }

})

$(".removeRS").on('click', function () {
  let checkedValues = []
  let isChecked = []

  $(".multiChangeList input:checkbox:checked").each(function (e) {
    let info = prizeList.find(({id})=> id == $(this).val())
    if (info.isSelected != 0) {
      checkedValues.push( info  );
    }
    isChecked.push(info)
  });

  if (isChecked.length) {
    if (checkedValues.length) {
      Swal.fire({
        title: 'REMOVE FROM RANDOM SELECTION',
        html: `
          <h5>Selected prizes will be removed from random selection</h5>
          <ul class="text-left mx-5" >
            ${checkedValues.map(({ name })=> `<li>${name}</li>`).join('')}
          </ul>
        `,
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
        url: '/api/surveyadmin/updateSelectedPrices',
        data: { selected: checkedValues.map(({ id }) => ({ id: id, isSelected:0 }) )},
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
            text: "",
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#df731b',
            confirmButtonText: 'CLOSE'
          })

          multiChangeBackdrop.hide()
          $(".areaCode").change()

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

    } else {
      Swal.fire('Unable to proceed','All selected items already be added.','warning')
    }
  } else {
    Swal.fire('Unable to proceed','No items selected.','warning')
  }

})

$(".showR").on('click', function () {
  let checkedValues = []
  let isChecked = []

  $(".multiChangeList input:checkbox:checked").each(function (e) {
    let info = prizeList.find(({id})=> id == $(this).val())
    if (info.isVisible != 1) {
      checkedValues.push( info  );
    }
    isChecked.push(info)
  });

  if (isChecked.length) {
    if (checkedValues.length) {
      Swal.fire({
        title: 'SHOW TO ROULETTE',
        html: `
          <h5>Selected prizes will be shown in the Roulette</h5>
          <ul class="text-left mx-5" >
            ${checkedValues.map(({ name })=> `<li>${name}</li>`).join('')}
          </ul>
        `,
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
        url: '/api/surveyadmin/updateViewablePrices',
        data: { visible : checkedValues.map(({ id }) => ({ id: id, isVisible: 1 }) )},
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
            text: "",
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#df731b',
            confirmButtonText: 'CLOSE'
          })

          multiChangeBackdrop.hide()
          $(".areaCode").change()

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

    } else {
      Swal.fire('Unable to proceed','All selected items already be added.','warning')
    }
  } else {
    Swal.fire('Unable to proceed','No items selected.','warning')
  }

})

$(".hideR").on('click', function () {
  let checkedValues = []
  let isChecked = []

  $(".multiChangeList input:checkbox:checked").each(function (e) {
    let info = prizeList.find(({id})=> id == $(this).val())
    if (info.isVisible != 0) {
      checkedValues.push( info  );
    }
    isChecked.push(info)
  });

  if (isChecked.length) {
    if (checkedValues.length) {
      Swal.fire({
        title: 'SHOW TO ROULETTE',
        html: `
          <h5>Selected prizes will be hidden in the Roulette</h5>
          <ul class="text-left mx-5" >
            ${checkedValues.map(({ name })=> `<li>${name}</li>`).join('')}
          </ul>
        `,
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
        url: '/api/surveyadmin/updateViewablePrices',
        data: { visible : checkedValues.map(({ id }) => ({ id: id, isVisible: 0 }) )},
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
            text: "",
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#df731b',
            confirmButtonText: 'CLOSE'
          })

          multiChangeBackdrop.hide()
          $(".areaCode").change()
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

    } else {
      Swal.fire('Unable to proceed','All selected items already be added.','warning')
    }
  } else {
    Swal.fire('Unable to proceed','No items selected.','warning')
  }

})

