# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=w
else
	PLAT=u
endif

WKR_DIR=..
BIN=$(WKR_DIR)/_bin$(PLAT)
TRG_JRAFCL=$(BIN)/jrafcl
TRG_JRAFFS=$(BIN)/jraffs

all: bin_mkdir cp_js done

bin_mkdir:
	@mkdir -p $(TRG_JRAFCL)/
	@mkdir -p $(TRG_JRAFFS)/sys/

cp_js: *.js 
	@cp -puv jraf.js $(TRG_JRAFFS)/sys/
	@cp -puv jrboot.js $(TRG_JRAFCL)/
	@cp -puv index.html $(TRG_JRAFCL)/
	@cp -puv index_u.html $(BIN)/index.html
	@cp -puv jraf.jrd $(BIN)/
	@cp -puv conf.jrd $(BIN)/
##	@cp -puv write.js $(TRG_JRAFFS)/sys/

checkin:
	@cp -fpuv $(TRG_JRAFFS)/sys/jraf.js ./
	@cp -fpuv $(TRG_JRAFCL)/jrboot.js ./
##	@cp -fpuv $(TRG_JRAFFS)/sys/write.js ./

done:
	@echo  [ COPY JRAF JS - OK ]
