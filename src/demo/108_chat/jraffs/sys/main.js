// Jraf team (C) 2017
'use strict';

var g_div;

var g_main = {};

function change_direct() // use this function to test direct copying
{
	var text = g_main.inp.val();
	g_main.div.html(text);
}

function change()
{
	var text = g_main.inp.val();
	jr('/demo/108/data').save(text).up();
}

function init()
{
	var cb = function(node)
	{
		g_main.inp.val(node.text);
	};

	jr('/demo/108/data').up(cb);
}

function main_js()
{
    $g_div_main.html('<h3>Demo 108: chat</h3>');

    var $inp = $('<input/>');
    $g_div_main.append($inp);

	$inp.on('change textInput input',change);

    var $div = $('<div/>');
    $g_div_main.append($div);

	g_main.inp = $inp;
	g_main.div = $div;

	var rep = function(x){ return x.replace(/0/g,'x'); }

	jr('/demo/108').md().x('data').bind_html($div,rep);
	init();
}

