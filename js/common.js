$(document).ready(function() {

    //AOS
    AOS.init({
        duration: 800, // 애니메이션 지속 시간 (밀리초)
        easing: 'ease-in-out', // 애니메이션의 이징 함수
        delay: 100, // 애니메이션 지연 시간 (밀리초)
        offset: 120, // 스크롤 감지의 시작 위치 (픽셀)
    });

    //스크롤 효과
    const lenis = new Lenis({
        // 추가된 부분
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', (e) => {
        console.log(e)
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)


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

    //PC GNB-Product 메뉴 오픈

    function navHoverEvent() {
        if ($(window).width() >= 1025) {
            $("nav").off("mouseenter mouseleave").hover(
                function() {
                    $(".nav-pc-product").stop(true, true).slideDown(200);
                    $(this).parent().addClass("visible");
                },
                function() {
                    $(".nav-pc-product").stop(true, true).slideUp(200);
                    $(this).parent().removeClass("visible");
                }
            );
        } else {
            $("nav").off("mouseenter mouseleave"); // 모바일 등 작은 화면일 때 이벤트 제거
        }
    }

    // 처음 로드할 때 실행
    navHoverEvent();

    // 리사이즈 시에도 반응
    $(window).resize(function() {
        navHoverEvent();
    });



    // ***** 탑 버튼 *****
    $('.scroll-top').click(function(e) {
        e.preventDefault();
        lenis.scrollTo(0, {
            duration: 1.5, // 부드럽게 올라가는 시간 (초 단위)
            easing: (t) => 1 - Math.pow(1 - t, 3), // 원하는 easing
        });
    });


    //***** scroll 좌우 드래그 *****
    const slider = $('.touch-drag'); // 스크롤 컨테이너 선택
    let isDown = false; // 마우스 클릭 상태
    let startX; // 클릭 시 마우스의 X좌표
    let scrollLeft; // 클릭 시 현재 스크롤 위치

    // 1. 마우스를 눌렀을 때
    slider.on('mousedown', function(e) {
        isDown = true;
        slider.css('cursor', 'grabbing'); // 드래그 중임을 나타내는 커서로 변경
        startX = e.pageX - slider.offset().left;
        scrollLeft = slider.scrollLeft();
    });

    // 2. 마우스를 떼거나, 영역을 벗어났을 때
    slider.on('mouseleave mouseup', function() {
        isDown = false;
        slider.css('cursor', 'grab'); // 원래 커서로 복귀
    });

    // 3. 마우스를 누른 채로 움직일 때
    slider.on('mousemove', function(e) {
        if (!isDown) return; // 마우스를 누르지 않았다면 실행 중지
        e.preventDefault(); // 기본 드래그 동작(텍스트 선택 등) 방지
        const x = e.pageX - slider.offset().left;
        const walk = (x - startX) * 2; // 마우스 이동 거리 (곱하는 숫자로 스크롤 속도 조절 가능)
        slider.scrollLeft(scrollLeft - walk);
    });


});
