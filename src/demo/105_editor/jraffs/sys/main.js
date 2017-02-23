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
    texarea_l: { wid: $('<textarea/>', {id: 'l'}), text: '', pos: 0, ver: 0 },
    texarea_r: { wid: $('<textarea/>', {id: 'r'}), text: '', pos: 0, ver: 0 },
    span_l_area_ver: { wid: $('<span/>') },
    span_r_area_ver: { wid: $('<span/>') },
    span_node_ver: { wid: $('<span/>') },
    fcd: function()
    {
        var self = this;

        if (self.texarea_l.wid.is(':focus'))
            return self.texarea_l;
        else if (self.texarea_l.wid.is(':focus'))
            return self.texarea_r;

        return null;
    },
    ufd: function()
    {
        var self = this;

        if (!self.texarea_l.wid.is(':focus'))
            return self.texarea_l;
        else if (!self.texarea_r.wid.is(':focus'))
            return self.texarea_r;
        else
            return null;
    }
};


function get_fi(x,y)
{
    if (x.is(':focus'))
        return x;
    else if (y.is(':focus'))
        return y;

    return null;
}

function get_fo(x,y)
{
    var self = this;

    if (get_fi(x,y) == x)
        return y;
    else if (get_fi(x,y) == y)
        return x;

    return null;
}

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
                .append($('<td/>', { colspan: '2' } )
                    .append(g_wid.span_node_ver.wid)))
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.span_l_area_ver.wid
                        .css('margin-left','1em'))
                    .css('text-align', 'left'))
                .append($('<td/>')
                    .append(g_wid.span_r_area_ver.wid
                        .css('margin-left','1em'))
                    .css('text-align', 'left')))
            .append($('<tr/>')
                .append($('<td/>')
                    .append(g_wid.texarea_l.wid
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        // .css('margin', '1em')
                        .css('width', '95%')
                        .css('height', '8em')
                    ))
                .append($('<td/>')
                    .append(g_wid.texarea_r.wid
                        .css('white-space', 'pre')
                        .css('resize', 'none')
                        // .css('margin', '1em')
                        .css('width', '95%')
                        .css('height', '8em')
                    ))
            )
        )

    $g_div_main.html($div);
    $g_div_main.css('text-align', 'center');
}

function main_js()
{
    main_html();

    g_wid.span_l_area_ver.wid.html(g_wid.texarea_l.ver);
    g_wid.span_r_area_ver.wid.html(g_wid.texarea_l.ver);

    g_wid.texarea_l.wid.on('input keydown click', function(e){change($(this), e); });
    g_wid.texarea_r.wid.on('input keydown click', function(e){change($(this), e); });

    jr(g_node.dir).md().up();

    init();
}

function change($o, e)
{
    var o = ($o.prop('id') == 'l') ? g_wid.texarea_l : g_wid.texarea_r;
    var p = o.wid.prop('selectionStart') || 0;
    var t = o.wid.val() || '';

    if (t == o.text && p == o.pos) return;
    
    //save data - version, text and cursor position;
    if (t != o.text ) 
    {
        console.log('11111');
        ++o.ver;
    }
    
    if (p != o.pos) 
    {
        console.log('222222');
        ++o.ver;
    }
    
    o.text = t;
    o.pos = p;

    if (o.wid.prop('id') == 'l')
        g_wid.span_l_area_ver.wid.html(g_wid.texarea_l.ver);
    else
        g_wid.span_r_area_ver.wid.html(g_wid.texarea_r.ver);

    jr(g_node.txt).save(t).up();
    jr(g_node.pos).save(p).up();
}

function init()
{
    var fn_init_ver = function(node)
    {
        g_wid.texarea_l.ver=+node.ver;
        g_wid.texarea_r.ver=+node.ver;
        g_wid.span_l_area_ver.wid.html(node.ver);
        g_wid.span_r_area_ver.wid.html(node.ver);
        g_wid.span_node_ver.wid.html(node.ver);

    };

    var fn_init_txt = function(node)
    {
        g_wid.texarea_l.text = node.text;
        g_wid.texarea_r.text = node.text;
    }

    var fn_init_pos = function(node)
    {
        g_wid.texarea_l.pos = node.text;
        g_wid.texarea_r.pos = node.text;
    }

    var fn_bind_txt = function(node)
    {
        var tl = g_wid.texarea_l;
        var tr = g_wid.texarea_r;
        var vn = +node.parent.ver;
        var vl = +g_wid.texarea_l.ver;
        var vr = +g_wid.texarea_r.ver;

        var fcd = g_wid.fcd();
        var ufd = g_wid.ufd();

        if (g_wid.span_node_ver.wid.html() != node.parent.ver)
            g_wid.span_node_ver.wid.html(vn);

        if (tl.ver !== vn && tl.text !== node.text)
        {
            tl.wid.val(node.text);
            tl.text = node.text;
            tl.ver = vn;
        }

        if (tr.ver !== vn && tr.text !== node.text)
        {
            tr.wid.val(node.text);
            tr.text = node.text;
            tr.ver = vn;
        }
    };

    var fn_bind_pos = function(node)
    {
        var tl = g_wid.texarea_l;
        var tr = g_wid.texarea_r;
        var vn = +node.parent.ver;
        var vl = +g_wid.texarea_l.ver;
        var vr = +g_wid.texarea_r.ver;
        
        if (g_wid.span_node_ver.wid.html() != node.parent.ver)
            g_wid.span_node_ver.wid.html(vn);        
        
    };
    
    jr(g_node.txt).up(fn_init_txt);
    jr(g_node.pos).up(fn_init_pos);
    jr(g_node.dir).up(fn_init_ver);

    jr(g_node.txt).up().bind_fun(fn_bind_txt);
    jr(g_node.pos).up().bind_fun(fn_bind_pos);

    setInterval(function()
    {
        jr(g_node.txt).up();
        jr(g_node.pos).up();
        jr(g_node.dir).up();
    }, 1000);
}

