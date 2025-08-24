$(document).ready(function() {

// *****nav-bar*****
    $(".nav-item").click(function(e){
      e.stopPropagation(); // 클릭 이벤트 버블링 방지
      $(this).children(".dropdown").slideToggle(200);
      $(".nav-item").not(this).children(".dropdown").slideUp(200); // 다른 메뉴 닫기
    });

    // 바깥 클릭 시 닫기
    $(document).click(function(){
      $(".dropdown").slideUp(200);
    });
    

});
