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