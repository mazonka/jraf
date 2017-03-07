// Jraf team (C) 2017
'use strict';

var g_main = {};

var fun = {
	create: function(nk,sk)
	{
		o('==c '+sk.i);
		var $it = $('<div/>');
		$it.html(sk.i);
		g_main.lst.append($it);
		sk.jqo = $it;
	},
	remove: function(sk)
	{
		o('==r '+sk.i);
		sk.jqo.remove();
	},
	update: function(nk,sk){ o('==u '+sk.i); }
};

function main_js()
{
    $g_div_main.html('<h3>Demo 109: File explorer</h3>');

	var $lst = $('<div/>');
	g_main.lst = $lst;

	$g_div_main.append($lst);

	var show = function(kid){ return kid.name; }

	g_main.napi = jr('/');
	g_main.napi.bind_list(fun);

	setTimeout(doit,2000);
}

function doit()
{
	g_main.napi.unbind_list(fun);
	g_main.napi = jr('/sys');
	g_main.napi.bind_list(fun);
}
