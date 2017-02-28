1. check that execdir.sh works
2. if you run PHP tests, start wget_cmds.sh
3. if you run jrafd tests, start main.sh

4. How to run nowrite tests
   replace list with nowrite
   PHP edit jraf.php write_deny=true
   C++ edit jrafd_start.sh - add option ban=write

