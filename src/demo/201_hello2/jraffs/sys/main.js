// Jraf team (C) 2017
'use strict';

var g_mo;

function main_js()
{
	$g_div_main.html("<h1>Hello, World 201!</h1>");

	jr_mount('/',(mo)=>{ g_mo = mo; o(g_mo); });
}

