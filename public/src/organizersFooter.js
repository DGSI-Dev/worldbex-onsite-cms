
let organizersLogo = [
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS2.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS3.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS4.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS5.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS6.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS7.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS8.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS9.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS10.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS11.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS12.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS13.png",
  "2022 WSI WEBSITE REGISTRATION DGSI EVENT LOGOS14.png",
] 

$(".organizers").append(
  ( organizersLogo.map(obj=>{
    return `<img class="organizersImage" src="../img/logos/events/${obj}" alt="" style="
    width: 65px;
    height: 65px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }">`
  }).join("") )
)
$(".organizersImage").hover(
  function(){
    $(this).css({
      '-ms-transform': 'scale(1.5)',
      '-webkit-transform': 'scale(1.5)',
      'transform': 'scale(1.5) translateY(-10px)',
      'cursor': 'pointer',
      'transition': 'transform .2s'
    })
    $(this).next().css({
      '-ms-transform': 'scale(1.1)',
      '-webkit-transform': 'scale(1.1)',
      'transform': 'translateY(-3px)',
      'cursor': 'pointer',
      'transition': 'transform .5s'
    })
    $(this).prev().css({
      '-ms-transform': 'scale(1.1)',
      '-webkit-transform': 'scale(1.1)',
      'transform': 'translateY(-3px)',
      'cursor': 'pointer',
      'transition': 'transform .5s'
    })
    
  },
  function() {
    $('.organizersImage').css({
      '-ms-transform': 'scale(1)',
      '-webkit-transform': 'scale(1)',
      'transform': 'scale(1)',
      'transform': 'translateY(0)',
    })
  }
)

var myModal = new bootstrap.Modal(document.getElementById('imgPreview'))
$('.organizersImage').on('click hover', function(){
  myModal.show()
  let img = $(this).clone()
  $("#imgPreview .modal-body").empty().append(img)
  $("#imgPreview .modal-body").find('img').css({width: '100%', height: 'auto'})
})