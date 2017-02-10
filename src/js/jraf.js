
function jraf_js(){}
var g_sys_loaded_jraf = 1;

var g_jraf_root = jraf_node(null,null);

var g_keep_loading = false;

function jraf_node(prnt, ini)
{
	var node = {};
	node.ver = 0;
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
			text = '';
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
		///console.log('callwid');
		///console.log(this);
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
	///console.log(a);
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
		///n.parent = nd;

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

	///console.log(jo);
	///console.log(nd);
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

function jraf_bind_virtual(node,path,cb)
{
	var leaf = jraf_virtual_node(node,path);
	var r = leaf.bind(cb);

	if( leaf.full > 0 ) return r;
	// find top incomplete node
	var n = leaf;
	while(n.parent != null)
	{
		if( n.parent.full > 0 ) break;
		n = n.parent;
	}

	///console.log('--- AAA');
	///console.log(n);
	///console.log(cb);

	jraf_node_up(n);

	return r;
}

