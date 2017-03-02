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
        t_ver: 0,
        p_ver: 0,
        history_text: [],
        history_pos: [],
        is_foc: function() { return (this.wid.is(':focus')) ? true : false; }
    },
    r:
    {
        wid: $('<textarea/>', { id: 'r' }),
        text: '',
        pos: 0,
        text_ver: 0,
        pos_ver: 0,
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
    var d = new Date();
    var s = d.getSeconds();

    return t.substr(0,p) + '|' + t.substr(p)
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
    g_wid.l.wid.on('input keyup click mousemoveon', function(e){change($(this), e); });
    g_wid.r.wid.on('input keyup click mousemoveon', function(e){change($(this), e); });

    jr(g_node.dir).md().up();

    init();
}

function is_ext_ascii(t)
{
    var ascii = /^[ -~\t\n\r]+$/;

    if (!ascii.test(t) && t != '') return false;

    return true;
}

function change($o, e)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p =  +($o[0].selectionStart) || 0;
    var t = $o.val() || '';
    var fn_dir_up = function(){jr(g_node.dir).up(); };

    if (!is_ext_ascii(t)) return $o.val(o.text);
    if (t == o.text && p == o.pos) return;

    if (t != o.text )
    {
        if (o.history_text[o.history_text.length-1] != t)
        {
            o.history_text.push(t);
            jr(g_node.txt).save(t).up(fn_dir_up);
        }
    }

    if (p != o.pos)
    {
        if (o.history_pos[o.history_pos.length-1] != p)
        {
            o.history_pos.push(p);
            jr(g_node.pos).save(p).up(fn_dir_up);
        }
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        g_wid.ntv.wid.html(v);

        g_wid.ltv.wid.html(v);
        g_wid.rtv.wid.html(v);

        g_wid.l.text = t;
        g_wid.l.text_ver = v;
        g_wid.l.wid.val(t);

        g_wid.r.text = t;
        g_wid.r.text_ver = v;
        g_wid.r.wid.val(t);
    }

    var fn_pos_init = function(node)
    {
        var v = +node.ver;
        var t = +node.text;

        g_wid.npv.wid.html(v);

        g_wid.lpv.wid.html(v);
        g_wid.rpv.wid.html(v);

        g_wid.l.pos = t;
        g_wid.l.pos_ver = v;

        g_wid.r.pos = t;
        g_wid.r.pos_ver = v;
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;
        var t = node.text;

        g_wid.ntv.wid.html(v);

        if (v > g_wid.l.text_ver)
        {
            g_wid.l.text = t;
            g_wid.l.text_ver = v;

            g_wid.ltv.wid.html(v);

            let i = g_wid.l.history_text.indexOf(t);

            if (i > -1)
                g_wid.l.history_text.splice(0, i+1);
            else
            {
                g_wid.l.wid.val(t);
                g_wid.l.history_text = [];
            }
        }

        if (v > g_wid.r.text_ver)
        {
            g_wid.r.text = t;
            g_wid.r.text_ver = v;

            g_wid.rtv.wid.html(v);

            let i = g_wid.r.history_text.indexOf(t);

            if (i > -1)
                g_wid.r.history_text.splice(0, i+1);
            else
            {
                g_wid.r.wid.val(t);
                g_wid.r.history_text = [];
            }
        }
    };

    var fn_pos_bind = function(node)
    {
        var v = +node.ver;
        var p = +node.text;

        g_wid.npv.wid.html(v);

        if (v > g_wid.l.pos_ver)
        {
            g_wid.l.pos = p;
            g_wid.l.pos_ver = v;

            g_wid.lpv.wid.html(v);

            let i = g_wid.l.history_pos.indexOf(p);

            if (i > -1)
                g_wid.l.history_pos.splice(0, i+1);
            else
            {
                if (g_wid.l.is_foc()) set_caret_pos(g_wid.l.wid, p);
                
                g_wid.l.history_pos = [];
            }
        }

        if (v > g_wid.r.pos_ver)
        {
            g_wid.r.pos = p;
            g_wid.r.pos_ver = v;

            g_wid.rpv.wid.html(v);

            let i = g_wid.r.history_pos.indexOf(p);

            if (i > -1)
                g_wid.r.history_pos.splice(0, i+1);
            else
            {
                if (g_wid.r.is_foc()) set_caret_pos(g_wid.r.wid, p);
                g_wid.r.history_pos = [];
            }
        }
    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.pos).up(fn_pos_init);

    jr(g_node.txt).bind_fun(fn_txt_bind);
    jr(g_node.pos).bind_fun(fn_pos_bind);

    
    jr(g_node.dir).up();
    
    refresh_chain();
}

function refresh_cback(cb){ jr(g_node.dir).up() }

function refresh_chain()
{
	var cb = function(){ setTimeout(refresh_chain, 10000); };
	refresh_cback(cb);
}
