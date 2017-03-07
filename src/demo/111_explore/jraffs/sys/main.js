// Jraf team (C) 2017
'use strict';

var $g_divctl;
var $g_divlst;
var $g_divtxt;
var cwd = [ '/' ];

var fun = {
	create: function(nk,sk,jqo)
	{
		o('==c '+sk.i);
		var $it = $('<div/>');

		var $text = $('<span/>');

		$text.html(sk.i);
		$text.on('click',function(){ entry(nk,sk,jqo); } );
		$text.css('cursor', 'pointer');

		var $del = $('<span/>');
		$del.html('[D] ');

		var $ren = $('<span/>');
		$ren.html('[R] ');

		$it.append($del).append($ren).append($text);

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
    $g_div_main.html('<h3>Demo 111: File explorer</h3>');

	$g_divctl = $('<div/>');
	init_ctl();
	$g_div_main.append($g_divctl);

	$g_divlst = $('<div/>');
	$g_div_main.append($g_divlst);

	$g_divtxt = $('<div/>');
	$g_divtxt.html('');
	$g_divtxt.css('border','1px solid black');
	$g_divtxt.css('width','fit-content');

	$g_div_main.append($g_divtxt);

	var show = function(kid){ return kid.name; }

	jr('/').bind_list_jqo($g_divlst,fun);

	var doit = function()
	{
		//jr('/sys').bind_list_jqo($g_divlst,fun);
	}

	setTimeout(doit,2000);
}

function entry(nk,sk,jqo)
{
	//$g_divtxt.html('');

	let sz = cwd.length;
	var pth = cwd[sz-1] + '/' + sk.i;

	if( nk.sz < 0 ) // directory
	{
		let sz = cwd.length;
		cwd[sz] = pth;
		jr(pth).bind_list_jqo($g_divlst,fun);
		jr('/').bind_html($g_divtxt);
		o('==dir');
	}
	else
	{
		o('==file');
		o(nk);
		var tr = function(x){ return '<pre>'+x.replace(/</g,'&lt;');+'</pre>'; }
		jr(pth).bind_html($g_divtxt,tr);
	}
}

function up()
{
	let sz = cwd.length;
	if( sz < 2 ) return;
	cwd.pop();
	jr(cwd[sz-2]).bind_list_jqo($g_divlst,fun);
	jr('/').bind_html($g_divtxt);

	o('---1');
	o(cwd);
}

function init_ctl()
{
	var t = $('<span/>');

	t.html('[UP]');
	t.on('click',function(){ up(); } );
	t.css('cursor', 'pointer');

	$g_divctl.append(t);
}
