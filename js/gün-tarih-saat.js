function dcountup(startingdate, baseunit){
    this.currentTime=new Date()
    this.startingdate=new Date(startingdate)
    this.timesup=false
    this.baseunit=baseunit
    this.start()
}
dcountup.prototype.oncountup=function(){} //default action for "oncountup"
dcountup.prototype.start=function(){
    var thisobj=this
    this.currentTime.setSeconds(this.currentTime.getSeconds()+1)
    var timediff=(this.currentTime-this.startingdate)/1000 //difference btw target date and current date, in seconds
    var oneMinute=60 //minute unit in seconds
    var oneHour=60*60 //hour unit in seconds
    var oneDay=60*60*24 //day unit in seconds
    var dayfield=Math.floor(timediff/oneDay)
    var hourfield=Math.floor((timediff-dayfield*oneDay)/oneHour)
    var minutefield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour)/oneMinute)
    var secondfield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour-minutefield*oneMinute))
    if (this.baseunit=="hours"){ //if base unit is hours, set "hourfield" to be topmost level
        hourfield=dayfield*24+hourfield
        dayfield="n/a"
    }
    else if (this.baseunit=="minutes"){ //if base unit is minutes, set "minutefield" to be topmost level
        minutefield=dayfield*24*60+hourfield*60+minutefield
        dayfield=hourfield="n/a"
    }
    else if (this.baseunit=="seconds"){ //if base unit is seconds, set "secondfield" to be topmost level
        var secondfield=timediff
        dayfield=hourfield=minutefield="n/a"
    }
    var result={days: dayfield, hours:hourfield, minutes:minutefield, seconds:secondfield}
    this.oncountup(result)
    setTimeout(function(){thisobj.start()}, 1000) //update results every second
}


var princewedding=new dcountup("Dec 9, 2021", "days")
princewedding.oncountup=function(result){
    //result is an object containing the current count up date/time, updated every second
    //Available properties: result["days"], result["hours"], result["minutes"], and result["seconds"]
    var mycountainer=document.getElementById("cpcontainer")
    mycountainer.innerHTML="<a style='color:#ffdc00'>"+result['days']+"</a>"
}

// TARİH AYARI //
function refrClock()
{
var d=new Date();
var s=d.getSeconds();
var m=d.getMinutes();
var h=d.getHours();
var day=d.getDay();
var date=d.getDate();
var month=d.getMonth();
var year=d.getFullYear();
var days=new Array("Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi");
var months=new Array("Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık");
if (s<10) {s="0" + s}
if (m<10) {m="0" + m}
document.getElementById("clock").innerHTML= "Tarih: <a style='color:red'>" +date+ " "+months[month]+" " +year+ "</a> | Günlerden: <a style='color:red'>" +days[day]+ "</a> | Saat: <a style='color:red'>" + h + ":" + m + ":" + s + "</a> "
setTimeout("refrClock()",1000);
}
refrClock();

// Created for an Articles on:
// https://www.html5andbeyond.com/bubbling-text-effect-no-canvas-required/

jQuery(document).ready(function($){
 
    // Define a blank array for the effect positions. This will be populated based on width of the title.
    var bArray = [];
    // Define a size array, this will be used to vary bubble sizes
    var sArray = [4,6,8,10];
 
    // Push the header width values to bArray
    for (var i = 0; i < $('.bubbles').width(); i++) {
        bArray.push(i);
    }
     
    // Function to select random array element
    // Used within the setInterval a few times
    function randomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
 
    // setInterval function used to create new bubble every 350 milliseconds
    setInterval(function(){
         
        // Get a random size, defined as variable so it can be used for both width and height
        var size = randomValue(sArray);
        // New bubble appeneded to div with it's size and left position being set inline
        // Left value is set through getting a random value from bArray
        $('.bubbles').append('<div class="individual-bubble" style="left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');
         
        // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
        // Callback function used to remove finsihed animations from the page
        $('.individual-bubble').animate({
            'bottom': '100%',
            'opacity' : '-=0.7'
        }, 3000, function(){
            $(this).remove()
        }
        );
 
 
    }, 350);
 
});