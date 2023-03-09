let pageName = $("#pageName").text()
var pchild = $("#pagechild").text()

$(".sidenav").removeClass("activeSideBar")
if(pchild){
  $(".sidenav").find(`a:contains("${pageName}")`).closest('li').addClass('activeSideBar')
  $(".sidenav").find(`a:contains("${pageName}")`).closest('li').addClass('menu-open')
  $(".sidenav").find(`a:contains("${pchild}")`).closest('li').addClass('activeSideBarChild')
}else{
  $(".sidenav").find(`a:contains("${pageName}")`).closest('li').addClass('activeSideBar')
}