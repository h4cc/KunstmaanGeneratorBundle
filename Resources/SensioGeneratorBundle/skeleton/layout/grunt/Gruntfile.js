var _ = require('underscore');

module.exports = function (grunt) {
    "use strict";

    var {{ bundle.getName() }};

    {{ bundle.getName() }} = {
        'js':   ['src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/**/*.js', '!src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/vendor/**/*.js', 'Gruntfile.js'],
        'scss': ['src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/scss/**/*.scss'],
        'twig': ['src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/views/**/*.html.twig'],
        'img':  ['src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/img/**/*.{png,jpg,jpeg,gif,webp}'],
        'svg':  ['src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/img/**/*.svg']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            {{ bundle.getName() }}Js: {
                files: {{ bundle.getName() }}.js,
                tasks: 'jshint:{{ bundle.getName() }}',
                options: {
                    nospawn: true
                }
            },
            {{ bundle.getName() }}Scss: {
                files: {{ bundle.getName() }}.scss,
                tasks: 'sass'
            },
            {{ bundle.getName() }}Images: {
                files: {{ bundle.getName() }}.img,
                tasks: ['imagemin:{{ bundle.getName() }}'],
                options: {
                    event: ['added', 'changed']
                }
            },
            {{ bundle.getName() }}Svg: {
                files: {{ bundle.getName() }}.svg,
                tasks: ['svg2png:{{ bundle.getName() }}'],
                options: {
                    event: ['added', 'changed']
                }
            },
            livereload: {
                files: [{{ bundle.getName() }}.js, {{ bundle.getName() }}.twig, {{ bundle.getName() }}.img, {{ bundle.getName() }}.svg, 'web/frontend/style.css'],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            dist: {
                files: {
                    'web/frontend/style.css': 'src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/scss/style.scss',
                    'web/frontend/ie8.css': 'src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/scss/legacy/ie/ie8.scss',
                    'web/frontend/ie7.css': 'src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/scss/legacy/ie/ie7.scss'
                }
            }
        },

        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                forin: true,
                indent: 4,
                trailing: true,
                undef: true,
                browser: true,
                devel: true,
                node: true,
                globals: {
                    jQuery: true,
                    $: true
                }
            },
            {{ bundle.getName() }}: {
                files: {
                    src: {{ bundle.getName() }}.js
                }
            }
        },

        imagemin: {
            {{ bundle.getName() }}: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/img',
                    src: '**/*.{png,jpg,jpeg,gif,webp}',
                    dest: 'src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/img'
                }]
            }
        },

        svg2png: {
            {{ bundle.getName() }}: {
                files: [{
                    src: {{ bundle.getName() }}.svg
                }]
            }
        },

        modernizr: {
            {{ bundle.getName() }}: {
                files: {
                    dev: "remote",
                    src: _.union({{ bundle.getName() }}.js, {{ bundle.getName() }}.scss, {{ bundle.getName() }}.twig),
                    dest: "src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources/public/vendor/modernizr/modernizr-custom.js"
                },
                parseFiles: true,
                extra: {
                    "shiv" : true,
                    "printshiv" : false,
                    "load" : true,
                    "mq" : false,
                    "cssclasses" : true
                },
                extensibility: {
                    "addtest" : false,
                    "prefixed" : false,
                    "teststyles" : false,
                    "testprops" : false,
                    "testallprops" : false,
                    "hasevents" : false,
                    "prefixes" : false,
                    "domprefixes" : false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['modernizr', 'sass']);
};
