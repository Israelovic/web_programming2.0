// Необхідні змінні
let index = 0;
let news;

// Обробка бокового меню
function click_on_menu (object) {

   // Видаляємо клас "active" з усіх елементів меню
   $("li.nav-item").removeClass("active");

   // Отримуємо елемент, на який натиснули
   let item = $(object);

   // Задаємо активному елементу клас "active"
   item.addClass("active");

   // Отримуємо id активного елемента
   let id = item.attr('id');

   // Виконуємо необхідну дію
   switch (id) {

      // Перехід на головну сторінку
      case "menu_home": 
         setTimeout(() => {
            document.location.href = "../index.html";
         }, 500);
      break;

      // Відобразити список картин
      case "menu_news":
         $("#div_task").attr("hidden", "");
         $("#div_news").removeAttr("hidden");   
      break;

      // Відобразити завдання
      case "menu_task":
         $("#div_task").removeAttr("hidden");
         $("#div_news").attr("hidden", "");   
      break;
   }
}
var audio = new Audio();

function playSound(url) {
    audio.src = url;
    audio.play();
}

function stopSound() {
    audio.pause();
    audio.currentTime = 0;
}
// Обробка вибору картини
function click_on_news (object) {

   let element;

   if (object === -1)
      { element = news[Math.floor(Math.random() * news.length)]; }
   else
      { element = $(object).attr("data"); }
   
   $.get(`../data/text/${element}.txt`, (data) => {

      let item_data = data.split("\n");

      let block =
        `<div class="modal-header border-secondary text-white" class="modalWin">
            <div class="d-flex flex-column ms-3">
               
               <h2 class="m-0">${item_data[0]}</h2>
               <span>Автор: ${item_data[1]}</span>
               <span>Час публікації: ${item_data[2]}</span>
            </div>
            <button type="button" onclick="stopSound()" class="btn-close bg-dark me-3" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         
         <div class="modal-body text-white">
            <img src="../data/img/${item_data[3]}.jpg" class="w-100" alt="news">
         </div>
         
         <div class="modal-footer border-secondary text-white">
            <h4 align="left">${item_data[4]}</h4>
            <p>${item_data[5]}</p>
         </div>`;

      $("#modal_content").html(block);
      $('#modal').modal('show');
      
   });
}

// Підвантаження нових даних
function load_more_news(n) {
    let a = 0;
    for (; a < n; ) {
        if (index >= news.length)
            return void disable_load_button();
        $.get(`../data/text/${news[index]}.txt`, (n=>{
            let a = n.split("\n")
              , t = `<div class="col-md-6 col-lg-3">\n               
              <div id="div1_news" class="p-2 news" onclick="click_on_news(this), playSound('../sound/${a[3]}.mp3')" data="${a[3]}">\n                  
              <img src="../data/img/${a[3]}.jpg" class="w-100" alt="news" width="300" height="300">\n                  
              <div class="bg-light text-dark">${a[0]}</div>\n               
              </div>\n            
              </div>`;
            $("#news").append(t)
        }
        )),
        a++,
        index++
    }
}

// Вимкнення кнопки "показати більше картин"
function disable_load_button() {
   $("#load").addClass("disabled");
}

// Реагуємо на закривання модального вікна
$("#modal").on("hidden.bs.modal", () => {
   $("li.nav-item").removeClass("active");
   $("#menu_news").addClass("active");
   $("#div_task").attr("hidden", "");
   $("#div_news").removeAttr("hidden");
});

// Завантаження початкових даних
$(document).ready(() => {    
   setTimeout(() => {
      $.get("../data/data.txt", (data) => {
         news = data.split("\n");
         news.splice(news.length - 1, 1);
         load_more_news(8);
      });
   }, 300);
});

$(function() {
 let header = $('.header');
 let hederHeight = header.height(); // вычисляем высоту шапки
  
 $(window).scroll(function() {
   if($(this).scrollTop() > 1) {
    header.addClass('header_fixed');
    $('body').css({
       'paddingTop': hederHeight+'px' // делаем отступ у body, равный высоте шапки
    });
   } else {
    header.removeClass('header_fixed');
    $('body').css({
     'paddingTop': 0 // удаляю отступ у body, равный высоте шапки
    })
   }
 });
});