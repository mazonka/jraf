// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_WKRTASK
#define _HQ_WKRTASK

#include <istream>
#include <string>

#include "gl_token.h"

#include "hq_record.h"
#include "hq_globalspace.h"

#include "ph_gl_aut.h"

using std::string;

struct Worker2
{
        GlobalSpace * gs;
        gl::Token tok;
        const char ** mime;
        bool encrypted;
        const os::net::Socket * sock;

    private:
        string info();
        string info_db();
        string info_nbs();
        string info_fam();
        string info_log();
        string info_sys();
        string info_id();
        string job();
        string add(bool zr);
        string zero();
        string record(bool last, bool dat, bool first);
        string lastdata();
        string range();
        string file(bool html, bool argument);
        string conn();
        string unlink();
        string note();
        string conflict();
        string quit();
        string tunnel();
        string pleb();
        string admin();
        string slice();
        string drop();

        string ph_login();
        string ph_script(string, string);
        string ph_aucmd();
        string ph_jraf(bool ro);
        string reseed();

        er::Code fetchRecord(int dbIndex, db::Dn * dn,
                             gl::intint n, bool first, db::Record * record);

        string dataset(AutArea & aa, const AutObject & ao);
        string phadmin(AutArea & aa, const AutObject & ao);
        string categ(AutArea & aa, const AutObject & ao);
        string dataset_file(AutArea & aa, const AutObject & ao);

    public:

        Worker2(GlobalSpace * g, const string * s,
                const char ** m, bool e, const os::net::Socket * t)
            : gs(g), tok(s), mime(m), encrypted(e), sock(t) {}

        string process(bool *);
        static string tunnel(GlobalSpace * gs, const string & ipport, const string & cmd);

    private:
        // forbid
        Worker2(const Worker2 &);
        void operator=(const Worker2 &);
};

#endif

