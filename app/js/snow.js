// Символ сніжинки
let snow_letter = "*";
// Манімальний розмір сніжинки
let snow_min_size = 8;
// Максимальний розмір сніжинки
let snow_max_size = 50;
// Максимальна кількість сніжинок
let snow_max_count = 35;
// Швидкість падіння сніжинок
let snow_speed = 0.5;
// Кольори сніжинок
let snow_color = [ "#33F", "#55F", "#77F", "#99F", "#BBF", "#DDF" ];
// Шрифти сніжинок
let snow_font = [ "Dela Gothic One", "Playfair Display", "Train One" ];

// Висота сторінки
let dH;
// Ширина сторінки
let dW;
// Кількість кадрів за секунду
let FPS = 60;
// Масив сніжинок
let snow = [];

// Допоміжні перемінні
let wiggle_speed = [];
let wiggle_value = [];
let wiggle = [];

// .......................................................................

// Отримуємо випадкове число
function random_value (range) {
    
return Math.floor(range * Math.random());

}

// .......................................................................

// Ініціалізуємо сніжинки
function init_snow() {

dW = document.body.clientWidth;
dH = document.body.clientHeight;

let snow_size_range = snow_max_size - snow_min_size;

for (i = 0; i < snow_max_count; i++) {

    // Задаємо "гойдання" сніжинок
    wiggle[i] = 15 + Math.random() * 15;
    // Задаємо швидкість "гойдання" сніжинок
    wiggle_speed[i] = 0.03 + Math.random() / 10;
    // Перемінна зберігає наростаюче "гойдання" сніжинок
    wiggle_value[i] = 0;

    // Отримуємо елемент
    snow[i] = document.getElementById("snowflake_" + i);
    // Задаємо шрифт
    snow[i].style.fontFamily = snow_font[random_value(snow_font.length)];
    // Задаємо розмір
    snow[i].size = random_value(snow_size_range) + snow_min_size;
    // Задаємо розмір у пікселях
    snow[i].style.fontSize = snow[i].size + "px";
    // Задаємо колір
    snow[i].style.color = snow_color[random_value(snow_color.length)];
    // Задаємо швидкість
    snow[i].speed = snow_speed * snow[i].size / 5;
    // Задаємо позицію по горизонталі
    snow[i].pos_x = random_value(dW - snow[i].size)
    // Задаємо позицію по вертикалі
    snow[i].pos_y = random_value(2 * dH - dH - 2 * snow[i].size);
    // Задаємо позицію по горизонталі в пікселях
    snow[i].style.left = snow[i].pos_x + "px";
    // Задаємо позицію по вертикалі в пікселях
    snow[i].style.top = snow[i].pos_y + "px";

}

move_snow();

}

// .......................................................................

// Рухаємо сніжинки
function move_snow() {

dW = document.body.clientWidth;
dH = document.body.clientHeight;

for (i = 0; i < snow_max_count; i++) {
    
    snow[i].pos_y += snow[i].speed;
    wiggle_value[i] += wiggle_speed[i];
    
    snow[i].style.top = snow[i].pos_y + "px";
    snow[i].style.left = snow[i].pos_x + wiggle[i] * Math.sin(wiggle_value[i]) + "px";

    if (snow[i].pos_y >= dH - 1.3 * snow[i].size ||
        parseInt(snow[i].style.left) > (dW - 3 * wiggle[i])) {

            snow[i].pos_x = random_value(dW - snow[i].size)
            snow[i].pos_y = 0;
            snow[i].hidden = !snow_is_running;
    }
}

setTimeout(move_snow, 1000 / FPS);

}

// .......................................................................

// Додаємо сніжинки до сторінки
for (z = 0; z < snow_max_count; z++) {
    
document.write(`<span id="snowflake_${z}"
                      style="position:absolute;
                             top:-${snow_max_size}px;">${snow_letter}</span>`);
}

// Допоміжні перемінна
let snow_is_started = false;
let snow_is_running = false;

// Починаємо ініціалізацію сніжинок, коли сторінка буде повністю завантажена
$("#title").bind("click", () => {
    
    if (!snow_is_started) { init_snow();
                            snow_is_started = true; }

    snow_is_running = !snow_is_running;
    
});