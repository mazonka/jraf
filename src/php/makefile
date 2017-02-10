# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=../_bin_$(PLAT)
CLI=$(BIN)/jrafcli
JRD=../conf

all: $(CLI) $(CLI)/jraf.php conf.jrd

$(CLI):
	@mkdir -p $(CLI)

$(CLI)/jraf.php: jraf.php
	cp jraf.php $(CLI)
	cp index.php $(CLI)

conf.jrd: $(JRD)/conf.jrd
	cp $< $(BIN)/

checkin:
	cp -fpuv $(CLI)/jraf.php ./

