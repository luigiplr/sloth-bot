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
                compact: true
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
                cwd: 'build'
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watchChokidar'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('default', ['newer:babel', 'newer:copy:dev', 'concurrent']);

    grunt.registerTask('run', ['concurrent']);


    process.on('SIGINT', function() {
        process.exit(1);
    });
};