// Jraf team (C) 2017
'use strict';

var $g_divpth;
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
        o('--- create '+sk.i);
        var $it = $('<div/>');

        var name = sk.i;
        if( nk.sz < 0 )  name = '['+name+']';
        var $text = mkelem(name,function(){ entry(nk,sk,jqo); } );

        var $del = mkelem('(x)',function(){ remove(nk,sk,jqo); } );
        
        var $spc = $('<span> &emsp; </span>');

        $it.append($del).append($spc).append($text);

        jqo.append($it);
        sk.jqo = $it;
    },

    remove: function(sk,jqo){ sk.jqo.remove(); }
};

function main_js()
{
    $g_div_main.html('<h3>Demo 111: File explorer</h3>');

    $g_divpth = $('<div/>');
    $g_divpth.html(cwd[0]);
    $g_div_main.append($g_divpth);

    $g_divctl = $('<div/>');
    var $spc = $('<span> &emsp; &emsp;&nbsp; </span>');

    $g_divctl.append($spc);
    $g_divctl.append(mkelem('( .. ) ',function(){ goup(); }));
    $g_divctl.append($spc.clone());

    $g_divctl.append(mkelem('(New File) ',function(){ newfile(); }));
    $g_divctl.append($spc.clone());
    $g_divctl.append(mkelem('(New Dir) ',function(){ newdir(); }));
    $g_divctl.append($spc.clone());
    $g_divctl.append(mkelem(' (Refresh)',function(){ rootup(); }));
    $g_div_main.append($g_divctl);

    $g_divlst = $('<div/>');
    $g_div_main.append($g_divlst);

    $g_divtxt = $('<pre contenteditable="true"/>');
    $g_divtxt.html('');
    $g_divtxt.css('border','1px solid black');
    $g_divtxt.css('min-width','100px');
    $g_divtxt.css('min-height','15px');
    $g_divtxt.css('width','fit-content');
    $g_divtxt.css('display','inline-block');

    $g_div_main.append($g_divtxt);

    var show = function(kid){ return kid.name; }

    jr(cwd[0]).bind_list_jqo($g_divlst,fun);
}

function entry(nk,sk,jqo)
{
    //$g_divtxt.html('');

    let sz = cwd.length;
    var pth = cwd[sz-1];
    if(pth!='/') pth += '/';
    pth += sk.i;

    if( nk.sz < 0 ) // directory
    {
        let sz = cwd.length;
        cwd[sz] = pth;
        jr(pth).bind_list_jqo($g_divlst,fun);
        jr('/').bind_html($g_divtxt);
        $g_divpth.html(pth);
    }
    else
    {
        var tr = function(x){ return ''+x.replace(/</g,'&lt;')+''; }
        //var tr = function(x){ return '<pre>'+x.replace(/</g,'&lt;')+'</pre>'; }
        jr(pth).bind_html($g_divtxt,tr);
    }
}

function goup()
{
    jr('/').bind_html($g_divtxt);
    let sz = cwd.length;
    if( sz < 2 ) return;
    cwd.pop();
    var pth = cwd[sz-2];
    jr(pth).bind_list_jqo($g_divlst,fun);
    $g_divpth.html(pth);
}


function rootup(){ jr('/').up(); }

function newfile()
{
    var name = prompt('Enter file name: ','');
    if( !name ) return;
    var pth = cwd[cwd.length-1]+'/'+name;
    jr(pth).save($g_divtxt.html(),rootup);
    o('---1 '+pth);
}

function newdir()
{
    var name = prompt('Enter dir name: ','');
    if( !name ) return;
    var pth = cwd[cwd.length-1]+'/'+name;
    jr(pth).md(rootup);
    o('---1 '+pth);
}

function remove(nk,sk,jqo)
{
    var pth = cwd[cwd.length-1] + '/' + sk.i;
    jr(pth).rm(rootup);
}
