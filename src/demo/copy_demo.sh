#!/bin/sh

error() 
{
	[ -z "$1" ] || echo "$1"
	exit 1
}

[ "$1" = "" ] && error "Use demo directory as the argument"
[ ! -d $1 ] && error "Not a directory: $1"

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

[ ! -d $JRAFCL ] && error "Create $JRAFCL first."
[ ! -d $JRAFFS ] && error "Create $JRAFFS first."

#cp -pv $1/*.js "$JRAFFS/sys"
cp -pvR $1/* $BIN/
