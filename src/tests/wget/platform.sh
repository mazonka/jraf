#!/bin/sh

# detect platform
if [ "z$1" = "zPLAT" ]
then
PLAT=$2
shift 2
fi
[ "z${CURROS}" = "zLinux" ] && PLAT=${PLAT:-u} || PLAT=${PLAT:-w}
execdir=_bin${PLAT}
echo "$PLAT"

