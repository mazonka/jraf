#!/bin/sh

wget=wget

if $wget --help > /dev/null
then
echo "testing wget -- OK"
else
echo "ERROR: wget is not installed"
exit
fi

die(){ echo $1; exit 1; }

sh jrafd_start.sh || die "main.sh: starting jrafd failed"

if sh wget_cmds.sh
then
:
else
die "ATTENTION: jrafd is left running for inspection"
fi

sh jrafd_stop.sh

