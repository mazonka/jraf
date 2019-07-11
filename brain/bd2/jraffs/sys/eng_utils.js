


function eng_utils_js(){}


function eng_is_email(data)
{
    return (/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,6}$/i.test(data)) ? true :
        false;
}

function eng_get_b64dec_list(data)
{

    data.forEach(function(item, i, arr)
    {
        arr[i] = window.atob(arr[i]);
    });

    return data;
}

function eng_get_b64enc_list(data)
{

    data.forEach(function(item, i, arr)
    {
        arr[i] = window.btoa(arr[i]);
    });

    return data;
}

function eng_open_file(file, ext_cb, ext_progress, ext_done)
{
    var obj = {
        name: file.name,
        size: file.size,
        type: file.type,
        error: 0,
        text: ''
    };

    /*
    file.error list:
    0 - no error;
    1 - no such file;
    2 - empty file;
    3 - File oversized;
    4 - File not found;
    5 - File not readable;
    9 - Read error;
     */
    var reader = new FileReader();

    reader.onerror = reader.onabort = function error_handler(evt)
    {
        // get window.event if evt argument missing (in IE)
        evt = evt || window.event;

        switch (evt.target.error.code)
        {
            case evt.target.error.NOT_FOUND_ERR:
                obj.error = 1;
                break;
            case evt.target.error.NOT_READABLE_ERR:
                obj.error = 2;
                break;
            case evt.target.error.ABORT_ERR:
                obj.error = 3;
                break;
            case evt.target.error.SECURITY_ERR:
                obj.error = 4;
                break;
            case evt.target.error.ENCODING_ERR:
                obj.error = 5;
                break;
            default:
                obj.error = 9;
        }
        //debug
        console.log('error:' + obj.error);
        ext_cb(obj);
    };

    reader.onload = function onload_handler(data)
    {
        var bytes = new Uint8Array(data.target.result);

        for (let i = 0, len = bytes.byteLength; i < len; i++)
            obj.text += String.fromCharCode(bytes[i]);

        ext_cb(obj);
    };

    reader.onprogress = function progress_handler(data)
    {
        if (data.lengthComputable)
        {
            let loaded = parseInt(((data.loaded / data.total) * 100),10);
            Boolean(ext_progress) && ext_progress(loaded);
        }
    };

    reader.onloadstart = function()
    {
        Boolean(ext_done) && ext_done(false);
    };

    reader.onloadend = function()
    {
        Boolean(ext_done) && ext_done(true);
    };

    //reader.readAsArrayBuffer(file.slice(0, size_lim));
    reader.readAsArrayBuffer(file);
}

function eng_get_resp_list(data)
{
    data = data.split(' : ');
    data.forEach(function(item, i, arr)
    {
        arr[i] = arr[i].replace(/^\s+|\s+$/g, '')
    });

    return data;
}

function eng_get_all_resp(data)
{
    var resp = eng_get_resp_list(data);

    resp.forEach(function(item, i, arr)
    {
        arr[i] = arr[i]
            .replace(/^\s+|\r|\s+$/g, '')
            .split('\u0020')
            .shift();
    });
    /*
    resp is an array with response headers list:
    ['OK', 'JRAF_ERR, 'JRAF_FAIL', 'AUTH', REQ_MSG_BAD, REQ_PATH_BAD, etc]
    */
    return resp;
}

function eng_get_resp(data)
{
    var resp = eng_get_all_resp(data);

    if (eng_is_arr_el_equal(resp, JRAF.OK)) return true;
    if (eng_is_in_arr(resp, [JRAF.AUTH])) return null;

    return false;
}

// find elemets from stack in arr
function eng_is_in_arr(arr, stack) {
    return arr.some(function (v) {
        return stack.indexOf(v) >= 0;
    });
}

//return true if all "arr" elements are equal to "val"
function eng_is_arr_el_equal(arr, val)
{
    return arr.every((v, i, arr) => v === val);
}

function eng_get_data(data)
{
    var _data = eng_get_resp_list(data);

    _data.forEach(function(item, i, arr)
    {
        arr[i] = arr[i]
            .replace(/^OK|^JRAF_FAIL.*|^JRAF_ERR.*/g, '')
            .replace(/^\s|\r|\s+$/g, '')
            .split(/\s/);

        arr[i] = arr[i].filter(
            function(el)
            {
                if (el.length > 0) return el;
            });
    });
    // ?FIX
    _data = _data.filter(
        function(el)
        {
            if (el.length > 0) return el;
        });

    if (_data.length === 0) _data = [null];

    return _data;
}

function eng_load_file(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function eng_get_profile(data)
{
    var profile = {};
    var _data = data;

    if (!Boolean(_data)) return null;
    if (_data.length != 6) return null;

    profile.adm = (_data.shift() == 'a') ? true : false;
    profile.eml = _data.shift();
    profile.qta = _data.shift();
    profile.lst = eng_get_dt(_data.shift());
    profile.cnt = _data.shift();
    profile.unm = _data.shift();

    return profile;
}

function eng_get_dt(data)
{
    var ts = {};
    data = data || '';

    if (typeof data !== 'string'
        || data === '*'
        || data.length !== 14
    )
    {
        return '*';
    }

    ts.yy = data.substring(0, 4);
    ts.mm = data.substring(4, 6);
    ts.dd = data.substring(6, 8);
    ts.h = data.substring(8, 10);
    ts.m = data.substring(10, 12);
    ts.s = data.substring(12);

    return [ts.yy, ts.mm, ts.dd].join('.') + ', ' +
        [ts.h, ts.m, ts.s].join(':');
}

