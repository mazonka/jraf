all: conf.phd

#	@echo "Usage: clean"

clean:
	rm -f db.sec input.sec output.sec output.opn pqkru db.opn input.opn
	rm -rf        ipch
	rm -rf        vc.sdf
	rm -rf        Debug
	rm -rf        Release
	rm -rf        DebugStatic
	rm -rf        vc.suo vc.*.suo
	rm -f conf.phd phenod.db hq.16000.lock


conf.phd: ../../_bin_msc/conf.phd
	cp $< $@
