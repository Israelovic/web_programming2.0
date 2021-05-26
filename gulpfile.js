// ...............................................................................................
// Створення необхідних змінних ..................................................................

// Відображати допоміжну інформацію
const log = true;

// Вибір препроцесора для css - sass, less або scss
const use_preprocessor = "scss";

// Залежно від вибраного препроцесора css використовуємо відповідний модуль
// gulp-sass - для sass та scss
// gulp-less - для less
const css_preprocessor = (use_preprocessor === "less" ? "less" : "sass");

// ...............................................................................................
// Підключення модулів ...........................................................................

// Підключаємо gulp
const { src, dest, watch, parallel, series } = require("gulp");

// Підключаємо gulpif - перевірка умов у .pipe()
const gulp_if = require("gulp-if");

// Підключаємо browser-sync - локальний сервер для тестування
const browser_sync = require("browser-sync").create();

// Підключаємо gh-pages - публікація сайту на github
const gh_pages = require("gh-pages");

// Підключаємо gulp-htmlmin - модуль стисненя html
const html_min = require("gulp-htmlmin");

// Підключаємо gulp-clean-css - модуль стисненя css
const clean_css = require("gulp-clean-css");

// Підключаємо css препроцесори
const sass = require("gulp-sass");
const less = require("gulp-less");

// Підключаємо gulp-terser - модуль стисненя js
const terser = require("gulp-terser");

// Підключаємо gulp-imagemin - модуль стиснення зображень
const image_min = require("gulp-imagemin");

// Підключаємо gulp-newer - модуль для фільтрування змінених файлів
const newer = require("gulp-newer");

// Підключаємо gulp-debug - виведення допоміжної інформації
const debug = require("gulp-debug");

// Підключаємо del - модуль видалення файлів
const del = require("del");

// ...............................................................................................
// Налаштування модулів ..........................................................................

// Налаштування для модуля gulp-debug
const opt = { title: "log", showCount: false };

// Налаштування для модуля gulp-clean-css
const css_opt = { level: { 1: { specialComments: 0 } } };

// Функція обробки результату публікації сайту на GitHub
const deploy_result = function (err) {
                          if (err) { console.log(`Deploy Error: ${err}`); }
                      };

// ...............................................................................................

// Запускаємо локальний сервер 
function browserSync() {
    browser_sync.init({                // Ініціалізація browser_sync
        server: { baseDir: "build/" }, // Встановлюємо базову директорію
        notify: false,                 // Вимикаємо інформаційні сповіщення
        online: true                   /* Дозволяємо підключення пристроїв через 
                                          локальну мережу (напр. смартфонів, планшетів і т.д.) */
    })
}

// Обробляємо html файли
function html() {
    return src("app/**/*.html")            // Беремо файли з розширенням html із папки app/ та усіх підпапок
          .pipe(newer("build/"))           // Відфільтровуємо лише змінені файли
          .pipe(html_min                   // Стискаємо готові html файли
              ({ collapseWhitespace: true,
                 removeComments: true }))
          .pipe(gulp_if(log, debug(opt)))  // Відображаємо список оброблюваних файлів
          .pipe(dest("build/"));           // Переміщуємо у папку build/ 
}

// Обробляємо css файли
function css() {
    return src("app/css/*.css",           // Беремо файли з розширенням css із папки app/css/
               { base: "app" })           // Задаємо параметр base, щоб зберегти вложеність файлів
          .pipe(newer("build/"))          // Відфільтровуємо лише змінені файли
          .pipe(gulp_if(log, debug(opt))) // Відображаємо список оброблюваних файлів
          .pipe(clean_css(css_opt))       // Стискаємо готові css файли
          .pipe(dest("build/"))           // Переміщуємо у папку build/
          .pipe(browser_sync.stream());   // Оновлюємо стилі без перезавантаження сторінки
}

// Обробляємо sass, less або scss файли
function preprocessCss() {
    return src(`app/${use_preprocessor}` + // Беремо файли заданого препроцесора css із відповідної папки
               `/*.${use_preprocessor}`)  
          .pipe(gulp_if(log, debug(opt)))  // Відображаємо список оброблюваних файлів
          .pipe(eval(css_preprocessor)())  // Компілюємо формат препросесора у css
          .pipe(clean_css(css_opt))        // Стискаємо готові css файли
          .pipe(dest("build/css/"))        // Переміщуємо у папку build/css/
          .pipe(browser_sync.stream());    // Оновлюємо стилі без перезавантаження сторінки
}

// Обробляємо js файли
function js() {
    return src("app/js/*.js",             // Беремо файли з розширенням js із папки app/js/
               { base: "app" })           // Задаємо параметр base, щоб зберегти вложеність файлів
          .pipe(newer("build/"))          // Відфільтровуємо лише змінені файли
          .pipe(terser())                 // Стискаємо готові js файли
          .pipe(gulp_if(log, debug(opt))) // Відображаємо список оброблюваних файлів
          .pipe(dest("build/"));          // Переміщуємо у папку build/
}

// Обробляємо txt файли
function txt() {
    return src("app/data/**/*.txt",       // Беремо файли з розширенням txt із папки app/data/
               { base: "app" })           // Задаємо параметр base, щоб зберегти вложеність файлів
          .pipe(newer("build/"))          // Відфільтровуємо лише змінені файли
          .pipe(gulp_if(log, debug(opt))) // Відображаємо список оброблюваних файлів
          .pipe(dest("build/"));          // Переміщуємо у папку build/
}

// Обробляємо файли зображень
function img() {
    return src(["app/img/**/*.{png,jpg,jpeg,gif}",
                "app/data/**/*.{png,jpg,jpeg,gif}"], // Беремо файли з розширеннями png, jpg, jpeg, gif
               { base: "app" })                      // Задаємо параметр base, щоб зберегти вложеність файлів
          .pipe(newer("build/"))                     // Відфільтровуємо лише змінені файли
          .pipe(image_min({ verbose: log,
                            silent: !log }))         // Стискаємо зображення
          .pipe(dest("build/"));                     // Переміщуємо у папку build/
}

function fonts() {
    return src("app/fonts/**/*.{otf,eot,ttf}",
        { base: "app" })
        .pipe(newer("build/"))
        .pipe(dest("build/"));
}
function sound() {
    return src("app/sound/**/*.{mp3,wav}",
        { base: "app" })
        .pipe(newer("build/"))
        .pipe(dest("build/"));
}
// Очищуємо папку зібраного проекту
function cleanBuild() {
    return del("build/**/*", { force: true });    // Очищуємо папку перед збиранням проекту
}

// Обробляємо зміни файлів
function watchForFiles() {

    // Слідкуємо за змінами html файлів
    watch("app/**/*.html")
   .on("all", series(html, browser_sync.reload));

    // Слідкуємо за змінами css файлів
    watch("app/css/*.css")
   .on("all", series(css));

    // Слідкуємо за змінами файлів препроцесора css - sass, less або scss
    watch(`app/${use_preprocessor}/*.${use_preprocessor}`)
   .on("all", series(preprocessCss));

    // Слідкуємо за змінами js файлів
    watch("app/js/*.js")
   .on("all", series(js, browser_sync.reload));

    // Слідкуємо за змінами txt файлів
    watch("app/data/**/*.txt")
   .on("all", series(txt, browser_sync.reload));

    // Слідкуємо за змінами файлів зображень
    watch("app/img/**/*")
   .on("all", series(img, browser_sync.reload));

}

// Публікуємо зібраний сайт на github
function deployOnGitHub() {
    return gh_pages
          .publish("build",                              // Папка, вміст якої заливається на github
                   { message: "Auto-generated commit" }, // Текст коміту
                   deploy_result);                       // Обробка можливих помилок
}

// ...............................................................................................

// Збирання проекту
exports.build = series(cleanBuild, html, css, preprocessCss, js, txt, img, fonts, sound);

// Завдання за замовчуванням
exports.default = parallel(series(exports.build, browserSync), watchForFiles);

// Збирання проекту та публікація його на github
exports.deploy = series(exports.build, deployOnGitHub);
