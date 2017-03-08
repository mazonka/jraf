// Jraf team (C) 2017
'use strict';

var g_profile = {};
var g_wid = {
    button: { ent: {}, ext: {}},
    h3: {},
    label: { opn: {} },
    inp: { eml: {} },
    span: { log: {}, opn: {} },
    div: { lst: {}, fs: {}, txt: {} },
    pre: { txt: {} }
};
var cwd = ['/home'];
var g_orphan;
g_wid.h3.wid = $('<h3>UNIPHYZ</h3>').css('text-align', 'center');
g_wid.button.ent.wid = $('<button/>', { text: '>', click: login });
g_wid.button.ext.wid = $('<button/>', { text: 'X', click: logout });
g_wid.label.opn.wid = $('<label/>', { text: '^' })
    .append($('<input type=file onchange="opn(this.files)"/>').hide());

g_wid.inp.eml.wid = $('<input/>', {});
g_wid.span.opn.wid = $('<span/>');
g_wid.span.log.wid = $('<span/>');
g_wid.div.fs.wid = $('<div/>')
    .css('border', '1px solid #000000')
    .css('min-width','100px')
    .css('min-height','15px')
    .css('width','50%')
    .css('margin','4px');
g_wid.pre.txt.wid = $('<pre/>')
    .css('border', '1px solid #000000')
    .css('min-width','100px')
    .css('min-height','15px')
    .css('width','50%')
    .css('margin','4px');
    
g_wid.div.lst.wid = $('<div/>');



function login()
{
    var cb = function (data)
    {
        console.log(data);
    };
    
    jraf_ajax(['jw login',g_wid.inp.eml.wid.val(),'*'].join(' '), cb);
}

function logout()
{
    var cb = function (data)
    {
        if (eng_get_resp)
        {
            var loc = window.location;
            var p = '?$0';
            
            window.location = loc.protocol + '//' + loc.host + loc.pathname + p;
        }
        
    };
    
    jraf_ajax(['jw logout', g_session].join(' '), cb);
}

function opn(f)
{
    var cb = function(data)
    {
        console.log('File name: ' + data.name);
        console.log('File text: ' + data.text);
        jr(g_profile.unm+'/'+data.name).save(data.text);
        jr('/home').up();
    };
    
    eng_open_file(f[0], cb);
}

function main_js()
{
    jw_md_users();
}

function jw_md_users()
{
    var cb = function (data)
    {
        var resp = eng_get_resp(data);
        
        if (resp === null)
            return console.log('/.jraf.sys/users creation error!');
        else if (resp === false)
            console.log('/.jraf.sys/users exists!');
        else
            console.log('/.jraf.sys/users created!');
        
        jr_profile(g_session);
    };
    
    jraf_ajax('jw md 0 /.jraf.sys/users', cb);
}

function jr_profile(sid)
{
    var cb = function (data)
    {
        if (!eng_get_resp(data)) return console.log('Profile getting failed!');
        
        g_profile = eng_get_profile(eng_get_data(data)[0]);
        
        if (g_profile.unm == '*')
            jr('/home').bind_list_jqo(g_wid.div.lst.wid, fun);
        else
        {
            cwd.push(g_profile.unm);
            jr(cwd[cwd.length-1]).bind_list_jqo(g_wid.div.lst.wid, fun);
        }
        
        wid_main();
        
        var jr_home_up = function() { jr('/home').up(refresh) };
        var refresh = function() { setTimeout(jr_home_up, 5000); };
        
        jr_home_up();
        
    };
    
    jraf_ajax(['jr profile',sid].join(' '), cb);
}

function mkelem(txt, cb)
{
    var t = $('<span/>');
    
    t.html(txt);
    t.on('click', cb);
    t.css('cursor', 'pointer');
    t.hover(function()
    {
        t.css('color', 'blue');
    }, function()
    {
        t.css('color', 'black');
    });
    
    return t;
}

function goup(lst)
{
    unbfile();
    let sz = cwd.length;
    if( sz < 2 ) return;
    cwd.pop();
    var pth = cwd[sz-2];
    jr(pth).bind_list_jqo(g_wid.div.lst.wid,fun);
}

function entry(nk,sk,jqo)
{
    let sz = cwd.length;
    var pth = cwd[sz-1];
    if(pth!='/') pth += '/';
    pth += sk.i;
    
    if( nk.sz < 0 ) // directory
    {
        let sz = cwd.length;
        cwd[sz] = pth;
        jr(pth).bind_list_jqo(g_wid.div.lst.wid,fun);
        unbfile();
        // $g_divpth.html(pth);
    }
    else
    {
        var tr = function(x){ return ''+x.replace(/</g,'&lt;')+''; }
        jr(pth).bind_html(g_wid.pre.txt.wid,tr);
    }
}

var fun = {
    create: function(nk,sk,jqo)
    {
        //o('--- create '+sk.i);
        var $it = $('<div/>');
        
        var name = sk.i;
        if( nk.sz < 0 )  name = '['+name+']';
        var $text = mkelem(name,function(){ entry(nk,sk,jqo); } );
        
        $it.append($text);
        
        jqo.append($it);
        sk.jqo = $it;
    },
    
    remove: function(sk,jqo){ sk.jqo.remove(); }
};

function rootup(){ jr('/').up(); }
function unbfile(){ g_orphan.bind_html(g_wid.pre.txt.wid); }

function wid_main()
{
    g_orphan = jr_api_node(jraf_node(null));
    
    $g_div_main.html('')
        .append(g_wid.h3.wid)
        .append(g_wid.span.opn.wid)
        .append(g_wid.span.log.wid)
    
    g_wid.div.fs.wid
        .append(mkelem('[..]',function(){ goup(); }))
        .append(g_wid.div.lst.wid)
    
    $g_div_main.append(g_wid.div.fs.wid);
    $g_div_main.append(g_wid.pre.txt.wid);
    
    if (g_session == '0')
    {
        g_wid.span.opn.wid.remove();
        g_wid.span.log.wid
            .html('')
            .append(g_wid.inp.eml.wid)
            .append(g_wid.button.ent.wid);
    }
    else
    {
        g_wid.span.log.wid.html('')
            .append(g_wid.button.ext.wid);
        
        g_wid.span.opn.wid.html(g_wid.label.opn.wid);
        
        g_wid.span.opn.wid;
        g_wid.label.opn.wid
            .css('display', 'inline-block')
            .css('cursor', 'pointer')
            .css('text-align', 'center')
            .css('border', '1px solid')
            .css('border-radius', '3px')
            .css('margin-left', '16')
            .css('margin-right', '16')
            .css('min-width', '38px');
        
        // g_wid.div.lsu.wid.html($('<span>User files:<span/>'));
    }
    // g_wid.div.lst.wid.html($('<span>All files:<span/>'));
    $('button')
        .css('width', '40px')
        .css('margin-left', '0')
        .css('margin-right', '0');
}






























/*
function get_file_list(g_profile)
{
var fs = {};
var scan = function (nd, o)
{
o.name = nd.name;        
o.path = nd.str();
o.sz = nd.sz;
o.kids = {};
o.text = nd.text;
if (nd.kids)
{
for (let i in nd.kids)
{
if (nd.kids.hasOwnProperty(i))
jr(o.path + '/' + i).up(function(node)
{ 
scan(node, o.kids[i] = {}) 
});
}
}
};
}
*/