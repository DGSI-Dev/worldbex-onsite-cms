
var refBarangay = [];
var refCity     = [];
var refProvince = [];
var refRegion   = [];

let addressFunctions = ()=>{
  // UTILS
  var getProvince = function(code) {
   return refProvince.filter(obj => obj.regCode == code)
 }
 var getCity = function(code) {
 return refCity.filter(obj => obj.provCode == code)
 }
 var getBrgy = function(code) {
 return refBarangay.filter(obj => obj.citymunCode == code)
 }

 var clear = (type) => {
    switch(type) {
      case 'region': {
        $(".region option [value='']").attr('selected', true)
      }
      case 'province': {
        $('.province').html('')
        $('.province').append(`<option value=''>Select Province</option`)
      }
      case 'city': {
        $('.city').html('')
        $('.city').append(`<option value=''>Select City</option`)
      }
      case 'brgy': {    
        $('.brgy').html('')
        $('.brgy').append(`<option value=''>Select Barangay</option`)
      }
    }
  }
 $(".region").on('change', function() {
   clear('province')
   getProvince($(this).find('option:selected').attr("name")).map(obj => {
     $(this).closest('form').find('.province').append(`<option value='${ obj.provCode }' name='${obj.provCode}'>${ obj.provDesc }</option>`)
   })
 })
 $(".province").on('change', function() {
   clear('city')
   getCity($(this).find('option:selected').attr("name")).map(obj => {
      $(this).closest('form').find('.city').append(`<option value='${ obj.citymunCode }' name='${obj.citymunCode}'>${ obj.citymunDesc }</option>`)
   })
 })
 $(".city").on('change', function() {
   let city = $('.city option:selected').val();
   $("#loadingAddress").show()
   let cityform = $(this)
   if(city == 137607){
     $.ajax({
       url: 'address/taguigBrgy.json',
       type:'GET',
       success:function (success) {
         success.sort(function(a, b){
           if(a.brgyDesc < b.brgyDesc) { return -1; }
           if(a.brgyDesc > b.brgyDesc) { return 1; }
           return 0;
         })
  
         let v = success.filter(i=>i.citymunCode === city)
         cityform.closest('form').find('.brgy').empty().append(
           '<option value="">Select Barangay</option>'+
           v.map(obj=>{
             return `<option value="${obj.brgyCode}">${obj.brgyDesc}</option>`
           })
         )
         $("#loadingAddress").hide()
       }
     })
   }else{
    clear('brgy')
    getBrgy(city).map(obj => {
       cityform.closest('form').find('.brgy').append(`<option value='${ obj.brgyCode }' name='${obj.brgyCode}'>${ obj.brgyDesc }</option>`)
    })
    $("#loadingAddress").hide()

   }
 })
}

let addressStorage = localStorage.getItem('address');
if(addressStorage){
  let address = JSON.parse(addressStorage)
  refRegion = address.region
  refProvince = address.province
  refCity = address.city
  // refBarangay = address.barangay

  refRegion.map((obj, i) => {
    if(obj.regDesc) $(".region").append(`<option value='${ obj.regCode }' name='${obj.regCode}'>${ obj.regDesc }</option>`)
  })
  addressFunctions()
}else{
  $.when(
    $.ajax({
      type: 'GET',
      url: 'address/refregion.json',
      success: function(res){
        if(res){
          if(res.length){
            refRegion = res.sort(function(a, b){
              if(a.regDesc < b.regDesc) { return -1; }
              if(a.regDesc > b.regDesc) { return 1; }
              return 0;
            })
            refRegion.map((obj, i) => {
              if(obj.regDesc) $(".region").append(`<option value='${ obj.regCode }' name='${obj.regCode}'>${ obj.regDesc }</option>`)
            })
          }else{
            $(".registerModal").css('display','none')
            Swal.fire('No Approved Location','Registration is temporarily not available.<br> Please try again later.','info')
          }
        }else{
            $(".registerModal").css('display','none')
            Swal.fire('No Approved Location','Registration is temporarily not available.<br> Please try again later.','info')
          }
      }
    }),
    $.ajax({
      type: 'GET',
      url: 'address/refprovince.json',
      success: function(res) {
        refProvince = res.sort(function(a, b){
          if(a.provDesc < b.provDesc) { return -1; }
          if(a.provDesc > b.provDesc) { return 1; }
          return 0;
        })

      }
    }),
    $.ajax({
      type: 'GET',
      url: 'address/refcitymun.json',
      success: function(res) {
        refCity = res.sort(function(a, b){
          if(a.citymunDesc < b.citymunDesc) { return -1; }
          if(a.citymunDesc > b.citymunDesc) { return 1; }
          return 0;
        })
      }
    }),
    // $.ajax({
    //   url:'address/refbrgy.json',
    //   type:'GET',
    //   success:function (success) {
    //     refBarangay = success.sort(function(a, b){
    //       if(a.brgyDesc < b.brgyDesc) { return -1; }
    //       if(a.brgyDesc > b.brgyDesc) { return 1; }
    //       return 0;
    //     })
    //   }
    // }),
  ).then(function(){
   let ifLoaded = setInterval(() => {
     if(
      refRegion.length &&
      refProvince.length &&
      refCity.length &&
      refBarangay.length
     ){
       localStorage.setItem('address', 
         JSON.stringify({ 
           region: refRegion,  
           province: refProvince,  
           city: refCity,  
           barangay: refBarangay,  
         }) 
       );
       clearInterval(ifLoaded)
     }
   }, 1000);
    addressFunctions()
  })
}
 

