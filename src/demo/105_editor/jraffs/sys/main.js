// JRAF Team (C) 2017
'use strict';

var g_data = {
    text: '',
    pos: 0
}

var g_node = {
    dir: '/demo/105',
    txt: '/demo/105/txt.txt',
    pos: '/demo/105/pos.txt'
};

var g_wid = {
    l:
    {
        wid: $('<textarea/>', { id: 'l' }),
        text: '',
        pos: 0,
        history_text: [],
        history_pos: [],
        is_foc: function() { return (this.wid.is(':focus')) ? true : false; }
    },
    r:
    {
        wid: $('<textarea/>', { id: 'r' }),
        text: '',
        pos: 0,
        history_text: [],
        history_pos: [],
        is_foc: function() { return (this.wid.is(':focus')) ? true : false; }
    },
    ltv: { wid: $('<span/>') },
    lpv: { wid: $('<span/>') },
    rtv: { wid: $('<span/>') },
    rpv: { wid: $('<span/>') },
    ntv: { wid: $('<span/>') },
    npv: { wid: $('<span/>') }
};

function get_pipe(t, p)
{
    return t;
/*
    var d = new Date();
    var s = d.getSeconds();

    return t.substr(0,p) + '|' + t.substr(p)
*/
}

function set_caret_pos($o, i) {
    $o[0].setSelectionRange(+i,+i);
}

function main_html()
{
    var $div = $('<div/>')
        .append('<h3>Demo 105: Multiuser editor widget</h3>')
        .append($('<table/>')
            .css('margin', 'auto')
            .css('width', '80%')
            .append($('<tr/>')
                .append($('<td/>', {colspan: '2'})
                    .css('text-align', 'center')
                    .append(g_wid.ntv.wid)
                    .append($('<span/>',{ text: ':' }))
                    .append(g_wid.npv.wid)))
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.ltv.wid
                        .css('margin-left','1em'))
                    .append($('<span/>', {text: ':'}))
                    .append(g_wid.lpv.wid)
                    .css('text-align', 'left'))
                .append($('<td/>')
                    .append(g_wid.rtv.wid
                        .css('margin-left','1em'))
                    .append($('<span/>', {text: ':'}))
                    .append(g_wid.rpv.wid)
                    .css('text-align', 'left')))
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.l.wid
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        // .css('margin', '1em')
                        .css('width', '95%')
                        .css('height', '8em')))
                .append($('<td/>')
                    .append(g_wid.r.wid
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        // .css('margin', '1em')
                        .css('width', '95%')
                        .css('height', '8em')))));

    $g_div_main.html($div);
    $g_div_main.css('text-align', 'center');
}

function main_js()
{
    main_html();

    /// 'keydown' not working by HOME/END sometimes...
    g_wid.l.wid.on('input keyup click', function(e){change($(this), e); });
    g_wid.r.wid.on('input keyup click', function(e){change($(this), e); });

    jr(g_node.dir).md().up();

    init();
}

function fok_i($o)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;

    if (o.is_foc()) $o.val(o.text);
}

function fok_o($o)
{
    console.log('focusout');
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;

    // if (!o.is_foc()) $o.val(get_pipe(o.text, +o.pos));

    // workaround because focusout can occur multiple times
    if (!o.is_foc() && o.text[+o.pos] != '|') $o.val(get_pipe(o.text, +o.pos));
}

function is_ext_ascii(t)
{
    var ascii = /^[ -~\t\n\r]+$/;

    if (!ascii.test(t) && t != '') return false;

    return true;
}
function change($o, e)
{
    console.log(': event: manual changes : ' + e.type);
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = $o[0].selectionStart || 0;
    var t = $o.val() || '';
    var fn_dir_up = function(){jr(g_node.dir).up(); };
    // var t = (e.type == 'click') ? o.text : $o.val() || '';

    if (!is_ext_ascii(t)) return $o.val(o.text);
    if (t == o.text && p == o.pos) return;

    if (e.keyCode == 33
        || e.keyCode == 34
        || e.keyCode == 35
        || e.keyCode == 36
        || e.keyCode == 37
        || e.keyCode == 38
        || e.keyCode == 39
        || e.keyCode == 40)
    {
        if (p != o.pos)
        {
            o.history_pos.push(p);
            jr(g_node.pos).save(p).up(fn_dir_up);
            return false;
        }
    }

    if (t != o.text )
    {
        o.history_text.push(t);
        jr(g_node.txt).save(t).up(fn_dir_up);
    }

    if (p != o.pos)
    {
        o.history_pos.push(p);
        jr(g_node.pos).save(p).up(fn_dir_up);
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        var v = +node.ver;

        g_wid.ltv.wid.html(v);
        g_wid.rtv.wid.html(v);
        g_wid.ntv.wid.html(v);

        g_wid.l.text = node.text;
        g_wid.r.text = node.text;
    }

    var fn_pos_init = function(node)
    {
        var v = +node.ver;

        g_wid.lpv.wid.html(node.v);
        g_wid.rpv.wid.html(node.v);
        g_wid.npv.wid.html(node.v);

        g_wid.l.pos = +node.text;
        g_wid.r.pos = +node.text;
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;
        var found;


        g_wid.l.text = t;
        g_wid.r.text = t;
        
        g_wid.ntv.wid.html(v);
        g_wid.ltv.wid.html(v);
        g_wid.rtv.wid.html(v);

        found = false;
        for (let i=0; i<g_wid.l.history_text.length; i++)
        {
            if (t == g_wid.l.history_text[i])
            {
                found = true;
                g_wid.l.history_text.splice(i, 1);

                break;
            }
        }

        if (!found)
        {
            g_wid.l.history_text = [];
            g_wid.l.wid.val(t);
        }

        found = false;
        for (let i=0; i<g_wid.r.history_text.length; i++)
        {
            if (t == g_wid.r.history_text[i])
            {
                g_wid.r.history_text.splice(i, 1);
                found = true;

                break;
            }
        }

        if (!found)
        {
            g_wid.r.history_text = [];
            g_wid.r.wid.val(t);
        }


    };

    var fn_pos_bind = function(node)
    {
        var v = +node.ver;
        var p = node.text;
        var found;

        g_wid.l.pos = p;
        g_wid.r.pos = p;

        g_wid.npv.wid.html(v);
        g_wid.lpv.wid.html(v);
        g_wid.rpv.wid.html(v);


        found = false;
        for (let i=0; i<g_wid.l.history_pos.length; i++)
        {
            if (p == g_wid.l.history_pos[i])
            {
                g_wid.l.history_pos.splice(i, 1);
                found = true;

                break;
            }
        }

        if (!found)
        {
            if (g_wid.l.is_foc()) set_caret_pos(g_wid.l.wid, p);

            g_wid.l.history_pos = [];
        }

        found = false;
        for (let i=0; i<g_wid.r.history_pos.length; i++)
        {
            if (p == g_wid.r.history_pos[i])
            {
                g_wid.r.history_pos.splice(i, 1);
                found = true;

                break;
            }
        }

        if (!found)
        {
            if (g_wid.r.is_foc()) set_caret_pos(g_wid.r.wid, p);

            g_wid.r.history_pos = [];

        }

    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.pos).up(fn_pos_init);

    jr(g_node.txt).bind_fun(fn_txt_bind);
    jr(g_node.pos).bind_fun(fn_pos_bind);

    setInterval(function()
    {
        // jr(g_node.txt).up();
        // jr(g_node.pos).up();
        jr(g_node.dir).up();
    }, 1000);
}

