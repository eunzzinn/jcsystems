$(document).ready(function() {
    // 네비게이션 아이템 클릭 시
    $(".nav-item").on('click', function(e) {
        e.stopPropagation(); // 이벤트 버블링 중단

        // 현재 클릭한 아이템
        let $currentItem = $(this);
        // 현재 클릭한 아이템의 드롭다운
        let $currentDropdown = $currentItem.children(".dropdown");

        // 1. 현재 클릭한 아이템의 드롭다운과 화살표 처리
        $currentDropdown.slideToggle(200);
        $currentItem.toggleClass('active'); // active 클래스를 토글하여 화살표 방향 제어

        // 2. 다른 네비게이션 아이템 처리
        // .not(this)를 사용하여 현재 클릭한 요소를 제외한 나머지를 선택
        let $otherItems = $(".nav-item").not($currentItem);

        // 다른 아이템들의 드롭다운은 닫고,
        $otherItems.children(".dropdown").slideUp(200);
        // 다른 아이템들의 active 클래스는 제거하여 화살표를 원래 방향으로
        $otherItems.removeClass('active');
    });

    // 문서(페이지 전체)의 다른 곳을 클릭했을 때
    $(document).on('click', function() {
        // 모든 드롭다운을 닫고,
        $(".dropdown").slideUp(200);
        // 모든 네비게이션 아이템에서 active 클래스를 제거
        $(".nav-item").removeClass('active');
    });
});
