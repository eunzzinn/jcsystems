$(document).ready(function () {
    // 상단 탭 클릭 이벤트
    $(".top-tab button").on("click", function () {
        var target = $(this).attr("onclick").match(/'(.*?)'/g)[0].replace(/'/g, ""); // ex) Rexnord, Raeder

        // 상단 탭 active 처리
        $(".top-tab button").removeClass("active");
        $(this).addClass("active");

        // 해당 콘텐츠 보이기
        $(".tabcontent").hide();
        $("#" + target).show();

        // 보이는 콘텐츠 안에서 첫번째 하위 탭 강제 활성화
        $("#" + target)
            .find(".sub-tab button")
            .removeClass("active")
            .first()
            .addClass("active");

        // 첫번째 하위 콘텐츠 보이기
        $("#" + target)
            .find(".sub-tabcontent")
            .hide()
            .first()
            .show();
    });

    // 하위 탭 클릭 이벤트
    $(".sub-tab button").on("click", function () {
        var parentTab = $(this).attr("onclick").match(/'(.*?)'/g)[1].replace(/'/g, ""); // Rexnord or Raeder
        var subTab = $(this).attr("onclick").match(/'(.*?)'/g)[0].replace(/'/g, ""); // Hyundai or Kia

        // 하위 탭 active 처리
        $("#" + parentTab)
            .find(".sub-tab button")
            .removeClass("active");
        $(this).addClass("active");

        // 하위 콘텐츠 보이기
        $("#" + parentTab)
            .find(".sub-tabcontent")
            .hide();
        $("#" + subTab + "-" + parentTab).show();
    });






});



