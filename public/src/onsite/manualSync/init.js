let dataTableCloud, $trCloud, dataCloud;
let dataTableLocal, $trLocal, dataLocal;

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

dataTableCloud = $("#dataTableCloud").DataTable({
  columns: [
    {
      data: null,
      title: "Action",
      render(data) {
        return '<button class="btn btn-warning"><i class="fas fa-cloud"></i> SYNC TO LOCAL</button>';
      },
    },
    {
      data: "attendees.title",
      title: "Title",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    {
      data: "attendees.firstName",
      title: "First Name",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    {
      data: "attendees.lastName",
      title: "Last Name",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    { data: "attendees.email", title: "Email" },
    { data: "attendees.mobileNumber", title: "Mobile Number" },
    {
      data: "attendees.prcNumber",
      title: "PRC Number",
      reder(data) {
        return data || "NA";
      },
    },
    {
      data: "attendees.prcExpiry",
      title: "PRC Expiry",
      render(data) {
        return data ? moment(data).format("ll") : "NA";
      },
    },
    {
      data: "attendees.companyName",
      title: "Company Name",
      render(data) {
        return data;
      },
    },
    {
      data: "attendees.designation",
      title: "Designation",
      render(data) {
        return data;
      },
    },
  ],
});
$("#dataTableCloud thead tr").clone().appendTo("#dataTableCloud thead");
$("#dataTableCloud thead tr:eq(1) th").each(function (i) {
  $(this).removeClass("sorting");
  var title = $(this).text();

  $(this).html(
    i > 0
      ? `
    <div class="input-group mb-3">
      <button class="input-group-text clearColumn"><i class="fas fa-eraser"></i></button>
      <input class="form-control-sm form-control" placeholder="Search ${title}" />
    </div>
  `
      : ""
  );

  $("input", this).on("keyup change", function () {
    if (dataTableCloud.column(i).search() !== this.value) {
      dataTableCloud.column(i).search(this.value).draw();
    }
  });
});

dataTableLocal = $("#dataTableLocal").DataTable({
  columns: [
    {
      data: null,
      title: "Action",
      render(data) {
        return '<button class="btn btn-warning"><i class="fas fa-cloud"></i> SYNC TO CLOUD</button>';
      },
    },
    {
      data: "attendees.attendees.qrCode",
      title: "QR CODE",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    {
      data: "attendees.title",
      title: "Title",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    {
      data: "attendees.firstName",
      title: "First Name",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    {
      data: "attendees.lastName",
      title: "Last Name",
      render(data) {
        return data ? data.toUpperCase() : "";
      },
    },
    { data: "attendees.email", title: "Email" },
    { data: "attendees.mobileNumber", title: "Mobile Number" },
    {
      data: "attendees.prcNumber",
      title: "PRC Number",
      reder(data) {
        return data || "NA";
      },
    },
    {
      data: "attendees.prcExpiry",
      title: "PRC Expiry",
      render(data) {
        return data ? moment(data).format("ll") : "NA";
      },
    },
    {
      data: "attendees.companyName",
      title: "Company Name",
      render(data) {
        return data;
      },
    },
    {
      data: "attendees.designation",
      title: "Designation",
      render(data) {
        return data;
      },
    },
  ],
});
$("#dataTableLocal thead tr").clone().appendTo("#dataTableLocal thead");
$("#dataTableLocal thead tr:eq(1) th").each(function (i) {
  $(this).removeClass("sorting");
  var title = $(this).text();

  $(this).html(
    i > 0
      ? `
    <div class="input-group mb-3">
      <button class="input-group-text clearColumn"><i class="fas fa-eraser"></i></button>
      <input class="form-control-sm form-control" placeholder="Search ${title}" />
    </div>
  `
      : ""
  );

  $("input", this).on("keyup change", function () {
    if (dataTableLocal.column(i).search() !== this.value) {
      dataTableLocal.column(i).search(this.value).draw();
    }
  });
});

$("#searchCloud").validate({
  focusInvalid: true,
  errorElement: "span",
  onkeyup: false,
  errorClass: "help-block text-danger",
  success: function (e) {
    $(e).remove();
  },
  errorPlacement: function (error, element) {
    error.insertAfter(element);
  },
  submitHandler: function (form) {
    var $form = $(form),
      params = $form.serializeArray();
    var sendBody = [];
    params.push({ name: "eventId", value: eventInfo.eventId });
    params.forEach((obj) => {
      if (obj.value) {
        sendBody.push({ name: obj.name, value: obj.value.trim() });
      }
    });

    if (
      $("#searchCloud input[name='firstName']").val() ||
      $("#searchCloud input[name='lastName']").val() ||
      $("#searchCloud input[name='qrCode']").val()
    ) {
      $.ajax({
        type: "POST",
        url: "/api/onsite/searchDataFromCloudServer",
        data: sendBody,
        dataType: "JSON",
        beforeSend: function () {
          Swal.fire({
            title: "Fetch data...",
            text: "Please wait",
            imageUrl: "img/loading.gif",
            imageWidth: 300,
            imageHeight: 300,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          dataTableCloud.clear();
          dataTableCloud.rows.add(res);
          dataTableCloud.draw();
          Swal.close();
        },
        error: function (err) {
          console.log(err);
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
    } else {
      Swal.fire(
        "Empty Search",
        "Please fill out atleast 1 field to proceed.",
        "info"
      );
    }
  },
});

$("#searchLocal").validate({
  focusInvalid: true,
  errorElement: "span",
  onkeyup: false,
  errorClass: "help-block text-danger",
  success: function (e) {
    $(e).remove();
  },
  errorPlacement: function (error, element) {
    error.insertAfter(element);
  },
  submitHandler: function (form) {
    var $form = $(form),
      params = $form.serializeArray();
    var sendBody = [];
    params.forEach((obj) => {
      if (obj.value) {
        sendBody.push({ name: obj.name, value: obj.value.trim() });
      }
    });

    if (
      $("#searchLocal input[name='firstName']").val() ||
      $("#searchLocal input[name='lastName']").val() ||
      $("#searchLocal input[name='qrCode']").val()
    ) {
      $.ajax({
        type: "POST",
        url: "/api/onsite/searchDataFromLocalServer",
        data: sendBody,
        dataType: "JSON",
        beforeSend: function () {
          Swal.fire({
            title: "Fetch data...",
            text: "Please wait",
            imageUrl: "img/loading.gif",
            imageWidth: 300,
            imageHeight: 300,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          dataTableLocal.clear();
          dataTableLocal.rows.add(res);
          dataTableLocal.draw();
          Swal.close();
        },
        error: function (err) {
          console.log(err);
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
    } else {
      Swal.fire(
        "Empty Search",
        "Please fill out atleast 1 field to proceed.",
        "info"
      );
    }
  },
});

$("#searchCloudScanQr").validate({
  focusInvalid: true,
  errorElement: "span",
  onkeyup: false,
  errorClass: "help-block text-danger",
  success: function (e) {
    $(e).remove();
  },
  errorPlacement: function (error, element) {
    error.insertAfter(element);
  },
  submitHandler: function (form) {
    let qrCode = $("#searchCloudScanQr").find('[name="qrCode"]').val();
    let val = qrCode.split(":");
    if (val.length >= 2) {
      $.ajax({
        type: "POST",
        url: "/api/onsite/searchDataFromCloudServer",
        data: { qrCode: val[0], eventId: eventInfo.eventId },
        dataType: "JSON",
        beforeSend: function () {
          Swal.fire({
            title: "Fetch data...",
            text: "Please wait",
            imageUrl: "img/loading.gif",
            imageWidth: 300,
            imageHeight: 300,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          console.log('searchDataFromCloudServer',res)
          Swal.close();
          if (res.length == 1) {
            func_syncToLocal(res[0]);
          } else {
            dataTableCloud.clear();
            dataTableCloud.rows.add(res);
            dataTableCloud.draw();
          }
        },
        error: function (err) {
          console.log(err);
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
        complete() {
          $("#searchCloudScanQr").find('[name="qrCode"]').val("");
        },
      });
    } else {
      Swal.fire("INVALID QR CODE", "Please scan valid QR CODE", "warning");
    }
    $("#searchLocalScanQr").find('[name="qrCode"]').val("");
  },
});

$("#searchLocalScanQr").validate({
  focusInvalid: true,
  errorElement: "span",
  onkeyup: false,
  errorClass: "help-block text-danger",
  success: function (e) {
    $(e).remove();
  },
  errorPlacement: function (error, element) {
    error.insertAfter(element);
  },
  submitHandler: function (form) {
    let qrCode = $("#searchLocalScanQr").find('[name="qrCode"]').val();
    let val = qrCode.split(":");
    $.ajax({
      type: "POST",
      url: "/api/onsite/searchDataFromLocalServer",
      data: { qrCode: val[0], eventId: eventInfo.eventId },
      dataType: "JSON",
      beforeSend: function () {
        Swal.fire({
          title: "Fetch data...",
          text: "Please wait",
          imageUrl: "img/loading.gif",
          imageWidth: 300,
          imageHeight: 300,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      },
      success: function (res) {
        dataTableLocal.clear();
        dataTableLocal.rows.add(res);
        dataTableLocal.draw();
        Swal.close();
      },
      error: function (err) {
        console.log(err);
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
      complete() {
        $("#searchLocalScanQr").find('[name="qrCode"]').val("");
      },
    });
    // if (val.length >= 2) {
    // } else {
    //   Swal.fire('INVALID QR CODE', 'Please scan valid QR CODE','warning')
    // }
    $("#searchLocalScanQr").find('[name="qrCode"]').val("");
  },
});

let func_syncToLocal = (info) => {
  data = info;
  let {
    qrCode,
    firstName,
    lastName,
    email,
    mobileNumber,
    designation,
    companyName,
    prcNumber,
    prcExpiry,
  } = info.attendees;
  Swal.fire({
    title: "SYNC TO LOCAL SERVER",
    html: `<h3 style="font-weight: 900;" class="text-uppercase">${[
      firstName,
      lastName,
    ].join(" ")}</h3>`,
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonColor: "#df731b",
    confirmButtonText: "PROCEED",
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        url: "/api/onsite/syncToLocalServer",
        dataType: "JSON",
        data: info,
        beforeSend: function () {
          Swal.fire({
            title: "Validating",
            text: "Please wait...",
            imageUrl: "img/loading.gif",
            imageWidth: 200,
            imageHeight: 200,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          Swal.fire({
            title: "Ticket Information",
            html: `
            <table class="w-100" style="text-align: left" cellpadding="2" >
              <tr>
                <td class="fs-5 mx-2" >First Name: </td>
                <td class="fs-4 ms-2">${firstName.toUpperCase()}</td>
              </tr>
              <tr>
                <td class="fs-5 mx-2" >Last Name: </td>
                <td class="fs-4 ms-2">${lastName.toUpperCase()}</td>
              </tr>
              <tr>
                <td class="fs-5 mx-2" >Email: </td>
                <td class="fs-4 ms-2">${email}</td>
              </tr>
              <tr>
                <td class="fs-5 mx-2" >Mobile Number: </td>
                <td class="fs-4 ms-2">${mobileNumber}</td>
              </tr>
              <tr>
                <td class="fs-5 mx-2" >Designation: </td>
                <td class="fs-4 ms-2">${designation}</td>
              </tr>
              <tr>
                <td class="fs-5 mx-2" >Company Name: </td>
                <td class="fs-4 ms-2">${companyName}</td>
              </tr>
            </table>
  
            
              <br>
              <div class="d-flex justfy-content-between">
              <button type="button" id="swal_cancel" class="swal2-cancel swal2-styled" aria-label="">Cancel</button>
              <button type="button" id="swal_edit" class="swal2-confirm swal2-styled" aria-label="" style=" background-color: rgb(223, 115, 27); border-left-color: rgb(223, 115, 27); border-right-color: rgb(223, 115, 27);">EDIT</button>
              <button type="button" id="swal_print" class="swal2-confirm swal2-styled" aria-label="" style=" background-color: rgb(223, 115, 27); border-left-color: rgb(223, 115, 27); border-right-color: rgb(223, 115, 27);"><i class="fas fa-print"></i> PRINT</button>
              </div>
            `,
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
          $("#swal_cancel").on("click", function () {
            Swal.close();
          });

          $("#swal_edit").on("click", function () {
            Swal.close();
            formEdit.find('[name="firstName"]').val(firstName);
            formEdit.find('[name="lastName"]').val(lastName);
            formEdit.find('[name="email"]').val(email);
            formEdit.find('[name="companyName"]').val(companyName);
            formEdit.find('[name="designation"]').val(designation);
            if (prcNumber) {
              formEdit.find('[name="prcNumber"]').val(prcNumber);
              formEdit.find('[name="prcExpiry"]').val(prcExpiry);
            } else {
              $("#noPrc").click();
            }

            let currentMobile = mobileNumber;
            let countryMobile = $(".countryMobile").val().replace("+", "");
            let myMobileNumber = currentMobile;

            //find Mobile prefix
            let prefVal = countriesWithNumber
              .reverse()
              .find((obj) =>
                currentMobile
                  .substr(0, 2)
                  .includes(obj.dial_code.replace("+", ""))
              );
            if (currentMobile.substr(0, 1) == 0) {
              myMobileNumber = currentMobile.slice(1);
            } else if (prefVal) {
              formEdit.find(".countryMobile").val(prefVal?.dial_code);
              let preffix = prefVal?.dial_code;
              let formattedPrefix = preffix?.replace("+", "");

              //update variable
              formEdit.find(".countryMobile").val(preffix);
              countryMobile = formattedPrefix - 1;

              myMobileNumber = currentMobile.slice(formattedPrefix.length);
            } else {
              myMobileNumber = currentMobile.slice(1);
            }

            $("#mobileNumber").val(myMobileNumber);

            Swal.close();
            modalEdit.show();
          });

          $("#swal_print").on("click", function () {
            console.log(data);
            printSticker(info.attendees);
          });
          // Swal.fire('SUCCESS', res.message, 'success')
        },
        error: function (err) {
          console.log(err);
          if (err.status == 502) {
            Swal.fire(
              "Account Login Full",
              "Please logout other WORLDBEX. Login.",
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
          } else if (
            err.status == 400 &&
            err.responseJSON.message == "Invalid parameters"
          ) {
            let { stack } = err.responseJSON;
            if (stack.length > 1) {
              let followingErr = stack
                .map(({ msg, value }) => `<li>${msg} : ${value}</li>`)
                .join("");
              Swal.fire({
                title: "Invalid Information",
                html: `
                  <h4>the following is not valid :</h4>
                  <ul>
                  ${followingErr}
                  </ul>
                `,
                icon: "warning",
              });
            } else {
              Swal.fire(
                stack[0].msg,
                `"${stack[0].value}" is not valid.`,
                "warning"
              );
            }
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire("Warning", err.responseJSON.message, "warning");
            } else {
              Swal.close();
            }
          }
        },
      });
    }
  });
};

dataTableCloud.on("click", 'tr td button:has("i.fa-cloud")', function () {
  $tr = $(this).closest("tr");
  data = dataTableCloud.row($tr).data();
  func_syncToLocal(data);
});

dataTableLocal.on("click", 'tr td button:has("i.fa-cloud")', function () {
  $tr = $(this).closest("tr");
  data = dataTableLocal.row($tr).data();
  console.log(data);
  let { firstName, lastName } = data.attendees;
  Swal.fire({
    title: "SYNC TO CLOUD SERVER",
    html: `<h3 style="font-weight: 900;" class="text-uppercase">${[
      firstName,
      lastName,
    ].join(" ")}</h3>`,
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonColor: "#df731b",
    confirmButtonText: "PROCEED",
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        url: "/api/onsite/syncToCloudServer",
        dataType: "JSON",
        data: data,
        beforeSend: function () {
          Swal.fire({
            title: "Validating",
            text: "Please wait...",
            imageUrl: "img/loading.gif",
            imageWidth: 200,
            imageHeight: 200,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          Swal.fire("SUCCESS", res.message, "success");
        },
        error: function (err) {
          console.log(err);
          if (err.status == 502) {
            Swal.fire(
              "Account Login Full",
              "Please logout other WORLDBEX. Login.",
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
          } else if (
            err.status == 400 &&
            err.responseJSON.message == "Invalid parameters"
          ) {
            let { stack } = err.responseJSON;
            if (stack.length > 1) {
              let followingErr = stack
                .map(({ msg, value }) => `<li>${msg} : ${value}</li>`)
                .join("");
              Swal.fire({
                title: "Invalid Information",
                html: `
                  <h4>the following is not valid :</h4>
                  <ul>
                  ${followingErr}
                  </ul>
                `,
                icon: "warning",
              });
            } else {
              Swal.fire(
                stack[0].msg,
                `"${stack[0].value}" is not valid.`,
                "warning"
              );
            }
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire("Warning", err.responseJSON.message, "warning");
            } else {
              Swal.close();
            }
          }
        },
      });
    }
  });
});

let formEdit = $("#form-edit");
// dataTable.on('click', 'tr td button:has("i.fa-edit")', function () {
//   $tr = $(this).closest('tr');
//   data = dataTable.row($tr).data();
//   formEdit.find('[name="firstName"]').val(data.firstName)
//   formEdit.find('[name="lastName"]').val(data.lastName)
//   formEdit.find('[name="email"]').val(data.email)
//   formEdit.find('[name="companyName"]').val(data.companyName)
//   formEdit.find('[name="designation"]').val(data.designation)
//   if (data.prcNumber) {
//     formEdit.find('[name="prcNumber"]').val(data.prcNumber)
//     formEdit.find('[name="prcExpiry"]').val(data.prcExpiry)
//   } else {
//     $("#noPrc").click()
//   }

// let currentMobile = data.mobileNumber
// let countryMobile = $(".countryMobile").val().replace('+','')
// let myMobileNumber = currentMobile

// //find Mobile prefix
// let prefVal =  countriesWithNumber.reverse().find(obj=> currentMobile.substr(0,2).includes( obj.dial_code.replace('+','') ) )
// if (currentMobile.substr(0,1) == 0) {
//   myMobileNumber = currentMobile.slice(1)
// } else if (prefVal) {
//   formEdit.find(".countryMobile").val(prefVal?.dial_code)
//   let preffix = prefVal?.dial_code
//   let formattedPrefix = preffix?.replace('+', '')

//   //update variable
//   formEdit.find(".countryMobile").val(preffix)
//   countryMobile = (formattedPrefix -  1)

//   myMobileNumber = currentMobile.slice(formattedPrefix.length)

// } else {
//   myMobileNumber = currentMobile.slice(1)
// }

// $("#mobileNumber").val(myMobileNumber)

//   // let countryMobile = formEdit.find(".countryMobile").val().replace('+','')
//   // let mobileNumber = data.mobileNumber.replace(countryMobile,'')
//   // $('[name="mobileNumber"]').val(mobileNumber)

//   modalEdit.show()
// })

formEdit.validate({
  errorElement: "span",
  errorClass: "help-block text-danger",
  rules: {
    mobileNumber: {
      mobileNumber: true,
    },
    email: {
      email: true,
      required: true,
    },
  },
  messages: {
    mobileNumber: {
      mobileNumber: "Invalid mobile number",
    },
    email: {
      email: "Invalid email format",
      required: "This field is required",
    },
  },
  errorPlacement: function (error, element) {
    var placement = $(element).data("error");
    if (placement) {
      $(placement).append(error);
    } else {
      if ($(element).attr("name") == "mobileNumber") {
        error.insertAfter($(element).parent());
      } else {
        error.insertAfter($(element));
      }
    }
  },
  submitHandler: function (form) {
    var $form = $(form),
      params = $form.serializeArray();

    let tosend = [];
    params.forEach((obj) => {
      if (obj.value) {
        if (obj.name == "mobileNumber") {
          tosend.push({
            name: obj.name,
            value: $(".countryMobile").val().replace("+", "") + obj.value,
          });
        } else if (obj.name == "privacyPolicy") {
        } else {
          tosend.push(obj);
        }
      }
    });

    if ($("#isStudent").prop("checked")) {
      tosend.push({ name: "designation", value: "student" });
    }

    Swal.close();
    Swal.fire({
      title: "Confirmation",
      html: `
          Are you sure that all information you provided are correct?
          <br>
          <div class="d-flex justfy-content-between">
          <button type="button" id="swal_cancel" class="swal2-cancel swal2-styled" aria-label="">Cancel</button>
          <button type="button" id="swal_save" class="swal2-confirm swal2-styled" aria-label="" style=" background-color: rgb(223, 115, 27); border-left-color: rgb(223, 115, 27); border-right-color: rgb(223, 115, 27);">SAVE</button>
          <button type="button" id="swal_savePrint" class="swal2-confirm swal2-styled" aria-label="" style=" background-color: rgb(223, 115, 27); border-left-color: rgb(223, 115, 27); border-right-color: rgb(223, 115, 27);"><i class="fas fa-print"></i> SAVE AND PRINT</button>
          </div>
        `,
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      // confirmButtonColor: '#df731b',
      // confirmButtonText: '<i class="fas fa-print"></i> PROCEED',
      // reverseButtons: true
    });

    $("#swal_cancel").on("click", function () {
      Swal.close();
    });
    $("#swal_save").on("click", function () {
      $.ajax({
        type: "POST",
        url: "/api/onsite/updateAttendee/" + data.attendees.qrCode,
        dataType: "JSON",
        data: tosend,
        beforeSend: function () {
          Swal.fire({
            title: "Validating",
            text: "Please wait...",
            imageUrl: "img/loading.gif",
            imageWidth: 200,
            imageHeight: 200,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          $("#search").submit();
          modalEdit.hide();
          Swal.fire("SUCCESS", "Successfully updated", "success");
          formEdit[0].reset();
          $("#noPrc").change();
          $("#isStudent").change();
        },
        error: function (err) {
          console.log(err);
          if (err.status == 502) {
            Swal.fire(
              "Account Login Full",
              "Please logout other WORLDBEX. Login.",
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
          } else if (
            err.status == 400 &&
            err.responseJSON.message == "Invalid parameters"
          ) {
            let { stack } = err.responseJSON;
            if (stack.length > 1) {
              let followingErr = stack
                .map(({ msg, value }) => `<li>${msg} : ${value}</li>`)
                .join("");
              Swal.fire({
                title: "Invalid Information",
                html: `
                    <h4>the following is not valid :</h4>
                    <ul>
                    ${followingErr}
                    </ul>
                  `,
                icon: "warning",
              });
            } else {
              Swal.fire(
                stack[0].msg,
                `"${stack[0].value}" is not valid.`,
                "warning"
              );
            }
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire("Warning", err.responseJSON.message, "warning");
            } else {
              Swal.close();
            }
          }
        },
      });
    });
    $("#swal_savePrint").on("click", function () {
      $.ajax({
        type: "POST",
        url: "/api/onsite/updateAttendee/" + data.attendees.qrCode,
        dataType: "JSON",
        data: tosend,
        beforeSend: function () {
          Swal.fire({
            title: "Validating",
            text: "Please wait...",
            imageUrl: "img/loading.gif",
            imageWidth: 200,
            imageHeight: 200,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        },
        success: function (res) {
          modalEdit.hide();
          let firstName = $('#form-edit [name="firstName"]').val();
          let lastName = $('#form-edit [name="lastName"]').val();
          let companyName = $('#form-edit [name="companyName"]').val();

          data.attendees.firstName = firstName;
          data.attendees.lastName = lastName;
          data.attendees.mobileNumber =
            $(".countryMobile").val().replace("+", "") +
            $('#form-edit [name="mobileNumber"]').val();
          data.attendees.designation = $(
            '#form-edit [name="designation"]'
          ).val();
          data.attendees.companyName = companyName;
          data.attendees.prcNumber = $('#form-edit [name="prcNumber"]').val();
          data.attendees.prcExpiry = $('#form-edit [name="prcExpiry"]').val();

          let { qrCode, middleName, tnNumber } = data.attendees;
          printSticker({
            qrCode,
            firstName,
            lastName,
            middleName,
            tnNumber,
            companyName,
          });

          formEdit[0].reset();
          $("#noPrc").change();
          $("#isStudent").change();
          // if($('#searchScanQr [name="qrCode"]').val()){
          //   $("#searchScanQr").submit()
          // }else{
          //   $("#search").submit()
          // }
        },
        error: function (err) {
          console.log(err);
          if (err.status == 502) {
            Swal.fire(
              "Account Login Full",
              "Please logout other WORLDBEX. Login.",
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
          } else if (
            err.status == 400 &&
            err.responseJSON.message == "Invalid parameters"
          ) {
            let { stack } = err.responseJSON;
            if (stack.length > 1) {
              let followingErr = stack
                .map(({ msg, value }) => `<li>${msg} : ${value}</li>`)
                .join("");
              Swal.fire({
                title: "Invalid Information",
                html: `
                    <h4>the following is not valid :</h4>
                    <ul>
                    ${followingErr}
                    </ul>
                  `,
                icon: "warning",
              });
            } else {
              Swal.fire(
                stack[0].msg,
                `"${stack[0].value}" is not valid.`,
                "warning"
              );
            }
          } else {
            if (err.responseJSON.message != "No record found.") {
              Swal.fire("Warning", err.responseJSON.message, "warning");
            } else {
              Swal.close();
            }
          }
        },
      });
    });
  },
});
