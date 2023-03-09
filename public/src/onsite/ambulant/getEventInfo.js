$.ajax({
  type: 'GET',
  url: '/api/onsite/getEvents',
  dataType: 'JSON',
  beforeSend: function() {
    Swal.fire({
      title: "Loading Event",
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
    eventInfo = res.event[0]
    surveys = res.surveys
    $.when(
      $.ajax("/src/onsite/ambulant/survey.js"),
      $.ajax("/src/onsite/ambulant/register.js"),
    ) 

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
      if(err.responseJSON.message != "No record found."){
        Swal.fire('Warning', err.responseJSON.message, 'warning')
      }else{
        Swal.close()
      }
    }
  }       
})