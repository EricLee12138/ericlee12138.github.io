let load = () => {
    $.when($.ready).then(() => {
        console.log('loaded');

        let lastTimestamp;

        let cursor = '#cursor';
        let instruction = '#cursor-instruction';
        let cardGroup = '#poker-card';
        let interactables = '.btn, .link, .select, .text, .interactable, .no-frame, a, iframe';
        let startingHover, hovering = false;
        let lastScrollTop = $(document).scrollTop();

        let mousePosition = { x: 0, y: 0 };
        let target;
        let targetSize = { x: 0, y: 0 };
        let targetInstruction = '';

        const CursorPadding = 10;

        let update = (delta) => {
            let targetX = hovering ? $(target).offsetCenter().left : mousePosition.x;
            let targetY = hovering ? $(target).offsetCenter().top : mousePosition.y;

            let x = moveTo(parseFloat($(cursor).css('left')), targetX, 2*delta);
            let y = moveTo(parseFloat($(cursor).css('top')), targetY, 2*delta);

            let targetWidth = hovering ? $(target).outerWidth() + CursorPadding : 30;
            let targetHeight = hovering ? $(target).outerHeight() + CursorPadding : 30;

            let width = moveTo($(cursor).outerWidth(), targetWidth, 4*delta);
            let height = moveTo($(cursor).outerHeight(), targetHeight, 4*delta);

            if (hovering && $(target).hasClass('no-frame')) {
                $(cursor).css('display', 'none');
                return;
            } else {
                $(cursor).css('display', 'block');
            }

            $(cursor).css('left', x);
            $(cursor).css('top', y);

            $(cursor).css('width', width);
            $(cursor).css('height', height);

            if (hovering)
            {
                switch($(target).prop('nodeName'))
                {
                case 'A':
                    $(cursor).css('border-image-source', 'url(../images/cursor-line.png)');
                    break;

                default:
                    $(cursor).css('border-image-source', 'url(../images/cursor-frame.png)');
                    break;
                }
            } else {
                $(cursor).css('border-image-source', 'url(../images/cursor-frame.png)');
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
            let posY = $(cursor).offsetCenter().top + scrollOffset;
            $(cursor).css('top', Math.min(posY, $(document.body).innerHeight() - $(cursor).outerHeight()));
            lastScrollTop = scrollTop;
        });

        $(cardGroup).on('mouseenter mouseover', (event) => {
            $(cardGroup).children().each((index, child) => {
                let count = $(cardGroup).children().length;
                let indexFromLast = count - 1 - index;
                if (indexFromLast > 0) {
                    $(child).css('transform', `rotate(${-3*indexFromLast}deg) translateX(${-10*indexFromLast}px) translateY(${3*indexFromLast}px)`);
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
                    $(child).css('transform', `rotate(${-3*indexFromLast}deg) translateX(${-12*indexFromLast}px) translateY(${3*indexFromLast}px)`);
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
                targetInstruction = 'Learn more';
            }
        });
        $(interactables).on('mouseleave', (event) => {
            hovering = false;
            targetInstruction = '';
        });

        let loop = () => {
            let timestamp = Date.now();

            update(timestamp - lastTimestamp);
            lastTimestamp = timestamp;
            window.requestAnimationFrame(loop);
        };
        // window.requestAnimationFrame(loop);
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