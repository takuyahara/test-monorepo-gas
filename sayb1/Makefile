.SILENT:
.PHONY: build
build:
	rm -rf dist
	mkdir dist
	npx uglifyjs Code.js -o dist/Code.js
	cp appsscript.json dist/appsscript.json
