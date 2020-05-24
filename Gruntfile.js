
module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        pkg: grunt.file.readJSON('package.json'),

        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify:     {
            //Загальні налаштування (grunt-browserify)
            options:      {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform:  [ require('brfs') ],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "Frontend/js/"
                }
            },

            //Збірка
            joke: {
                src:        'Frontend/js/main.js',
                dest:       'Frontend/src/final.js'
            }
        }
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['Frontend/**/*.js', 'Frontend/**/*.ejs'],
            //завдання виконувати під час зміни в файлах
            tasks: ['browserify:joke']
        }
    };

    //Ініціалізувати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Модулі, які необхідно виокристовувати
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Список завданнь за замовчуванням
    grunt.registerTask('default',
        [
            'browserify:joke'
        ]
    );

};