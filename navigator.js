/* released main Products Navigator on this site:
http://test.beauty-alchemy.ru/?page=catalog&category=1&kind=1
*/

jQuery( document ).ready(function() {
    /* Стрелочка вверх */
	jQuery('#scrollup img').mouseover( function(){
		jQuery( this ).animate({opacity: 0.65},100);
	}).mouseout( function(){
		jQuery( this ).animate({opacity: 1},100);
	}).click( function vverh(){
		window.scrollBy(0,-50); // чем меньше значение по оси Y, тем выше скорость перемещения
        if (window.pageYOffset > 0) {requestAnimationFrame(vverh);} 
		return false;
	});
	jQuery(window).scroll(function(){
		if ( $(document).scrollTop() > 0 ) {
			jQuery('#scrollup').fadeIn('fast');
		} else {
			jQuery('#scrollup').fadeOut('fast');
		}
        if ($(this).scrollTop() > 327 ){
            jQuery('#admin_head').addClass('notscroll');
        }else {
            jQuery('#admin_head').removeClass('notscroll');
        }
	});
    
    /* Корзина */
    $('#basket').click( function(){
		location.href="?page=mybasket"; 
		return false;
	});
    
    /* пункты вертикального меню */
    $('.vertical').click (function(){
            $('.vertical').removeClass('activebtn');
            $('.vertslide').slideUp(1000);
            $(this).addClass('activebtn');
            $(this).closest('.vertsub').children('.vertslide:hidden').slideDown(1000);
    });
    $('.vertslide').click (function(){
            $('.vertslide').removeClass('activebtn');
            $(this).addClass('activebtn');
    });
});

function set_navigator(line,cat,skin,kind){
    $.post("index.php?page=json", {
            action:'navigator',
        }, function(data){
            if (data.state){
                draw_navigator(data.res,line,cat,skin,kind);
            }else alert(data.message);
        },
    "json");
}
function draw_navigator(ties,line,cat,skin,kind){
    var navi=tmp=selected='';
    var disabled='disabled';
    $("#navigator").empty();
    // формируем массивы связей для динамичного отображения списков выбора (слева направо)
    var lines=new Array();
    var cats=new Array();
    var skins= new Array();
    var kinds=new Array();
    lines=ties.lines;
    if (line==''){
        cats=ties.categories;
        skins=ties.skins;
        if (cat=='') kinds=ties.kinds;
        else {
            if (skin==''){ 
                for (i in ties.catkind){
                    if (ties.catkind[i].category==cat) kinds[ties.catkind[i].kind]=ties.catkind[i].kind_name; 
                }
            }else{ 
                for (i in ties.skinkind){
                    if (ties.skinkind[i].skin==skin) kinds[ties.skinkind[i].kind]=ties.skinkind[i].kind_name; 
                }
            }
        }
    }else{
        for (i in ties.linecat){
            if (ties.linecat[i].line==line) cats[ties.linecat[i].category]=ties.linecat[i].cat_name;
        }
        for (i in ties.lineskin){
            if (ties.lineskin[i].line==line) skins[ties.lineskin[i].skin]=ties.lineskin[i].skin_name;
        }
        if (cat==''){
            for (i in ties.linekind){
                if (ties.linekind[i].line==line) kinds[ties.linekind[i].kind]=ties.linekind[i].kind_name; 
            }
        }else{
            if (skin==''){ 
                for (i in ties.linecatkind){
                    if ((ties.linecatkind[i].line==line)&&(ties.linecatkind[i].category==cat)) kinds[ties.linecatkind[i].kind]=ties.linecatkind[i].kind_name; 
                }
            }else{ 
                for (i in ties.lineskinkind){
                    if ((ties.lineskinkind[i].line==line)&&(ties.lineskinkind[i].skin==skin)) kinds[ties.lineskinkind[i].kind]=ties.lineskinkind[i].kind_name; 
                }
            }
        }
    }
    //alert(print_r(cats));
    // рисуем навигатор
    navi+='<p class="navsel"><strong>Вы выбрали продукцию по следующим критериям:</strong></p>';
    navi+='<select id="navline" class="navsel" onchange="set_ties1();"><option value="">Любая линия косметики</option>';
    for (i in lines){
        if (i==line) selected='selected';
        navi+='<option '+selected+' value="'+i+'">'+lines[i].line_name+'</option>';
        selected='';
    }
    navi+='</select><strong>>></strong>';
    navi+='<select id="navcat" class="navsel" onchange="set_ties2();"><option value="">Любая категория</option>';
    //alert(print_r(cats)); return;
    for (i in cats){
        if (i==cat) selected='selected';
        if ((i==cat)&&(cats[i].indexOf("лиц")>-1)) disabled='';
        navi+='<option '+selected+' value="'+i+'">'+cats[i]+'</option>';
        selected='';
    }
    navi+='</select><strong>>></strong>';
    navi+='<select id="navskin" '+disabled+' class="navsel '+disabled+'" onchange="set_ties3();"><option value="">Для любого типа кожи</option>';
    for (i in skins){
        if (i==skin) selected='selected';
        navi+='<option '+selected+' value="'+i+'">'+skins[i]+'</option>';
        selected='';
    }
    navi+='</select><strong>>></strong>';
    navi+='<select id="navkind" class="navsel"><option value="">Любой вид продукции</option>';
    for (i in kinds){
        if (i==kind) selected='selected';
        navi+='<option '+selected+' value="'+i+'">'+kinds[i]+'</option>';
        selected='';
    }
    navi+='</select><button id="select" name="select" type="button" class="navsel navbtn" onclick="get_navigator();">';
    navi+='<img class="img_navi" alt="Выбрать" src="design/img/select2.png"/></button></br>';
    navi+='<p class="navsel"><strong>Вы можете изменить критерии выбора и нажать галочку! Или воспользоваться поиском нужной продукции</strong></p>';
    navi+='<em class="navsel" style="color:#f23dc8 !important"><strong>по ключевому слову (фразе):</strong></em><input type="text" id="fragment" class="navsel"/>';
    navi+='<button id="search" type="button" class="navsel navbtn" onclick="get_search();">';
    navi+='<img class="img_navi" alt="Искать" src="design/img/search.png"/></button>';
    $("#navigator").append(navi);
}
function set_ties1(){
    set_navigator($('#navline').val(),'','','');
}
function set_ties2(){
    set_navigator($('#navline').val(),$('#navcat').val(),'','');
}
function set_ties3(){
    set_navigator($('#navline').val(),$('#navcat').val(),$('#navskin').val(),'');
}

function get_navigator(){
    var line=$('#navline').val();
    var cat=$('#navcat').val();
    var skin=$('#navskin').val();
    var kind=$('#navkind').val();
    product_get(line,cat,skin,kind);
}
function get_search(){
    product_get_by_search($('#fragment').val());
}
// устанавливаем активность кнопок вертикального меню, для отображения правильного выбора
function set_vertical(open, cat, kind){
    if(open){
        //alert("правда!");
        if (!($('#vertical'+cat).hasClass('activebtn'))) {
            $('.vertical').removeClass('activebtn');
            $('.vertslide').slideUp(1000);
            $('#vertical'+cat).addClass('activebtn');
            $('#vertical'+cat).closest('.vertsub').children('.vertslide:hidden').slideDown(1000);
        }
        $('.vertslide').removeClass('activebtn');
        $('#vertslide'+cat+'kind'+kind).addClass('activebtn');
    }else {
        //alert("ложь!");
        $('.vertical').removeClass('activebtn');
        $('.vertslide').removeClass('activebtn').slideUp(1000);
    }
}
