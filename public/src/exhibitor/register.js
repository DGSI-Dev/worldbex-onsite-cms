
let dataTable, $tr, data

dataTable = $('#dataTable').DataTable({
  // dom: 'ft',
  // searching: true,
  // pageLength: 1,
  columns: [
    {
      data: null, title: "Action", class: "text-center", render(data) {
        return `
          <button class="btn btn-sm btn-secondary"><i class="fas fa-print"></i></button>
          <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
        `
    }},
    {data: 'firstName', title: "First Name", render(data){
      return data ? data.toUpperCase() : ''
    }},
    {data: 'lastName', title: "Last Name", render(data){
      return data ? data.toUpperCase() : ''
    }},
    {data: 'companyName', title: "Company Name", render(data){
      return data
    }},
    {data: 'position', title: "Position", render(data){
      return data
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

let textSize = (element, fonstSize, lineHeight) => {
  element.css({
    'font-size': fonstSize,
    'line-height': lineHeight
  })
  element.parent().css({
    'line-height': lineHeight
  })
}

// const printSticker = ({ firstName, lastName, companyName }) => {
//   let exName = [firstName, lastName].join(" ").trim()
//   let fullName =  Boolean(exName.trim()) ? exName : companyName
//   $('.fullName').html(fullName)
//   $('.companyName').html(Boolean(exName.trim()) ? companyName : '')

//   if(Boolean(exName.trim())){
//     if (exName?.length >= 28) {
//       textSize($(".fullName"), '10pt', '11pt')
//     } else {
//       textSize($(".fullName"), '15pt', '16pt')
//     }
//   }else{
//     if (companyName?.length >= 28) {
//       textSize($(".fullName"), '12pt', '13pt')
//     } else {
//       textSize($(".fullName"), '15pt', '16pt')
//     }
//   }
  
//   if (companyName?.length >= 28) {
//     textSize($(".companyName"), '8pt', '9pt')
//   } else {
//     textSize($(".companyName"), '11pt', '12pt')
//   }

//   if (exName?.length >= 28 && companyName?.length >= 28) {
//     textSize($(".fullName"), '8pt', '9pt')
//     textSize($(".companyName"), '8pt', '9pt')
//   }

//   // $(".fullName").fitText(1.1, { minFontSize: '15pt', maxFontSize: '18pt' });
//   Swal.close()
//   $('.stickerDiv').printThis({
//     importCSS: true,
//     // canvas: true,
//     removeInlineSelector: "*",
//     removeInline: false,
//     printDelay: 300,
//     afterPrint: function(){
//       $.ajax({
//         type: 'POST',
//         url: '/api/onsite/addPrintlogs',
//         data: {qrCode},
//         dataType: 'JSON',
//         beforeSend: function() {
//           Swal.fire({
//             title: "Saving Print Logs",
//             text: "Please wait",
//             imageUrl: "img/loading.gif",
//             imageWidth: 300,
//             imageHeight: 300,
//             showConfirmButton: false,
//             allowOutsideClick: false
//           })
//         },
//         success: function (res) {
//           Swal.close()
//         },
//         error: function (err) {
//           if(err.status == 502){
//             Swal.fire('Account Login Full', "Please logout other WORLDBEX Login.",'warning')
//           }else if(err.status == 500){
//             Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
//           }else if(err.status == 404){
//             Swal.fire('Warning', "Failed to send request.", 'warning')
//           }else{
//             if(err.responseJSON.message != "No record found."){
//               Swal.fire('Warning', err.responseJSON.message, 'warning')
//             }else{
//               Swal.close()
//             }
//           }
//         }
//       });
//     }
//   })
// }
// printSticker({firstName: 'Juan', lastName: 'Dela Cruz', 
// companyName: 'ABC Corporation'})

const printSticker = ({ firstName, lastName, companyName }) => {
  let exName = [firstName, lastName].join(" ").trim()
  let fullName =  Boolean(exName.trim()) ? exName : companyName
  $('.fullName').html(fullName)
  $('.companyName').html(Boolean(exName.trim()) ? companyName : '')

  if(Boolean(exName.trim())){
    if (exName?.length >= 28) {
      textSize($(".fullName"), '10pt', '11pt')
    } else {
      textSize($(".fullName"), '15pt', '16pt')
    }
  }else{
    if (companyName?.length >= 28) {
      textSize($(".fullName"), '12pt', '13pt')
    } else {
      textSize($(".fullName"), '15pt', '16pt')
    }
  }
  
  if (companyName?.length >= 28) {
    textSize($(".companyName"), '8pt', '9pt')
  } else {
    textSize($(".companyName"), '11pt', '12pt')
  }

  if (exName?.length >= 28 && companyName?.length >= 28) {
    textSize($(".fullName"), '8pt', '9pt')
    textSize($(".companyName"), '8pt', '9pt')
  }

  // $(".fullName").fitText(1.1, { minFontSize: '15pt', maxFontSize: '18pt' });
  Swal.close()
  $('.stickerDiv').printThis({
    importCSS: true,
    // canvas: true,
    removeInlineSelector: "*",
    removeInline: false,
    printDelay: 300,
    afterPrint: function(){
      $.ajax({
        type: 'POST',
        url: '/api/onsite/addPrintlogs',
        data: {qrCode},
        dataType: 'JSON',
        beforeSend: function() {
          Swal.fire({
            title: "Saving Print Logs",
            text: "Please wait",
            imageUrl: "img/loading.gif",
            imageWidth: 300,
            imageHeight: 300,
            showConfirmButton: false,
            allowOutsideClick: false
          })
        },
        success: function (res) {
          Swal.close()
        },
        error: function (err) {
          if(err.status == 502){
            Swal.fire('Account Login Full', "Please logout other WORLDBEX Login.",'warning')
          }else if(err.status == 500){
            Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
          }else if(err.status == 404){
            Swal.fire('Warning', "Failed to send request.", 'warning')
          }else{
            if(err.responseJSON.message != "No record found."){
              Swal.fire('Warning', err.responseJSON.message, 'warning')
            }else{
              Swal.close()
            }
          }
        }
      });
    }
  })
}
printSticker({firstName: 'Juan', lastName: 'Dela Cruz', 
companyName: 'ABC Corporation'})


const getExhibitors = () => {
  $.ajax({
    type: 'GET',
    url: '/api/exhibitor/getExhibitorList',
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

      Swal.close()
    },error(err){
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

getExhibitors()
// registration
$("#registration").validate({
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
    if (
      $('#registration [name="firstName"]').val() ||
      $('#registration [name="lastName"]').val() ||
      $('#registration [name="companyName"]').val()
    ) {
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
            url: '/api/exhibitor/signup',
            data: params,
            dataType: 'JSON',
            beforeSend: function() {
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
              Swal.close()
              printSticker(res)
              $("#registration")[0].reset()
              getExhibitors()
            },
            error: function(err){
              console.log(err)
              if(err.status == 502){
                Swal.fire('Account Login Full', "Please logout other T.R.A.C.E. Login.",'warning')
              }else if(err.status == 500){
                Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
              }else if(err.status == 404){
                Swal.fire('Warning', "Failed to send request.", 'warning')
              }else{
                if(err.responseJSON?.message != "No record found."){
                  Swal.fire('Warning', err.responseJSON.message, 'warning')
                }else{
                  Swal.close()
                }
              }
            }       
          })
        }
      })
    } else {
      Swal.fire('Warning','Please input any of the following: First Name, Last Name, Company Name','warning')
    }
    

  }
})

dataTable.on('click', 'tr td button:has("i.fa-print")', function () {
  $tr = $(this).closest('tr');
  data = dataTable.row($tr).data();
  printSticker(data)

})

dataTable.on('click', 'tr td button:has("i.fa-edit")', function () {
  $tr = $(this).closest('tr');
  data = dataTable.row($tr).data();
  $('#edit [name="firstName"]').val(data.firstName)
  $('#edit [name="lastName"]').val(data.lastName)
  $('#edit [name="companyName"]').val(data.companyName)
  $('#edit [name="position"]').val(data.position)
  $("#modal-edit").modal('show')
})


$("#edit").validate({
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
    if (
      $('#edit [name="firstName"]').val() ||
      $('#edit [name="lastName"]').val() ||
      $('#edit [name="companyName"]').val()
    ) {
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
            url: '/api/exhibitor/updateExhibitor/'+data.exhibitorId,
            data: params,
            dataType: 'JSON',
            beforeSend: function() {
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
              Swal.close()
              printSticker(res)
              $("#edit")[0].reset()
              
              $("#modal-edit").modal('hide')
              getExhibitors()
            },
            error: function(err){
              console.log(err)
              if(err.status == 502){
                Swal.fire('Account Login Full', "Please logout other T.R.A.C.E. Login.",'warning')
              }else if(err.status == 500){
                Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
              }else if(err.status == 404){
                Swal.fire('Warning', "Failed to send request.", 'warning')
              }else{
                if(err.responseJSON?.message != "No record found."){
                  Swal.fire('Warning', err.responseJSON.message, 'warning')
                }else{
                  Swal.close()
                }
              }
            }       
          })
        }
      })
    } else {
      Swal.fire('Warning','Please input any of the ff: First Name, Last Name, Company Name','warning')
    }
    

  }
})