cmake_minimum_required(VERSION 2.8.9)
set(CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")


# Standard install paths
include(GNUInstallDirs)

string(TOLOWER "${CMAKE_BUILD_TYPE}" cmake_build_type_lower)

# enable QML debugging
if(CMAKE_BUILD_TYPE MATCHES DEBUG OR CMAKE_BUILD_TYPE MATCHES "Debug")
    add_definitions(-DQT_QML_DEBUG)
endif()

find_package(Qt5Core REQUIRED)
find_package(Qt5Gui REQUIRED)
find_package(Qt5Widgets REQUIRED)
find_package(Qt5Quick REQUIRED)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

# uninstall target
configure_file(
    "${CMAKE_CURRENT_SOURCE_DIR}/cmake_uninstall.cmake.in"
    "${CMAKE_CURRENT_BINARY_DIR}/cmake_uninstall.cmake"
    IMMEDIATE @ONLY)
add_custom_target(uninstall
    COMMAND ${CMAKE_COMMAND} -P ${CMAKE_CURRENT_BINARY_DIR}/cmake_uninstall.cmake)

# make non compiled files (QML, JS, images, etc.) visible in QtCreator
file(GLOB_RECURSE NON_COMPILED_FILES *.qml *.js *.png *.py *.pot *.po *.qdoc *.qdocconf *.css *.html)
add_custom_target(NON_COMPILED_TARGET ALL SOURCES ${NON_COMPILED_FILES})

add_subdirectory(src)
add_subdirectory(tests)
