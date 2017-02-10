// Hasq Technology Pty Ltd (C) 2013-2016

#pragma once

#include <map>

#include "gl_utils.h"
#include "os_filesys.h"

#include "ph_db.h"

gl::intint calc_usage(std::map<string, gl::vstr> & fnames);
void ds_file_del(string daid, string fiid);
gl::intint ds_file_put(string daid, string fiid, string pos, const string & s);
void ds_file_del(string daid, string fiid);
os::Path ds_file1(string daid);
os::Path ds_file2(os::Path f, string fiid);
string ds_file_list(Phdb & phdb, string daid, string fiid);
int getsize(const string & daid, const string & fiid);
