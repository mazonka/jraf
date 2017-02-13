// (C) 2016
'use strict';

function cli_js(){}

var g_sys_loaded_cli = 1;

var $g_div_cli;
var $g_input, $g_output, $g_edit, $g_view;
var g_cli_commands;
var g_cwd;

var g_hist_pointer = 0;

var gPRMT = '> ';

function start_cli(div)
{
    ///$g_div_cli = $g_div_main;
    $g_div_cli = div;

    cli_build_commands();

    $g_div_cli.html(cli_build_area());

    g_cwd = g_jraf_root;

    $g_input.keydown(function(e){ return cli_keycode(e.keyCode); });

    $g_input.html(cli_prompt());
    ///$g_input.focus();
    cli_input_toend();
}

function cli_input_toend()
{
    $g_input.focus();
    var o = $g_input[0];
    var i = o.value.length;
    o.setSelectionRange(i,i);
    o.scrollTop = o.scrollHeight;
}

function cli_output_toend()
{
    var o = $g_output[0];
    var i = o.value.length;
    o.setSelectionRange(i,i);
    o.scrollTop = o.scrollHeight;
}

function cli_build_area()
{
    var tbl = $('<table/>', { border: '0', width: '100%' } );
    var tr = $('<tr/>');
    var td1 = $('<td/>', { width: '50%' } );
    var td2 = $('<td/>');

    td1.html(cli_build_left());
    td2.html(cli_build_right());

    tbl.append(tr);
    tr.append(td1);
    tr.append(td2);

    return tbl;
}

function cli_build_left()
{
    var d0 = $('<div/>');
    var d1 = $('<div/>');
    var d2 = $('<div/>');

    d0.append(d1);
    d0.append(d2);

    d1.html(cli_build_input());
    d2.html(cli_build_output());

    return d0;
}

function cli_build_right()
{
    var d0 = $('<div/>');
    var d1 = $('<div/>');
    var d2 = $('<div/>');

    d0.append(d1);
    d0.append(d2);

    d1.html(cli_build_edit());
    d2.html(cli_build_view());

    return d0;
}

function cli_build_input()
{
    $g_input = $('<textarea/>',{ width: '95%', height:'10em'});
    return $g_input;
}

function cli_build_output()
{
    $g_output = $('<textarea/>',{ width: '95%', height:'10em'});
    return $g_output;
}

function cli_build_edit()
{
    $g_edit = $('<textarea/>',{ width: '95%', height:'10em'});
    return $g_edit;
}

function cli_build_view()
{
    $g_view = $('<textarea/>',{ width: '95%', height:'10em'});
    return $g_view;
}

function cli_view_update(node)
{
    var r = node.str()+'\n';
    r += '-'.repeat(r.length-1) +'\n';
    if( node.full==0 ) r += node.name + " incomplete\n";
    if( node.sz < 0 ) r += cli_list_that(node,false);
    else r += node.text;

    $g_view[0].value = r;
}

function cli_keycode(x)
{
    var ret = true;
    if( x==38 || x==40 || x==13 || x==9 ) ret = false;
    // console.log(x);

    var $o = $g_input; // jQ
    var o = $g_input[0]; // dom

    if( x==13 )
    {
        var cmd = cli_extract_command(o.value);
        var out = cli_execute_command(cmd);
        cli_output_commnd(out);
        g_hist_pointer = 0; // reset arrows
    }
    else if( x==9 )
    {
        var cmd = cli_extract_command(o.value);
        cli_tab(cmd);
    }
    else if( x==38 ) cli_arrow(true);
    else if( x==40 ) cli_arrow(false);
    else if( x==8 ) ret = cli_backspace();

    if(!ret) cli_input_toend();

    return ret;
}


function cli_tab(c)
{
    if( c.length < 1 )
    {
        var out = '';
        for( var i in g_cli_commands ) out += ' ' + i;
        out = out.trim();
        cli_output_commnd(out);
    }

    if( c.length == 1 )
    {
        var out = '';
        var cnt = 0;
        var vld = [];
        var sz = c[0].length;
        for( var i in g_cli_commands )
        {
            if( i.substr(0,sz) == c[0] )
            {
                vld[cnt++] = i;
                out += ' ' + i;
            }
        }

        if( cnt == 0 ) return;
        if( cnt == 1 )
        {
            $g_input[0].value+= vld[0].substr(sz);
            return;
        }

        out = out.trim();
        cli_output_commnd(out);
        $g_input[0].value+= c[0];
    }
}

function cli_output_commnd(out)
{
    var o = $g_input[0];

    if( typeof out === 'undefined' || typeof out.length === 'undefined' )
    {
        console.log('ERROR: run function does not return string');
        o.value += '\n'+cli_prompt();
        return;
    }

    if( out.length > 0 && out[out.length-1] != '\n' ) out += '\n';
    o.value += '\n'+out+cli_prompt();
}

function cli_prompt()
{
    return g_cwd.str().substr(1)+gPRMT;
}

function cli_extract_command(text)
{
    var t, i = text.lastIndexOf('\n');
    if( i == -1 ) t = text;
    else t = text.substr(i+1);
    i = t.indexOf(gPRMT);
    if( i == -1 || i+3 > t.length ) return '';
    var cmd = t.substr(i+gPRMT.length);

    return cmd;
}

function cli_execute_command(cmd)
{
    var c = cmd.split(' ');
    c = c.filter( function(x){ return x.length>0; } );

    if( c.length < 1 ) return '';

    if( c[0] in g_cli_commands )
    {
        return g_cli_commands[c[0]].run(c);
    }

    return 'unknown command ['+c[0]+'], try \'help\'';
}


function cli_build_commands()
{
    g_cli_commands = {};

    cli_build_cmd_help();
    cli_build_cmd_cls();
    cli_build_cmd_pwd();
    cli_build_cmd_ls();
    cli_build_cmd_up();
    cli_build_cmd_down();
    cli_build_cmd_rup();
    cli_build_cmd_cd();
    cli_build_cmd_bind();
    cli_build_cmd_unbind();
    cli_build_cmd_md();
    cli_build_cmd_mk();
    //cli_build_cmd_js(); // run js file
    cli_build_cmd_cj(); // run cj file
    cli_build_cmd_rm();
    cli_build_cmd_edit();
    cli_build_cmd_save();
    //cli_build_cmd_loadmod(); // load js module into DOM head
}

function cli_arr_extract_history()
{
    var t = $g_input[0].value;
    var a = t.split('\n');
    a = a.filter(function(x){ return x.indexOf(gPRMT) >= 0; });
    if( a.length < 2 ) return [];
    a.pop();

    for( let i in a )
    {
        let j = a[i].indexOf(gPRMT);
        a[i] = a[i].substr(j+gPRMT.length);
    }

    a = a.filter(function(x){ return x.length > 0; });

    var b = [];
    for( let j in a )
    {
        let i = a.length - j - 1;
        if( b.indexOf(a[i]) == -1 ) b.push(a[i]);
    }

    return b;
}

function cli_arrow_show(s)
{
    var text = $g_input[0].value;
    ///var i = text.lastIndexOf(gPRMT);
    var i = text.lastIndexOf('\n');
    if( i < 0 ) return;

    ///$g_input[0].value = text.substr(0,i)+gPRMT+s;
    $g_input[0].value = text.substr(0,i)+'\n'+ cli_prompt() +s;
}

function cli_arrow(direction)
{
    if( direction ) ++g_hist_pointer;
    else --g_hist_pointer;

    if( g_hist_pointer <= 0 )
    {
        g_hist_pointer = 0;
        cli_arrow_show('');
        return;
    }

    var a = cli_arr_extract_history();
    if( a.length < 1 ) return;
    if( g_hist_pointer > a.length ) g_hist_pointer = a.length;

    cli_arrow_show(a[g_hist_pointer-1]);

    //console.log(a);
}

function cli_backspace()
{
    var text = $g_input[0].value;
    var i = text.lastIndexOf('\n');
    if( i < 0 ) i = 0;
    else ++i;

    if( cli_prompt() == text.substr(i) ) return false;
    return true;
}

function cli_output(s)
{
    $g_output[0].value += s + '\n';
	cli_output_toend();
}
