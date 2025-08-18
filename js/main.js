$(document).ready(function() {

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

    // 강제로 리플로우(reflow)를 발생시켜 브라우저가 변경 사항을 즉시 렌더링하도록 함
    progress.offsetWidth; // 이 줄을 추가

    // 다음 프레임에서 애니메이션 다시 시작
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


// ***** PRODUCT SLIDER *****

    const productSlider = document.getElementById("productSlider");
    const productSlides = document.querySelectorAll(".product-slide");
    const productBtns = document.querySelectorAll(".product-btn");
    const numNow = document.querySelector(".now-num");

    const slideWidth = productSlides[0].offsetWidth;
    const slideGap = 20;
    const slidesPerView = 1;   //한 번에 1장씩 이동
    const autoDelay = 3000;
    const totalOriginal = productSlides.length;

    let productIndex = slidesPerView; // 복제 때문에 1부터 시작
    let productInterval;

    // 슬라이드 복제 (앞뒤에 더미 추가)
    const firstClones = [];
    const lastClones = [];

    for (let i = 0; i < slidesPerView; i++) {
      const firstClone = productSlides[i].cloneNode(true);
      const lastClone = productSlides[productSlides.length - 1 - i].cloneNode(true);
      firstClone.classList.add("clone");
      lastClone.classList.add("clone");
      firstClones.push(firstClone);
      lastClones.unshift(lastClone);
    }

    productSlider.append(...firstClones);
    productSlider.prepend(...lastClones);

    const allSlides = document.querySelectorAll(".product-slide"); // 복제 포함
    const totalSlides = allSlides.length;

    // 위치 세팅 + 숫자 업데이트
    function setProductSliderPosition(animate = true) {
      if (!animate) productSlider.style.transition = "none";
      else productSlider.style.transition = "transform 0.6s ease-in-out";

      const offset = -(productIndex * (slideWidth + slideGap));
      productSlider.style.transform = `translateX(${offset}px)`;

      // 원본 기준 인덱스로 숫자 업데이트
      let realIndex = productIndex - slidesPerView;
      if (realIndex < 0) realIndex = totalOriginal + realIndex;
      realIndex = realIndex % totalOriginal;
      numNow.textContent = (realIndex + 1).toString().padStart(2, "0"); // 01 ~ 06
    }

    // 다음 슬라이드
    function nextProductSlide() {
      productIndex++;
      setProductSliderPosition();

      if (productIndex === totalSlides - slidesPerView) {
        setTimeout(() => {
          productIndex = slidesPerView;
          setProductSliderPosition(false);
        }, 600);
      }
    }

    // 이전 슬라이드
    function prevProductSlide() {
      productIndex--;
      setProductSliderPosition();

      if (productIndex < slidesPerView) {
        setTimeout(() => {
          productIndex = totalSlides - slidesPerView * 2;
          setProductSliderPosition(false);
        }, 600);
      }
    }

    // 버튼 이벤트
    productBtns[0].addEventListener("click", () => {
      prevProductSlide();
      resetProductAutoSlide();
    });
    productBtns[1].addEventListener("click", () => {
      nextProductSlide();
      resetProductAutoSlide();
    });

    // 자동 슬라이드
    function startProductAutoSlide() {
      clearInterval(productInterval);
      productInterval = setInterval(nextProductSlide, autoDelay);
    }
    function resetProductAutoSlide() {
      clearInterval(productInterval);
      startProductAutoSlide();
    }

    // 초기 실행
    productIndex = slidesPerView;
    setProductSliderPosition(false);
    startProductAutoSlide();

});
