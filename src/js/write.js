// (C) 2016
'use strict';

function write_js(){}
var g_sys_loaded_write = 1;

function o(x){ console.log(x); }

function jraf_write_md(cwd,name,cbi)
{
    var cb = function(jo){ cbi(jo); };
    var path = (cwd.str() == '/') ? cwd.str() + name : cwd.str() + '/' +name;
    jraf_write_obj('md '+path, cb);
}

function jraf_write_save(pth,body,cbi)
{
    var cb = function(jo){ cbi(jo); };
    var b64 = window.btoa(body);
    jraf_write_obj('save '+pth+' '+body.length+' '+b64, cb);
}

function jraf_write_rm(cwd,name,cbi)
{
    var cb = function(jo){ cbi(jo); };
    var path = cwd.str()+'/'+name;
    jraf_write_obj('rm '+path, cb);
}

function jraf_write_obj(cmd, cb, extra)
{
    var parser = function(data, ext)
    {
        ext.cb(jraf_parse_wrt(data),ext.ex);
    }

    var ex = {};
    ex.ex = extra;
    ex.cb = cb;
    jraf_ajax("jraf au " + g_session+' ' + cmd, parser, ex);
}

function jraf_parse_wrt(data)
{
    data = data.trim();
    var a = data.split(' ');
    var r = { err: '' };
    if( a[0] != "OK" )
    {
        console.log("Backend reply: "+ data);
        return { err: data };
    }

    r.msg = 'ok';
    return r;
}

