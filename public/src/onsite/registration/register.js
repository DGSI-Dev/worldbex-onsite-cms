let bodyFormat = {
  eventId: "",
  paymentChannel: "",
  attendees: [],
  survey: [],
};

//Show Hide Password
$("#showPassword").on("change", function () {
  let ischecked = $(this).prop("checked");
  if (ischecked) {
    $('[name="password"], [name="confirmPassword"]').prop("type", "text");
  } else {
    $('[name="password"], [name="confirmPassword"]').prop("type", "password");
  }
});

$("#isPh").on("change", function () {
  let isCheck = $(this).prop("checked");
  if (isCheck) {
    $(".inPh").show("slide");
    $(".outsidePh").hide("slide");
    $('[name="country"]').val("").change();
    $('[name="city"]').val("");
  } else {
    $('[name="region"]').val("").change();
    $('[name="province"]').val("").change();
    $('[name="city"]').val("").change();
    $('[name="address"]').val("");
    $(".outsidePh").show("slide");
    $(".inPh").hide("slide");
  }
});

const printSticker = ({ qrCode, firstName, lastName, companyName }) => {
  let qrValue = [
    qrCode,
    firstName?.trim(),
    lastName?.trim(),
    eventInfo.eventTag,
    "O",
  ].join(":");
  $(".qrCode").empty().qrcode(qrValue, 85, 85);
  let exName = [firstName, lastName].join(" ");
  let fullName = Boolean(exName.trim())
    ? exName.toLocaleUpperCase()
    : companyName;
  $(".stickerId").text(qrCode);
  $(".fullName").text(fullName);
  $(".companyName").text(Boolean(exName.trim()) ? companyName : "");
  Swal.close();
  $(".stickerDiv").printThis({
    importCSS: true,
    canvas: true,
    removeInlineSelector: "*",
    removeInline: false,
    printDelay: 300,
    afterPrint: function () {
      $.ajax({
        type: "POST",
        url: "/api/onsite/addPrintlogs",
        data: { qrCode },
        dataType: "JSON",
        beforeSend: function () {
          Swal.fire({
            title: "Saving Print Logs",
            text: "Please wait",
            imageUrl: "img/loading.gif",
            imageWidth: 300,
            imageHeight: 300,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          Swal.close();
        },
        error: function (err) {
          if (err.status == 502) {
            Swal.fire(
              "Account Login Full",
              "Please logout other WORLDBEX Login.",
              "warning"
            );
          } else if (err.status == 500) {
            Swal.fire(
              "Warning",
              "Internal server error. Please try again later.",
              "warning"
            );
          } else if (err.status == 404) {
            Swal.fire("Warning", "Failed to send request.", "warning");
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire("Warning", err.responseJSON.message, "warning");
            } else {
              Swal.close();
            }
          }
        },
      });
    },
  });
};

// printSticker({qrCode: '2122L6VRAXN80816', firstName:"Christopher", lastName: 'Dungaran', companyName: 'Dynamic Global Soft Inc.'})

// let dataTable, $tr, data
// dataTable  = $('#dataTable').DataTable({
//   columns: [
//     {
//       data: null, title: "Action", class: "text-center", render(data) {
//         return `
//           <button class="btn btn-sm btn-secondary"><i class="fas fa-print"></i></button>
//           <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
//         `
//     }},
//     {data: 'firstName', title: "First Name", render(data){
//       return data ? data.toUpperCase() : ''
//     }},
//     {data: 'lastName', title: "Last Name", render(data){
//       return data ? data.toUpperCase() : ''
//     }},
//     {data: 'companyName', title: "Company Name", render(data){
//       return data
//     }},
//     {data: 'position', title: "Position", render(data){
//       return data
//     }},
//   ]
// });
// $('#dataTable thead tr').clone().appendTo( '#dataTable thead' );
// $('#dataTable thead tr:eq(1) th').each( function (i) {
//   $(this).removeClass('sorting')
//   var title = $(this).text();

//   $(this).html(  i > 0 ? `
//     <div class="input-group mb-3">
//       <button class="input-group-text clearColumn"><i class="fas fa-eraser"></i></button>
//       <input class="form-control-sm form-control" placeholder="Search ${title}" />
//     </div>
//   `  :
//     '')
//    ;

//   $( 'input', this ).on( 'keyup change', function () {
//     if ( dataTable.column(i).search() !== this.value ) {
//       dataTable
//       .column(i)
//       .search( this.value )
//       .draw();
//     }
//   });

// });

// const getVisitors = () => {
//   $.ajax({
//     type: 'GET',
//     url: '/api/exhibitor/getExhibitorList',
//     dataType: 'JSON',
//     beforeSend(res){
//       Swal.fire({
//         title: "Loading...",
//         text: "Please wait",
//         imageUrl: "../img/loading.gif",
//         imageWidth: 200,
//         imageHeight: 200,
//         showConfirmButton: false,
//         allowOutsideClick: false
//       })
//     },success(res){
//       dataTable.clear()
//       dataTable.rows.add(res)
//       dataTable.draw()

//       Swal.close()
//     },error(err){
//       console.log(err)
//       if(err.status == 500){
//         Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
//       }else if(err.status == 404){
//         Swal.fire('Warning', "Failed to send request.", 'warning')
//       }else{
//         Swal.fire('Warning', err.responseJSON.message, 'warning')
//       }
//     }
//   })
// }
// getVisitors()

// dataTable.on('click', 'tr td button:has("i.fa-print")', function () {
//   $tr = $(this).closest('tr');
//   data = dataTable.row($tr).data();
//   printSticker(data)

// })

// dataTable.on('click', 'tr td button:has("i.fa-edit")', function () {
//   $tr = $(this).closest('tr');
//   data = dataTable.row($tr).data();
//   let {
//     firstName,
//     lastName,
//     email,
//     mobileNumber,
//     companyName,
//     position,
//   } = data

//   $('#edit [name="firstName"]').val(firstName)
//   $('#edit [name="lastName"]').val(lastName)
//   $('#edit [name="companyName"]').val(companyName)
//   $('#edit [name="position"]').val(position)
//   $('#edit [name="email"]').val(email)

// let prefVal =  countriesWithNumber.reverse().find(obj=> mobileNumber?.substr(0,3).includes( obj.dial_code.replace('+','') ) )
// if (mobileNumber?.substr(0,1) == 0) {
//   myMobileNumber = mobileNumber?.slice(1)
// } else if (prefVal) {
//   $(".countryMobile").val(prefVal?.dial_code)
//   let preffix = prefVal?.dial_code
//   let formattedPrefix = preffix?.replace('+', '')

//   //update variable
//   $(".countryMobile").val(preffix)
//   countryMobile = (formattedPrefix -  1)

//   myMobileNumber = mobileNumber?.slice(formattedPrefix.length)

// } else {
//   myMobileNumber = mobileNumber?.slice(1)
// }

// $("#mobileNumber").val(myMobileNumber)

//   $("#modal-edit").modal('show')
// })

// $("#edit").validate({
//   errorElement: 'span',
//   errorClass: 'help-block text-danger',
//   rules: {
//     mobileNumber: {
//       mobileNumber: true,
//     },
//     email: {
//       email: true,
//       required: true
//     }
//   },
//   messages: {
//     mobileNumber: {
//       mobileNumber: "Invalid mobile number",
//     },
//     email: {
//       email: 'Invalid email format',
//       required: "This field is required"
//     }
//   },
//   errorPlacement: function(error, element) {
//     var placement = $(element).data('error');
//     if (placement) {
//       $(placement).append(error)
//     } else {
//       if($(element).attr('name') == "mobileNumber"){
//         error.insertAfter($(element).parent())
//       }else{
//         error.insertAfter($(element));
//       }
//     }
//   },
//   submitHandler: function (form) {
//     var $form = $(form),
//     params = $form.serializeArray();
//     if (
//       $('#edit [name="firstName"]').val() ||
//       $('#edit [name="lastName"]').val() ||
//       $('#edit [name="companyName"]').val() ||
//       $('#edit [name="position"]').val()
//     ) {
//       Swal.fire({
//         title: 'Confirmation',
//         html: `Are you sure that all information you provided are correct?`,
//         icon: 'warning',
//         allowOutsideClick: false,
//         showCancelButton: true,
//         confirmButtonColor: '#df731b',
//         confirmButtonText: 'PROCEED',
//         reverseButtons: true,
//       }).then((result) => {
//         if (result.value) {
//           $.ajax({
//             type: 'POST',
//             url: '/api/exhibitor/updateExhibitor/'+data.qrCode,
//             data: params,
//             dataType: 'JSON',
//             beforeSend: function() {
//               Swal.fire({
//                 title: "Validating",
//                 text: "Please wait...",
//                 imageUrl: "img/loading.gif",
//                 imageWidth: 200,
//                 imageHeight: 200,
//                 showConfirmButton: false,
//                 allowOutsideClick: false
//               })
//             },
//             success: function (res) {
//               Swal.close()
//               printSticker(res)
//               $("#edit")[0].reset()

//               $("#modal-edit").modal('hide')
//               getVisitors()
//             },
//             error: function(err){
//               console.log(err)
//               if(err.status == 502){
//                 Swal.fire('Account Login Full', "Please logout other T.R.A.C.E. Login.",'warning')
//               }else if(err.status == 500){
//                 Swal.fire('Warning', "Internal server error. Please try again later.", 'warning')
//               }else if(err.status == 404){
//                 Swal.fire('Warning', "Failed to send request.", 'warning')
//               }else{
//                 if(err.responseJSON?.message != "No record found."){
//                   Swal.fire('Warning', err.responseJSON.message, 'warning')
//                 }else{
//                   Swal.close()
//                 }
//               }
//             }
//           })
//         }
//       })
//     } else {
//       Swal.fire('Warning','Please input any of the ff: First Name, Last Name, Company Name','warning')
//     }

//   }
// })
