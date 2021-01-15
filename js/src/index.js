'use strict';

var mouseX, mouseY, mouseScroll = 0;
var startGame = false;

(() => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
})();

window.onresize = () => {
    updateResponsiveImages();
    updateResponsiveVideos();
}

// $(document).ready(function() {
window.onload = () => {
    $('a').on('click', function(event) {
        var hash = this.hash;
        if (hash !== "") {
            if ($(hash).length > 0) {
                event.preventDefault();
                const scrollTop = { y: window.scrollY };
                new TWEEN.Tween(scrollTop)
                .to({ y: $(hash).offset().top }, 800).easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    window.scrollTo(0, scrollTop.y);
                }).start();
            }
        }
    });

    const scale = { x: 1 }, game = { x: 0 };
    const tweenClickBack = new TWEEN.Tween(scale)
        .to({ x: 1 }, 750).easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(() => {
            document.getElementById('cursor').style.transform = `scale(${scale.x})`;
        });
    const tweenClick = new TWEEN.Tween(scale)
        .to({ x: scale.x - .5 }, 50).easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            document.getElementById('cursor').style.transform = `scale(${scale.x})`;
        })
        .chain(tweenClickBack);
    const tweenHover = new TWEEN.Tween(scale)
        .to({ x: 4 }, 750).easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(() => {
            document.getElementById('cursor').style.transform = `scale(${scale.x})`;
        });
    const tweenHoverBack = new TWEEN.Tween(scale)
        .to({ x: 1 }, 750).easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(() => {
            document.getElementById('cursor').style.transform = `scale(${scale.x})`;
        });

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        var transform = `translate3d(${mouseX}px, ${mouseY + mouseScroll}px, 0)`;
        document.getElementById('cursor-holder').style.transform = transform;
    });

    window.addEventListener('click', () => {
        tweenHover.stop();
        tweenClick.start();
    });

    window.addEventListener('scroll', () => {
        mouseScroll = pageYOffset;
        var transform = `translate3d(${mouseX}px, ${mouseY + mouseScroll}px, 0)`;
        document.getElementById('cursor-holder').style.transform = transform;
    });

    window.addEventListener('mouseover', (event) => {
        if (event.target.nodeName === 'A' ||
            event.target.nodeName === 'ARTICLE'
        ) {
            tweenHover.start();
        } else {
            tweenHoverBack.start();
        }
    });

    requestAnimationFrame(renderTweenLoop);
    updateResponsiveImages();
    updateResponsiveVideos();

    if (window.location.pathname !== '/') return;

    const gameStart = new TWEEN.Tween(game)
        .to({ x: 25 }, 250).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            document.getElementById('selfie-mask').setAttribute('r', `${game.x}%`);
        });
    const gameEnd = new TWEEN.Tween(game)
        .to({ x: 0 }, 250).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            document.getElementById('selfie-mask').setAttribute('r', `${game.x}%`);
        });

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        // if (startGame) {
            document.getElementById('selfie-mask').setAttribute('cx', `${mouseX}`);
            document.getElementById('selfie-mask').setAttribute('cy', `${(mouseY + (window.scrollY - document.getElementById('game-container').offsetTop))}`);
        // }
    });

    window.addEventListener('scroll', (event) => {
        // if (startGame) {
            if (mouseX !== undefined && mouseX !== NaN) {
                document.getElementById('selfie-mask').setAttribute('cx', `${mouseX}`);
                document.getElementById('selfie-mask').setAttribute('cy', `${(mouseY + (window.scrollY - document.getElementById('game-container').offsetTop))}`);
            }
        // }
    });

    window.addEventListener('mouseover', (event) => {
        if (event.target.nodeName === 'DIV' && event.target.id == 'game-container') {
            startGame = true;
            // gameStart.start();
        } else {
            startGame = false;
            // gameEnd.start();
        }
    });

    loadCubeHead();

    // var button = document.getElementById('nav-menu-btn');
    // button.onclick = function(e) {
    //     if (window.screen.width <= 481)
    //         e.preventDefault();
        
    //     var menu = document.getElementById('nav-menu');
    //     if (menu.classList.contains('open')) {
    //         button.classList.remove('open');
    //         menu.classList.remove('open');
    //     } else {
    //         button.classList.add('open');
    //         menu.classList.add('open');
    //     }
    // }
};

var updateResponsiveImages = function() {
    var respImg = document.querySelectorAll('img.img-responsive');
    respImg.forEach(function(img) {
        var ratio = img.naturalWidth / img.naturalHeight;
        
        var width, height;

        width = img.parentElement.offsetWidth;
        height = -1;
        if (width / ratio < img.parentElement.offsetHeight) {
            width = -1;
            height = img.parentElement.offsetHeight;
        }

        img.style.width = width == -1 ? 'auto' : width + 'px';
        img.style.height = height == -1 ? 'auto' : height + 'px';
    });

    document.querySelector('#selfie svg').setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerWidth / 3}`)
}

var updateResponsiveVideos = function() {
    var respVideo = document.querySelectorAll('div.video-container');
    respVideo.forEach(function(video) {
        video.firstElementChild.style.height = video.style.height = video.offsetWidth / 2 + 'px';
    });
}

var renderTweenLoop = function() {
    document.querySelectorAll('div.background').forEach((element) => {
        if (element.offsetHeight !== element.parentElement.parentElement.offsetHeight) {
            element.style.height = `${element.parentElement.parentElement.offsetHeight}px`;
        }
    })

    TWEEN.update();
    requestAnimationFrame(renderTweenLoop);
}