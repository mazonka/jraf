# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=_bin_$(PLAT)
TRG_CLI=../$(BIN)/jrclnt

all: bin_mkdir cp_php done
	
bin_mkdir:
	@mkdir -p $(TRG_CLI)

cp_php: jraf.php index.php
	@cp jraf.php $(TRG_CLI)/
	@cp index.php $(TRG_CLI)/

checkin:
	@cp -fpuv $(TRG_CLI)/jraf.php ./
	@cp -fpuv $(TRG_CLI)/index.php ./

done:
	@echo [ COPY JRAF PHP - OK ]
