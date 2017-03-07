// Jraf team (C) 2017
'use strict';

var g_profile = {};
var g_wid = {
    button: { ent: {}, ext: {}},
    h3: {},
    label: { opn: {} },
    inp: { eml: {} },
    span: { log: {}, opn: {} },
    div: { lsu: {}, lso: {}, }
};

g_wid.h3.wid = $('<h3>UNIPHYZ</h3>').css('text-align', 'center');
g_wid.button.ent.wid = $('<button/>', { text: '>', click: login });
g_wid.button.ext.wid = $('<button/>', { text: 'X', click: logout });
g_wid.label.opn.wid = $('<label/>', { text: '^' })
    .append($('<input type=file onchange="opn(this.files)"/>').hide());

g_wid.inp.eml.wid = $('<input/>', {});
g_wid.span.opn.wid = $('<span/>');
g_wid.span.log.wid = $('<span/>');
g_wid.div.lsu.wid = $('<div/>');
g_wid.div.lso.wid = $('<div/>');

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
        //jr(data.name).save(data.text);
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
        get_file_list(g_profile);
    };

    jraf_ajax(['jr profile',sid].join(' '), cb);
}

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
                if (nd.kids.hasOwnProperty(i) )
                {
                    o.kids[i] = {};
                    jr(o.path + '/' + i).up(function(node){ scan(node, o.kids[i]) } );
                }
            }
        }
    };
    
    console.log(g_profile.unm);
    
    if (g_profile.unm == '*')
    {
        var cb = function (node) 
        { 
            fs[node.name] = {};
            scan(node, fs[node.name]);
            console.dir(fs);
        };
        jr('/home').up(cb);
    }
    else
    {
        //jr(g_profile.unm).up(function(node){console.log(node.kids)});
        //jr(g_profile.unm).up(function(node){console.log(node.kids)});
    }

}

function wid_main(pf,ukids,okids)
{
    $g_div_main.html('')
        .append(g_wid.h3.wid)
        .append(g_wid.span.opn.wid)
        .append(g_wid.span.log.wid)
        .append(g_wid.div.lsu.wid)
        .append(g_wid.div.lso.wid)

    if (g_session == '0')
    {
        g_wid.span.opn.wid.remove();
        g_wid.div.lsu.wid.remove();
        g_wid.span.log.wid.html('')
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

        g_wid.div.lsu.wid.html($('<span>User files:<span/>'));
    }
    g_wid.div.lso.wid.html($('<span>All files:<span/>'));
    $('button')
        .css('width', '40px')
        .css('margin-left', '0')
        .css('margin-right', '0');
}
