#!/bin/sh

cmd=`cat cmd.wget`
$cmd --post-data="command=quit"
rm -f wget.log wget.out

