
	@echo " linting..."
	@jshint ${SCRIPT_DEV} --show-non-errors

	@echo " minifying..."
	@uglifyjs ${SCRIPT_DEV} > ${SCRIPT_MIN}

	@gzip --best --stdout ${SCRIPT_MIN} > ${SCRIPT_MIN}.gz
	@$(FILESIZE_CHECK)
	@rm ${SCRIPT_MIN}.gz


