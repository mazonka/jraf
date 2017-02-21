// JRAF Team (C) 2016
'use strict';

var g_dir = '/demo/105';
var g_txt = '/demo/105/txt.txt';
var g_cur = '/demo/105/cur.txt';
var g_main = {
    tlt: $('<textarea/>',{id: 'tlt'}),
    trt: $('<textarea/>',{id: 'trt'}),
    foc: function()
        {
            if (this.tlt.is(':focus'))
                return this.tlt;
            else if (this.trt.is(':focus'))
                return this.trt;
            
            return null;
        },
    out: function()
        {
            if (this.foc() == this.tlt)
                return this.trt;
            else if (this.foc() == this.trt)
                return this.tlt;
            else
                return null;
        },
    pos: 0
};

function main_js()
{
    g_main.tlt.css('margin', '1em')
        .css('width', '40%')
        .css('height', '8em');

    g_main.trt.css('margin', '1em')
        .css('width', '40%')
        .css('height', '8em');

    g_main.tlt.on('input', change );
    g_main.trt.on('input', change );

    g_main.tlt.focus(function(){fokus($(this))});
    g_main.trt.focus(function(){fokus($(this))});
    //g_main.tlt.focusout(function() { g_main.trt.focus() } );
    //g_main.trt.focusout(function() { g_main.tlt.focus() } );
    
    $g_div_main.html('<h3>Demo 105: editor widget</h3>');
    $g_div_main.css('text-align', 'center');

    $g_div_main.append(g_main.tlt);
    $g_div_main.append(g_main.trt);

    jr(g_dir).md().x(g_txt).x(g_cur);
    
    // g_main.tlt.focus();
    
    init();
}

function change(text)
{
    var cb = function(node)
    { 
        g_main.out().val(get_pipe(node.text, g_main.pos)); 
    };
    
    var pos = g_main.foc() != null 
        ? g_main.foc().prop('selectionStart')
        : 0;
    
    
    jr(g_txt).save(g_main.foc().val()).up(cb);
    jr(g_cur).save(pos).up();
}

function fokus($o)
{
    var cb = function(node)
    {
        var text = node.text;
        
        g_main.out().val(get_pipe(text, g_main.pos));
        g_main.foc().val(text);
        
        set_caret_pos(g_main.foc(), g_main.pos);
    };
    
    jr(g_txt).up(cb);
}

function init()
{
    var cb = function(node)
    {
        var text = node.text;
        
        if (g_main.out() == null)
        {
            Boolean(g_main.tlt.val() != text) 
                && g_main.tlt.val(get_pipe(text, g_main.pos));
            Boolean(g_main.trt.val() != text) 
                && g_main.trt.val(get_pipe(text, g_main.pos));
        }
        else
        {
            Boolean(g_main.out().val() != text) && g_main.out().val(get_pipe(text, g_main.pos));
            //Boolean(g_main.foc().val() != text) && g_main.foc().val(text);
            //set_caret_pos(g_main.foc(), pos);
        }
    };
    
    setInterval(function()
    { 
        jr(g_cur).up(function(node) { g_main.pos = +node.text||0; });
        // jr(g_txt).up(function(node) { change(node.text) });
        jr(g_txt).up(cb);

    }, 200);
}

function get_pipe(text, pos)
{
    var d = new Date();
    var s = d.getSeconds();
    
    return (s % 2 == 0)
        ? text.substr(0,pos) + '|' + text.substr(pos)
        : text.substr(0,pos) + ' ' + text.substr(pos);
    
    ///constant pipe
    ///return text.substr(0,pos) + '|' + text.substr(pos);
}

function set_caret_pos($o, i) {
    $o[0].setSelectionRange(+i,+i);
}
