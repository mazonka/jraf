# JRAF Team (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=w
else
	PLAT=u
endif

WRK_DIR=../..
BIN=$(WRK_DIR)/_bin$(PLAT)
TRG_JRAFCL=$(BIN)/jrafcl
JQ_BZ2=$(shell ls *.bz2)

all: bin_mkdir jq_untar jq_cp jq_rm done

bin_mkdir:
	@mkdir -p $(TRG_JRAFCL)/lib/images

jq_untar: $(JQ_BZ2)
	@tar xjvf $(JQ_BZ2) >/dev/null

jq_cp:
	$(eval DIR := $(shell ls -d */))
	@cp -puv $(DIR)/jquery-ui.min.js $(TRG_JRAFCL)/lib/
	@cp -puv $(DIR)/jquery-ui.min.css $(TRG_JRAFCL)/lib/
	@cp -puv $(DIR)/external/jquery/jquery.js $(TRG_JRAFCL)/lib/
	@cp -puv $(DIR)/images/*.png $(TRG_JRAFCL)/lib/images
	@cp -puv $(DIR)/external/jquery/jquery.js $(TRG_JRAFCL)/lib/
	
jq_rm:
	$(eval DIR := $(shell ls -d */))
	@rm -rf $(DIR)
	
done:
	@echo [ COPY JQUERY UI - OK ]