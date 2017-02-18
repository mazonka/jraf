// Jraf team (C) 2017
'use strict';

function main_js()
{
    $g_div_main.html('LOADING');
    var $div = $('<div/>');
	$div.html('starting...');
    $g_div_main.append($div);

	var n = jr('/demo/103/hw.txt');
	n.bind_html($div);
}

