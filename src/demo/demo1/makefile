# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

WKR_DIR=../..
BIN=$(WKR_DIR)/_bin_$(PLAT)
TRG_CLI=$(BIN)/jrclnt
TRG_JRAF=$(BIN)/jraf
SRC_JQ=$(WKR_DIR)/ext/jq
SRC_JS=$(WKR_DIR)/js
SRC_SH=../shared
SRC_CONF=$(WKR_DIR)/conf
SRC_PHP=$(WKR_DIR)/php
DEMO_SYS=sys
DEMO_JRD=jrd

# all: jr_mkdir jr_cp conf.jrd php_cp cli_cp done
all: jr_mkdir jr_cp conf.jrd php_cp cli_cp jq_cp done

jr_mkdir:
	@mkdir -p $(TRG_CLI)/jraf
	@mkdir -p $(TRG_JRAF)/sys
	@echo [ Create folders tree - OK ]

jr_cp: $(SRC_JS)/jraf.js $(SRC_JS)/write.js $(SRC_JS)/sys.js
	@cp -puv $(SRC_JS)/jraf.js $(TRG_JRAF)/sys/
	@cp -puv $(SRC_JS)/write.js $(TRG_JRAF)/sys/
	@cp -puv $(SRC_JS)/sys.js $(TRG_CLI)/jraf/
	@cp -pruv $(SRC_SH)/. $(TRG_JRAF)/
	@echo [ Copy JRAF files - OK ]

conf.jrd: $(SRC_CONF)/conf.jrd
	@cp $< $(BIN)/

php_cp: $(SRC_PHP)
	@$(MAKE) -sC $(SRC_PHP)
	
cli_cp: $(DEMO_SYS)/*.js
	@cp -puv $(DEMO_SYS)/*.js $(TRG_JRAF)/sys/
	@cp -puv $(DEMO_JRD)/jraf.jrd $(BIN)/
	@echo [ Copy client files - OK ]

jq_cp: $(SRC_JQ)
	@$(MAKE) -sC $(SRC_JQ)
	
done:
	@echo Done.

clean:
	rm -rf $(TRG_JRAF)/sys/*.js
	rm -rf $(TRG_CLI)/jraf/*.js
	@echo Done.
