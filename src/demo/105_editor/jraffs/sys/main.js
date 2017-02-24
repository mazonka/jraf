// JRAF Team (C) 2017
'use strict';

var g_ver_nd;

var g_ver_textarea_txt;
var g_ver_textarea_pos;
var g_ver_textarea;
var g_ver_node_dir;

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
    l: { wid: $('<textarea/>', {id: 'l'}), text: '', pos: 0, pver: 0, tver: 0 },
    r: { wid: $('<textarea/>', {id: 'r'}), text: '', pos: 0, pver: 0, tver: 0 },
    ltv: { wid: $('<span/>') },
    lpv: { wid: $('<span/>') },
    rtv: { wid: $('<span/>') },
    rpv: { wid: $('<span/>') },
    ntv: { wid: $('<span/>') },
    npv: { wid: $('<span/>') },
    foc: function()
    {
        var self = this;
        
        if (self.l.wid.is(':focus'))
            return self.l;
        else if (self.r.wid.is(':focus'))
            return self.r;

        return null;
    },
    unf: function()
    {
        var self = this;

        if (self.foc() == self.l)
            return self.r;
        else if (self.foc() == self.r)
            return self.l;
        
        return null;
    }
};

function get_pipe(t, p)
{
    var d = new Date();
    var s = d.getSeconds();

    return t.substr(0,p) + '|' + t.substr(p)
    // return (s % 2 == 0)
        // ? t.substr(0,p) + '|' + t.substr(p)
        // : t.substr(0,p) + ' ' + t.substr(p);
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

    /// keydown not working by HOME/END sometimes...
    g_wid.l.wid.on('input keyup click', function(e){change($(this), e); });
    g_wid.r.wid.on('input keyup click', function(e){change($(this), e); });

    g_wid.l.wid.focus(fokus);
    g_wid.r.wid.focus(fokus);
    
    jr(g_node.dir).md().up();
    
    init();
}

function fokus()
{
    if (g_wid.foc() !== null) g_wid.foc().wid.val(g_wid.foc().text);
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
    var p = $o[0].selectionStart || 0;
    var t = $o.val() || '';
    
    if (!is_ext_ascii(t)) return $o.val(o.text);
    if (t == o.text && p == o.pos) return;

    // save data - version, text and cursor position;
    if (t != o.text )
    {
        ++o.tver;
        o.text = t;
        
        ++o.pver;
        o.pos = p;

        jr(g_node.txt).save(t).up();
        jr(g_node.pos).save(p).up();
    }

    if (p != o.pos)
    {
        ++o.pver;
        o.pos = p;

        jr(g_node.pos).save(p).up();
    }

    if (o == g_wid.l)
    {
        g_wid.ltv.wid.html(o.tver);
        g_wid.lpv.wid.html(o.pver);
    }
    else
    {
        g_wid.rtv.wid.html(o.tver);
        g_wid.rpv.wid.html(o.pver);
    }
    
    /// ask why bind_fun do not work without version changes
    // jr(g_node.txt).save(t).up();
    // jr(g_node.pos).save(p).up();
}

function init()
{
    var fn_txt_init = function(node)
    {
        var v = +node.ver;
        
        g_wid.l.tver = v;
        g_wid.r.tver = v;

        g_wid.ltv.wid.html(v);
        g_wid.rtv.wid.html(v);
        g_wid.ntv.wid.html(v);

        g_wid.l.text = node.text;
        g_wid.r.text = node.text;
    }

    var fn_pos_init = function(node)
    {
        var v = +node.ver;
        
        g_wid.l.pver = v;
        g_wid.r.pver = v;

        g_wid.lpv.wid.html(node.v);
        g_wid.rpv.wid.html(node.v);
        g_wid.npv.wid.html(node.v);

        g_wid.l.pos = +node.text;
        g_wid.r.pos = +node.text;
    }

    var fn_txt_bind = function(node)
    {
        var v = +node.ver;

        if (g_wid.ntv.wid.html() != v) g_wid.ntv.wid.html(v);

        if (g_wid.l.tver < v)
        {
            g_wid.l.wid.val(node.text);

            g_wid.l.tver = v;
            g_wid.l.text = node.text;

            g_wid.ltv.wid.html(v);
        }

        if (g_wid.r.tver < v)
        {
            g_wid.r.wid.val(node.text);
            
            g_wid.r.tver = v;
            g_wid.r.text = node.text;

            g_wid.rtv.wid.html(v);
        }
    };

    var fn_pos_bind = function(node)
    {
        var v = +node.ver;

        if (g_wid.npv.wid.html() != v) g_wid.npv.wid.html(v);

        if (g_wid.l.pver < v)
        {
            if (g_wid.foc() == g_wid.l)
                set_caret_pos(g_wid.l.wid, +node.text);
            else          
                g_wid.l.wid.val(get_pipe(g_wid.l.text, +node.text));
            
            g_wid.l.pver = v;
            g_wid.l.pos = +node.text;
            
            g_wid.lpv.wid.html(v);
        }

        if (g_wid.r.pver < v)
        {
            if (g_wid.foc() == g_wid.r)
                set_caret_pos(g_wid.r.wid, +node.text);
            else
                g_wid.r.wid.val(get_pipe(g_wid.r.text, +node.text));
            
            g_wid.r.pver = v; 
            g_wid.r.pos = +node.text;
            
            g_wid.rpv.wid.html(v);
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

