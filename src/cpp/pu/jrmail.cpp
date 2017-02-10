// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_protocol.h"

#include "os_net.h"
#include "os_thread.h"

#include "sg_cout.h"
#include "sg_testing.h"

#include "hq_logger.h"
#include "hq_config.h"
#include "hq_console.h"
#include "hq_publisher.h"

#include "hq_platform.h"

void send_au(string, string);

int main(int ac, const char * av[]) try
{
    if ( ac < 3 ) throw gl::ex("Usage: phmain cmd + args");

    string cmd = av[1];

    if (0);
    else if ( cmd == "login" && ac == 4 ) send_au(av[2], av[3]);
    else throw gl::ex("Command [" + cmd + "] not recognized or wrong number of args");

    return 0;
}
catch (gl::Exception e)
{
    std::cout << "Error (phmail): " << e.str() << '\n';

    return 0;
}
catch (string s)
{
    std::cout << "Error (phmail): " << s << '\n';
    return 0;
}


void send_au(string email, string url)
{
    os::Cout() << "[N/I] phmail: Sending to [" + email + "] au [" + url + "]\n";
}

