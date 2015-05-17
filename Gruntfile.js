module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var shims = require("./shims"),
        sharedModules = Object.keys(shims).concat([
            // place all modules you want in the lib build here
            "nvd3"
        ]);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build', 'doc'],
            dev: {
                src: ['build/app.js', 'build/vendor.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
            },
            prod: ['dist']
        },

        mkdir: {
            all: {
                options: {
                    mode: 0777,
                    create: ['doc', 'public', 'public/js', 'public/css']
                }
            }
        },

        browserify: {
            vendor: {
                files: {
                    'build/vendor.js': ["app/vendor/lib.js"]
                },
                options: {
                    transform: ["browserify-shim"],
                    require: sharedModules
                }
            },
            app: {
                files: {
                    'build/app.js': ['src/main.js']
                },
                options: {
                    external: sharedModules
                }
            },
            test: {
                files: {
                    'build/tests.js': [
                        'spec/**/*.test.js'
                    ]
                }
            }
        },

        less: {
            transpile: {
                files: {
                    'build/<%= pkg.name %>.css': [
                        'styles/**/*.less'
                    ]
                }
            }
        },

        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        copy: {
            dev: {
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    src: 'build/<%= pkg.name %>.css',
                    dest: 'public/css/<%= pkg.name %>.css'
                }]
            }
        },

        cssmin: {
            minify: {
                src: ['build/<%= pkg.name %>.css'],
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },

        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js'
                }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/**/*.js', 'index.html'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
            },
            less: {
                files: ['styles/**/*.less'],
                tasks: ['less:transpile', 'copy:dev']
            },
            test: {
                files: ['build/app.js', 'spec/**/*.test.js'],
                tasks: ['browserify:test']
            },
            karma: {
                files: ['build/tests.js'],
                tasks: ['jshint:test', 'karma:watcher:run']
            }
        },

        concurrent: {
            dev: {
                tasks: ['watch:scripts', 'watch:less', 'watch:html', 'watch:test'],
                options: {
                    logConcurrentOutput: true
                }
            },
            test: {
                tasks: ['watch:karma'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            watcher: {
                background: true,
                singleRun: false
            },
            test: {
                singleRun: true
            }
        },

        jsdoc : {
            dist : {
                src: ['src/**/*.js', 'README.md'],
                options: {
                    destination: 'doc',
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },

        'gh-pages': {
            options: {
                base: 'doc'
            },
            src: ['**']
        },

        jshint: {
            options: {
                ignores: ['src/requires/**/*.js']
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js'],
            dev: ['src/**/*.js'],
            test: ['spec/**/*.js']
        }
    });

    grunt.registerTask('build:dev', ['clean', 'mkdir:all', 'browserify:app', 'browserify:vendor', 'jshint:dev', 'less:transpile', 'concat', 'copy:dev', 'jsdoc', 'gh-pages']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:app', 'jshint:all', 'less:transpile', 'concat', 'cssmin', 'uglify', 'copy:prod']);

    grunt.registerTask('test:src', ['karma:test']);
    grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);

    grunt.registerTask('test', ['test:src']);

    grunt.task.registerTask('watch', 'A sample task that logs stuff.', function(arg1, arg2) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
        } else {
            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
        }
    });

    grunt.registerTask('watch', ['watch:scripts', 'watch:less']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};
