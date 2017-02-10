#!/bin/sh

cwd=`sh execdir.sh`
wr=$cwd/wroot
echo ""
echo "=="
pushd $wr >/dev/null
ls -1 .jraf.sys/users/admin@server.com/access 
popd >/dev/null
rm -rf $wr
