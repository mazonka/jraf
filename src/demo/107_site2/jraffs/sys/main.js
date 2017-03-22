// Jraf team (C) 2017
'use strict';

var g_div;

function main_js()
{
    $g_div_main.html('<h3>Demo 107: web site with a few pages - preloaded</h3>');

    var $div = $('<div/>');
    $g_div_main.append($div);
	g_div = $div;

	jr('/demo/107/page1.html').node.text = "Loading ...";
	jr('/demo/107/page1.html').bind_html(g_div);
	jr('/demo/107').up({keep_loading:true});
}


function ref(x)
{
	jr('/demo/107/'+x).bind_html(g_div);
	return false;
}
