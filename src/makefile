# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=w
else
	PLAT=u
endif

BIN=_bin$(PLAT)
TRG_JRAFCL=$(BIN)/jrafcl
TRG_JRAFFS=$(BIN)/jraffs
SRC_JQ=ext/jq
SRC_JS=core
SRC_SH=../shared
# SRC_CONF=conf
# SRC_HTML=html
SRC_PHP=php
SRC_CPP=cpp

# all: jr_mkdir jr_cp conf.jrd php_cp cli_cp done
all: jr_mkdir jr_cp php_cp jq_cp b64 done
cpp: jr_mkdir jr_cp cpp_cp jq_cp b64 done
php: jr_mkdir jr_cp php_cp jq_cp b64 done

jr_mkdir:
	@mkdir -p $(TRG_JRAFFS)/sys
	@mkdir -p $(TRG_JRAFFS)/.jraf.sys
	@printf 10420 > $(TRG_JRAFFS)/.jraf.sys/version
	@mkdir -p $(TRG_JRAFFS)/.jraf.ver
	@mkdir -p $(TRG_JRAFCL)
	
jr_cp: $(SRC_JS)/*.js
	@$(MAKE) -sC $(SRC_JS)

#conf_cp: $(SRC_CONF)/conf.jrd
#	@cp -puv $(SRC_CONF)/conf.jrd $(BIN)/
#	@echo [ COPY CONF - OK ]
	
php_cp: $(SRC_PHP)/makefile
	@$(MAKE) -sC $(SRC_PHP)

cpp_cp: $(SRC_CPP)/makefile
	@$(MAKE) -sC $(SRC_CPP)	

jq_cp: $(SRC_JQ)
	@$(MAKE) -sC $(SRC_JQ)

b64: ext/base64.js
	@cp $< $(TRG_JRAFCL)/lib/

done:
	@echo [ MAKE DEMO - OK ]

clean:
	rm -rf $(BIN)
	@echo [ CLEANED ]