// (C) 2016
'use strict';

function clc_js(){}

var g_sys_loaded_clc = 1;

function cli_build_cmd_help()
{
    var help_help = "help: prints help page\n";
    var help_run = function(c)
    {
        var r = '';
        if(c.length<2)
        {
            for( var i in g_cli_commands ) r += g_cli_commands[i].help;
            return r;
        }

        for( var i=1; i<c.length; i++ )
        {
            if( c[i] in g_cli_commands )
                r += g_cli_commands[c[i]].help;
            else
                r += '['+c[i]+'] - not a valid command';
        }
        return r;
    };

    g_cli_commands.help = { help : help_help, run : help_run };
}

function cli_build_cmd_cls()
{
    var cls_help = 'cls [argument]: clear area\n'
            + '- cls in: clear command area (default)\n'
            + '- cls out: clear output area\n'
            + '- cls edit: clear editor area\n'
            + '- cls view: clear view (bind) area\n';

    var cls_run = function(c)
    {
        var ar = 'in';
        if( c.length > 1 ) ar = c[1];
        if( ar == 'in' ){ $g_input[0].value='';  }
        else if( ar == 'out' ){ $g_output[0].value = ''; }
        else if( ar == 'edit' ){ $g_edit[0].value = ''; }
        else if( ar == 'view' ){ $g_view[0].value = ''; }
        else return 'use in/out/edit';
        return '';
    };

    g_cli_commands.cls = { help : cls_help, run : cls_run };
}

function cli_build_cmd_pwd()
{
    var pwd_help = 'pwd: print current node\n';
    var pwd_run = function(c){ return g_cwd.str(); };
    g_cli_commands.pwd = { help : pwd_help, run : pwd_run };
}

function cli_build_cmd_ls()
{
    var ls_help = 'ls [node]: list node, default - current\n';
    var ls_run = function(c)
    {
        if( c.length > 1 )
        {
            let h = c[1];
            let cwd = jraf_relative(g_cwd,h);
            let dir = (h[h.length-1]=='/');
            if( cwd == null ) return 'node does not exist';
            return cli_list_that(cwd,dir);
        }
        return cli_list_kids(g_cwd);
    };
    g_cli_commands.ls = { help : ls_help, run : ls_run };
}

function cli_build_cmd_up()
{
    var up_help = 'up [node]: update node, refresh by reloading\n';
    var up_run = function(c)
    {
        let cwd = g_cwd;
        if( c.length > 1 ) cwd = jraf_relative(g_cwd,c[1]);
        if( cwd == null ) return 'node does not exist';
        g_keep_loading = false;
        cli_update_node(cwd);
        return '';
    };
    g_cli_commands.up = { help : up_help, run : up_run };
}

function cli_build_cmd_rup()
{
    var help = 'rup (start|stop): update current node recursively\n';
    var run = function(c)
    {
        let c1 = c[1];
        if( c.length < 2 ) c1='start'; // return 'use start or stop';
        if( c1 == 'stop' ) g_keep_loading = false;
        else if( c1 == 'start' )
        {
            g_keep_loading = true;
            cli_update_node(g_cwd);
        }
        return '';
    };
    g_cli_commands.rup = { help : help, run : run };
}

function cli_build_cmd_down()
{
    var help = 'down [node]: make node incomplete, kill kids\n';
    var run = function(c)
    {
        g_keep_loading = false;
        let n = g_cwd;
        if( c.length > 1 ) n = jraf_relative(g_cwd,c[1]);
        if( n == null ) return 'node does not exist';
        if( n.watch > 0 ) return 'node or its descendants bound\n';
        for( let i in n.kids ) n.rmkid(i);
        n.full = 0;
        return '';
    };
    g_cli_commands.down = { help : help, run : run };
}

function cli_build_cmd_cd()
{
    var cd_help = 'cd [path]: change current node\n';
    var cd_run = function(c)
    {
        let cwd = g_cwd;
        if( c.length <2 ) return "Home node is not defined";
        cwd = jraf_relative(g_cwd,c[1]);
        if( cwd == null ) return 'node does not exist';
        g_cwd = cwd;
        return '';
    };
    g_cli_commands.cd = { help : cd_help, run : cd_run };
}

function cli_build_cmd_bind()
{
    var help = 'bind [node]: bind node to view area\n';
    var run = function(c)
    {
        let n = g_cwd;
        if( c.length > 1 ) n = jraf_relative(g_cwd,c[1]);
		var r = '';
        if( n == null ) 
		{	
			if( c.length < 1 ) return 'node does not exist\n'
			return 'node does not exist - binding virtual\n'
			+ jraf_bind_virtual(g_cwd,c[1],cli_view_update);
		}
        ///if( n.full == 0 ) return 'node is not loaded';
        return n.bind(cli_view_update);
    };
    g_cli_commands.bind = { help : help, run : run };
}

function cli_build_cmd_unbind()
{
    var help = 'unbind [node]: unbind node\n';
    var run = function(c)
    {
        let n = g_cwd;
        if( c.length > 1 ) n = jraf_relative(g_cwd,c[1]);
        if( n == null ) return 'node does not exist';
        if( n.watch == 0 ) return 'node is not bound';
        return n.unbind();
    };
    g_cli_commands.unbind = { help : help, run : run };
}

function cli_build_cmd_md()
{
    var help = 'mkdir/md node: create new directory node on server\n';
    var run = function(c)
    {
        if( c.length != 2 ) return 'need one argument';
        cli_write_md(g_cwd,c[1]);
        return '';
    };
    g_cli_commands.md = { help : help, run : run };
    g_cli_commands.mkdir = { help : help, run : run };
}

function cli_build_cmd_mk()
{
    var help = 'mk node: create new virtual node\n';
    var run = function(c)
    {
        if( c.length != 2 ) return 'need one argument';
		jraf_virtual_node(g_cwd,c[1])
        return '';
    };
    g_cli_commands.mk = { help : help, run : run };
}

function cli_build_cmd_rm()
{
    var help = 'rm node: remove node on server\n';
    var run = function(c)
    {
        if( c.length != 2 ) return 'need one argument';
        cli_write_rm(g_cwd,c[1]);
        return '';
    };
    g_cli_commands.rm = { help : help, run : run };
}

function cli_build_cmd_edit()
{
    var help = 'edit [node]: edit file\n';
    var run = function(c)
    {
        let n = g_cwd;
        if( c.length > 1 ) n = jraf_relative(g_cwd,c[1]);
        if( n == null ) return 'node does not exist';
        if( n.sz < 0 ) return 'node is not file';
        if( n.full == 0 ) return 'node is incomplete';
		$g_edit[0].value = n.text;
        return '';
    };
    g_cli_commands.edit = { help : help, run : run };
}

function cli_build_cmd_save()
{
    var help = 'save [node]: save file\n';
    var run = function(c)
    {
        let n = g_cwd;
		var pth = g_cwd.str()+'/';
        if( c.length > 1 )
		{
			let nm = c[1];
			if( nm[0] == '/' ) pth = nm;
			else pth += nm;
		}
		return cli_save(pth,$g_edit[0].value);
    };
    g_cli_commands.save = { help : help, run : run };
}

function cli_build_cmd_cj()
{
    var help = 'cj [node]: run clij script\n';
    var run = function(c)
    {
        let n = g_cwd;
        if( c.length > 1 ) n = jraf_relative(g_cwd,c[1]);
        if( n == null ) return 'node does not exist';
		return cli_run_cj(n);
    };
    g_cli_commands.cj = { help : help, run : run };
}

//function cli_build_cmd_ ()

////////////////////////////////////////////////////////
// ls

function cli_list_to_array(node)
{
    var r = [];

    r[0] = ''+node.ver;

    r[1] = node.name;
    if( node.parent == null ) r[1] = '(root)';

    r[2] = 'D';
    if( node.sz >= 0 ) r[2] = ''+node.sz;

    r[3] = node.watch_str();

    r[4] = 'I';
    if( node.full == 1 ) r[4] = 'C';

    return r;
}

function cli_list_formline(a)
{
    var r = '';

    for( let i=0; i<a.length; i++ )
    {
        if(i) r += ' ';
        r += a[i];
    }

    return r;
}

function cli_list_that(node,dir)
{
    if(dir) return cli_list_kids(node);
    var a = cli_list_to_array(node);
    return cli_list_formline(a);
}

function cli_list_kids(node)
{
    if( node.sz >= 0 ) return node.text;

    var mx = [0,0,0,0,0];
    var ar = [];
    for( let i in node.kids )
    {
        let k = node.kids[i];
        let line = cli_list_to_array(k);

        for( let j=0; j<5; j++ )
            if( line[j].length > mx[j] )
                mx[j] = line[j].length;

        ar[ar.length] = line;
    }

    // format
    for( let i=0; i<ar.length; i++)
    {
        for( let j=0; j<4; j++ ) // no need for the last column
        {
            let sz = mx[j]-ar[i][j].length;
            for( let k=0; k<sz; k++ )
                ar[i][j] += ' ';
        }
    }

    var r  = '';
    for( let i=0; i<ar.length; i++)
        r += cli_list_formline(ar[i]) + '\n';

    if( node.full == 0 ) r += 'node ['+node.str()+'] incomplete, use \'up\'\n';

    return r;
}

////////////////////////////////////////////////////////
// up

function cli_update_node(node)
{
    var ver = node.ver;
    var cb = function(jo,nd)
    {
        //console.log(jo);
        //console.log(nd);
        let s = '';
        if( jo.err == '' )
        {
            if( ver == nd.ver ) s = ''+nd.ver;
            else s = '' + ver + ' -> '+nd.ver;
        }
        else
            s = jo.err;

        ///$g_output[0].value += 'up ['+nd.str()+'] ' + s + '\n';
		cli_output('up ['+nd.str()+'] ' + s);
    };

    var name = node.name;
    var path;
    if( node.parent == null )
    {
        path = '/';
        name = '';
    }
    else
        path = node.parent.str()+'/';

    jraf_update_obj(path,name,cb,node);
}

////////////////////////////////////////////////////////
// md

function cli_write_md(cwd,name)
{
    var cb = function(jo,nd)
    {
        //console.log(jo);
        //console.log(nd);
        let s = '';
        if( jo.err == '' ) s = jo.msg;
        else s = jo.err;

        ///$g_output[0].value += 'mkdir: ' + s + '\n';
		cli_output('mkdir: ' + s);
    };

    jraf_write_md(cwd,name,cb);
}

////////////////////////////////////////////////////////
// rm

function cli_write_rm(cwd,name)
{
    var cb = function(jo,nd)
    {
        //console.log(jo);
        //console.log(nd);
        let s = '';
        if( jo.err == '' ) s = jo.msg;
        else s = jo.err;

        ///$g_output[0].value += 'rm: ' + s + '\n';
		cli_output('rm: ' + s);
    };

    jraf_write_rm(cwd,name,cb);
}

////////////////////////////////////////////////////////
// cj

function cli_run_cj(node)
{
	if( node.sz < 0 ) return "error: not file";

    var c = node.text.split('\n');
    c = c.filter( function(x){ return x.length>0; } );

	var r = '';
	for( let i in c )
		r += cli_execute_command(c[i].trim()) + '\n';

	return r;

}
////////////////////////////////////////////////////////
// save

function cli_save(pth,body)
{
    var cb = function(jo,nd)
    {
        //console.log(jo);
        //console.log(nd);
        let s = '';
        if( jo.err == '' ) s = jo.msg;
        else s = jo.err;

        ///$g_output[0].value += 'save: ' + s + '\n';
		cli_output('save: ' + s);
    };

    jraf_write_save(pth,body,cb);

	return 'use \'up\' to refresh value';
}
////////////////////////////////////////////////////////
//

