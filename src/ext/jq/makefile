# JRAF Team (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=_bin_$(PLAT)
TRG_CLI=../../$(BIN)/jrclnt
JQ_BZ2=$(shell ls *.bz2)

all: bin_mkdir jq_untar jq_cp jq_rm done

bin_mkdir:
	@mkdir -p $(TRG_CLI)
	@mkdir -p $(TRG_CLI)/lib/images

jq_untar: $(JQ_BZ2)
	@tar xjvf $(JQ_BZ2) >/dev/null

jq_cp:
	$(eval DIR := $(shell ls -d */))
	@cp -puv $(DIR)/jquery-ui.min.js $(TRG_CLI)/lib/
	@cp -puv $(DIR)/jquery-ui.min.css $(TRG_CLI)/lib/
	@cp -puv $(DIR)/external/jquery/jquery.js $(TRG_CLI)/lib/
	@cp -puv $(DIR)/images/*.png $(TRG_CLI)/lib/images
	@cp -puv $(DIR)/external/jquery/jquery.js $(TRG_CLI)/lib/
	
jq_rm:
	$(eval DIR := $(shell ls -d */))
	@rm -rf $(DIR)
	
done:
	@echo [ COPY JQUERY UI - OK ]