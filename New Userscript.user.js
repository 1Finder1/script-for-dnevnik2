// ==UserScript==
// @name         average_score
// @namespace    http://tampermonkey.net/
// @version      2
// @description  for class site
// @author       KraBaDA
// @match        https://schools.dnevnik.ru/marks.aspx*tab=period*
// @icon         https://www.google.com/s2/favicons?domain=dnevnik.ru

// @connect      website8v.pythonanywhere.com
// @grant        GM_xmlhttpRequest

// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var URL_POST = 'https://website8v.pythonanywhere.com/marks/upload'

    var REPLACE_SUBJECT = {
        'История России': 'История',
        'Всеобщая история': 'История',
        'Родной язык(русский)': 'Родной язык'
    }

    var trs = $('table#journal>tbody>tr')
    $(trs[0]).append('<th style="width:5%" rowspan="2">Ср.балл</th>')

    var current_quarter = $('.switch>.active>a').text().match(/\d+/)[0]
    var marks = {}
    var average = {}

    for (var i = 2; i<trs.length; i++)
    {
        var current_tr = $(trs[i])
        var current_marks_elements = current_tr.find('.tac>span')
        var current_subject = current_tr.find('.s2>a>strong').text()

        console.log(current_subject, typeof REPLACE_SUBJECT[current_subject] !== "undefined")
        if (typeof REPLACE_SUBJECT[current_subject] !== "undefined") {
            current_subject = REPLACE_SUBJECT[current_subject]
        }

        var mark_list = []
        var average_score = 0

        for (var j = 0; j<current_marks_elements.length; j++){
            mark_list.push(parseInt(current_marks_elements[j].innerHTML))
        }

        average_score = (mark_list.reduce((a, b) => a + b, 0)/mark_list.length).toFixed(2)
        var mark_class = 'mG'

        if (2.5 < average_score && average_score < 3.5){mark_class = 'mY'}
        if (average_score < 2.5){mark_class = 'mR'}

        marks[current_subject] = mark_list
        average[current_subject] = average_score

        current_tr.append('<th><span class="mark '+mark_class+'">' + average_score + '</span></th>')
    }

    var request = {
        'login': localStorage.storage,
        'date': new Date().toLocaleDateString(),
        'quarter': current_quarter,
        'marks': marks,
        'average': average
    }
    console.log(request)

    GM_xmlhttpRequest({
        method: "POST",
        url: URL_POST,
        data: JSON.stringify(request),
        headers: {
            'Content-type': 'application/json',
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        onload: function (response) {
          console.log(response)
        }
      });

    var btn_auth = document.createElement('button')
    document.body.append(btn_auth)
    $(btn_auth).css({
        'text-align': 'center',
        'background-color': 'transparent',
        'border:': '1px solid transparent',
        'border-radius': '.25rem',
        'color': '#198754;',
        'position' :'absolute',
        'right': '1rem',
        'bottom': '5rem',
        'border': '1px solid transparent',
        'transition': 'transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;',
        'zoom': '2'
    })
    $(btn_auth).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key-fill" viewBox="0 0 16 16"><path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>')

    var cont_auth = document.createElement('div')
    document.body.append(cont_auth)
    $(cont_auth).css({
        'display': 'none',
        'position' :'absolute',
        'right': '1rem',
        'bottom': '7rem',
    })


    var input_auth = document.createElement('input')
    cont_auth.appendChild(input_auth)
    $(input_auth).css({
        'display': 'inline-block',
        'width': "100%",
        'padding': ".375rem .75rem",
        'fontSize': "15px",
        'fontWeight': 400,
        'lineHeight': 1.5,
        'color': "#212529",
        'backgroundColor': "#fff",
        'backgroundClip': "padding-box",
        'border': "1px solid #ced4da",
        'WebkitAppearance': "none",
        'MozAppearance': "none",
        'appearance': "none",
        'borderRadius': ".25rem",
        'transition': "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
        'width': '7rem'
    })

    var confirm_btn = document.createElement('button')
    cont_auth.appendChild(confirm_btn)
    $(confirm_btn).css({
        'display': 'inline-block',
        'text-align': 'center',
        'border:': '1px solid transparent',
        'border-radius': '.25rem',
        'color': '#FFF',
        'border': '1px solid transparent',
        'transition': 'transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
        'zoom': '2',
        'background-color': '#0d6dfd',
        'font-size': '10px',
        'border-radius': '.25rem'
    })
    $(confirm_btn).html('Сохранить!')
    $(confirm_btn).on('click', function() {
        localStorage.storage =  $(input_auth).val()
        console.log(localStorage.storage)
    })

    $(btn_auth).on('click', function() {
    if($(cont_auth).hasClass('sw')){
        $(cont_auth).removeClass('sw');
        $(cont_auth).css('display', 'none');
    } else {
        $(cont_auth).addClass('sw');
        $(cont_auth).css('display', 'block');
    }

})

})();
