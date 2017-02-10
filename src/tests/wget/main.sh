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

sh phenod_start.sh || die "main.sh: starting phenod failed"

if sh wget_cmds.sh
then
:
else
die "ATTENTION: phenod is left running for inspection"
fi

sh phenod_stop.sh

