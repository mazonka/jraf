# Hasq Technology Pty Ltd (C) 2013-2016

# PLAT: w u

include mk_all.mak

DB=db
GL=gl
MA=ma
OS=os
PU=pu
SG=sg
VI=vi

all: ../$(TRG) ../$(TRG)/jrafd$(EEXT) ../$(TRG)/jrmail$(EEXT) 

../$(TRG):
	@echo "Usage: make PLAT={w,u} [MEMORY=1] [GCOV=1]"
	@echo "removing ../$(TRG)/jrafd$(EEXT)"
	rm -f ../$(TRG)/jrafd$(EEXT)
	@mkdir -p ../$(TRG)

../$(TRG)/jrafd$(EEXT): $(PU)/$(TRG)/jrafd$(EEXT)
	@echo "updating ../$(TRG)/jrafd$(EEXT)"
	rm -f ../$(TRG)/jrafd$(EEXT)
	cp $< $@

../$(TRG)/jrmail$(EEXT): $(PU)/$(TRG)/jrmail$(EEXT)
	@echo "updating ../$(TRG)/jrmail$(EEXT)"
	rm -f ../$(TRG)/jrmail$(EEXT)
	cp $< $@

$(PU)/$(TRG)/jrafd$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp $(OS)/*.h \
	$(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(PU) && make PLAT=$(PLAT)


$(TRG)/htview$(EEXT): $(VI)/$(TRG)/htview$(EEXT)
	cp $< $@

$(VI)/$(TRG)/htview$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp \
	$(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp $(VI)/*.cpp $(VI)/*.h
	cd $(VI) && make PLAT=$(PLAT)


$(TRG)/zdb$(EEXT): db/$(TRG)/zdb$(EEXT)
	cp $< $@
	chmod 0777 $@

$(DB)/$(TRG)/zdb$(EEXT): $(DB)/*.cpp $(DB)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(DB) && make PLAT=$(PLAT)


$(TRG)/tcpclient$(EEXT): $(SG)/$(TRG)/tcpclient$(EEXT)
	cp $< $@

$(SG)/$(TRG)/tcpclient$(EEXT): $(SG)/*.cpp $(SG)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(SG) && make PLAT=$(PLAT)



clean:
	rm -rf _bin* */_bin* */*.obj
	rm -rf */*/_bin* */*/*.obj
	rm -rf os/_*.*.cpp
	rm -rf _exported
	cd $(DB) && make clean
	cd $(GL) && make clean
	cd $(SG) && make clean
	cd $(OS) && make PLAT=$(PLAT) clean
	cd $(PU) && make clean
	cd $(MA) && make clean

install:
	mkdir -p ~/bin
	cp _bin$(PLAT)/* ~/bin/
