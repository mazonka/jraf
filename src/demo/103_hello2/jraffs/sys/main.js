// Jraf team (C) 2017
'use strict';

function main_js()
{
	$g_div_main.html("<h1>Hello, World!</h1>");

    var $div = $('<div/>');
    $g_div_main.html('');
    $g_div_main.append($div);

	jr('/demo/103/hw.txt').bind($div);
}

