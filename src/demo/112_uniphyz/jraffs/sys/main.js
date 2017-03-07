// Jraf team (C) 2017
'use strict';

var g_wid = {
    btn: { li: {}, lo: {}, up: {} },
    tbl: {},
    hdr: {}
};


g_wid.btn.li.wid = $('<button/>', { text: 'Login', click: login });
g_wid.btn.lo.wid = $('<button/>', { text: 'Logout', click: logout });
g_wid.btn.up.wid = $('<label/>', { text: 'Upload' })
    .css('cursor', 'pointer')
    .css('border', '1px solid')
    .css('border-radius', '3px')
    .css('padding-left', '4px')
    .css('padding-right', '4px')
    .css('margin', '2px')
    .append($('<input type=file onchange="upload(this.files)"/>').hide());
g_wid.hdr.wid = $('<h3>UNIPHYZ</h3>').css('text-align', 'center');
g_wid.tbl.wid = $('<table/>');
g_wid.tbl.add = function() { o(this) };

function login()
{
    var cb = function (data)
    {
        console.log(data);
    };
    
    jraf_ajax('jw login a@b.cc *', cb);
}

function logout()
{
    var cb = function (data)
    {
        console.log(data);
    };
    
    jraf_ajax('jw logout ' + g_session, cb);
}

function upload(f)
{
    var cb = function(data)
    {
        console.log('File name: ' + data.name);
        console.log('File text: ' + data.text);
    };
    
    eng_open_file(f[0], cb);
}

function main_js()
{
    ping();
}

function main_wid()
{
    $g_div_main.html(g_wid.hdr.wid);
    $g_div_main.append(
        $('<div/>').append(g_wid.btn.li.wid).append(g_wid.btn.lo.wid));
    
    $g_div_main.append(
        $('<div/>').append(g_wid.btn.up.wid));
}

function ping()
{
    var cb = function (data)
    {
        if (eng_get_resp(data)) return create_users();
    };
    
    jraf_ajax('jr ping', cb);
}

function create_users()
{
    var cb = function (data)
    {
        var resp = eng_get_resp(data);
        
        if (resp === null) 
            return console.log('/.jraf.sys/users creation error!');
        else if (resp === false)
            console.log('/.jraf.sys/users exists!');
        else
            console.log('/.jraf.sys/users created!');
            
        main_wid();
    };
    
    jraf_ajax('jw md 0 /.jraf.sys/users', cb);    
}