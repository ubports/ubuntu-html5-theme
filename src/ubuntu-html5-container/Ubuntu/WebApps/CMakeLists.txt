project(ubuntu-html5-container)

# setup install location
execute_process(
    COMMAND qmake -query QT_INSTALL_QML
    OUTPUT_VARIABLE QT_INSTALL_QML
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
set(HTML5_CONTAINER_IMPORTS_DIR "${QT_INSTALL_QML}/Ubuntu/WebApps")

# setup install for local component files
file(GLOB QML_FILES RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} *.qml qmldir)
install(FILES ${QML_FILES} DESTINATION ${HTML5_CONTAINER_IMPORTS_DIR})

# make sure that we have all the files in the right place if we test locally
# & have a specific build dir
if(NOT ${CMAKE_CURRENT_BINARY_DIR} STREQUAL ${CMAKE_CURRENT_SOURCE_DIR})
  foreach(_qmlfile ${QML_FILES})
    add_custom_command(OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/${_qmlfile}
                       DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/${_qmlfile}
                       COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/${_qmlfile} ${CMAKE_CURRENT_BINARY_DIR}/${_qmlfile})
  endforeach(_qmlfile)
  add_custom_target(copy_to_build_dir DEPENDS ${QML_FILES})
  add_dependencies(${PLUGIN} copy_files_to_build_dir)
endif()

