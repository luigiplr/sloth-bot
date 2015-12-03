module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['*.json', 'index.js'],
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
                presets: ['es2015'],
                compact: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'build/src'
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
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:babel']
            }
        },
        nodemon: {
            script: 'index.js',
            options: {
                cwd: 'build',
                delay: 500
            }
        },
        concurrent: {
            run: {
                tasks: ['nodemon', 'watchChokidar'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('default', ['newer:babel', 'concurrent:run']);

    grunt.registerTask('deps', ['newer:copy:dev']);

    grunt.registerTask('run', ['concurrent:run']);


    process.on('SIGINT', function() {
        process.exit(1);
    });
};