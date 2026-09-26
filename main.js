
/* وظائف الموقع القديمة تعمل عند توفر jQuery، أما شريط الصور فيعمل بدون أي مكتبة خارجية. */
(function () {
    'use strict';

    // WowSlider مستقل: صورة واحدة في كل مرة مع انتقال تلقائي.

    function initWowSlider() {
        var slider = document.getElementById('wowslider-container1');
        if (!slider) return;

        var slides = slider.querySelectorAll('.ws_images li');
        var bullets = slider.querySelectorAll('.ws_bullets button');
        var previous = slider.querySelector('.ws_prev');
        var next = slider.querySelector('.ws_next');
        if (!slides.length) return;

        var current = 0;
        var timer;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            for (var i = 0; i < slides.length; i++) {
                slides[i].classList.toggle('active', i === current);
                slides[i].setAttribute('aria-hidden', i === current ? 'false' : 'true');
            }
            for (var j = 0; j < bullets.length; j++) {
                bullets[j].classList.toggle('active', j === current);
                bullets[j].setAttribute('aria-selected', j === current ? 'true' : 'false');
            }
        }

        function restartTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 4500);
        }

        for (var b = 0; b < bullets.length; b++) {
            bullets[b].addEventListener('click', function () {
                showSlide(Number(this.getAttribute('data-slide')));
                restartTimer();
            });
        }
        if (previous) previous.addEventListener('click', function () {
            showSlide(current - 1);
            restartTimer();
        });
        if (next) next.addEventListener('click', function () {
            showSlide(current + 1);
            restartTimer();
        });

        showSlide(0);
        restartTimer();
    }

    // يبدأ فورًا عند فتح الصفحة، سواء وُجدت jQuery أم لا.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWowSlider);
    } else {
        initWowSlider();
    }

    // الوظائف القديمة للمشروع، مع حماية من عدم توفر jQuery عند الفتح دون إنترنت.
    function initLegacyFeatures() {
        if (!window.jQuery) return;
        var $ = window.jQuery;

        window.showToast = function () {
            if (window.toastr) toastr.success('أهلاً بك في منصة كلية الحاسوب!');
        };

        if (window.toastr) {
            toastr.options = {
                closeButton: true,
                positionClass: 'toast-top-left',
                timeOut: '4000'
            };
        }

        $('.load-modal').on('click', function (e) {
            e.preventDefault();
            var targetFile = $(this).data('target');
            $.ajax({
                url: '../modals/' + targetFile,
                type: 'GET',
                success: function (response) {
                    $('#modal-body-content').html(response);
                    if (window.bootstrap) {
                        new bootstrap.Modal(document.getElementById('ajaxModal')).show();
                    }
                },
                error: function () {
                    if (window.toastr) toastr.error('تعذر تحميل الملف من مجلد modals');
                }
            });
        });

        $('#registerForm').on('submit', function (e) {
            e.preventDefault();
            var valid = true;
            var fullName = $('#fullName').val().trim();
            var email = $('#email').val().trim();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();
            $('#fullName').toggleClass('is-invalid', fullName === '');
            $('#email').toggleClass('is-invalid', email === '' || !email.includes('@'));
            $('#password').toggleClass('is-invalid', password.length < 6);
            $('#confirmPassword').toggleClass('is-invalid', confirmPassword !== password || confirmPassword === '');
            valid = fullName !== '' && email.includes('@') && password.length >= 6 && confirmPassword === password;
            if (valid) { toastr.success('تم إنشاء الحساب بنجاح!'); this.reset(); }
        });

        $('#loginForm').on('submit', function (e) {
            e.preventDefault();
            var valid = $('#loginEmail').val().trim() !== '' && $('#loginPassword').val() !== '';
            $('#loginEmail').toggleClass('is-invalid', $('#loginEmail').val().trim() === '');
            $('#loginPassword').toggleClass('is-invalid', $('#loginPassword').val() === '');
            if (valid) { toastr.info('تم تسجيل الدخول بنجاح!'); this.reset(); }
        });
    }

    if (window.jQuery) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLegacyFeatures);
        } else {
            initLegacyFeatures();
        }
    }
}());
