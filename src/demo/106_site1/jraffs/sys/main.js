// Jraf team (C) 2017
'use strict';

var g_div;

function main_js()
{
    $g_div_main.html('<h3>Demo 106: web site with a few pages - late loading</h3>');

    var $div = $('<div/>');
    $g_div_main.append($div);

	var f = function(x)
	{
		return x.replace(/i/g,'I');
	};

	jr('/demo/106/page1.html').bind_html($div);

	g_div = $div;
}


function ref(x)
{
	jr('/demo/106/'+x).bind_html(g_div);
	return false;
}
