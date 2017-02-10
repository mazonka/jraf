#ifndef __JR_CONF_H
#define __JR_CONF_H

#include <string>

#include "os_filesys.h"

using std::string;

namespace jraf
{
extern string ph_conf;
void testConf();
string loadConf(string name);
bool matchConf(string name, string val);
void sendmail(string & server, string sid, string mail);
void cleanOldFiles(os::Path dir, double secs);
bool isuname(const string & s);
} // jraf

#endif
