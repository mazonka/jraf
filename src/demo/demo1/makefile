# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=../../_bin_$(PLAT)
BIN_CLI=$(BIN)/cli
BIN_JRAF=$(BIN)/jraf
SRC_JS=../../js
SRC_CONF=../../conf
SRC_PHP=../../php
DEMO_CLI=cli
DEMO_JRAF=jraf

all: jr_mkdir jr_cp conf.jrd php_cp cli_cp done

jr_mkdir:
	@echo [ Create folders tree ]
	@mkdir -p $(BIN_CLI)/jraf
	@mkdir -p $(BIN_JRAF)/sys
	@echo [ OK ]

jr_cp:
	@echo [ Copy JRAF files ]
	@cp -puv $(SRC_JS)/*.js $(BIN_JRAF)/sys/
	@echo [ OK ]

conf.jrd: $(SRC_CONF)/conf.jrd
	cp $< $(BIN_CLI)/

php_cp: $(SRC_PHP)/jraf.php $(SRC_PHP)/index.php
	@echo [ Copy PHP files ]
	cp $(SRC_PHP)/jraf.php $(BIN_CLI)
	cp $(SRC_PHP)/index.php $(BIN_CLI)
	@echo [ OK ]
	
cli_cp: $(DEMO_JRAF)/sys/*.js $(DEMO_CLI)/jraf/*.js
	@echo [ Copy CLI files ]
	cp -puv $(DEMO_JRAF)/sys/*.js $(BIN_JRAF)/sys/
	cp -puv $(DEMO_CLI)/jraf/sys.js $(BIN_CLI)/jraf/
	@echo [ OK ]
    
done:
	@echo Done.

clean:
	rm -rf $(BIN_JRAF)/sys/*.js
	rm -rf $(BIN_CLI)/jraf/*.js
	@echo Done.
