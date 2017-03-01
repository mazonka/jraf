#!/bin/sh
#
# (C) 2016
#

uname -o | grep -i "Linux" > /dev/null && PLAT="u" || PLAT="w"
BIN=_bin${PLAT}
echo ${BIN}

#comm="./jrafd tcp_port=16000 dprn=1 dpul=1 dced=1 dwkr=1 cycle=10000"
#comm="./jrafd"
comm="jrafd skcseed=jraf dpul=0"

error() {
	[ -z "$1" ] || echo ">>> $1"
	exit 1
}


[ "$?" -eq 0 ] || error

cd "../${BIN}/"

if cmd /c ls 2> /dev/null 1> /dev/null
then
echo $comm > strt.bat
echo pause >> strt.bat
#cmd /c start $comm
cmd /c start cmd /c strt.bat
else
./$comm
fi


