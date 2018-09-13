# $^ = deps, $@ = current target, $< = first dep
babel := node_modules/.bin/babel

source_files := $(shell find . -name "*.jsx")
build_files  := $(source_files:./%.jsx=dist/%.js)
static_files  := $(wildcard vendor/*) $(wildcard styles/*.css) index.html
dist_files   := $(static_files:%=dist/%) $(build_files) 

.PHONY: build clean

build: $(dist_files)

clean:
	rm -rf dist

dist/src/%.js: src/%.jsx
	mkdir -p $(dir $@)
	$(babel) $< --out-file $@ --source-maps

dist/index.html: index.html
	mkdir -p $(dir $@)
	rm -f $@
	< $< sed 's#{MONZO_API_ROOT}#$(MONZO_API_ROOT)#' > $@

dist/%: ./%
	mkdir -p $(dir $@)
	cp -f $< $@