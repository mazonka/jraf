// JRAF Team (C) 2017

'use strict';

var g_sys_files = {};
var g_session;
var g_startx;
var $g_div_main;


var g_ajax_wlp = window.location.pathname;
var g_ajax_cntr = 0;
//var ajax_test = 2;

function jraf_ajax(cmd, callback, extra)
{
    jraf_ajax_get(cmd, callback, extra);
    //jraf_ajax_post(cmd, callback, extra);
}

function jraf_ajax_get(cmd, callback, extra)
{
    $.get(g_ajax_wlp,'r ' + (++g_ajax_cntr) + ' ' + encodeURI(cmd))

    .done(function (data) {
        //if( ++ajax_test%5 ) return callback(null,extra);
        callback(data,extra);
    })

    .fail(function () {
        callback(null,extra);
    })

    .always(function () {});
}

function jraf_ajax_post(cmd, callback, extra)
{
    $.post(g_ajax_wlp,'command=r ' + (++g_ajax_cntr) + ' ' + cmd)

    .done(function (data) {
        //if( ++ajax_test%5 ) return callback(null,extra);
        callback(data,extra);
    })

    .fail(function () {
        callback(null,extra);
    })

    .always(function () {});
}


var inject_script_error_message = '';
function jr_wonerr(msg, url, lineNo, columnNo, error)
{
    inject_script_error_message = 'script load ERROR [' + msg +'] line '+ lineNo;;
    return true;
}

function inject_script(text)
{
    var old_wonerr = window.onerror;
    window.onerror = jr_wonerr;
    window.jr_wonerr_message = '';

    try
    {
        var sc = document.createElement('script');
        sc.innerHTML = text;
        if( 'append' in document.head ) document.head.append(sc);
        else document.head.appendChild(sc);
    }
    catch (e) 
    {
        if (e instanceof SyntaxError) 
            jr_wonerr(e.message,'',e.lineNumber,e.columnNumber,e);
        return;
    }

    window.onerror = old_wonerr;
}


function inject_script_old(text)
{
    var sc = document.createElement('script');
    sc.innerHTML = text;
    if( 'append' in document.head ) document.head.append(sc);
    else document.head.appendChild(sc);
}

function jraf_boot(id)
{
    var vid = id.split(/\/(.+)/);
    g_session = vid[0];
    if( vid[1] )
    {
        g_startx = {};
        g_startx.file = vid[1];
        g_startx.name = g_startx.file.split(/\//).slice(-1)[0].replace('.','_');
        g_startx.booting = true;
    }

    console.log('Jraf boot: ' + g_session+ ( g_startx ? ' on '+g_startx.name : '' ) );

    document.write('<div id="div_main" style="text-align: left;"></div>');
    $g_div_main = $('#div_main');

    var out = function(data,extra)
    {
        if( data == null ) data = 'FAILED';

        if( data.length > 4 && data.substr(0,3) == 'OK ' )
            data = data.substr(3);

        var s = $g_div_main.html();
        s += '# ' + extra + data + '<br/>';
        $g_div_main.html(s);
    };

    jraf_ajax('jr ping', out, 'JRAF : ');
    jraf_ajax('jr version client', out, 'Jraf client version : ');
    jraf_ajax('jr version backend', out, 'Jraf backend version : ');

    var sysjs = function(jo)
    {
        if( jo.err != '' )
        {
            out(jo.err,'Backend error on [/sys]: ');
            return;
        }

        var counter = 0;
        var cb = function(data,ex)
        {
            if( data.err != '' )
            {
                out(data.err,'ERROR loading '+ex);
                return;
            }

            out('ok',ex);
            inject_script(data.text);
            if( inject_script_error_message != '' ) 
            {
                out(inject_script_error_message,ex);
                inject_script_error_message = '';
                return;
            }

            if( --counter==0 )
            {
                if( g_startx && !( g_startx.name in window ) )
                    out('Cannot start '+g_startx.name,ex);
                else sys_loaded();
            }
        }

        for( var i in jo.kids ) if( i.substr(0,1)=='.' ) delete jo.kids[i];
        for( var i in jo.kids ) g_sys_files[i.replace('.','_')] = 1;
        console.log('sys objects: '+ Object.keys(g_sys_files).length);

        for( var i in jo.kids )
        {
            ++counter;
            jraf_read_obj('/sys/',i, cb, i+' : ');
        }

        if(g_startx)
        {
            ++counter;
            jraf_read_obj('/', g_startx.file, cb, g_startx.file + ' : ');
        }

        ///sys_loaded();
    }

    jraf_read_obj('/', 'sys', sysjs);

    console.log('sys loading started');
}

/*
example
var global;
try {
  global = Function('return this')() || (42, eval)('this');
} catch(e) {
  global = window;
}
*/

function sys_loaded()
{
    for( let i in g_sys_files )
    {
        if( typeof window[i] === 'undefined' )
        {
            console.log('waiting for '+i);
            setTimeout(sys_loaded,500);
            return;
        }
        else
        {
            ///console.log(window[i]);
        }
    }

    console.log('sys loaded');

    for( let i in g_sys_files ) window[i]();
    if(g_startx) window[g_startx.name]();

    console.log('sys started');
}

function jraf_read_obj(path, ob, cb, extra)
{
    var par = function(data, ext)
    {
        if( data != null )
        {
            console.log('req '+path+ob+' '+data.substr(0,2) );
            return ext.cb(jraf_parse_obj(data,ext.ob),ext.ex);
        }

        console.log('load '+path+ob+" FAILED");
        jraf_read_obj(path, ob, cb, extra);
    }

    var ex = {};
    ex.ex = extra;
    ex.ob = ob;
    ex.cb = cb;
    jraf_ajax('jr read ' + g_session + ' ' + path + ob, par, ex);
}

function jraf_parse_obj(text,nm)
{
    text = text.trim();
    var a = text.split(' ');
    var r = { err: '' };
    if( a[0] != 'OK' )
    {
        console.log('Backend reply: '+text);
        return { err: text };
    }
    r.ver = parseInt(a[1]);
    r.sz = parseInt(a[2]);
    r.cb = null;
    r.name = nm;

    if( r.sz >= 0 )
    {
        if( a.length < 4 )
            r.text = '';
        else
            //r.text = window.atob(a[3]);
            r.text = Base64.decode(a[3]);
        return r;
    }

    if( r.sz < 0 )
    {
        var n = parseInt(a[3]);
        r.kids = {};

        let nex = 3*n+4;
        if( a.length != nex )
        {
            let e = 'ERROR: jraf_read_obj returned '+a.length;
            e += ', expected '+ nex + ' ['+text+']';
            console.log(e);
            return r;
        }

        for( var i=0; i<n; i++ )
        {
            var ver = parseInt(a[4+3*i]);
            var sz = parseInt(a[5+3*i]);
            var name = a[6+3*i];
            r.kids[name] = {};
            r.kids[name].ver = ver;
            r.kids[name].sz = sz;
            r.kids[name].cbi = 0;
            r.kids[name].name = name;
            r.kids[name].parent = r;
        }
    }

    return r;
}

