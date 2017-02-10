// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _GL_UTILS
#define _GL_UTILS

#include <string>
#include <vector>
#include <sstream>
#include <algorithm>


#include "gl_defs.h"

using std::string;

namespace gl
{

void replaceAll(string & s, const string & from, const string & to);
bool replaceHexCodes(string & s);

int toi(const char * s);

inline int toi(const string & s) { return toi(s.c_str()); }
intint toii(const string & s);

std::vector<string> tokenise(const string & s);


string tosHex(int n, size_t length);
string tolower(const string & s);
string unslash(const string & s);

template<typename T>
inline string tos(T x) { std::ostringstream o; o << x; return o.str(); }

string file2str(const string & file);
void str2file(const string & file, const string & str);
string file2word(const string & file);
void touch(const string & file);

bool isSufx(const std::string & str, const std::string & sufx);

template <class V, class T>
inline bool isin(const V & v, const T & t)
{
    return (v.end() != std::find(v.begin(), v.end(), t));
}

template <class V, class T>
inline void add(V & v, const T & t)
{
    if ( !isin(v, t) )
        v.push_back(t); // so far maybe later change to insert if necessary
}

template <class V, class T>
inline void merge(V & v, const T & t)
{
    for ( typename T::const_iterator i = t.begin(); i != t.end(); ++i )
        add(v, *i);
}


template <class V, class T>
inline T * findin(V & v, const T & t)
{
    typename V::iterator i = std::find(v.begin(), v.end(), t);
    if ( i == v.end() ) return 0;
    return &*i;
}

template <class V, class T>
inline int findidx(V & v, const T & t)
{
    int cntr = 0;
    typename V::iterator i = v.begin();
    for ( ; i != v.end(); ++i, ++cntr )
        if ( *i == t ) return cntr;

    return -1;
}

template <class T>
class Remover
{
        Remover(const Remover &);
        void operator=(const Remover &);
        const T * p;
    public:
        Remover(const T * x): p(x) {}
        ~Remover() { delete p; }
        void disable() { p = 0; }
};

template <class T>
class Removec
{
        Removec(const Removec &);
        void operator=(const Removec &);
        std::vector<T *> v;
    public:
        Removec(const std::vector<T *> & x): v(x) {}
        ~Removec() { for ( size_t i = 0; i < v.size(); i++ ) delete v[i]; }
        void disable() { v.clear(); }
};

// calendar
int calendarDays(int year, int month);
void nextDay(int & year, int & month, int & day);
string nextDay(const string & date);


typedef std::vector<string> vstr;
vstr str2vstr(const string & s, char delim);
string int2str(int x, int width = 0, char pad = '0');
void eatEndl(string & s);
bool isb64(const string & s);
bool issql(const string & s);
bool ismail(const string & s);
bool endswith(string const & fs, string const & en);

} // gl


#endif

