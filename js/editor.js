$.when($.ready).then(() => {
    let editor;
    let running = false;
    let runButton = '#run';
    let copyButton = '#copy';
    // let themeButton = '#theme';
    let output = '#output';
    let status = '#status';

    let timeout;

    editor = ace.edit('editor');
    editor.setTheme(`ace/theme/cloud9_night_low_color`);
    editor.session.setMode('ace/mode/c_cpp');
    editor.session.setValue(localStorage.getItem('code'));
    editor.session.setUseWrapMode(true);

    editor.session.on('change', () => {
        localStorage.setItem('code', editor.getSession().getValue());
    });

    $(runButton).on('click', (event) => {
        if (running) return;

        running = true;
        showStatus('running');
        let runningText = $('<p><span style="color:var(--color-blue);">Running</span></p>');
        $(output).append(runningText);
        $(output).scrollTop($(output).prop('scrollHeight'));
        $.ajax({
            url: 'http://192.168.1.81:80/code/index.php',
            method: 'POST',
            data: {
                language: 'cpp',
                code: editor.getSession().getValue()
            },
            success: (response) => {
                running = false;
                runningText.remove();
                showStatus('success');
                showOutput(response);

                console.log(response);
            },
            error: () => {
                showStatus('fail');
                showOutput();
            }
        });
    });

    $(copyButton).on('click', (event) => {
        clearTimeout(timeout);

        navigator.clipboard.writeText(editor.getSession().getValue());

        $(copyButton).removeClass('grey');
        $(copyButton).addClass('green');
        $(copyButton + ' > h3').text('Copied!');

        timeout = setTimeout(() => {
            $(copyButton).removeClass('green');
            $(copyButton).addClass('grey');
        $(copyButton + ' > h3').text('Copy');
    }, 2000);
    });

    let showStatus = (code) => {
        $(status).removeClass();
        switch (code) {
            case 'success': $(status).addClass('green'); break;
            case 'fail': $(status).addClass('red'); break;
            case 'running': break;
        }
    }
    let showOutput = (response) => {
        $(output).append('<p><span style="color:var(--color-green);">Finished</span><br>' + response + '</p>');
        $(output).scrollTop($(output).prop('scrollHeight'));
    }
});