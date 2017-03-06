// Jraf team (C) 2017
'use strict';

var g_main = {};

function main_js()
{
    $g_div_main.html('<h3>Demo 109: File explorer</h3>');

	var $lst = $('<div/>');
	var $it1 = $('<div/>');
	var $it2 = $('<div/>');

	$lst.append($it1).append($it2);

	$it1.html('item1');
	$it2.html('item2');

	$g_div_main.append($lst);


	var show = function(kid){ return kid.name; }

	o('===2');
	jr('/').bind_list_html($lst,$('<div/>'),show);
}

