  
  // $(':input[required]:visible').parent().find('label').append(' <span class="text-danger">*</span>')

  window.onload = () => {
    const mobileNum = document.getElementsByName('mobileNumber');
    mobileNum.onpaste = e => e.preventDefault();
    const passwordform = document.getElementsByName('password');
    passwordform.onpaste = e => e.preventDefault();
    // const confirmpass = document.getElementsByName('confirmPassword');
    // confirmpass.onpaste = e => e.preventDefault();
  }

  $('.showPassword').on('click', function(){
    let btn = $(this)
    btn.find('i').toggle()
    input = btn.parent().find('input')
    input.attr('type',  input.attr('type') == 'password' ? 'text' : 'password' )
  })
  
  $('[name="mobileNumber"], .prcNumber').keyup(function () {
    if(this.value){
      this.value = this.value.replace(/[^0-9\.]/g,'');
    }
  });

  $('#noMname').on('change',function () {
    let exp = $('[name="middleName"]')
    if($(this).prop('checked')){
      exp.prop('disabled', true)
      exp.val('N/A')
    }else{
      exp.prop('disabled', false)
      exp.val('')
    }
  });

  $('[name="designation"]').on('input change', function () {
    let val = $(this).val()?.toLowerCase()
    if (val.includes('student')) {
      $('#isStudent').click()    
    }
  })

  $('#isStudent').on('change',function () {
    let designation = $('[name="designation"]')
    let companyName = $('[name="companyName"]')
    if($(this).prop('checked')){
      designation.prop('disabled', true)
      designation.val('Student')
      companyName.parent().find('label').text('School Name')
      companyName.prop('placeholder', 'School Name')
    }else{
      designation.prop('disabled', false)
      designation.val('')
      companyName.parent().find('label').text('Company')
      companyName.prop('placeholder', 'Company')
    }
  });

  $('.noPrc').on('change click',function () {
    let exp = $(this).closest('form').find('.prcNumber, [name="prcExpiry"]')
    if($(this).prop('checked')){
      exp.prop('disabled', true)
      exp.val('N/A')
    }else{
      exp.prop('disabled', false)
      exp.val('')
    }
  });

  function getAge(bday){
    return moment().diff(moment(bday),'years')
  }

  $.validator.addMethod("email", function(value, i) {
    let val = value.trim()
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(val)
    // if(val){
    //   return  val
    // }
    // else {
    //   return false
    // }
    
  //  $(i).val(val)
    //return /^[A-Za-z0-9@.' \-]+$/.test(value);
  });

  $.validator.addMethod("prcExpiry", function(value) {
    if(value){
      let curDate = moment(value)
      if(curDate.isAfter( seminarInfo.dateFrom ) ){
        return true
      } else{
        return false
      } 
    }else{
      return true
    }
  });
  $.validator.addMethod("checkspclkey", function(value) {
    return /[.~!@#$%^&*()_+=]/.test(value);
  });
  $.validator.addMethod("checklower", function(value) {
    return /[a-z]/.test(value);
  });
  $.validator.addMethod("checkupper", function(value) {
    return /[A-Z]/.test(value);
  });
  $.validator.addMethod("checkdigit", function(value) {
    if(value){
      return /[0-9]/.test(value);
    }else{
      return true
    }
  });
  $.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[A-Z]/.test(value);
  });


  $.validator.addMethod("mobileNumber", function(value) {
    if(value){
      // return /^(09|08|07)\d{9}$/.test(value);
      return /^()\d{10}$/.test(value);
    } else{
      return false
    } 
  });

  $.validator.addMethod("acceptedChars", function(value) { 
    if(value.trim()){
      return /^[A-Za-z ñÑ.' \-]+$/.test(value);
    }else{
      return false
    } 
  });

  $.validator.addMethod("middleName", function(value) {
      if(value.trim()){
      if(!/^\s*$/.test(value)){
        return /^[A-Za-z ñÑ.' \-]+$/.test(value);
      }else{
        return true
      }
    }else{
      return true
    }
  });

  $.validator.addMethod("fname", function(value) {
    if(value.trim()){
      return /^[A-Za-z ñÑ.' \-]+$/.test(value);
    }else{
      return false
    }
  });

  let currAge = 0
  $.validator.addMethod("checkAge", function(value) {
    var age = moment().diff(value,'years')
    currAge = age
    if(age > 150 || age < 5){
      return false
    }else{
      return true
    }
  });
  
  $.validator.addMethod("username", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value);
  });

  $.validator.addMethod("password", function(value) {
    if(value.length >= 5 && value.length<= 30){
      return true
    }else{
      return false
    }
  });
  $.validator.addMethod("passwordChars", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value);
  });

  $('[name="birthdate"]').on('change', function(){
    let age = getAge($(this).val())
    if(age >= 5 &&  age <= 18){
      $(".contactPerson").show('slide')
    }else{
      $(".contactPerson").hide('slide')
    }
  })

