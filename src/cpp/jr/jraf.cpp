#include <iostream>
#include <fstream>

#include "os_filesys.h"
#include "os_timer.h"
#include "sg_cout.h"
#include "gl_utils.h"
#include "gl_except.h"
#include "gl_err.h"
#include "ma_utils.h"
#include "ma_skc.h"

#include "jr_conf.h"
#include "jraf.h"

inline string zero(string s, string d = "0")
{
    return s.empty() ? d : s;
}

string Jraf::request(gl::Token tok, string anonce, bool ro)
{
    Cmdr result;
    while (true)
    {
        if ( !tok.next() ) return bad().s;
        string cmd = tok.sub();

        if ( cmd == "ping" ) result += ok();
        else if ( cmd == "version" )
        {
            if ( !tok.next() ) result += bad();
            else
            {
                string w = tok.sub();
                if ( w == "backend" ) result += ok(jraf::be_version);
                else if ( w == "client" ) result += client_version();
                else result += bad();
            }
        }

        else if ( cmd == "read" || cmd == "get" )
        {
            if ( !tok.next() ) return err("session id").s;
            string sess = tok.sub();

            auto usr = user(sess);
            if ( !usr.auth ) { result += auth(); return result.s; }

            hq::LockRead lock(&access);

            string pth;
            Cmdr er = read_tok_path(tok, pth, usr, false );
            if ( !er.b ) return result.s += er.s;
            result += read_obj(pth, cmd == "get", usr );
        }

        else if ( cmd == "profile" )
        {
            if ( !tok.next() ) return err("session id").s;
            string sess = tok.sub();

            auto usr = user(sess);
            if ( !usr.auth ) { result += auth(); return result.s; }

            hq::LockRead lock(&access);
            result += profile(usr);
        }

        else if ( isaureq(cmd) && !ro )
        {
            hq::LockWrite lock(&access);
            result += aurequest(tok, cmd);
        }
        else if ( cmd == "login" && !ro )
        {
            hq::LockWrite lock(&access);

            nonce = ma::skc::hashHex(nonce + anonce).substr(0, 16);
            result += login(tok, true);
        }
        else if (cmd == "logout" && !ro )
        {
            hq::LockWrite lock(&access);
            result += login(tok, false);
        }
        else
        {
            result += err("bad command [" + cmd + "]");
            break;
        }

        if ( !result.b ) break;
        if ( !tok.next() ) break;
        string ts = tok.sub();
        if ( ts != ":" ) return result.s + " : " + err("[" + ts + "]").s;

        result.s += " : ";
    }

    if ( result.s.empty() ) return bad().s;
    return result.s;
}


Jraf::Cmdr Jraf::client_version()
{
    string p = (sys_dir() + "version").str();
    string fever = gl::file2str(p);

    if ( fever.empty() ) return err("no file system found [" + p + "]");

    return ok(fever);
}

os::Path Jraf::ver_path(const os::Path & p) const
{
    os::Path q = p;
    q = q.glue(jraf::ver_name);
    q = ver_dir() + q;
    return q;
}


string Jraf::getver(const os::Path & p) const
{
    os::Path q = ver_path(p);
    string ver = gl::file2word( q.str() );
    ver = zero(ver);
    return ver;
}

void Jraf::setver(const os::Path & p, string v)
{
    os::Path q = ver_path(p);

    os::Path parent = parent_str(q);
    if ( !parent.isdir() ) os::FileSys::trymkdir(parent);
    if ( !parent.isdir() ) throw gl::ex("Failed to make dir " + parent.str());

    std::ofstream of(q.str(), std::ios::binary );
    of << v << '\n';
    if ( !of ) throw gl::ex("Bad access to " + q.str());
}

bool Jraf::special(string s, bool su)
{
    if ( s.find(jraf::ver_name) != string::npos ) return true;

    if (su) return false;

    if ( s.find(jraf::sys_name) != string::npos ) return true;

    return false;
};

Jraf::Cmdr Jraf::read_obj(string pth, bool getonly, const User & u)
{
    if ( special(pth, u.su) ) return err("sys path");

    os::Path rp(pth);
    os::Path p = root(pth);
    string ver = getver(pth);

    if ( p.isdir() )
    {
        string q = ver + " -1";
        if ( getonly ) return ok(q);

        os::Dir dir = os::FileSys::readDirEx(p, true, true);

        string r;
        int cntr = 0;

        for ( auto i : dir.dirs )
        {
            if ( special(i, u.su) ) continue;
            r += ' ' + getver(rp + i);
            r += " -1";
            r += ' ' + i;
            cntr++;
        }

        for ( auto i : dir.files )
        {
            if ( special(i.first, u.su) ) continue;
            r += ' ' + getver(rp + i.first);
            r += ' ' + gl::tos(i.second);
            r += ' ' + i.first;
            cntr++;
        }

        q += ' ' + gl::tos(cntr);

        return ok(q + r);
    }

    if ( p.isfile() )
    {
        string r = ver + ' ' + gl::tos(p.filesize());
        if ( getonly ) return ok(r);
        r += ' ' + ma::b64enc( gl::file2str(p.str()) );
        return ok(r);
    }

    return err("bad path " + pth);
}

bool Jraf::isaureq(const string & cmd) const
{
    if (0) {}
    else if ( cmd == "md" ) return true;
    else if ( cmd == "rm" ) return true;
    else if ( cmd == "put" ) return true;
    else if ( cmd == "save" ) return true;
    else if ( cmd == "mv" ) return true;
    return false;
}

Jraf::Cmdr Jraf::aurequest(gl::Token & tok, const string & cmd)
{
    if ( !tok.next() ) return err("session id");
    string sess = tok.sub();
    auto superuser = user(sess);
    if ( !superuser.auth ) return auth();

    ///if ( !tok.next() ) return err("command");
    ///string cmd = tok.sub();

    string pth;
    Cmdr er = read_tok_path(tok, pth, superuser, true);
    if ( !er.b ) return er;

    if (0) {}

    else if ( cmd == "md" ) return aureq_md(pth);
    else if ( cmd == "rm" ) return aureq_rm(pth);
    else if ( cmd == "put" ) return aureq_put(tok, pth, true);
    else if ( cmd == "save" ) return aureq_put(tok, pth, false);
    else if ( cmd == "mv" )
    {
        string pto;
        er = read_tok_path(tok, pto, superuser, true);
        if ( !er.b ) return er;
        return aureq_mv(pth, pto);
    }

    return err("command [" + cmd + "] unknown");
}


Jraf::Cmdr Jraf::aureq_rm(string pth)
{
    if ( pth.empty() ) return fail("root cannot be removed");

    os::Path p = root(pth);

    p.erase();
    if ( p.isdir() || p.isfile() ) return fail("rm " + pth);

    update_ver(pth);

    return ok(pth);
}

Jraf::Cmdr Jraf::aureq_md(string pth)
{
    os::Path p = root(pth);
    if ( p.isdir() ) return ok(pth);
    os::FileSys::trymkdir(p);
    if ( !p.isdir() ) return fail("md " + pth);
    update_ver(pth);
    return ok(pth);
}

Jraf::User Jraf::user(string sess)
{
    os::Path usr = users();
    if ( !usr.isdir() ) return User(true, true);

    if ( sess == "0" ) return User(false, true);

    os::Path in = login() + sess;

    if ( !in.isfile() ) return User(false, false);

    string email = gl::file2word(in.str());

    bool superuser = jraf::matchConf("admin", email);

    // update stat

    os::Path udir = users() + email;
    if ( !udir.isdir() )
    {
        udir.mkdir();
        if ( !udir.isdir() ) throw gl::ex("Cannot create " + udir.str());

        new_user(email);
    }

    // set counter
    string file_cntr = (udir + "counter").str();
    string scntr = gl::file2word( file_cntr );
    int icntr = 0;
    if ( !scntr.empty() ) icntr = gl::toi(scntr);
    scntr = gl::tos(++icntr);
    gl::str2file(file_cntr, scntr + '\n');

    // set access
    string file_last = (udir + "access").str();
    string last = os::Timer::getGmd() + os::Timer::getHms();
    gl::str2file(file_last, last + '\n');

    User r(superuser, true);
    r.email = email;
    r.cntr = scntr;
    r.last = last;

    return r;
}

void Jraf::set_user_uname(User & su)
{
    string uname = gl::file2word((users() + su.email + "uname").str());
    if ( jraf::isuname(uname) ) su.uname = uname;
}

void Jraf::set_user_quota(User & su)
{
    string quota = gl::file2word((users() + su.email + "quota").str());
    su.quotaKb = quota;
}

bool Jraf::check_au_path(string pth, User & su, bool write)
{
    if ( su.su ) return true;
    if ( !write ) return true;

    set_user_uname(su);
    if ( su.uname.empty() ) return false;

    string rpth = root(pth).str();
    string hdir = (home() + su.uname).str();

    auto hsz = hdir.size();
    if ( rpth.size() < hsz ) return false;

    //os::Cout() << "email, quotaKb, last, cntr, uname" << os::endl;
    //os::Cout() << su.email << ", " << su.quotaKb << ", "<< su.last << ", " << su.cntr << ", " << su.uname << os::endl;

    return ( rpth.substr(0, hsz) == hdir );
}

Jraf::Cmdr Jraf::aureq_put(gl::Token & tok, string pth, bool append)
{
    // (put) pos, sz, text
    // (save) sz, text

    int pos = -1;
    if ( append )
    {
        if ( !tok.next() ) return err("position");
        pos = gl::toi(tok.sub());
    }

    if ( !tok.next() ) return err("size");
    int siz = gl::toi(tok.sub());

    string text;
    if ( siz )
    {
        if ( !tok.next() ) return err("text");
        text = ma::b64dec(tok.sub());
    }

    if ( (int)text.size() != siz ) return err("size mismatch");

    os::Path f = root(pth);

    if ( !f.isfile() ) { std::ofstream of(f.str().c_str()); }
    if ( !f.isfile() ) return fail("cannot create " + pth);

    int fsz = f.filesize();

    if ( append )
    {
        if ( fsz != pos ) return fail(gl::tos(fsz));

        std::ofstream of(f.str().c_str(), std::ios::app | std::ios::binary );
        of << text;
    }
    else
    {
        std::ofstream of(f.str().c_str(), std::ios::binary);
        of << text;
    }

    update_ver(pth);
    return ok(gl::tos(f.filesize()));
}

Jraf::Cmdr Jraf::read_tok_path(gl::Token & tok, string & pth, User & su, bool wr)
{
    if ( !tok.next() ) return err("path");
    string p = tok.sub();

    gl::replaceAll(p, "//", "/");

    if ( p.find("..") != string::npos ) return err("..");

    if ( p.empty() ) return err("empty");

    while ( !p.empty() && p[p.size() - 1] == '/' )
        p = p.substr(0, p.size() - 1);

    if ( special(p, su.su) ) return fail("system path");
    if ( !check_au_path(p, su, wr) ) return fail("denied");

    pth = p;
    return Cmdr();
}

Jraf::Cmdr Jraf::aureq_mv(string pth, string pto)
{
    os::Path f1 = root(pth);
    bool dir = f1.isdir();

    if ( dir ) return fail("moving direcrories not allowed");
    // the reason is that it would require recursive copying
    // of the version files sub-tree, since it cannot be moved

    os::Path f2 = root(pto);

    bool k = os::rename(f1.str(), f2.str());
    if ( !k ) return fail(pth + " -> " + pto);
    if ( f1.isdir() || f1.isfile() ) return fail("mv " + pth);

    update_ver(pto);
    update_ver(pth);
    // no parent updating is required as it is automatic

    return ok(pto);
}

string Jraf::parent_str(os::Path pth)
{
    string spth = pth.str();

    if ( pth.size() < 2 ) return "";
    string up = pth.strP(pth.size() - 2);
    return up;
}

void Jraf::update_ver(os::Path pth)
{
    if ( special(pth.str(), false) ) return;

    string v = getver(pth);
    v = gl::tos( gl::toi(v) + 1 );
    setver(pth, v);

    string up = parent_str(pth);
    if ( up == pth.str() ) return;

    update_ver(up);
}

Jraf::Cmdr Jraf::login(gl::Token & tok, bool in)
{
    if ( !tok.next() ) return err("need arg");
    string em = tok.sub();

    if ( !users().isdir() ) return fail("no users");

    os::Path dir = login();
    if ( !dir.isdir() )
    {
        dir.mkdir();
        if ( !dir.isdir() ) return fail("login directory fails");
    }

    if ( in )
    {
        string server;

        if ( tok.next() && (server = tok.sub()) != ":" );
        else return err("arg required <server> or '*'");

        if ( server == "*" ) server = "";

        if ( !gl::ismail(em) ) return err("bad email");
        gl::str2file( (dir + nonce).str(), em);

        jraf::sendmail(server, nonce, em);

        return ok(server);
    }

    // logout

    (dir + em).erase();

    jraf::cleanOldFiles(dir, 10 * 1000 * 1000); // 4 months

    return ok();
}


void Jraf::new_user(string email)
{
    os::Path udir = users() + email;

    // set quota and uname
    string quotaKb = jraf::loadConf("quota");
    if ( quotaKb.empty() ) quotaKb = "10000";

    string x = ma::skc::hashHex(email).substr(0, 16);
    string uname = ma::skc::hashHex(email + x).substr(0, 16);

    /// string uname = ma::skc::enc(x, email, x, x);
    /// uname = ma::toHex(uname).substr(0, 16);

    string file_quota = (udir + "quota").str();
    gl::str2file(file_quota, quotaKb + '\n');

    string file_uname = (udir + "uname").str();
    gl::str2file(file_uname, uname + '\n');

    // create home dir
    auto hm = home();

    if ( !hm.isdir() )
    {
        hm.mkdir();
        if ( !hm.isdir() ) throw gl::ex("Cannot create /home");
    }

    (hm + uname).mkdir();
}

Jraf::Cmdr Jraf::profile(User & su)
{
    set_user_uname(su);
    set_user_quota(su);

    string r = su.su ? "a" : "u";

    // auto star = [](string s, string d = "*") -> string { return s.empty() ? d : s; };
    auto star = [](string s) -> string { return s.empty() ? "*" : s; };

    r += " ";
    r += star(su.email) + ' ';
    r += star(su.quotaKb) + ' ';
    r += star(su.last) + ' ';
    r += star(su.cntr) + ' ';

    if ( su.uname.empty() ) r += star(su.uname);
    else r += (os::Path(jraf::home) + su.uname).str();

    return ok(r);
}

