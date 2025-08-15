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


    // *****MAIN*****

    const slides = document.querySelectorAll('.main-slide');
const prevBtn = document.querySelector('.main-slider .prev');
const nextBtn = document.querySelector('.main-slider .next');
const pauseBtn = document.querySelector('.pause-resume');
const progress = document.querySelector('.progress');

let current = 0;
let playing = true;
let timeout; // setInterval 대신 setTimeout 사용
let startTime; // 타이머 시작 시간
const slideDuration = 5000; // 슬라이드 전환 시간 (5초)

function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    current = index;

    // 프로그레스 바를 처음부터 다시 시작
    progress.style.transition = 'none'; // 애니메이션 중지
    progress.style.width = '0%'; // 너비 0%로 리셋

    // 다음 프레임에서 애니메이션 다시 시작
    // 이렇게 하면 너비가 0%로 즉시 리셋된 후 100%로 부드럽게 애니메이션이 시작됩니다.
    setTimeout(() => {
        if (playing) {
            progress.style.transition = `width 5s linear`; // 슬라이드 시간에 맞춰 transition 설정
            progress.style.width = '100%';
            startAutoSlide(); // 다음 슬라이드 타이머 재설정
        }
    }, 10);
}

function nextSlide() {
    clearTimeout(timeout); // 기존 타이머 중지
    showSlide((current + 1) % slides.length);
}

function prevSlide() {
    clearTimeout(timeout); // 기존 타이머 중지
    showSlide((current - 1 + slides.length) % slides.length);
}

function startAutoSlide() {
    clearTimeout(timeout);
    startTime = Date.now();
    timeout = setTimeout(nextSlide, slideDuration);
}

function stopAutoSlide() {
    clearTimeout(timeout);
    const elapsedTime = Date.now() - startTime;
    const remainingTime = slideDuration - elapsedTime;

    // 프로그레스 바의 너비를 현재 진행 상태로 유지
    const currentWidth = (elapsedTime / slideDuration) * 100;
    progress.style.transition = 'none';
    progress.style.width = `${currentWidth}%`;

    // 일시정지 상태를 유지하기 위해 remainingTime 저장
    return remainingTime > 0 ? remainingTime : 0;
}

pauseBtn.addEventListener('click', () => {
    playing = !playing;
    const pauseBtnImg = pauseBtn.querySelector('img');

    if (playing) {
        // 재생 상태일 때
        pauseBtnImg.src = 'img/main/ico-pause.svg';
        // 프로그레스 바 애니메이션 재개
        const remainingTime = parseFloat(progress.style.width) > 0 ?
            slideDuration * (1 - parseFloat(progress.style.width) / 100) : slideDuration;

        timeout = setTimeout(nextSlide, remainingTime);

        progress.style.transition = `width ${remainingTime / 1000}s linear`;
        progress.style.width = '100%';

    } else {
        // 일시정지 상태일 때
        pauseBtnImg.src = 'img/main/ico-play.svg';
        clearTimeout(timeout);
        // 프로그레스 바의 현재 상태를 유지하고 애니메이션 중지
        const elapsedTime = Date.now() - startTime;
        const currentWidth = (elapsedTime / slideDuration) * 100;
        progress.style.transition = 'none';
        progress.style.width = `${currentWidth}%`;
    }
});

nextBtn.addEventListener('click', () => {
    // 수동으로 슬라이드 넘길 때도 타이머 리셋
    clearTimeout(timeout);
    nextSlide();
    if(playing) {
        startAutoSlide();
    }
});

prevBtn.addEventListener('click', () => {
    // 수동으로 슬라이드 넘길 때도 타이머 리셋
    clearTimeout(timeout);
    prevSlide();
    if(playing) {
        startAutoSlide();
    }
});

showSlide(0);
startAutoSlide();

    // 솔루션 슬라이더
    const productSlider = document.getElementById('productSlider');
    let productIndex = 0;

    function nextproductSlide() {
        productIndex = (productIndex + 1) % 3;
        productSlider.style.transform = `translateX(-${productIndex * 100}%)`;
    }
    setInterval(nextproductSlide, 5000);

    // 탑 버튼
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
