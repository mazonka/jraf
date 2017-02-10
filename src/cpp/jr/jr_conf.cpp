#include <fstream>
#include <cstdlib>

#include "gl_err.h"
#include "gl_except.h"
#include "gl_utils.h"

#include "os_exec.h"
#include "sg_cout.h"

#include "jr_conf.h"

string jraf::ph_conf = "conf.phd";

void jraf::testConf()
{
    string a = gl::file2str(ph_conf);
    if ( a.empty() ) throw gl::ex("Cannot open: " + ph_conf);
}


string jraf::loadConf(string name)
{
    std::ifstream in(ph_conf.c_str());
    while (in)
    {
        string k, v;
        in >> k >> v;
        if ( k == name ) return v;
    }

    return "";
}

bool jraf::matchConf(string name, string val)
{
    std::ifstream in(ph_conf.c_str());
    while (in)
    {
        string k, v;
        in >> k >> v;
        if ( k == name && v == val ) return true;
    }

    return false;
}


void jraf::sendmail(string & url, string sid, string em)
{
    // url http://localhost:16000/home?0, http://localhost:16000[/]

    if ( url.empty() ) url = jraf::loadConf("server");

    if ( url.empty() ) throw gl::ex("jraf::sendmail: empty url");
    auto i = url.find('?');

    if ( i == string::npos )
    {
        if ( url[url.size() - 1] != '/' ) url += '/';
        url += "jraf?";
    }
    else
        url = url.substr(0, i + 1);

    string furl = url + gl::tos(sid);

    string cmd = jraf::loadConf("phmail");
    if ( cmd.empty() ) cmd = "phmail";

    cmd += " login " + em + " " + furl;

    cmd = os::THISDIR + cmd;
    std::system(cmd.c_str());
}

void jraf::cleanOldFiles(os::Path dir, double secs)
{
    os::Dir d = os::FileSys::readDir(dir);

    for ( auto i : d.files )
    {
        string nm = i.first;
        auto file = dir + nm;
        double ho = file.howold();
        if ( ho > secs ) file.erase();
        //os::Cout()<<" "<<file.str()<<' '<<ho<<' '<<secs<<os::endl;
    }
}

bool jraf::isuname(const string & s)
{
    if ( s.size() < 3 ) return false;
    if ( s.size() > 16 ) return false;

    for ( int i = 0; i < (int)s.size(); i++ )
    {
        const char & c = s[i];

        //if ( c >= 'A' && c <= 'Z' ) continue;
        if ( c >= 'a' && c <= 'z' ) continue;
        if ( c >= '0' && c <= '9' ) continue;
        if ( c == '_' || c == '_' ) continue;

        return false;
    }

    return true;

}

