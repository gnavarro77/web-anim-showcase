module.exports = function(grunt) {



    grunt.initConfig({
        connect: {
            uses_defaults: {}
        },
        wiredep: {
            target: {
                src: 'index.html'
            }
        }
    });

    require("load-grunt-tasks")(grunt);
    //grunt.loadNpmTasks('grunt-wiredep');

    //grunt.registerTask("build", ["copy", "sass", "postcss", "uglify"]);
    //grunt.registerTask("default", ["browserSync", "watch"]);

    grunt.registerTask("wire", ["wiredep"]);

};
