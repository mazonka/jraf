// Jraf team (C) 2017
'use strict';

var g_main = {};

function change_direct() // use this function to test direct copying
{
    var text = g_main.inp.val();
    g_main.pre.html(text);
}

function refresh_cback(cb){ jr('/demo/108/data').up(cb); }

function refresh_chain()
{
	var cb = function(){ setTimeout(refresh_chain,1000); }
	refresh_cback(cb);
}

function change(e)
{
    if (e.keyCode != 13 ) return;
    var inp = g_main.inp;
    var text = inp.val();
    if( text == '' ) return refresh_cback(null);
    
    text = g_main.nam.val()+'> '+text+'\n';
    jr('/demo/108/data').add(text);
    inp.val('');
}

function erase()
{
    jr('/demo/108/data').save('');
}

function main_js()
{
    $g_div_main.html('<h3>Demo 108: chat</h3>');

    var $nam = $('<input/>');
    $nam.val('X');
    $g_div_main.css('font-family', 'monospace');
    $g_div_main.append($('<span>Your name </span>')).append($nam);

    var $pre = $('<pre/>');
    $g_div_main.append($pre);

    var $inp = $('<input/>');
    $g_div_main.append($('<span>Your text </span>')).append($inp);
    $inp.on('keydown',change);

    var $btn = $('<button class="ui-button ">Erase</button>');
    $g_div_main.append($('<br/><br/>')).append($btn);
    $btn.on('click',erase);

    g_main.nam = $nam;
    g_main.inp = $inp;
    g_main.pre = $pre;
    g_main.btn = $btn;

    $inp.focus();

    var rep = function(x){ return x.replace(/0/g,'x'); }

    jr('/demo/108').md().x('data').bind_html($pre,rep);

    jr('/demo/108/data').up();

    ///setInterval(refresh,1000);
	refresh_chain();
}

