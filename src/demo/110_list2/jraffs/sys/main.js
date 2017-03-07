// Jraf team (C) 2017
'use strict';

var fun = {
	create: function(nk,sk,jqo)
	{
		o('==c '+sk.i);
		var $it = $('<div/>');
		$it.html(sk.i);
		jqo.append($it);
		sk.jqo = $it;
	},
	remove: function(sk,jqo)
	{
		o('==r '+sk.i);
		sk.jqo.remove();
	},
	update: function(nk,sk,jqo){ o('==u '+sk.i); }
};

function main_js()
{
    $g_div_main.html('<h3>Demo 110: File list using jquery object</h3>');

	var $lst = $('<div/>');
	$g_div_main.append($lst);

	var show = function(kid){ return kid.name; }

	jr('/').bind_list_jqo($lst,fun);

	var doit = function()
	{
		jr('/sys').bind_list_jqo($lst,fun);
	}

	setTimeout(doit,2000);
}

