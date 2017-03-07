// Jraf team (C) 2017
'use strict';

var $g_divctl;
var $g_divlst;
var $g_divtxt;
var cwd = [ '/' ];

function mkelem(txt,cb)
{
	var t = $('<span/>');
	t.html(txt);
	t.on('click',cb);
	t.css('cursor', 'pointer');	
	t.hover(function(){t.css('color','blue');},function(){t.css('color','black');});
	return t;
}

var fun = {
	create: function(nk,sk,jqo)
	{
		var $it = $('<div/>');

		var $text = mkelem(sk.i,function(){ entry(nk,sk,jqo); } );

		var $del = mkelem('[X]',function(){} );
		
		var $spc = $('<span> &emsp; </span>');

		$it.append($del).append($spc).append($text);

		jqo.append($it);
		sk.jqo = $it;
	},
	remove: function(sk,jqo)
	{
		sk.jqo.remove();
	},
	update: function(nk,sk,jqo){ o('--- update '+sk.i); }
};

function main_js()
{
    $g_div_main.html('<h3>Demo 111: File explorer</h3>');

	$g_divctl = $('<div/>');
	$g_divctl.append(mkelem('[Dir] ',function(){}));
	$g_divctl.append(mkelem('[File] ',function(){}));
	$g_divctl.append(mkelem('[UP]',function(){ up(); }));
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
	}
	else
	{
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
}

