/* my own easy slider
realization: http://test.beauty-alchemy.ru/
on the main page*/

$(document).ready(function() {    
    if ($('#slider').size()) {
        mySlide();
    }
})
var slider=0;
function mySlide() {
    var count=$("#count").val();
    $(".slider-img").fadeOut(1000);
    $("#img"+slider).fadeIn(1000);
    slider++;
    if (slider > count-1) slider=0;
    setTimeout("mySlide();", 5000);
}
