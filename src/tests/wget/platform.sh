#!/bin/sh

# detect platform
if [ "z$1" = "zPLAT" ]
then
PLAT=$2
shift 2
fi
[ "z${CURROS}" = "zLinux" ] && PLAT=${PLAT:-unx} || PLAT=${PLAT:-msc}
execdir=_bin_${PLAT}
echo "$PLAT"

