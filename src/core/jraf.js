'use strict';

function jraf_js(){}

var g_jraf_root = jraf_node(null,null);

///var g_keep_loading = false;

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
            kid.ver = -1;
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
    var upo = ex.upo;
    delete upo.list_of_nodes[nd.str()];

    var empty = (x) => 
    {
        for( let i in x ) return false;
        return true;
    };

    if( jo.err != '' )
    {
        if( upo.error ) upo.error(jo,nd);
        if( upo.final && empty(upo.list_of_nodes) ) upo.final(jo,nd);
        return;
    }

    if( jo.sz == nd.sz && jo.ver == nd.ver && nd.full == 1 
        && ( !upo.keep_loading || nd.sz>=0 ) )
    {
        ///if( ex.cbi ) ex.cbi(jo,nd);
        if( upo.every ) upo.every(jo,nd);
        if( upo.final && empty(upo.list_of_nodes) ) upo.final(jo,nd);
        return;
    }

    nd.ver = jo.ver;
    nd.full = 1;

    if( nd.name != jo.name ) console.log('ERROR (jraf_update_callback) name mismatch');

    if( nd.sz<0 )
    {
        if( jo.sz<0 ) jraf_update_DD(jo,nd,upo);
        else jraf_update_DF(jo,nd);
    }
    else
    {
        if( jo.sz<0 ) jraf_update_FD(jo,nd,upo);
        else jraf_update_FF(jo,nd);
    }
    
    if( nd.watch == 2 ) nd.wid(nd);

    ///if( ex.cbi ) ex.cbi(jo,nd);
    if( upo.every ) upo.every(jo,nd);
    if( upo.final && empty(upo.list_of_nodes) ) upo.final(jo,nd);

}

function jraf_update_obj(path,name,upo,node)
{
    var ex = {};
    ex.node = node;

    ex.upo = upo || {};
    ex.upo.keep_loading = ex.upo.keep_loading || false;

    ex.upo.list_of_nodes = ex.upo.list_of_nodes || {};
    ex.upo.list_of_nodes[node.str()] = true;

    // functions
    //ex.upo.every()
    //ex.upo.final()

    jraf_read_obj(path,name,jraf_update_callback,ex);
}

function jraf_update_node(node,upo)
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

    jraf_update_obj(path,name,upo,node);
}

/*///
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
*/

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

function jraf_update_FD(jo,nd,upo)
{
    jraf_update_DD(jo,nd,cbi);
    nd.sz = -1;
    nd.text = '';
}

function jraf_update_DD(jo,nd,upo)
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

        ///let kp = g_keep_loading;
        let kp = upo.keep_loading;

        if( n.ver == j.ver )
        {
            if( !kp ) continue;
            if( n.full==1 && n.sz >= 0 ) continue;
        }
        else
        {
            if( n.watch == 0 && !kp ) continue; // keep old
        }

        //jraf_update_obj(nd.str()+'/',i,cbi,n);
        jraf_update_obj(nd.str()+'/',i,upo,n); // no propagate cb down
    }
}

function jraf_update_FF(jo,nd)
{
    nd.sz = jo.sz;
    nd.text = jo.text;
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

    ///jraf_node_up(n);
    jraf_update_node(n);
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
/* Jan API section

jr('path')               => return api node (Jan object - Jraf Api Node)
.bind_html(jq_obj,[fun]) == bind text node to a Jqo(jquery) object
                            fun - optional translation function
.md()                    == create directory on server
.save(text)              == save text on server
.up()                    == update node
.x(path)                 == return new apinode relative
...
*/

function jr(path)
{
    return jr_api_node(jraf_virtual_node(g_jraf_root,path));
}

function jr_api_node(n)
{
    var vn = {};
    vn.node = n;

    vn.bind_html = function(jqo,tr)
    {
        if( 'boundto' in jqo ) jqo.boundto.unbind();
        var cb4 = function(n){ jqo.html(tr?tr(n.text):n.text); }
        jraf_bind_virtual_leaf(this.node,cb4);
        jqo.boundto = this.node;
        
        return this;
    };

    vn.bind_fun = function(fun)
    {
        jraf_bind_virtual_leaf(this.node,fun);
        return this;
    };

    vn.unbind_fun = function()
    {
        this.node.unbind();
        return this;
    };

    vn.md = function(ca)
    {
        var vnode = this;
        var cb = function(x)
        {
            if( x.err && x.err != '' ) o(x.err);
            vnode.up(ca);
        };
        jraf_write_md(g_jraf_root,this.node.str(),cb)
        return this;
    };

    vn.save = function(body,cb){ return this.write_file(body,null,cb); }
    vn.add = function(body,cb){ return this.write_file(body,'*',cb); }
    vn.put = function(body,pos,cb){ return this.write_file(body,pos,cb); }

    vn.write_file = function(body,offset,ca)
    {
        var vnode = this;
        var cb = function(x)
        {
            if( x.err && x.err != '' ) o(x.err);
            vnode.up(ca);
        };
        jraf_write_file(this.node.str(),body,cb,offset)
        return this;
    };

    vn.up = function(x)
    {
        var upo;
        if( typeof x == 'function' )
        {
            var cbi = function(j,n)
            {
                if(x) x(n); 
                if( j.err && j.err != '' ) o(j.err); 
            };

            upo = { keep_loading: false, final: cbi };
        }
        else
            upo = x;

        jraf_update_node(this.node,upo);
        return this;
    };

    vn.x = function(path)
    {
        return jr_api_node(jraf_virtual_node(this.node,path));
    }

    vn.bind_list_jan = function(fun)
    {
        if( !this.skids ) this.skids = {};

        var thisvn = this;
        var cb = function(n)
        {
            jr_api_manage_list(fun,thisvn.skids,n.kids,null);
        };

        this.bind_fun(cb);
        return this;
    }

    vn.unbind_list_jan = function(fun)
    {
        jr_api_manage_list(fun,this.skids,{},null);
        this.unbind_fun();
        return this;
    }

    vn.bind_list_jqo = function(jqo,fun)
    {
        if( 'boundto' in jqo )
        {
            jqo.boundto.unbind();
            jr_api_manage_list(fun,jqo.jraf_skids,{},jqo);
        }

        jqo.boundto = this.node;
        if( !jqo.jraf_skids ) jqo.jraf_skids = {};

        var cb5 = function(n)
        {
            var skids = jqo.jraf_skids;
            jr_api_manage_list(fun,skids,n.kids,jqo);
        };

        this.bind_fun(cb5);

        return this;
    }

    vn.rm = function(cb)
    {
        jraf_write_obj('rm', this.node.str(), cb);
    }

    return vn;
}

function jr_api_manage_list(fun,skids,nkids,jqo)
{
    for( let i in skids )
    {
        if( i in nkids && nkids[i].ver >= 0 ) continue;
        fun.remove(skids[i],jqo);
        delete skids[i];
    }

    for( let i in nkids )
    {
        if( nkids[i].ver < 0 ) continue;

        if( !(i in skids) )
        {
            skids[i] = { ver: nkids[i].ver, i:i  };
            fun.create(nkids[i],skids[i],jqo);
        }
        else if( skids[i].ver < nkids[i].ver && fun.update )
        {
            fun.update(nkids[i],skids[i],jqo);
        }

        skids[i].ver = nkids[i].ver;
    }
}


// =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =
/* Mount API section
*/

function jr_mount(pth,acb)
{
    var mo = {};

    var jan = jr(pth);
    mo.node = jan.node;
    mo.o = {};

    // mo methods
    mo.up = (upo) => { jraf_update_node(mo.node,upo); }; // update
    mo.merge = function(){ jr_mount_merge(this.node,mo)    };
    mo.um = function(cb){  this.up(()=>{ this.merge(); cb && cb(); }); };
    mo.us = function(cb){  this.up(()=>{ this.merge(); this.save(cb); }); };
    mo.st = () => { return jr_mount_status([]); }; // status
    mo.save = (cb) => {}; // checkin
    mo.unmount = ()=>{};

    var build = function(jo,nd)
    {
        o('build '+nd.str());

        var a = [];

        var n = nd;
        while(true)
        {
            if( n === mo.node ) break;
            if( n.parent == null ) break; // impossible
            a.push(n);
            n = n.parent;
        }

        var m = mo;
        while( a.length )
        {
            n = a.pop();
            o('n='+n.name);

            if( !m.o ) m.o = {};
            if( !m.o[n.name] ) m.o[n.name] = {};
            let ind = m.o[n.name];
            if( n.sz >= 0 ) ind.text = n.text;
            else if ( !ind.o ) ind.o = {};

            m = ind;
        }

        nd.bind( function(){ jr_mount_merge(this,m); } );
    }; // build

    var upo = 
    {
        keep_loading : true,
        final : () => { mo.merge(); acb(mo); }
    };

    //jan.up(upo);
    mo.up(upo);
}

function jr_mount_merge(nd,mo)
{
    if( !mo ) mo = {};
    nd.mount = mo;
    if( nd.watch != 2 ) nd.bind(jr_mount_bound);

    ///o('merge');o(nd);o(mo);
    if( nd.sz < 0 )
    {
        if( mo.text ) jr_mount_merge_FD(nd,mo);
        else jr_mount_merge_DD(nd,mo);
    }
    else
    {
        if( mo.text ) jr_mount_merge_FF(nd,mo);
        else jr_mount_merge_DF(nd,mo);
    }
}

function jr_mount_bound()
{
    o('==jr_mount_bound ['+this.name+']');
    jr_mount_merge(this,this.mount);
}

function jr_mount_merge_DD(nd,mo)
{
    if( !mo.o ) mo.o = {};

    var m = mo.o;
    for( let i in m )
    {
        if( !(i in nd.kids ) ) delete m[i];
    }

    for( let i in nd.kids )
    {
        if( !(i in m) ) m[i] = {};
        ///o('=A= '+i);
        jr_mount_merge(nd.kids[i],m[i]);
    }
}

function jr_mount_merge_DF(nd,mo)
{
    if( mo.o ) delete mo.o;
    mo.text = nd.text;
}

function jr_mount_merge_FF(nd,mo)
{
    mo.text = nd.text;
}

function jr_mount_merge_FD(nd,mo)
{
    delete mo.text;
    jr_mount_merge_DD(nd,mo);
}

function jr_mount_status(arr)
{
}
