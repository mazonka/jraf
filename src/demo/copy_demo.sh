#!/bin/sh

if [ "$1" == "" ]; then
echo "Use demo directory as the argument"
exit
fi

if test -d $1 ; then
:
else
echo "Not a directory: $1"
exit
fi

PLAT=$(uname | grep "Linux")
if [[ ${PLAT} == "" ]]
then
    PLAT=w
else
    PLAT=u
fi

BIN=../_bin${PLAT}
JRAFCL=${BIN}/jrafcl
JRAFFS=${BIN}/jraffs

error() 
{
	[ -z "$1" ] || echo "$1"
	exit 1
}

[ ! -d "$JRAFCL" -o ! -d "$JRAFFS" ] && error "Create JRAF first."

#cp -pv $1/*.js "$JRAFFS/sys"
cp -pvR $1/* $BIN/
