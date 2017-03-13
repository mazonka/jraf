// JRAF Team (C) 2017
'use strict';

var g_node = {
    dir: '/demo/105',
    txt: '/demo/105/editor2.txt'
};

var g_wid = {
    textarea: $('<textarea/>'),
    span: $('<span>&nbsp;<span>'),
    txt: '',
    ver: 0,
    his: [],
    mod: 0
};

function main_js()
{
    main_html();

    let timer_id = setTimeout(function chfix()
    {
        change();
        timer_id = setTimeout(chfix, 750);
    }, 750);

    g_wid.textarea.on('input keyup', function()
    {
        asterisk();
    });

    jr(g_node.dir).md().up();

    init();
}

function main_html()
{
    var $div = $('<div/>');
    var $table = $('<table/>');
    var $tr0 = $('<tr/>');
    var $tr1 = $('<tr/>');

    $tr0.append($('<td/>')
        .append(g_wid.span)
        .css('text-align', 'left'));

    $tr1.append($('<td/>')
        .append(g_wid.textarea
        .css('white-space', 'pre')
        .css('resize', 'none')
        .css('width', '99%')
        .css('height', '8em')));
        
    $table
        .append($tr0)
        .append($tr1)
        .css('margin', 'auto')
        .css('width', '80%');

    $div
        .append('<h3>Multiuser editor widget</h3>')
        .append($table);

    $g_div_main.html($div);
    $g_div_main.css('text-align', 'center');
}

function asterisk()
{
    var t = g_wid.textarea.val() || '';

    if (t == g_wid.txt) return;
    
    g_wid.mod = 1;

    g_wid.span.html('*');
}

function change()
{
    var t = g_wid.textarea.val() || '';

    if (t == g_wid.txt) return;

    let cb = function(){jr(g_node.dir).up()};

    if (t != g_wid.txt)
    {
        if (g_wid.his[g_wid.his.length - 1] != t)
        {
            g_wid.his.push(t);
            jr(g_node.txt).save(t,cb);
        }
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        g_wid.txt = node.text;
        g_wid.ver = +node.ver;
        g_wid.textarea.val(node.text);
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        if (v > g_wid.ver)
        {
            g_wid.txt = t;
            g_wid.ver = v;

            let h = g_wid.his.indexOf(t);
            if (h > -1)
                g_wid.his.splice(0, h + 1);
            else
            {
                g_wid.textarea.val(t);
                g_wid.his = [];
            }

            g_wid.mod = 0;
            check_mod(g_wid.span, g_wid.mod);
        }
    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.txt).bind_fun(fn_txt_bind);

    refresh_chain();
}

function check_mod($o, mod)
{
    if (mod == 0) $o.html('&nbsp;');
}

function refresh_cback(vn, cb)
{
    vn.up(cb);
}

function refresh_chain()
{
    var vn = jr(g_node.dir);
    var cb = function(n)
    {
        if (n != vn.node) return;
        setTimeout(refresh_chain, 5000);
    };

    refresh_cback(vn, cb);
}