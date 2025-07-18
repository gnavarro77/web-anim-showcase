module.exports = function(grunt) {
    grunt.initConfig({
        wiredep: {
            target: {
                src: 'index.html'
            }
        }
    });

    //require("load-grunt-tasks")(grunt);
    grunt.loadNpmTasks('grunt-wiredep');

    //grunt.registerTask("build", ["copy", "sass", "postcss", "uglify"]);
    //grunt.registerTask("default", ["browserSync", "watch"]);

    grunt.registerTask("wire", ["wiredep"]);

};
