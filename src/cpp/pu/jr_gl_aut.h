// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _PH_GL_AUT
#define _PH_GL_AUT

#include "jr_db.h"
#include "jraf.h"
#include "jr_conf.h"

#include <map>

struct AutObject
{
    string seid;
    Profile profile;
    AutObject(string x, Profile e): seid(x), profile(e) {}
    AutObject() {}

    bool isok() const { return !seid.empty(); }
};

class AutQueue
{
        std::map<string, AutObject> aos;

        unsigned szMax;
        int findAob(gl::intint aid) const;
    public:
        void addAob(const AutObject & ao);
        AutObject getAob_seid(string seid) const;
        AutObject getAob_mail(string mail) const;
        AutQueue(unsigned sz): szMax(sz) {}

        void remove_by_seid(string seid) { aos.erase(seid); }
        void remove_by_mail(string);
        void refresh(Jrdb & db, const AutObject & ao);

        string dump() const;
};

struct AutArea
{
    Jrdb jrdb;
    Jraf jraf;

    os::Semaphore access2autArea;
    AutQueue que;

    AutArea(int sz, string dbfile, string jroot)
        : jrdb(dbfile), jraf(jroot), access2autArea(1), que(sz)
    { jraf::testConf(); }

    AutObject newAob_email(string id, string email);
    void update_name(const AutObject & ao, string newname);

    static string dump_safe(GlobalSpace * gs);
};

#endif
