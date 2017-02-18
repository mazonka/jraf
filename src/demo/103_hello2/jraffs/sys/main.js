// Jraf team (C) 2017
'use strict';

var hw = {};
function update()
{
	var n = jr('/demo/103/hw.txt');
	n.node.text = 'loading ...';
	n.bind_html(hw.div);
}

function main_js()
{
    $g_div_main.html('<h3>Hello, World 103 !</h3>');
    var $div = $('<div/>');
	$div.html('Start: wait for 1 second');
    $g_div_main.append($div);

	hw.div = $div;

	setTimeout(update,1000);

	//jr('/demo/103/hw.txt').bind_html($div);
}

