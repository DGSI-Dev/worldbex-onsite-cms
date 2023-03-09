$(function () {
  $.when(
    $.ajax("/src/utilities/mobileCountryCodes.js"),
    // $.ajax("/src/utilities/loadCountries.js"),
    $.ajax("/src/utilities/loadAddress.js"),
    $.ajax("/src/utilities/basicInfoValidation.js")
  ).then(function () {
    $.when(
      $.ajax("/src/onsite/registration/constants.js"),
      $.ajax("/src/onsite/registration/getEventInfo.js")
    );
  });
});

// const printSticker = ({ qrCode, firstName, lastName, companyName }) => {
//   let qrValue = [qrCode,firstName?.trim(), lastName?.trim(), eventInfo.eventTag, "O"].join(":")
//   $(".qrCode").empty().qrcode( qrValue ,85,85)
//   let exName = [firstName, lastName].join(" ")
//   let fullName =  Boolean(exName.trim()) ? exName.toLocaleUpperCase() : companyName
//   $('.stickerId').text(qrCode)
//   $('.fullName').text(fullName)
//   $('.companyName').text(Boolean(exName.trim()) ? companyName : '')
//   Swal.close()
//   $('.stickerDiv').printThis({
//     importCSS: true,
//     canvas: true,
//     removeInlineSelector: "*",
//     removeInline: false,
//     printDelay: 300
//   })
// }
// printSticker({qrCode: '2022L5I1RW3F0712', firstName:"LEO", lastName: 'SALONGA', companyName: 'Worldbex Services International'})
