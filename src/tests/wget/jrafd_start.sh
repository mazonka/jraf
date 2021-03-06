#!/bin/sh

cwd=`pwd`
test -f /usr/bin/cygpath && cwd=`cygpath -m $cwd`

# detect platform
PLAT=`sh platform.sh`
execdir=_bin_${PLAT}
#echo "Platform detected $PLAT"

die(){ echo $1; exit 1; }

xpwd=`sh execdir.sh` || die "jrafd_start.sh: cannot find jrafd"

echo "jrafd found at $xpwd"
cd $xpwd

rm -rf wroot
opt1="jrdb=wget.db jraf_root=wroot tcp_port=16001 skcseed=1"
opt2="s=$cwd/date.inp let=reseed"
#opt3="ban=write"
comm="./jrafd -cqx dwkr=1 quit=1 $opt1 $opt2 $opt3"
echo $comm

if cmd /c ls 2> /dev/null 1> /dev/null
then
cmd /c start $comm
else
./$comm
fi

cd $cwd