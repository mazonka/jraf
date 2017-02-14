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
all: start jr_mkdir jr_cp conf.jrd php_cp cli_cp jq_cp done

start:
	@echo [ MAKE DEMO ]
	
jr_mkdir:
	@mkdir -p $(TRG_CLI)/jraf
	@mkdir -p $(TRG_JRAF)/sys

jr_cp: $(SRC_JS)/*.js
	@$(MAKE) -sC $(SRC_JS)
	@cp -pruv $(SRC_SH)/. $(TRG_JRAF)/

conf.jrd: $(SRC_CONF)/conf.jrd
	@cp $< $(BIN)/

php_cp: $(SRC_PHP)
	@$(MAKE) -sC $(SRC_PHP)
	
cli_cp: $(DEMO_SYS)/*.js
	@cp -puv $(DEMO_SYS)/*.js $(TRG_JRAF)/sys/
	@cp -puv $(DEMO_JRD)/jraf.jrd $(BIN)/

jq_cp: $(SRC_JQ)
	@$(MAKE) -sC $(SRC_JQ)
	
done:
	@echo [ MAKE DEMO - OK ]

clean:
	rm -rf $(TRG_JRAF)
	rm -rf $(TRG_CLI)
	rm -rf $(BIN)/jraf.jrd
	rm -rf $(BIN)/conf.jrd
	@echo Done.
