/* реализацию см. на: http://phonebook.pa.infobox.ru/
*/
// автоопределение города на стартовой странице
window.onload = function () {
      $("#myCity").text(ymaps.geolocation.city);
}
$(function(){
    // переключалка формы для добавления новой записи в справочник
   	$("#toggleInsertForm").click( function()  {
        $('#hidden').toggle(1000);
    });
    // поиск по ФИО или фрагменту, можно вводить в любой последовательности
    $("#searchByNames").click( function()  {
        var searchSequence=$("#namesSearch").val().toLowerCase().trim();        
        searchWrapper(searchSequence, 1);
    });
    // поиск по номеру телефона. Вырезает все символы, кроме цифровых. Если в начале 8 и номер из 11 знаков - заменяет на +7
    $("#searchByPhones").click( function()  {
        var searchSequence=$("#phoneSearch").val().trim();
        searchWrapper(searchSequence, 0);
    });
});

function searchWrapper(searchSequence, searchType){
        $(".search1").val("");
        $(".rows").show();
        var result=document.getElementById("search_result");
        if (searchSequence!=""){
            var count=searchCore(searchSequence, searchType);
            if (count==0) result.innerHTML='Запись "'+searchSequence+'" в справочнике не найдена!'; 
            else result.innerHTML='Найдено '+count +' записей вида: "'+searchSequence+'"';
        }else {
            result.innerHTML="";
        }
}

function searchCore(searchSequence, searchType){
    var countRows=document.getElementById('table_body').getElementsByTagName('tr').length;
    var count=0;
    if (searchType){
            var names = Array(2).join(searchSequence).split(" ");           
            if (!(1 in names)) names[1]="";
            if (!(2 in names)) names[2]="";
            for (i=1; i<=countRows; i++){
                var text=document.getElementById("row"+i).textContent.toLowerCase();
                 if ((text.indexOf(names[0])!=-1)&&(text.indexOf(names[1])!=-1)&&(text.indexOf(names[2])!=-1)){
                    count++;
                }else {                                                    
                    $("#row"+i).hide();
                }
            }
    }else{
            var phone = searchSequence.replace(/\D/g, "");
            if (phone.length>=11 && phone.charAt(0)=="8") {
                phone="+7" + phone.slice(1);
            }
            if (phone=="") return 0;
            for (i=1; i<=countRows; i++){
                var text=document.getElementById("row"+i).getElementsByClassName("col4")[0].textContent; 
                 if (text.indexOf(phone)!=-1){
                    count++;
                }else {
                    $("#row"+i).hide();
                }
            }
    }
    return count;
}

