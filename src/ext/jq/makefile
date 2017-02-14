# JRAF Team (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=_bin_$(PLAT)
TRG_CLI=../../$(BIN)/jrclnt
JQ_BZ2=$(shell ls *.bz2)

all: title bin_mkdir jq_untar jq_cp jq_rm done

title:
	@echo Copy JQueryUI to client dir...

bin_mkdir:
	@mkdir -p $(TRG_CLI)
	@mkdir -p $(TRG_CLI)/lib/images

jq_untar: $(JQ_BZ2)
	@tar xjvf $(JQ_BZ2) >/dev/null
	@ echo [ tar - OK ]	

jq_cp:
	$(eval DIR := $(shell ls -d */))
	@cp $(DIR)/jquery-ui.min.js $(TRG_CLI)/lib/
	@cp $(DIR)/jquery-ui.min.css $(TRG_CLI)/lib/
	@cp $(DIR)/external/jquery/jquery.js $(TRG_CLI)/lib/
	@cp $(DIR)/images/*.png $(TRG_CLI)/lib/images
	@cp $(DIR)/external/jquery/jquery.js $(TRG_CLI)/lib/
	@ echo [ cp - OK ]
	
jq_rm:
	$(eval DIR := $(shell ls -d */))
	@rm -rf $(DIR)
	@ echo [ rm - OK ]
	
done:
	@echo Done.