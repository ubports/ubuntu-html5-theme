project(ubuntu-html5-app-launcher)

configure_file(
    config.h.in
    ${CMAKE_CURRENT_BINARY_DIR}/config.h
    @ONLY)

include_directories(
    ${CMAKE_BINARY_DIR}
)


# ubuntu-html5-app binary
set(HTML5_LAUNCHER ubuntu-html5-app-launcher)

set(HTML5_LAUNCHER_SRC
    main.cpp
)

add_executable(${HTML5_LAUNCHER}
    ${HTML5_LAUNCHER_SRC}
)
qt5_use_modules(${HTML5_LAUNCHER} Core Widgets Quick)


# install qml files
file(GLOB QML_FILES *.qml)
install(FILES ${QML_FILES} DESTINATION ${CMAKE_INSTALL_DATADIR}/ubuntu-html5-app-launcher)
install(DIRECTORY actions DESTINATION ${CMAKE_INSTALL_DATADIR}/ubuntu-html5-app-launcher
        FILES_MATCHING PATTERN *.qml)


# install bin files
install(TARGETS ${HTML5_LAUNCHER}
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
