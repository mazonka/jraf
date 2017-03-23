// Jraf team (C) 2017
'use strict';

var g_mo;

function main_js()
{
	$g_div_main.html("<h1>Hello, World 201!</h1>");

	jr_mount('/',loaded);
}

function loaded(mo)
{
	g_mo = mo; 
	o('== MO =='); o(mo);

	mo.o.file = { text:'aaa' };
	mo.o.dir = { o: {} };

	///o('== ST =='); o(mo.st());

	mo.save(saved);
}

function saved()
{
	o('=saved=');
	o(g_mo);
}
