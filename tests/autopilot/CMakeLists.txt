execute_process(COMMAND python -c "from distutils.sysconfig import get_python_lib; print get_python_lib()"
    OUTPUT_VARIABLE PYTHON_PACKAGE_DIR OUTPUT_STRIP_TRAILING_WHITESPACE)

install(DIRECTORY ubuntu_html5_container ubuntu_html5_ui_toolkit
    DESTINATION ${PYTHON_PACKAGE_DIR}
    )

