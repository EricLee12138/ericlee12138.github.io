let load = () => {
    $.when($.ready).then(() => {
        let lastTimestamp;

        let cursor = '#cursor';
        let instruction = '#cursor-instruction';
        let cardGroup = '#poker-card';
        let interactables = '.btn:not(.ignore), .link, .select, .text, .interactable, .no-frame, a, iframe';
        let startingHover, hovering = false;
        let lastScrollTop = $(document).scrollTop();

        let mousePosition = { x: 0, y: 0 };
        let target;
        let targetSize = { x: 0, y: 0 };
        let targetInstruction = '';

        const CursorPadding = 12;

        let updateCursor = (delta) => {
            let targetX = hovering ? $(target).offsetCenter().left : mousePosition.x;
            let targetY = hovering ? $(target).offsetCenter().top : mousePosition.y;

            let x = moveTo(parseFloat($(cursor).css('left')), targetX, .5*delta);
            let y = moveTo(parseFloat($(cursor).css('top')), targetY, .5*delta);

            let targetWidth = hovering ? $(target).outerWidth() + CursorPadding : 30;
            let targetHeight = hovering ? $(target).outerHeight() + CursorPadding : 30;

            let width = moveTo($(cursor).outerWidth(), targetWidth, .5*delta);
            let height = moveTo($(cursor).outerHeight(), targetHeight, .5*delta);

            // if (hovering) {
            //     if ($(target).hasClass('no-frame') || 
            //     ($(target).prop('nodeName') == 'IFRAME' && $(target).parents().hasClass('no-frame')))
            //     {
            //         $(cursor).css('display', 'none');
            //         // return;
            //     }
            // } else {
            //     $(cursor).css('display', 'block');
            // }

            $(cursor).css('left', x);
            $(cursor).css('top', y);

            $(cursor).css('width', width);
            $(cursor).css('height', height);

            if (hovering)
            {
                switch($(target).prop('nodeName'))
                {
                case 'A':
                    $(cursor).css('border-image-source', 'url(/images/cursor-line.png)');
                    break;

                default:
                    $(cursor).css('border-image-source', 'url(/images/cursor-frame.png)');
                    break;
                }
            } else {
                $(cursor).css('border-image-source', 'url(/images/cursor-frame.png)');
                $(cursor).css('display', 'block');
            }

            if (targetInstruction.length > 0) {
                $(instruction).html(() => { return targetInstruction; });
                $(instruction).css('display', 'block');
            } else {
                // $(instruction).html(() => { return 'Instruction Instruction Instruction Instruction'; });
                $(instruction).html(() => { return ''; });
                $(instruction).css('display', 'none');
            }
        }

        let moveTo = (currentValue, targetValue, time) => {
            let speed = (targetValue - currentValue) / time;
            if (currentValue > targetValue) {
                return currentValue + speed < targetValue ? targetValue : currentValue + speed;
            }
            return currentValue + speed > targetValue ? targetValue : currentValue + speed;
        }

        $('.link').on('click', function() {
            window.location.href = $(this).attr('href');
        });

        $('.select').on('click', function() {
            switchVideo($(this).attr('select'));
        });

        $(document).on('mousemove', (event) => {
            mousePosition.x = Math.min(event.pageX, $(document.body).innerWidth() - $(cursor).outerWidth() / 2);
            mousePosition.y = Math.min(event.pageY, $(document.body).innerHeight() - $(cursor).outerHeight() / 2);
        });
        $(document).on('scroll', (event) => {
            if (hovering) return;
            let scrollTop = $(document).scrollTop();
            let scrollOffset = scrollTop - lastScrollTop;
            let posY = mousePosition.y + scrollOffset;
            mousePosition.y = Math.min(posY, $(document.body).innerHeight() - $(cursor).outerHeight() / 2);
            lastScrollTop = scrollTop;
        });

        $(cardGroup).on('mouseenter mouseover', (event) => {
            $(cardGroup).children().each((index, child) => {
                let count = $(cardGroup).children().length;
                let indexFromLast = count - 1 - index;
                if (indexFromLast > 0) {
                    $(child).css('transform', `rotate(${-3*indexFromLast}deg) translateX(${-10*indexFromLast}px) translateY(${4*indexFromLast}px)`);
                } else if (indexFromLast == 0) {
                    $(child).css('transform', 'none');
                }
            });
        });
        $(cardGroup).on('mouseleave', (event) => {
            $(cardGroup).children().each((index, child) => {
                $(child).css('transform', 'none');
            });
        });
        $(cardGroup).on('click', (event) => {
            $(cardGroup).prepend($('#poker-card div.card').last());
            $(cardGroup).children().each((index, child) => {
                let count = $(cardGroup).children().length;
                let indexFromLast = count - 1 - index;
                if (indexFromLast > 0) {
                    $(child).css('transform', `rotate(${-3*indexFromLast}deg) translateX(${-12*indexFromLast}px) translateY(${4*indexFromLast}px)`);
                } else if (indexFromLast == 0) {
                    $(child).css('transform', 'none');
                }
            });
        });

        $(interactables).on('mouseenter mouseover', (event) => {
            hovering = true;
            target = event.currentTarget;
            event.stopPropagation();

            let text = $(target).attr('instruction');
            if (text != undefined && text.length > 0) {
                targetInstruction = text;
            } else if ($(target).prop('nodeName') == 'A') {
                targetInstruction = $(target).attr('href');
                // targetInstruction = 'Learn more';
            }
        });
        $(interactables).on('mouseleave', (event) => {
            hovering = false;
            targetInstruction = '';
        });

        let catButton = '#nav-setting-cat';
        let cat = '#nav-setting-cat img#cat';
        let catMoving = true;
        let catTimeout;
        let catDirection = -1;

        $(catButton).on('click', () => {
            catMoving = false;
            clearTimeout(catTimeout);
            $(cat).attr('src', '/images/meow.gif');

            catTimeout = setTimeout(() => { triggerCat(); }, 2500);
        });

        let triggerCat = () => {
            let max = 10, min = 6;
            let sec = Math.random() * (max - min) + min;

            if (catMoving) $(cat).attr('src', '/images/cat.gif');
            else $(cat).attr('src', '/images/walk.gif');

            catMoving = !catMoving;

            catTimeout = setTimeout(() => { triggerCat(); }, sec * 1000);
        };

        triggerCat();

        let updateCat = (delta) => {
            let catWidth = $(cat).outerWidth();
            let catButtonWidth = $(catButton).innerWidth();
            let catCssPos = parseFloat($(cat).css('left'));

            let catSpeed = 20 / 1000;

            if (catCssPos <= 0 || catCssPos + catWidth >= catButtonWidth) {
                catCssPos = Math.max(0, catCssPos);
                catCssPos = Math.min(catButtonWidth - catWidth, catCssPos);
                $(cat).css('left', catCssPos);
            }

            if (!catMoving) return;

            if ((catCssPos <= 0 && catDirection < 0) ||
                (catCssPos + catWidth >= catButtonWidth && catDirection > 0)) {
                catDirection *= -1;
            }

            $(cat).css('left', catCssPos + catDirection * catSpeed * delta);
            $(cat).css('transform', `scaleX(${-catDirection})`);
        };

        let update = (delta) => {
            updateCat(delta);
            updateCursor(delta);
        };

        let loop = () => {
            let timestamp = performance.now();

            update(timestamp - lastTimestamp);
            lastTimestamp = timestamp;
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);

        let loadMask = $('#load-mask');
        $(loadMask).animate({
            opacity: 0
        }, 1000, () => { $(loadMask).css('display', 'none'); })
    });

    jQuery.fn.extend({
        offsetCenter: function() {
            return {
                left: this.offset().left + this.outerWidth() / 2,
                top: this.offset().top + this.outerHeight() / 2,
            }
        }
    });
}