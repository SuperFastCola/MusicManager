module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'www/js/MusicManager.min.js': ["www/js/MusicManager.js"]
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    "www/css/styles.css":["www/css/styles.less"],
                    "www/css/musicplayer.css":["www/css/musicplayer.less"]
                }
            }
        },
        watch: {
            css: {
                files: ['www/css/styles.less','www/css/responsive.less','www/css/style_import.css','www/css/style_import.less','www/css/fonts.css','www/css/style_main.less','www/css/musicplayer.less'],
                tasks: ['less']
            },
            scripts: {
                files: 'www/js/MusicManager.js',
                tasks: ['uglify']
            }
        }

    });

    // Load required modules
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // Default task(s).
    grunt.registerTask('default', ['uglify','less','watch']);
};