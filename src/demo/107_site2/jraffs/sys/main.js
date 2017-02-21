// Jraf team (C) 2017
'use strict';

var g_div;

function init()
{
	g_keep_loading = true;
	jr('/demo/107').up();
}

function main_js()
{
    $g_div_main.html('<h3>Demo 107: web site with a few pages - preloaded</h3>');

    var $div = $('<div/>');
    $g_div_main.append($div);

	var f = function(x)
	{
		return x.replace(/i/g,'I');
	};

	jr('/demo/107/page1.html').bind_html($div);

	g_div = $div;

	setTimeout(init,100);
}


function ref(x)
{
	jr('/demo/107/'+x).bind_html(g_div);
	return false;
}
