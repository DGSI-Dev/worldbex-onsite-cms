
$('.showPassword').on('click', function(){
  let btn = $(this)
  btn.find('i').toggle()
  input = btn.parent().find('input')
  input.attr('type',  input.attr('type') == 'password' ? 'text' : 'password' )
})

$("#login").validate({
  focusInvalid: true,
  errorElement: 'span',
  errorClass: 'help-block text-danger',
  errorPlacement: function(error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.insertBefore($(element).parent().parent().find('.input-group'));
    }
  },
  submitHandler: function (form) {
    var $form = $(form),
    params = $form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/api/visitor/login',
      data: params,
      dataType: 'JSON',
      beforeSend: function() {
        Swal.fire({
          title: "Checking...",
          text: "Please wait",
          imageUrl: "img/loading.gif",
          imageWidth: 300,
          imageHeight: 300,
          showConfirmButton: false,
          allowOutsideClick: false
        })
      },
      success: function(response){
        window.location.href = response.location
      },
      error: function(err){
        console.log(err)
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
    })
  }
})
