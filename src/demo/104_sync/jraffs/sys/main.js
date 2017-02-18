// Jraf team (C) 2017
'use strict';

var g_main = {};

function change_direct() // use this function to test direct copying
{
	var text = g_main.inp.val();
	g_main.div.html(text);
}

function change()
{
	var text = g_main.inp.val();
	jr('/demo/104/a.txt').save(text).up();
}

function init()
{
	var cb = function(node)
	{
		g_main.inp.val(node.text);
	};

	jr('/demo/104/a.txt').up(cb);
}

function main_js()
{
    $g_div_main.html('<h3>Demo 104: synchronising widget</h3>');

    var $inp = $('<input/>');
    $g_div_main.append($inp);

	$inp.on('change textInput input',change);

    var $div = $('<div/>');
    $g_div_main.append($div);

	g_main.inp = $inp;
	g_main.div = $div;

	jr('/demo/104').md().x('a.txt').bind_html($div);
	init();
}

