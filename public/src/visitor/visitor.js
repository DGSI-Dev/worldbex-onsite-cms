window.onbeforeunload = function() {
  return "Dude, are you sure you want to leave? Think of the kittens!";
}
function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };
$(document).on("keydown", disableF5);

let capitalizePhrase = (phrase) => {
  return phrase.replace(/\b\w/g, c => c.toUpperCase())
}

let formatStatusChar = (phrase, status) => {
  switch (status) {
    case 'LOWERCASE': {
      return phrase.toLowerCase()
    }
      break;
    case '1st LETTER CAPITAL': {
      return capitalizePhrase(phrase)
    }
      break;
    case 'NO FORMAT': {
      return phrase
    }
      break;
  
    default: {
      // UPPERCASE
      return phrase.toUpperCase()
    }
      break;
  }
}
  
$(function () {
  let eventList = []
  let currentEventId = ''
  let currentEvent
  let validData = []
  let inValidData = []
  
  $.ajax({
    type: 'GET',
    url: '/api/visitor/getEventVip',
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
      Swal.close()
      eventList = res
      res.forEach(({ eventId, imgSrc, name }) => {
        $(".eventId").append(`
          <option value="${eventId}" data-image="${imgSrc}">${ name }</option>
        `)
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
    }
  })

  let eventTitle = $(".eventTitle")
  
  const tableOptins = {
    columns: [
      { data: 'title', title: "Title", class: "text-capitalize" },
      { data: 'firstName', title: "First Name", class: "text-capitalize" },
      { data: 'lastName', title: "Last Name", class: "text-capitalize" },
      { data: 'email', title: "Email"},
      { data: 'mobileNumber', title: "Mobile", class: "text-capitalize" },
      { data: 'prcNumber', title: "PRC", class: "text-capitalize" },
      { data: 'prcExpiry', title: "PRC Expiry", class: "text-capitalize" },
      { data: 'companyName', title: "Company Name", class: "text-capitalize" },
      { data: 'designation', title: "Designation", class: "text-capitalize" },
    ],
  }

  const tableOptinsError = {
    columns: [
      { data: 'rowNumber', title: "Row Number"},
      { data: 'title', title: "Title", class: "text-capitalize" },
      { data: 'firstName', title: "First Name", class: "text-capitalize" },
      { data: 'lastName', title: "Last Name", class: "text-capitalize" },
      { data: 'email', title: "Email"},
      { data: 'mobileNumber', title: "Mobile", class: "text-capitalize" },
      { data: 'prcNumber', title: "PRC", class: "text-capitalize" },
      { data: 'prcExpiry', title: "PRC Expiry", class: "text-capitalize" },
      { data: 'companyName', title: "Company Name", class: "text-capitalize" },
      { data: 'designation', title: "Designation", class: "text-capitalize" },
    ]
  }

  let dataTableUploads = $('#dataTableUploads').DataTable(tableOptins);

  let dataTable = $('#dataTable').DataTable(tableOptins);

  let dataTableInvalid = $('#dataTableInvalid').DataTable(tableOptinsError);

  $(".eventId").on('change', function(value){
    if (value) {
      currentEventId = $(this).val()
      $('.eventDiv').toggle('slide')
      $('.scannerDiv').toggle('slide')
      eventTitle.text($(this).find('option:selected').text())
      $(".currentEventId").text($(this).val())
      
      currentEvent = eventList.find(({ eventId }) => eventId = currentEventId)
    }
    
    let sVIPInLocal = localStorage.getItem(currentEventId)
    if (sVIPInLocal) {
      let successtable = JSON.parse(sVIPInLocal)
      dataTableUploads.clear().rows.add(successtable).draw();
    }
    
  })
  $(".changeEvent").on('click', function(){
    $('.eventDiv').toggle('slide')
    $('.scannerDiv').toggle('slide')
  })
  
  let keys = [
    "title",
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "prcNumber",
    "prcExpiry",
    "attendDate",
    "companyName",
    "designation"
  ]

  const validateFileColumns = (data) => {
    if (data.length) {
      let errArr = [];
      keys.map((key) => {
        if(data[0].hasOwnProperty(key)) {
           errArr.push(true);
        } else {
          errArr.push(false);
        }
      });
      let dateErr = [];
      data.forEach((d) => {
        dateErr.push(true);
      });
      if (errArr.includes(false)){
        Swal.fire(
          "Invalid Data",
          `Please upload a file with valid data`,
          "warning"
        );
      } else {
        
        validData = []
        inValidData = []
        let successVIPInLocal = localStorage.getItem(currentEventId)
        data.forEach((obj, i) => {
          let { firstName, lastName, companyName, title } = obj
          if (firstName.trim() && lastName.trim()) {

            obj.attendDate = currentEvent.dateSeries
            obj.title =  formatStatusChar(title, $("#set_title").val())
            obj.firstName = formatStatusChar(firstName, $("#set_firstName").val()) 
            obj.lastName = formatStatusChar(lastName, $("#set_lastName").val()) 
            obj.companyName = formatStatusChar(companyName, $("#set_companyName").val()) 
            
            if (successVIPInLocal) {
                let successVIPInsert = JSON.parse(successVIPInLocal)
                let isExist =  Boolean(successVIPInsert.find(({ firstName: sFN, lastName: sLN, companyName: sCN, title: sTitle }) =>  
                  sFN == firstName && sLN == lastName && sCN == companyName && sTitle == title
                ))
              if (!isExist) {
                validData.push(obj)
              }
            } else {
              validData.push(obj)
            }
            
          } else {
            if (firstName || lastName || companyName || title) {
              obj.rowNumber = i + 1
              inValidData.push(obj)
            }
          }
        })

        dataTable.clear().rows.add(validData).draw();

        dataTableInvalid.clear().rows.add(inValidData).draw();
        inValidData.length ? $(".hasInvalidData").show('slide') : $(".hasInvalidData").hide('slide') 
        inValidData.length ? $("#uploadDataToCloud").hide('slide') : $("#uploadDataToCloud").show('slide') 
        Swal.close();
      }

    } else {
      Swal.fire("No data available", `Please check your file`, "warning");
    }
  }

  $("#upload").on('click', function () {
    if (currentEventId) {
      $(".hasInvalidData").hide('slide')
      dataTable.clear().draw();
      dataTableInvalid.clear().draw();
      var fileInput = document.getElementById('fileUpload');
      var filePath = fileInput.value;
      if (filePath) {
        // Allowing file type
        var allowedExtensions = /(\.xlsx|\.csv|\.xls)$/i;
    
        if (!allowedExtensions.exec(filePath)) {
          Swal.fire('Invalid File Type', 'EXCEL(.xlsx) and CSV(.csv) files are only allowed','warning')
          fileInput.value = '';
          return false;
        } else {
          if (typeof (FileReader) != "undefined") {
            Swal.fire({
              title: "Loading File",
              text: "Please wait...",
              imageUrl: "img/loading.gif",
              imageWidth: 200,
              imageHeight: 200,
              showConfirmButton: false,
              allowOutsideClick: false
            })
            var reader = new FileReader();
            if ($("#fileUpload").val().split(".").pop().toLowerCase() == "csv") {
              reader.onload = function (event) {
                var file = event.target.result;
                var data = $.csv.toObjects(file);
                validateFileColumns(data)
              }
              reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
              reader.onload = function (file) {
                let data = file.target.result;
                let workbook = XLSX.read(data, {
                  type: "binary",
                });
                workbook.SheetNames.forEach(function (sheetName) {
                  // Here is your object
                  let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                    defval: "",
                  });
                  validateFileColumns(data)
                });
              };
              reader.onerror = function (ex) {
                Swal.fire('Failed to upload file', 'Please try again', 'warning')
              };
              reader.readAsBinaryString($("#fileUpload")[0].files[0]);
            }
          } else {
            alert("This browser does not support HTML5.");
          }
        }
      } else {
        Swal.fire('No file Selected','Please select .xlsx or .csv file.', 'warning')
      }
    } else {
      Swal.fire('No Selected Event','Please select an event first.', 'warning')
    }
  })

  $("#fileUpload").on('click', function () {
     this.value = ''
  })
  
  function calculatePercent(given, counter){
    if(isNaN(given) || isNaN(counter)){
      return 0;
    }else{
      return ((counter/given) * 100).toFixed(0);
    }
  }

  $("#uploadDataToCloud").on('click', function () {
    let participants = validData
    if (inValidData.length && !currentEventId) {
      if (inValidData.length) {
        Swal.fire({
          title: 'Unable to Upload',
          html: 'Please remove/fix invalid data.<br>The row requires any one of the ff: First Name, Last Name, Company Name',
          icon: 'warning',
          allowOutsideClick: false,
          confirmButtonText: 'CLOSE',
          confirmButtonColor: '#df731b',
        })
      } else {
        Swal.fire({
          title: 'Unable To Proceed',
          html: 'Please select an event.',
          icon: 'warning',
          allowOutsideClick: false,
          confirmButtonText: 'CLOSE',
          confirmButtonColor: '#df731b',
        })
      }
      
    } else {

      let successVIPInsert = []
      let successVIPInLocal = localStorage.getItem(currentEventId)
      if (successVIPInLocal) {
        successVIPInsert = JSON.parse(successVIPInLocal)
        participants = participants.filter(({ firstName, lastName, companyName, title }) => {
          let isExist =  Boolean(successVIPInsert.find(({ firstName: sFN, lastName: sLN, companyName: sCN, title: sTitle }) =>  
            sFN == firstName && sLN == lastName && sCN == companyName && sTitle == title
          ))
          return !isExist
        })
      }

      
      if (participants.length) {
        
        Swal.fire({
          title: 'UPLOAD DATA',
          html: `Are you sure? <br> Please ckeck the battery and do not turn off/restart computer or reload your browser while uploading.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#df731b',
          reverseButtons: true,
          confirmButtonText: 'PROCEED',
          cancelButtonText: 'CANCEL'
        }).then((result) => {
          if (result.value) {
            //setting variables
            var participantsLength = participants.length, counter = 0, success = [],  failed = [], progress = 0;
            
            Swal.fire({
              title: "Uploading...",
              html: `
                <h5>Do not turn off computer.<br> Please wait...</h5>
                <div class="progress" id="forceSyncProgress">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                  role="progressbar" 
                  style="width: 0%" 
                  aria-valuenow="10" 
                  aria-valuemin="0" 
                  aria-valuemax="100">
                  0%
                  </div>
                </div>
                <br>
                  <div class="border rounded border-secondary text-left w-100" id="forceSyncLogsDiv">
                    <label>Logs: </label><br>
                    <ul id="forceSyncLogs" style="max-height:400px; overflow-y: scroll"></ul>
                  </div>
              `,
              imageUrl: "img/loading.gif",
              imageWidth: 200,
              imageHeight: 200,
              showConfirmButton: false,
              allowOutsideClick: false
            })
  
            $("#forceSyncLogs").empty()
            
            progress = calculatePercent(participantsLength, counter)
            $("#forceSyncProgress div").css('width',progress+'%').text(progress+'%')
            
            function getData()
            {
              function validateCounter(status, message){
                $("#forceSyncLogs").append(`
                  <li class="text-${status ? 'secondary' : 'danger'}">
                  <span class="text-capitalize">
                    ${ [ participants[counter].title, participants[counter].firstName, participants[counter].lastName ].join(" ").trim() ?? participants[counter].companyName }
                  </span> : ${ message }</small></li>`)
                counter++;
                progress = calculatePercent(participantsLength, counter)
  
                $("#forceSyncProgress div")
                .css('width',progress+'%')
                .text(progress+'%')
                .removeClass(!status ? 'bg-success' : 'bg-danger')
                .addClass(status ? 'bg-success' : 'bg-danger');
  
                if (counter < participantsLength) {
                  getData()
                }else{
                  setTimeout(() => {
                    dataTableUploads.clear().rows.add(successVIPInsert).draw();
                    Swal.fire({
                      title: 'Upload Results',
                      html: `
                        <label>Total Upload List</label> : <h6>${participants.length}</h6>
                        <label>Success</label> : <h6>${success.length}</h6>
                        <label>Failed</label> : <h6>${failed.length}</h6>
                        `+
                      `<small><div class="border rounded border-secondary text-left w-100" id="resultForceSyncLogs">
                        ${$('#forceSyncLogsDiv').html()}
                      </div></small>`
                      ,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'CLOSE',
                      confirmButtonText: 'RETRY',
                      cancelButtonText: 'DISMISS',
                      confirmButtonColor: '#df731b',
                      reverseButtons: true,
                      allowOutsideClick: false
                    }).then((result) => {
                      if (result.value) {
                        Swal.fire({
                          title: 'RETY',
                          text: 'Submit all unsuccessfull account?',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'CANCEL',
                          confirmButtonText: 'PROCEED',
                          cancelButtonText: 'DISMISS',
                          confirmButtonColor: '#df731b',
                          reverseButtons: true,
                          allowOutsideClick: false
                        }).then((result) => {
                          if (result.value) {
                            participants = failed
                            $("#uploadDataToCloud").click()
                          }
                        })
  
                      } else {
                        //CLEAR ALL
                        participants = []
                        counter = 0
                        success = []
                        failed = []
                        progress = 0
                        
                        dataTable.clear().draw();
                        dataTableInvalid.clear().draw();
                        $('#fileUpload').val('')
                        $("#uploadDataToCloud").hide('slide')
                        $(".hasInvalidData").hide('slide')      
                        validData = []
                        inValidData = []
                      }
                    })
                  }, 1000);
                };
              }

              $.ajax({
                type:'POST',
                url: '/api/visitor/createEventVisitorTransaction',
                data: {
                  eventId: currentEventId,
                  attendees: [ participants[counter] ]
                },
                async: true,
                dataType: 'JSON',
                success: function (response) {
                  
                  successVIPInsert.push(participants[counter])
                  localStorage.setItem(currentEventId, JSON.stringify(successVIPInsert))

                  success.push(participants[counter])
                  validateCounter(true, response.message)
                  

                }, error: function(err){
                  console.log(err)
                  failed.push(participants[counter])
                  var errMessage = ''
                  if(err.responseJSON){
                    errMessage = err.responseJSON.stack ? err.responseJSON.stack.split("\n")[0] : err.responseJSON.message
                  } else if (err.status == 500) { 
                    errMessage = err.responseText ? JSON.parse(err.responseText).stack.split("\n")[0] : JSON.parse(err.responseText).message
                  } else {
                    errMessage = err.statusText
                  } 
                  validateCounter(false, errMessage)
                }
              });
              
            }
            
            getData()
  
          }
        })
      } else {
        Swal.fire({
          title: 'No more to upload',
          html: 'All data might be uploaded already. Please try again.',
          icon: 'warning',
          allowOutsideClick: false,
          confirmButtonText: 'CLOSE',
          confirmButtonColor: '#df731b',
        })
      }


    }
  })
});