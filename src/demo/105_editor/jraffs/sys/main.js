// JRAF Team (C) 2017
'use strict';

var g_node = {
    dir: '/demo/105',
    txt: '/demo/105/txt.txt',
    pos: '/demo/105/pos.txt'
};

var g_wid = {};

function main_js()
{
    g_wid.l = mko('l');
    g_wid.r = mko('r');

    main_html();

    for (let i in g_wid)
    {
        if (g_wid.hasOwnProperty(i))
        {
            let p = g_wid[i];
            // console.dir(p);
            // console.dir(g_wid[i]);
            let timer_id = setTimeout(function chfix()
            {
                change(p.textarea);
                timer_id = setTimeout(chfix, 750);

            }, 750);

            p.textarea.on('input keyup click', function()
            {
                asterisk(p.textarea);
            });
        }
    }
    // setInterval(function(){change(g_wid['l'].textarea)}, 750);
    // setInterval(function(){change(g_wid['r'].textarea)}, 750);

    jr(g_node.dir).md().up();

    init();
}

function mko(x)
{
    return {
        textarea: $('<textarea/>',{id: x}),
        txt: '',
        pos: 0,
        txt_v: 0,
        pos_v: 0,
        txt_h: [],
        pos_h: [],
        mod: {t: 0, p: 0},
        is_foc: function(){return (this.textarea.is(':focus'))?true:false;},
        span: $('<span>&nbsp;<span>')
    }
}

function main_html()
{
    var $div = $('<div/>');
    var $table = $('<table/>');
    var $tr0 = $('<tr/>');
    var $tr1 = $('<tr/>');

    for (let i in g_wid)
    {
        if (g_wid.hasOwnProperty(i))
        {
            $tr0.append($('<td/>')
                .append(g_wid[i].span)
                .css('text-align', 'left'));

            $tr1.append($('<td/>')
                .append(g_wid[i].textarea
                    .css('white-space', 'pre')
                    .css('resize', 'none')
                    .css('width', '99%')
                    .css('height', '8em')));
        }
    }

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

function asterisk($o)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = +($o[0].selectionStart);
    var t = $o.val() || '';

    if (t == o.txt && p == o.pos) return;
    if (t != o.txt) o.mod.t = 1;
    if (p != o.pos) o.mod.p = 1;

    o.span.html('*');
}

function change($o)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = +($o[0].selectionStart);
    var t = $o.val() || '';

    if (!o.is_foc()) p = -1;
    if (t == o.txt && (p == o.pos || p == -1)) return;

    console.log('change:' + $o.prop('id'));

    let cb = function(){jr(g_node.dir).up()};

    if (t != o.txt)
    {
        if (o.txt_h[o.txt_h.length - 1] != t)
        {
            o.txt_h.push(t);
            jr(g_node.txt).save(t,cb);
        }
    }

    if (p != o.pos && p != -1)
    {
        if (o.pos_h[o.pos_h.length - 1] != p)
        {
            o.pos_h.push(p);
            jr(g_node.pos).save(p,cb);
        }
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        for (let i in g_wid)
        {
            if (g_wid.hasOwnProperty(i))
            {
                g_wid[i].txt = node.text;
                g_wid[i].txt_v = +node.ver;
                g_wid[i].textarea.val(node.text);
            }
        }
    }

    var fn_pos_init = function(node)
    {
        for (let i in g_wid)
        {
            if (g_wid.hasOwnProperty(i))
            {
                g_wid[i].pos_v = +node.ver;
                g_wid[i].pos = +node.text;
            }
        }
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        for (let i in g_wid)
        {
            if (g_wid.hasOwnProperty(i))
            {
                if (v > g_wid[i].txt_v)
                {
                    g_wid[i].txt = t;
                    g_wid[i].txt_v = v;

                    let h = g_wid[i].txt_h.indexOf(t);
                    if (h > -1)
                        g_wid[i].txt_h.splice(0, h + 1);
                    else
                    {
                        g_wid[i].textarea.val(t);
                        g_wid[i].txt_h = [];
                    }

                    g_wid[i].mod.t = 0;
                    check_mod(g_wid[i].span, g_wid[i].mod);
                }
            }
        }
    };

    var fn_pos_bind = function(node)
    {
        var v = +node.ver;
        var p = +node.text;

        for (let i in g_wid)
        {
            if (g_wid.hasOwnProperty(i))
            {
                if (v > g_wid[i].pos_v)
                {
                    g_wid[i].pos = p;
                    g_wid[i].pos_v = v;

                    let h = g_wid[i].pos_h.indexOf(p);
                    if (h > -1)
                        g_wid[i].pos_h.splice(0, h + 1);
                    else
                    {
                        if (g_wid[i].is_foc())
                            set_caret_pos(g_wid[i].textarea, p);

                        g_wid[i].pos_h = [];
                    }

                    g_wid[i].mod.p = 0;
                    check_mod(g_wid[i].span, g_wid[i].mod);
                }
            }
        }
    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.pos).up(fn_pos_init);

    jr(g_node.txt).bind_fun(fn_txt_bind);
    jr(g_node.pos).bind_fun(fn_pos_bind);

    refresh_chain();
}


function set_caret_pos($o, i)
{
    $o[0].setSelectionRange(+i, +i);
}

function check_mod($o, mod)
{
    if (mod.t == 0 && mod.p == 0) $o.html('&nbsp;');
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