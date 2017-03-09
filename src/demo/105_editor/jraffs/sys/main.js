// JRAF Team (C) 2017
'use strict';

var g_node = {
    dir: '/demo/105',
    txt: '/demo/105/txt.txt',
    pos: '/demo/105/pos.txt'
};

var g_wid = {
    l:
    {
        textarea: $('<textarea/>', {id: 'l'}),
        txt: '',
        pos: 0,
        txt_v: 0,
        pos_v: 0,
        txt_h: [],
        pos_h: [],
        is_foc: function(){return (this.textarea.is(':focus')) ? true : false;},
        ch: $('<span>&nbsp;<span>')
    },
    r:
    {
        textarea: $('<textarea/>', { id: 'r' }),
        txt: '',
        pos: 0,
        txt_v: 0,
        pos_v: 0,
        txt_h: [],
        pos_h: [],
        is_foc: function(){return (this.textarea.is(':focus')) ? true : false;},
        ch: $('<span>&nbsp;<span>')
    }
};

function set_caret_pos($o, i)
{
    $o[0].setSelectionRange(+i, +i);
}

function main_html()
{
    var $div = $('<div/>')
        .append('<h3>Demo 105: Multiuser editor widget</h3>')
        .append($('<table/>')
            .css('margin', 'auto')
            .css('width', '80%')
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.l.ch)
                    .css('text-align', 'left'))
                .append($('<td/>')
                    .append(g_wid.r.ch)
                    .css('text-align', 'left')))
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.l.textarea
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        .css('width', '95%')
                        .css('height', '8em')))
                .append($('<td/>')
                    .append(g_wid.r.textarea
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        .css('width', '95%')
                        .css('height', '8em')))));

    $g_div_main.html($div);
    $g_div_main.css('text-align', 'center');
}

function main_js()
{
    main_html();

    g_wid.l.textarea.on('input keyup click', function(e){asterisk($(this))});
    g_wid.r.textarea.on('input keyup click', function(e){asterisk($(this))});

    setInterval(function(){change(g_wid.l.textarea)}, 750);
    setInterval(function(){change(g_wid.r.textarea)}, 750);

    jr(g_node.dir).md().up();

    init();
}

function asterisk($o)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = +($o[0].selectionStart) || 0;
    var t = $o.val() || '';

    if (t == o.txt && p == o.pos) return o.ch.html('&nbsp');
    
    o.ch.html('*');
}

function change($o)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = +($o[0].selectionStart) || 0;
    var t = $o.val() || '';

    if (t == o.txt && p == o.pos) return o.ch.html('&nbsp');

    if (t != o.txt)
    {
        if (o.txt_h[o.txt_h.length - 1] != t)
        {
            console.log('catch text');
            o.txt_h.push(t);
            jr(g_node.txt).save(t);
        }
    }

    if (p != o.pos)
    {
        if (o.pos_h[o.pos_h.length - 1] != p)
        {
            console.log('catch pos');
            o.pos_h.push(p);
            jr(g_node.pos).save(p);
        }
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        g_wid.l.txt = t;
        g_wid.l.txt_v = v;
        g_wid.l.textarea.val(t);

        g_wid.r.txt = t;
        g_wid.r.txt_v = v;
        g_wid.r.textarea.val(t);
    }

    var fn_pos_init = function(node)
    {
        var v = +node.ver;
        var t = +node.text;

        g_wid.l.pos = t;
        g_wid.l.pos_v = v;

        g_wid.r.pos = t;
        g_wid.r.pos_v = v;
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        if (v > g_wid.l.txt_v)
        {
            g_wid.l.txt = t;
            g_wid.l.txt_v = v;
            console.log('text');
            let i = g_wid.l.txt_h.indexOf(t);

            if (i > -1)
                g_wid.l.txt_h.splice(0, i + 1);
            else
            {
                g_wid.l.textarea.val(t);
                g_wid.l.txt_h = [];
            }
        }

        if (v > g_wid.r.txt_v)
        {
            g_wid.r.txt = t;
            g_wid.r.txt_v = v;

            let i = g_wid.r.txt_h.indexOf(t);

            if (i > -1)
                g_wid.r.txt_h.splice(0, i + 1);
            else
            {
                g_wid.r.textarea.val(t);
                g_wid.r.txt_h = [];
            }
        }
    };

    var fn_pos_bind = function(node)
    {
        var v = +node.ver;
        var p = +node.text;

        if (v > g_wid.l.pos_v)
        {
            g_wid.l.pos = p;
            g_wid.l.pos_v = v;
            
            let i = g_wid.l.pos_h.indexOf(p);
            console.log('pos');
            if (i > -1)
                g_wid.l.pos_h.splice(0, i + 1);
            else
            {
                if (g_wid.l.is_foc()) set_caret_pos(g_wid.l.textarea, p);

                g_wid.l.pos_h = [];
            }
        }

        if (v > g_wid.r.pos_v)
        {
            g_wid.r.pos = p;
            g_wid.r.pos_v = v;

            let i = g_wid.r.pos_h.indexOf(p);

            if (i > -1)
                g_wid.r.pos_h.splice(0, i + 1);
            else
            {
                if (g_wid.r.is_foc()) set_caret_pos(g_wid.r.textarea, p);
                g_wid.r.pos_h = [];
            }
        }
    };

    jr(g_node.txt)
        .up(fn_txt_init);
    jr(g_node.pos)
        .up(fn_pos_init);

    jr(g_node.txt)
        .bind_fun(fn_txt_bind);
    jr(g_node.pos)
        .bind_fun(fn_pos_bind);

    refresh_chain();
}

function refresh_cback(vn, cb)
{
    vn.up(cb)
}

function refresh_chain()
{
    var vn = jr(g_node.dir);
    var cb = function(n)
    {
        if (n != vn.node) return;
        setTimeout(refresh_chain, 1000);
    };

    refresh_cback(vn, cb);
}