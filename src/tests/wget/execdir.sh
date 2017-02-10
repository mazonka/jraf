#!/bin/sh

die(){ echo $1; exit 1; }

# detect platform
PLAT=`sh platform.sh`
execdir=_bin_${PLAT}

#search for _bin
xpwo=
while :
do
#echo "AAA cheking `pwd`"
if [[ -f "$execdir/phenod" || -f "$execdir/phenod.exe" ]]; then
   hpwd=`pwd`
   break
fi
cd ..
xpwd=`pwd`
if [ "$xpwd" = "$xpwo" ]; then
   die "Cannot find phenod"
fi
#echo "[$xpwd] = [$xpwo]"
xpwo=$xpwd
done

echo $xpwo/$execdir

