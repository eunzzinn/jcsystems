$(document).ready(function() {

// *****COMMON*****

    // GNB 스크롤 동작
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        const st = window.scrollY;
        if (st === 0) {
            header.classList.remove('scrolled');
            header.classList.remove('visible');
        }
        // 스크롤을 내릴 경우
        else if (st > lastScrollTop) {
            header.classList.add('scrolled');
            header.classList.remove('visible');
        }
        // 스크롤을 올릴 경우
        else {
            header.classList.remove('scrolled');
            header.classList.add('visible');
        }
        lastScrollTop = st <= 0 ? 0 : st;
    });

    //모바일 GNB-Product 메뉴 애니메이션
    $('.gnb-header .close-btn').click(function() {
        $('.nav-mo-container').fadeOut(300);
    });
    $('.nav-mo .menu').click(function() {
        $('.nav-mo-container').fadeIn(300); // 300ms 동안 서서히 나타남
    });

    $('.has-submenu').click(function(e) {
        // 기본 링크 동작 방지 (<a> 태그 클릭 시 페이지 이동 방지)
        e.preventDefault();
        $(this).find('.submenu').slideToggle(300);
        $(this).toggleClass('active');

        // 다른 열려있는 서브메뉴 닫기 (선택 사항)
        // 현재 클릭된 메뉴가 아닌 다른 .has-submenu의 .submenu를 닫고 active 클래스 제거
        $('.has-submenu').not(this).find('.submenu').slideUp(300);
        $('.has-submenu').not(this).removeClass('active');
    });

    $('.submenu a').click(function(e) {
        // 이벤트 버블링(전파)을 막아 상위 .has-submenu의 click 이벤트가 실행되지 않게 함
        e.stopPropagation();
    });

// ***** 탑 버튼 *****
    $('.scroll-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

});
