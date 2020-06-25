'use strict';

var test;

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
// window.addEventListener('resize', appHeight);
appHeight();

$(document).ready(function() {
//     updateResponsiveImages();
//     updateResponsiveVideos();

//     // var workBtn = document.getElementById('a-works');
//     // var workMenu = document.getElementById('works-menu');
//     // workBtn.onclick = function() {
//     //     if (workMenu.classList.contains('stf-non-disp')) {
//     //         workMenu.classList.remove('stf-non-disp');
//     //     } else {
//     //         workMenu.classList.add('stf-non-disp');
//     //     }
//     // };

//     loadCubeHead();

//     window.onresize = function() {
//         updateResponsiveImages();
//         updateResponsiveVideos();
//     }

    var button = document.getElementById('nav-menu-btn');
    button.onclick = function(e) {
        if (window.screen.width <= 481)
            e.preventDefault();
        
        var menu = document.getElementById('nav-menu');
        if (menu.classList.contains('open')) {
            button.classList.remove('open');
            menu.classList.remove('open');
        } else {
            button.classList.add('open');
            menu.classList.add('open');
        }
    }

    // Add smooth scrolling to all links
    $("a").on('click', function(event) {
        var hash = this.hash;
        test = this;
        if (hash !== "") {
            if ($(hash).length > 0) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, 'swing', function(){
                    window.location.hash = hash;
                });
            }
        }
    });
});

window.onload = function() {
    updateResponsiveImages();
    updateResponsiveVideos();

    // var workBtn = document.getElementById('a-works');
    // var workMenu = document.getElementById('works-menu');
    // workBtn.onclick = function() {
    //     if (workMenu.classList.contains('stf-non-disp')) {
    //         workMenu.classList.remove('stf-non-disp');
    //     } else {
    //         workMenu.classList.add('stf-non-disp');
    //     }
    // };

    loadCubeHead();

    window.onresize = function() {
        updateResponsiveImages();
        updateResponsiveVideos();
    }
}

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
}

var updateResponsiveVideos = function() {
    var respVideo = document.querySelectorAll('div.video-container');
    respVideo.forEach(function(video) {
        video.firstElementChild.style.height = video.style.height = video.offsetWidth / 2 + 'px';
    });
}