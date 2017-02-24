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
    fcd: function()
    {
        var self = this;
        
        if (self.l.wid.is(':focus'))
            return self.l;
        else if (self.r.wid.is(':focus'))
            return self.r;

        return null;
    },
    ufd: function()
    {
        var self = this;

        if (self.fcd() == self.l)
            return self.r;
        else if (self.fcd() == self.r)
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
    g_wid.fcd().wid.val(g_wid.fcd().text);
}

function change($o, e)
{
    var o = ($o.prop('id') == 'l') ? g_wid.l : g_wid.r;
    var p = o.wid.prop('selectionStart') || 0;
    var t = o.wid.val() || '';
    
    if (t == o.text && p == o.pos) return;

    // save data - version, text and cursor position;
    if (t != o.text )
    {
        jr(g_node.txt).save(t).up();
        ++o.tver;
        o.text = t;
    }

    if (p != o.pos)
    {
        jr(g_node.pos).save(p).up();
        o.pos = p;
        ++o.pver;
    }

    if (o.wid.prop('id') == 'l')
    {
        g_wid.ltv.wid.html(g_wid.l.tver);
        g_wid.lpv.wid.html(g_wid.l.pver);
    }
    else
    {
        g_wid.rtv.wid.html(g_wid.r.tver);
        g_wid.rpv.wid.html(g_wid.r.pver);
    }
}

function init()
{
    var fn_txt_init = function(node)
    {
        g_wid.l.tver = +node.ver;
        g_wid.r.tver = +node.ver;

        g_wid.ltv.wid.html(node.ver);
        g_wid.rtv.wid.html(node.ver);
        g_wid.ntv.wid.html(node.ver);

        g_wid.l.text = node.text;
        g_wid.r.text = node.text;
    }

    var fn_pos_init = function(node)
    {
        g_wid.l.pver = +node.ver;
        g_wid.r.pver = +node.ver;

        g_wid.lpv.wid.html(node.ver);
        g_wid.rpv.wid.html(node.ver);
        g_wid.npv.wid.html(node.ver);

        g_wid.l.pos = +node.text;
        g_wid.r.pos = +node.text;
    }

    var fn_txt_bind = function(node)
    {
        //change displayed node version
        if (g_wid.ntv.wid.html() != node.ver) g_wid.ntv.wid.html(node.ver);

        if (g_wid.l.tver != +node.ver)
        {
            g_wid.l.wid.val(node.text);
            // g_wid.l.wid.val(get_pipe(node.text, g_wid.l.pos));

            g_wid.l.tver = +node.ver;
            g_wid.l.text = node.text;

            g_wid.ltv.wid.html(node.ver);
        }

        if (g_wid.r.tver != +node.ver)
        {
            g_wid.r.wid.val(node.text);
            // g_wid.r.wid.val(get_pipe(node.text, g_wid.r.pos));
            
            g_wid.r.tver = +node.ver;
            g_wid.r.text = node.text;

            g_wid.rtv.wid.html(node.ver);
        }
    };

    var fn_pos_bind = function(node)
    {
            console.log('fn_pos_bind');
        //change displayed node version
        if (g_wid.npv.wid.html() != node.ver) g_wid.npv.wid.html(node.ver);
        
        if (g_wid.fcd() === null)
        {
            if (g_wid.l.pver != +node.ver)
            {
                // g_wid.l.wid.val(get_pipe(g_wid.l.text, +node.text));

                g_wid.l.pver = +node.ver;
                g_wid.l.pos = node.text;

                g_wid.lpv.wid.html(node.ver);
            }

            if (g_wid.r.pver != +node.ver)
            {
                // g_wid.r.wid.val(get_pipe(g_wid.r.text, +node.text));

                g_wid.r.pver = +node.ver; 
                g_wid.r.pos = node.text;

                g_wid.rpv.wid.html(node.ver);
            }
        }
        else
        {
            set_caret_pos(g_wid.fcd().wid, +node.text);
            console.log('111');
        }
        

    };

    jr(g_node.txt).up(fn_txt_init);
    jr(g_node.pos).up(fn_pos_init);

    jr(g_node.txt).bind_fun(fn_txt_bind);
    jr(g_node.pos).bind_fun(fn_pos_bind);

    setInterval(function()
    {
        jr(g_node.txt).up();
        jr(g_node.pos).up();
    }, 1000);
}

