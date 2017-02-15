#!/bin/sh

PLAT=$(uname | grep "Linux")
if [[ ${PLAT} == "" ]]
then
    PLAT=w
else
    PLAT=u
fi

BIN=../../_bin${PLAT}
JRAFCL=${BIN}/jrafcl
JRAFFS=${BIN}/jraffs

error() 
{
	[ -z "$1" ] || echo "$1"
	exit 1
}

[ ! -d "$JRAFCL" -o ! -d "$JRAFFS" ] && error "Create JRAF first."

cp -puv sys/*.js "$JRAFFS/sys"
cp -puv jrd/jraf.jrd "$JRAFCL"
