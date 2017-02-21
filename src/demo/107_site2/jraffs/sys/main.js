// Jraf team (C) 2017
'use strict';

var g_div;

function main_js()
{
    $g_div_main.html('<h3>Demo 107: web site with a few pages - preloaded</h3>');

    var $div = $('<div/>');
    $g_div_main.append($div);
	g_div = $div;

	var f = function()
	{
		jr('/demo/107/page1.html').bind_html(g_div);
		g_keep_loading = true;
		jr('/demo/107').up();
	}

	jr('/demo/107').up(f);
}


function ref(x)
{
	jr('/demo/107/'+x).bind_html(g_div);
	return false;
}
