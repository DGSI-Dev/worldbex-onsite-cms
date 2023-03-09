
$('#logout').click(function(){
  Swal.fire({
    title: 'Logout',
    text: "Do you want to log out?",
    icon: 'info',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: '#df731b',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: 'POST',
        url: '/api/citizen-vip-sign-out',
        success: function (response) {
          window.location.href = '/vip'
        },
        error: function (response) {
          alert(response.responseText)
        }
      })
    }
  })
  
})
