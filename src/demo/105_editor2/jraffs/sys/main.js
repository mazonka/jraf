// JRAF Team (C) 2017
'use strict';

var g_node = {
    dir: '/demo/105',
    txt: '/demo/105/txt.txt',
    pos: '/demo/105/pos.txt'
};

var g_wid = {
    textarea: $('<textarea/>'),
    txt: '',
    txt_v: 0,
    txt_h: [],
    mod: {t: 0},
    is_foc: function(){return (this.textarea.is(':focus'))?true:false;},
    span: $('<span>&nbsp;<span>')
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
        .append('<h3>Demo 105: Multiuser editor widget</h3>')
        .append($table);

    $g_div_main.html($div);
    $g_div_main.css('text-align', 'center');
}

function asterisk()
{
    var t = g_wid.textarea.val() || '';

    if (t == g_wid.txt) 
        return;
    else
        g_wid.mod.t = 1;

    g_wid.span.html('*');
}

function change()
{
    var t = g_wid.textarea.val() || '';

    if (t == g_wid.txt) return;

    let cb = function(){jr(g_node.dir).up()};

    if (t != g_wid.txt)
    {
        if (g_wid.txt_h[g_wid.txt_h.length - 1] != t)
        {
            g_wid.txt_h.push(t);
            jr(g_node.txt).save(t,cb);
        }
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        g_wid.txt = node.text;
        g_wid.txt_v = +node.ver;
        g_wid.textarea.val(node.text);
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        if (v > g_wid.txt_v)
        {
            g_wid.txt = t;
            g_wid.txt_v = v;

            let h = g_wid.txt_h.indexOf(t);
            if (h > -1)
                g_wid.txt_h.splice(0, h + 1);
            else
            {
                g_wid.textarea.val(t);
                g_wid.txt_h = [];
            }

            g_wid.mod.t = 0;
            check_mod(g_wid.span, g_wid.mod);
        }
    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.txt).bind_fun(fn_txt_bind);

    refresh_chain();
}

function check_mod($o, mod)
{
    if (mod.t == 0) $o.html('&nbsp;');
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