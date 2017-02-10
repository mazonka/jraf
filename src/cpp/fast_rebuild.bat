set PL=PLAT=msc

pushd .

make %PL% clean

cd gl && make %PL% -j 10 && cd ../
cd os && make %PL% -j 10 && cd ../
cd sg && make %PL% -j 10 && cd ../
cd ma && make %PL% -j 10 && cd ../
cd db && make %PL% -j 10 && cd ../
cd pu && make %PL% -j 10 && cd ../
::cd q3 && make %PL% -j 10 && cd ../
cd jr && make %PL% -j 10 && cd ../

popd

make %PL%
make %PL%
make %PL%
make %PL%

pause

