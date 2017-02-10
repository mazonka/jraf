// Hasq Technology Pty Ltd (C) 2013-2016

#include "sg_client.h"

sgl::Client::Client(const Link & link) throw() :
    ok(false)
    , addr(link.tcpto, ok)
    , tcpClient(link.prot, addr, link.nl, link.px.remote.empty() ? nullptr : &link.px )
{
    if (ok) ok = tcpClient.isConnected();
}
