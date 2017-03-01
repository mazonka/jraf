// Jraf team (C) 2017
'use strict';

var g_div;

var g_main = {};

function change_direct() // use this function to test direct copying
{
	var text = g_main.inp.val();
	g_main.div.html(text);
}

function change(e)
{
	if (e.keyCode != 13 ) return;
	var inp = g_main.inp;
	var text = g_main.nam.val()+'> '+inp.val();
	jr('/demo/108/data').save(text).up();
	inp.val('');
}

function main_js()
{
    $g_div_main.html('<h3>Demo 108: chat</h3>');

    var $nam = $('<input/>');
	$nam.val('X');
    $g_div_main.append($nam);

    var $div = $('<div/>').css('font-family', 'monospace');
    $g_div_main.append($div);

    var $inp = $('<input/>');
    $g_div_main.append($inp);
	$inp.on('keydown',change);

	g_main.nam = $nam;
	g_main.inp = $inp;
	g_main.div = $div;

	var rep = function(x){ return x.replace(/0/g,'x'); }

	jr('/demo/108').md().x('data').bind_html($div,rep);

	jr('/demo/108/data').up();
}

