var baseURL = ''
$.ajax({
  type: 'GET',
  url: '/api/baseURL',
  dataType: 'JSON',
  success(res){
    baseURL = res.baseUrl
  },
  error(err){
    console.log(err)
  }
})