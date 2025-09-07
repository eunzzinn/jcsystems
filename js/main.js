$(document).ready(function() {


    // ***** MAIN SLIDER (3장, 진행바 이어서 재생, 좌/우/일시정지) *****

    $(function() {
        const slides = [...document.querySelectorAll(".main-slide")];
        const prevBtns = document.querySelectorAll(".nav-btn.prev");
        const nextBtns = document.querySelectorAll(".nav-btn.next");
        const pauseBtns = document.querySelectorAll(".pause-resume");

        const DURATION = 5000; // 5s
        let idx = 0;
        let timer = null;
        let isPaused = false;
        let startTime = 0;
        let elapsed = 0; // ms (현재 슬라이드에서 경과한 시간)

        const barOf = (i) => slides[i].querySelector(".progress");

        const updatePauseIcons = () => {
            pauseBtns.forEach((btn) => {
                const img = btn.querySelector("img");
                if (isPaused) {
                    img.src = "img/main/ico-play.svg";
                    img.alt = "재생";
                } else {
                    img.src = "img/main/ico-pause.svg";
                    img.alt = "일시정지";
                }
            });
        };

        const stopTimer = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };

        const go = (to, { keepElapsed = false } = {}) => {
            // 활성 슬라이드 전환
            slides.forEach((s, i) => s.classList.toggle("active", i === to));
            stopTimer();
            if (!keepElapsed) elapsed = 0;

            // 모든 바 리셋, 활성 슬라이드만 현재 상태로 세팅
            slides.forEach((s, i) => {
                const b = s.querySelector(".progress");
                b.style.transition = "none";
                b.style.width = i === to ?
                    (isPaused ? `${(elapsed / DURATION) * 100}%` : "0%") :
                    "0%";
            });

            // 재생 중이면 남은 시간만큼 진행바 + 자동 넘김
            if (!isPaused) {
                const remaining = Math.max(0, DURATION - elapsed);
                const b = barOf(to);
                // 다음 프레임에 transition 적용
                requestAnimationFrame(() => {
                    b.style.transition = `width ${remaining}ms linear`;
                    // 강제 리플로우로 transition 재적용 보장
                    void b.offsetWidth;
                    b.style.width = "100%";
                });
                startTime = Date.now();
                timer = setTimeout(() => {
                    elapsed = 0;
                    next();
                }, remaining);
            }

            idx = to;
        };

        const next = () => go((idx + 1) % slides.length);
        const prev = () => go((idx - 1 + slides.length) % slides.length);

        const pause = () => {
            if (isPaused) return;
            isPaused = true;
            elapsed += Date.now() - startTime;
            const b = barOf(idx);
            b.style.transition = "none";
            b.style.width = `${Math.min(100, (elapsed / DURATION) * 100)}%`;
            stopTimer();
            updatePauseIcons();
        };

        const resume = () => {
            if (!isPaused) return;
            isPaused = false;
            const remaining = Math.max(0, DURATION - elapsed);
            const b = barOf(idx);
            b.style.transition = `width ${remaining}ms linear`;
            void b.offsetWidth;
            b.style.width = "100%";
            startTime = Date.now();
            timer = setTimeout(() => {
                elapsed = 0;
                next();
            }, remaining);
            updatePauseIcons();
        };

        // 버튼 이벤트
        nextBtns.forEach((btn) =>
            btn.addEventListener("click", () => {
                const wasPaused = isPaused;
                go((idx + 1) % slides.length);
                if (wasPaused) updatePauseIcons(); // 일시정지 상태 유지(진행바는 0%에서 멈춘 채)
            })
        );

        prevBtns.forEach((btn) =>
            btn.addEventListener("click", () => {
                const wasPaused = isPaused;
                go((idx - 1 + slides.length) % slides.length);
                if (wasPaused) updatePauseIcons();
            })
        );

        pauseBtns.forEach((btn) =>
            btn.addEventListener("click", () => (isPaused ? resume() : pause()))
        );

        // 초기화
        go(0);
        updatePauseIcons();
    });





    // ***** PRODUCT SLIDER *****

    const productSlider = document.getElementById("productSlider");
    if (productSlider) {
        const sliderContainer = productSlider.parentElement;
        const originalSlides = Array.from(productSlider.querySelectorAll(".product-slide"));
        const productBtns = document.querySelectorAll(".product-btn");
        const numNow = document.querySelector(".now-num");

        const totalOriginal = originalSlides.length;
        const autoDelay = 3000;
        let productIndex = totalOriginal; // 시작 인덱스 (원본 슬라이드의 첫 번째)
        let productInterval;

        // 모든 슬라이드를 앞뒤로 복제하여 완벽한 무한 루프 구현
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            productSlider.appendChild(clone);
        });
        originalSlides.slice().reverse().forEach(slide => {
            const clone = slide.cloneNode(true);
            productSlider.prepend(clone);
        });

        const allSlides = document.querySelectorAll(".product-slide");

        // 슬라이더 위치를 설정하는 핵심 함수 (로직 전면 수정)
        function setProductSliderPosition(animate = true) {
            // 데스크톱 (1025px+) 에서만 새 로직 적용
            if (window.innerWidth >= 1025) {
                const transitionStyle = animate ? "transform 0.6s ease-in-out" : "none";
                productSlider.style.transition = transitionStyle;

                // 모든 슬라이드에서 'active-product' 클래스 제거 후 현재 슬라이드에만 추가
                allSlides.forEach(s => s.classList.remove("active-product"));
                const activeSlide = allSlides[productIndex];
                if (activeSlide) {
                    activeSlide.classList.add("active-product");
                }

                // --- 위치 계산 로직 수정 ---
                const slideWidthDefault = 340;
                const slideWidthActive = 620;
                const slideGap = 20;
                const rightOffset = 60;

                // 1. 활성 슬라이드 이전 슬라이드들의 전체 너비를 계산
                let offsetToActiveSlide = 0;
                for (let i = 0; i < productIndex; i++) {
                    offsetToActiveSlide += slideWidthDefault + slideGap;
                }

                // 2. 활성 슬라이드의 오른쪽 끝이 컨테이너 오른쪽에서 60px 떨어진 곳에 위치하기 위한 translateX 값을 계산
                const containerWidth = sliderContainer.offsetWidth;
                // 활성 슬라이드의 왼쪽이 컨테이너 왼쪽에 대해 위치해야 할 지점
                const targetActiveLeft = containerWidth - slideWidthActive - rightOffset;
                // 이동해야 할 총 거리
                const translateXValue = offsetToActiveSlide - targetActiveLeft;

                productSlider.style.transform = `translateX(-${translateXValue}px)`;

            } else { // 모바일/태블릿 (1025px 미만) - 기존 로직 유지
                const slideWidth = document.querySelector('.product-slide').offsetWidth;
                const offset = -((productIndex - totalOriginal) * (slideWidth + 20));
                // 자연스러운 애니메이션 추가
                const transitionStyle = animate ? "transform 0.6s ease-in-out" : "none";
                productSlider.style.transition = transitionStyle;
                productSlider.style.transform = `translateX(${offset}px)`;

                allSlides.forEach(s => s.classList.remove("active-product"));
            }

            // 페이지 번호 업데이트
            let realIndex = (productIndex % totalOriginal);
            if (realIndex === 0) realIndex = totalOriginal;
            numNow.textContent = (realIndex === totalOriginal ? 1 : realIndex + 1).toString().padStart(2, "0");
        }

        // 슬라이드 이동 및 무한 루프 처리 함수
        function moveSlide(direction) {
            productIndex += direction;
            setProductSliderPosition();

            if (productIndex >= totalOriginal * 2) {
                setTimeout(() => {
                    productIndex = totalOriginal;
                    setProductSliderPosition(false);
                }, 600);
            } else if (productIndex < totalOriginal) {
                setTimeout(() => {
                    productIndex = totalOriginal * 2 - 1;
                    setProductSliderPosition(false);
                }, 600);
            }
        }

        function nextProductSlide() { moveSlide(1); }

        function prevProductSlide() { moveSlide(-1); }

        productBtns[0].addEventListener("click", () => {
            prevProductSlide();
            resetProductAutoSlide();
        });
        productBtns[1].addEventListener("click", () => {
            nextProductSlide();
            resetProductAutoSlide();
        });

        function startProductAutoSlide() {
            clearInterval(productInterval);
            productInterval = setInterval(nextProductSlide, autoDelay);
        }

        function resetProductAutoSlide() {
            startProductAutoSlide();
        }

        // 초기 설정
        setProductSliderPosition(false);
        startProductAutoSlide();

        window.addEventListener('resize', () => setProductSliderPosition(false));
    }
});
