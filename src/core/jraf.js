'use strict';

function jraf_js(){}

var g_jraf_root = jraf_node(null,null);

var g_keep_loading = false;

function jraf_node(prnt, ini)
{
    var node = {};
    node.ver = -1;
    node.sz = -1; 
    node.watch = 0; // 0,1,2 - none, monitor, bound
    // monitor means some distant kids have binding

    node.wid = null; // binding callback ( do not set, use bind() )
    node.name = '';
    node.parent = prnt;
    node.full = 0; // 0,1 - incomplete, complete/loaded
    node.text = ''; // file body
    node.kids = {}; // children

    node.watch_str = function()
    {
        var r = 'X';
        if( node.watch == 0 ) r = 'N';
        if( node.watch == 1 ) r = 'M';
        if( node.watch == 2 ) r = 'B';
        return r;
    };

    node.str = function()
    { 
        if( this.parent == null ) return '/';
        let r = this.parent.str();
        if( r == '/' ) r = '';
        return r + '/' + this.name;
    };

    node.rmkid = function(k)
    {
        if( !(k in this.kids) ) return;

        let kid = this.kids[k];
        for( let i in kid.kids ) kid.rmkid(i);

        if( kid.watch == 0 )
            delete this.kids[k];
        else
        {
            kid.full = 0;
            kid.sz = -1;
            kid.text = '';
        }
    };

    node.bind = function(fun)
    {
        //console.log(this.watch);
        //console.log(this);
        var r = '('+this.str() + ') - bound';
        this.wid = fun;
        this.watch = 2;
        let p = this.parent;
        while(p)
        {
            if( p.watch==0 )
            {
                p.watch=1;
                r += '\n(' + p.str()+') - set to '+p.watch_str();
            }
            else
                r += '\n(' + p.str()+') - remains at '+ p.watch_str();

            p = p.parent;
        }
        this.wid(this);
        return r+'\n';
    };

    node.unbind = function()
    {
        //console.log(this.watch);
        //console.log(this);

        if( this.watch == 0 ) return '('+this.str() + ') - is not bound\n';
        var r = '';
        if( this.watch == 2 )
        {
            this.watch = 1;
            r = '('+this.str() + ') - set to '+ this.watch_str()+'\n';
        }

        r += this.bind_check();
        return r;
    };

    node.bind_check = function()
    {
        if( this.watch == 2 ) return '';
        if( this.watch != 1 ) console.log('ERROR bind_check called on N node');

        for( let i in this.kids )
        {
            if( this.kids[i].watch > 0 )
                return '('+this.str() + ') - remains at '+ this.watch_str()+'\n';
        }

        this.watch = 0;
        var r = '('+this.str() + ') - set to '+ this.watch_str()+'\n';

        if( this.parent != null ) r += this.parent.bind_check();
        return r;
    };

    node.callwid = function()
    {
        if( this.watch == 2 ) this.wid(this);
        for( let i in this.kids )
        {
            let kid = this.kids[i];
            if( kid.watch ) kid.callwid();
        }
    };

    // initialize object
    ini = ini || {};
    for( let i in ini ) node[i] = ini[i];

    return node;
}

// cur_node - current node
// path - path string: relative or absolute
// returns - node
function jraf_relative(cur_node, path)
{
    while(true)
    {
        if( path.indexOf('//') == -1 ) break;
        path = path.replace('//','/');
    }

    var a = path.split('/');
    if( a.length < 1 ) return cur_node;

    var i=0;
    var cwd = cur_node;

    if( a[0] == '' )
    {
        i=1;
        cwd = g_jraf_root;
    }

    for(; i<a.length; i++ )
    {
        let s = a[i];
        if( s=='' ) continue;
        if( s=='.' ) continue;
        if( s=='..' )
        {
            cwd = cwd.parent;
            if( cwd == null ) return null;
            continue;
        }

        if( !( s in cwd.kids ) ) return null;
        cwd = cwd.kids[s];
    }

    return cwd;
}

function jraf_update_callback(jo,ex)
{
    var nd = ex.node;

    if( jo.err != '' )
    {
        ex.cbi(jo,nd);
        return;
    }

    if( jo.sz == nd.sz && jo.ver == nd.ver && nd.full == 1 
        && ( !g_keep_loading || nd.sz>=0 ) )
    {
        ex.cbi(jo,nd);
        return;
    }

    nd.ver = jo.ver;
    nd.full = 1;

    if( nd.name != jo.name ) console.log('ERROR (jraf_update_callback) name mismatch');

    if( nd.sz<0 )
    {
        if( jo.sz<0 ) jraf_update_DD(jo,nd,ex.cbi);
        else jraf_update_DF(jo,nd);
    }
    else
    {
        if( jo.sz<0 ) jraf_update_FD(jo,nd,ex.cbi);
        else jraf_update_FF(jo,nd);
    }
    if( nd.watch == 2 ) nd.wid(nd);

    ex.cbi(jo,nd);
}

function jraf_update_obj(path,name,cbi,node)
{
    var ex = {};
    ex.node = node;
    ex.cbi = cbi;
    jraf_read_obj(path,name,jraf_update_callback,ex);
}

function jraf_update_node(node,cb)
{
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

function jraf_update_DF(jo,nd)
{
    {
        let akids = {}; 
        for( let i in nd.kids ) akids.i = 1;
        for( let i in akids ) nd.rmkid(i);
    }

    nd.sz = jo.sz;
    nd.text = jo.text;
}

function jraf_update_FD(jo,nd,cbi)
{
    jraf_update_DD(jo,nd,cbi);
    nd.sz = -1;
    nd.text = '';
}

function jraf_update_DD(jo,nd,cbi)
{
    // first delete disappeared nodes (that are not watched)
    {
        let akids = {}; 
        for( let i in nd.kids ) akids[i] = 1;

        for( let i in akids )
        {
            if( i in jo.kids ) continue;
            nd.rmkid(i);
        }
    }

    // add new
    for( let i in jo.kids )
    {
        if( i in nd.kids ) continue;
        var j = jo.kids[i];

        var n = jraf_node(nd);
        n.ver = j.ver;
        n.sz = j.sz;
        n.name = i;

        nd.kids[i] = n;
    }

    // update kids
    for( let i in nd.kids )
    {
        if( !(i in jo.kids) )
        {
            if( nd.kids[i].watch < 1 )
            {
                console.log('ERROR kids mismatch 152: i, jo.kids, nd.kids');
                return;
            }
            // this is virtual
            let vn = nd.kids[i];
            vn.callwid();
            continue;
        }

        var n = nd.kids[i];
        var j = jo.kids[i];

        let kp = g_keep_loading;

        if( n.ver == j.ver )
        {
            if( !kp ) continue;
            if( n.full==1 && n.sz >= 0 ) continue;
        }
        else
        {
            if( n.watch == 0 && !kp ) continue; // keep old
        }

        jraf_update_obj(nd.str()+'/',i,cbi,n);
    }
}

function jraf_update_FF(jo,nd)
{
    nd.sz = jo.sz;
    nd.text = jo.text;
}

function jraf_node_up(node, ext_cb)
{
    var name = node.name;
    var path;
    if( node.parent == null )
    {
        path = '/';
        name = '';
    }
    else
        path = node.parent.str()+'/';

    ext_cb = ext_cb || function(){};

    jraf_update_obj(path,name,ext_cb,node);    
}

function jraf_virtual_node(wd,c)
{
    var a = c.split('/');
    a = a.filter(function(x){ return x.length > 0; });

    for( let j in a)
    {
        let i = a[j];
        if( !(i in wd.kids) )
            wd.kids[i] = jraf_node(wd,{name:i});

        wd = wd.kids[i];
    }

    return wd;
}

function jraf_bind_virtual_leaf(leaf,cb)
{
    var r = leaf.bind(cb);

    if( leaf.full > 0 ) return r;
    // find top incomplete node
    var n = leaf;
    while(n.parent != null)
    {
        if( n.parent.full > 0 ) break;
        n = n.parent;
    }
    jraf_node_up(n);

    return r;
}

function jraf_bind_virtual_path(node,path,cb)
{
    var leaf = jraf_virtual_node(node,path);
    return jraf_bind_virtual_leaf(leaf,cb);
}

// =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =
// write section

function o(x){ console.log(x); }

function jraf_write_md(cwd,name,cbi)
{
    var cb = function(jo){ cbi(jo); };
    var path = (cwd.str() == '/') ? cwd.str() + name : cwd.str() + '/' +name;
    jraf_write_obj('md', path, cb);
}

function jraf_write_file(pth,body,cbi,pos)
{
    body = String(body);
    var cb = function(jo){ cbi(jo); };
    //var b64 = window.btoa(body);
    var b64 = Base64.encode(body);
    b64 = b64.replace('+','-');
    var ln = Base64._utf8_encode(body).length;

    if( !pos )
        jraf_write_obj('save', pth+' '+ln+' '+b64, cb);
    else
        jraf_write_obj('put', pth+' '+pos+' '+ln+' '+b64, cb);
}

function jraf_write_rm(cwd,name,cbi)
{
    var cb = function(jo){ cbi(jo); };
    var path = cwd.str()+'/'+name;
    jraf_write_obj('rm', path, cb);
}

function jraf_write_obj(cmd, pth, cb, extra)
{
    var parser = function(data, ext)
    {
        ext.cb(jraf_parse_wrt(data),ext.ex);
    }

    var ex = {};
    ex.ex = extra;
    ex.cb = cb;
    jraf_ajax('jw ' + cmd + ' ' + g_session + ' ' + pth, parser, ex);
}

function jraf_parse_wrt(data)
{
    if( !data )
    {
        console.log('Backend reply: NULL');
        return { err: 'NULL' };
    }

    data = data.trim();
    var a = data.split(' ');
    var r = { err: '' };
    if( a[0] != 'OK' )
    {
        console.log('Backend reply: ' + data);
        return { err: data };
    }

    r.msg = 'ok';
    return r;
}


// =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =
/* API section

jr('path')               => return apinode
.bind_html(jq_obj,[fun]) == bind text node to a jquery object
                            fun - optional translation function
.md()                    == create directory on server
.save(text)              == save text on server
.up()                    == update node
.x(path)                 == return new apinode relative

.bind_fun(fun)     == binds node to a function
.bind_list(jq_obj) == binds list node to a jquery object
*/

function jr_api_node(n)
{
    var vn = {};
    vn.node = n;

    vn.bind_html = function(jqo,fun)
    {
        if( 'boundto' in jqo ) jqo.boundto.unbind();
        var cb = function(n){ jqo.html(fun?fun(n.text):n.text); }
        jraf_bind_virtual_leaf(this.node,cb);
        jqo.boundto = this.node;
        
        return this;
    };

    vn.bind_fun = function(fun)
    {
        jraf_bind_virtual_leaf(this.node,fun);
        return this;
    };

    vn.md = function()
    {
        var vnode = this;
        var cb = function(x)
        {
            if( x.err && x.err != '' ) o(x.err);
            vnode.up();
        };
        jraf_write_md(g_jraf_root,this.node.str(),cb)
        return this;
    };

    vn.save = function(body){ return this.write_file(body,null); }
    vn.add = function(body){ return this.write_file(body,'*'); }
    vn.put = function(body,pos){ return this.write_file(body,pos); }

    vn.write_file = function(body,offset)
    {
        var vnode = this;
        var cb = function(x)
        {
            if( x.err && x.err != '' ) o(x.err);
            vnode.up();
        };
        jraf_write_file(this.node.str(),body,cb,offset)
        return this;
    };

    // Warning: cb will called for all updating kids
    vn.up = function(cb)
    {
        var cbi = function(j,n)
        {
            if(cb) cb(n); 
            if( j.err && j.err != '' ) o(j.err); 
        };

        jraf_update_node(this.node,cbi);
        return this;
    };

    vn.x = function(path)
    {
        return jr_api_node(jraf_virtual_node(this.node,path));
    }

	vn.bind_list_html = function(jqo,template,show)
	{
		var cb = function(n)
		{
			o('---1');
			o(jqo);
			jqo.children().each(function(i,x){ o($(this).html()); });
			for( let i in n.kids ){ o(n.kids[i].name); }
		};

		this.bind_fun(cb);
	}

    return vn;
}


function jr(path)
{
    return jr_api_node(jraf_virtual_node(g_jraf_root,path));
}

