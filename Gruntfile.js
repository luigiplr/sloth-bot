module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['package.json'],
                    dest: 'build/'
                }, {
                    cwd: 'node_modules/',
                    src: Object.keys(require('./package.json').dependencies).map(function(dep) {
                        return dep + '/**/*';
                    }),
                    dest: 'build/node_modules/',
                    expand: true
                }]
            },

        },
        // javascript
        babel: {
            options: {
                plugins: ['transform-minify-booleans'],
                presets: ['es2015', ],
                compact: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'build/js'
                }]
            }
        },
        clean: {
            release: ['build/'],
        },
        // livereload
        watchChokidar: {
            options: {
                spawn: true
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['build/**/*', '!build/resources/bin/plugins/**/*']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:babel']
            }
        }
    });

    grunt.registerTask('default', ['newer:babel', 'newer:copy:dev', 'watchChokidar']);

    grunt.registerTask('run', ['watchChokidar']);


    process.on('SIGINT', function() {
        process.exit(1);
    });
};