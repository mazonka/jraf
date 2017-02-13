

'use strict';

///var jraf = {};
///jraf.vers = 0;
///jraf.cb = null;

var g_sys_files = {};
var g_session;
var $g_div_main;

function jraf_ajax(cmd, callback, extra) {
    $.post('/','command=' + cmd)

    .done(function (data) {
        callback(data,extra);
    })

    .fail(function () {
        callback('FAIL');
    })

    .always(function () {});
}


function jraf_boot(id)
{
    g_session = id;

    console.log('Jraf boot: hello');
    console.log('Jraf sid:' + g_session);
    document.write('<div id="div_main" style="text-align: left;"></div>');
    $g_div_main = $('#div_main');

    var out = function(data,extra)
    {
        if( data.length > 4 && data.substr(0,3) == 'OK ' )
            data = data.substr(3);

        var s = $g_div_main.html();
        s += '# ' + extra + data + '<br/>';
        $g_div_main.html(s);
    }

    jraf_ajax('jraf ping', out, 'JRAF : ');
    jraf_ajax('jraf version client', out, 'Jraf client version : ');
    jraf_ajax('jraf version backend', out, 'Jraf backend version : ');

    var sysjs = function(jo)
    {
        if( jo.err != '' )
        {
            out(jo.err,'Backend error on [/sys]: ');
            return;
        }

        var cb = function(data,ex)
        {
            if( data.err != '' )
            {
                out(data.err,'Backend error '+ex);
                return;
            }

            out('ok',ex);
            var sc = document.createElement('script');
            sc.innerHTML = data.text;
            //console.log(sc.innerHTML);
            document.head.append(sc);
        }

        for( var i in jo.kids ) g_sys_files[i.replace('.','_')] = 1;
	    console.log('sys objects: '+ Object.keys(g_sys_files).length);

        for( var i in jo.kids )
        {
            jraf_read_obj('/sys/',i, cb, i+' : ');
        }

	    sys_loaded();
    }

    jraf_read_obj('/', 'sys', sysjs);

    console.log('sys loading started');
    //sys_loaded1();
    //sys_loaded2();
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
			///console.log(i);
			///console.log(typeof window[i]);
			///console.log(window[i]);
		}
	}

    console.log('sys loaded');

	for( let i in g_sys_files )
	{
		window[i]();
	}

    console.log('sys started');
}

function jraf_read_obj(path, ob, cb, extra)
{
    var par = function(data, ext)
    {
        ext.cb(jraf_parse_obj(data,ext.ob),ext.ex);
    }

    var ex = {};
    ex.ex = extra;
    ex.ob = ob;
    ex.cb = cb;
    jraf_ajax('jraf read 0 '+path+ob, par, ex);
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
            r.text = window.atob(a[3]);
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

    ///console.log('jraf_parse_obj : '+r);
    return r;
}

