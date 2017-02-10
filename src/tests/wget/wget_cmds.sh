#!/bin/sh

wget=wget

if $wget --help > /dev/null
then
echo "testing wget -- OK"
else
echo "ERROR: wget is not installed"
exit
fi

die(){ echo $1; exit 1; }
run()
{
	if test -f $1_.sh; then
	sh $1_.sh >> wget.out
	fi

	cm="$cmd --post-data=command=reseed"
	#echo $cm
	$cm

	cm="$cmd --post-file=$1.i"
	#echo $cm
	$cm

	if test -f $1.sh; then
	sh $1.sh >> wget.out
	fi

	if cmp $1.o wget.out
	then
	echo "$1 - ok"
	else
	echo $cm
	echo "$1 - FAILED see wget.out"
	diff $1.o wget.out | grep -v "No newline at end of file"
	exit 1
	fi
}

cmd=`cat cmd.wget`

while read LINE
do

rm -f wget.log wget.out

if test -f $LINE.i; then

#	cm="$cmd --post-file=$LINE.i"
	#echo $cm
#	$cm

#	if cmp $LINE.o wget.out
#	then
#	echo "$LINE - ok"
#	else
#	echo $cm
#	echo "$LINE - FAILED see wget.out"
#	exit 1
#	fi
	run $LINE

elif test -d $LINE; then

	for i in $LINE/*.i
	do

	in=$LINE/$(basename $i)
	in=${in%.*}
	#echo "file $in"

	run $in

	done

else
	echo "SKIPPED $LINE.i"
fi

rm -f wget.log wget.out
done < cmds.list


