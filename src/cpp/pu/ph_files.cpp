// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "sg_cout.h"
#include "ph_files.h"

os::Path ds_file1(string daid)
{
    os::Path f = "files";
    f += gl::tos(10000 + gl::toi(daid));
    return f;
}

os::Path ds_file2(os::Path f, string fiid)
{
    f += gl::tos(10000 + gl::toi(fiid));
    return f;
}

gl::intint ds_file_put(string daid, string fiid, string pos, const string & s)
{
    os::Path f = ds_file1(daid);
    os::FileSys::trymkdir(f);

    if ( !f.isdir() )
        return -2;

    f = ds_file2(f, fiid);

    if ( !f.isfile() ) { std::ofstream of(f.str().c_str()); }

    int fsz = f.filesize();

    if ( fsz != gl::toi(pos) )
        return fsz;

    {
        std::ofstream of(f.str().c_str(), std::ios::app);
        of << s;
    }

    return f.filesize();
}

void ds_file_del(string daid, string fiid)
{
    os::Path f = ds_file1(daid);
    f = ds_file2(f, fiid);
    f.erase();
}

int getsize(const string & daid, const string & fiid)
{
    os::Path f = ds_file1(daid);
    f = ds_file2(f, fiid);
    return f.filesize();
}

gl::intint calc_usage(std::map<string, gl::vstr> & fnames)
{
    gl::intint us = 0;

    for ( auto & daid : fnames )
    {
        for ( auto & fiid : daid.second )
        {
            us += (gl::intint)(unsigned)getsize(daid.first, fiid);
        }
    }

    return us;
}

string ds_file_list(Phdb & phdb, string daid, string fiid)
{
    gl::vstr ids, des;
    int sz = phdb.ds_file_list(daid, fiid, ids, des);
    string r;
    r += gl::tos(sz);

    if ( ids.size() != des.size() ) return "";
    if ( (int)ids.size() != sz ) return "";

    for ( int i = 0; i < sz; i++ )
    {
        r += ' ' + ids[i];
        r += ' ' + des[i];
        r += ' ' + gl::tos(getsize(daid, ids[i]));
    }

    return r;
}

