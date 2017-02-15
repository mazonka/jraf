# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

WKR_DIR=..
BIN=$(WKR_DIR)/_bin_$(PLAT)
TRG_CLI=$(BIN)/jrclnt
TRG_JRAF=$(BIN)/jraf

all: bin_mkdir cp_js done

bin_mkdir:
	@mkdir -p $(TRG_CLI)/jraf/
	@mkdir -p $(TRG_JRAF)/sys/

cp_js: *.js 
	@cp -puv jraf.js $(TRG_JRAF)/sys/
	@cp -puv write.js $(TRG_JRAF)/sys/
	@cp -puv sys.js $(TRG_CLI)/jraf/

checkin:
	@cp -fpuv $(TRG_JRAF)/sys/jraf.js ./
	@cp -fpuv $(TRG_JRAF)/sys/write.js ./
	@cp -fpuv $(TRG_CLI)/jraf/sys.js ./

done:
	@echo  [ COPY JRAF JS - OK ]
