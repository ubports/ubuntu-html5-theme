/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 *
 * This file is part of ubuntu-html5-theme.
 *
 * This package is free software; you can redistribute it and/or modify
 * it under the terms of the Lesser GNU General Public License as 
 * published by the Free Software Foundation; either version 3 of the 
 * License, or
 * (at your option) any later version.
 
 * This package is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 
 * You should have received a copy of the GNU Lesser General Public 
 * License along with this program. If not, see 
 * <http://www.gnu.org/licenses/>.
 */

/*global module:false*/

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * app.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * https://launchpad.net/ubuntu-html5-theme\n' +
        ' * GNU LGPL v3\n' +
        ' */'
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        expr: true,
        globals: {
          head: false,
          module: false,
          console: false
        }
      },
      files: [ 'Gruntfile.js', 'js/app.js' ]
    },
    concat: {
      options:{
        separator: ';'
      },
      js: {
        src: ['ambiance/js/*.js'],
        dest: 'build/app.js'
      },
      css:{
        src: ['ambiance/css/*.css'],
        dest: 'build/app.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: '<%= concat.js.dest %>',
        dest: 'build/app.min.js'
      }
    },

    cssmin: {
      options: {
            banner: '/*!\n' +
        ' * app.min.css <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * https://launchpad.net/ubuntu-html5-theme\n' +
        ' * GNU LGPL v3\n' +
        ' */'
      },
      compress: {
        files: {
          'build/app.min.css': [ '<%= concat.css.dest %>' ]
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );

  // Default task.
  grunt.registerTask( 'default', [ 'jshint', 'concat', 'cssmin', 'uglify' ] );
};
