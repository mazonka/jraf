# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=w
else
	PLAT=u
endif

BIN=_bin$(PLAT)
TRG_JRAFCL=../$(BIN)/jrafcl

all: bin_mkdir cp_php done
	
bin_mkdir:
	@mkdir -p $(TRG_JRAFCL)

cp_php: jraf.php index.php
	@cp jraf.php $(TRG_JRAFCL)/
	@cp index.php $(TRG_JRAFCL)/

checkin:
	@cp -fpuv $(TRG_JRAFCL)/jraf.php ./
	@cp -fpuv $(TRG_JRAFCL)/index.php ./

done:
	@echo [ COPY JRAF PHP - OK ]
