# (C) 2016-2017

ifeq ($(OS),Windows_NT)
	PLAT=msc
else
	PLAT=unx
endif

BIN=../_bin_$(PLAT)/phclnt

all: $(BIN) $(BIN)/jraf.php

$(BIN):
	@mkdir -p $(BIN)

$(BIN)/jraf.php: jraf.php
	cp jraf.php $(BIN)
	cp index.php $(BIN)

checkin:
	cp -fpuv $(BIN)/jraf.php ./

