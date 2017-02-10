# Hasq Technology Pty Ltd (C) 2013-2016

MYLIB=jrlib
#SQ3=sqlite
#SQPATH=../../ext/sqlite/

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

MADIR=../ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$O/htmalib$(LEXT)

OSDIR=../os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)

SGDIR=../sg
INC := $(INC) -I$(SGDIR)
SGLIB=$(SGDIR)/$O/htsglib$(LEXT)

DBDIR=../db
INC := $(INC) -I$(DBDIR)
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)

src = jraf.cpp jr_conf.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

#srctrg = sqlcl.cpp
#trg := $(srctrg:%.cpp=$O/%$(EEXT))

#csrc = sqlite3.c
#cobj := $(csrc:%.c=$O/%$(OEXT))

all: $O $(trg) $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/$(MYLIB)$(LEXT) $(DBLIB) $(SGLIB) $(OSLIB) $(GLLIB)
	$(COMPILER) $(OPT) $(INC) $< $O/$(MYLIB)$(LEXT) \
	$(DBLIB) $(OSLIB) $(SGLIB) $(GLLIB) $(LDF) $(EOUT)$@

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

$O/$(MYLIB)$(LEXT): $(obj)
	$(ARCR)$O/$(MYLIB)$(LEXT) $(obj)

#	$(RANLIB) $O/$(MYLIB)$(LEXT) 


