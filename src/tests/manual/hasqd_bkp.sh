#!/bin/sh

name=phenod

url=https://github.com/mazonka/phenomainz.git/trunk/src/phenod
#svn=svn
svn='cmd /c c:/ap14/run/sx.bat'

reinit()
{
rm -rf $name
echo $svn ls $url
$svn ls $url
echo $svn co $url -r 22
$svn co $url -r 22
}

#reinit
#exit

start=300
end=399

for (( x=$start; x<=$end; x++ ))
do
echo "= = = Iteration $x = = ="
cd $name
$svn up -r $x
cd ..
svn export $name $name_$x
fcl3 make -D $name_$x $name_$x
bzip2 $name_$x.fcl
rm -rf $name_$x
done
