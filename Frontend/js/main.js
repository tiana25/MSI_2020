jQuery(document).ready(function($){


//OPEN AND CLOSE SIDEBAR "FAVOURITES"
$('#openfave img').click(function(){
 $('.favourites').toggleClass('active');
 $('#fave').toggleClass("justify-content-end");
 $(".favourites").toggleClass("shadow");
 $("#cross").show();
});

$("#cross").click(function(){
    $(".favourites").toggleClass("shadow");
    $('.favourites').toggleClass('active');
    $('#fave').toggleClass("justify-content-end");
    $("#cross").hide();
});


//Creating categories//
function categoryTemplate(key,val){
    return`<label class="btn btn-secondary" id=${key}>
    <input type="radio" name="options" autocomplete="off"> ${val}
  </label>`
}
 
$.getJSON("https://api.chucknorris.io/jokes/categories", function(data){
    var items = [];
    $.each( data, function( key, val ) { 
      items.push(categoryTemplate(key,val));
    });

    $("#btn-optns").html(items);

    });

//Creating ejs template for jokes//
    var fs = require('fs');
    var ejs = require('ejs');
    
    const Joke = ejs.compile(fs.readFileSync('./Frontend/templates/Joke.ejs', "utf8"));
    const FaveJoke = ejs.compile(fs.readFileSync('./Frontend/templates/FaveJoke.ejs', "utf8"));


//ARRAY WITH FAVOURITE JOKES
var Fave = [];
var $faveJokes = $("#fave-jokes");
$faveJokes.html("");

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
    Fave = items;
  } else {
    items = [];
  }
  localStorage.setItem('items', JSON.stringify(Fave));
  updateFave();

//Adding and removing jokes to 'favourites' //
function addToFave(joke){
    idx = Fave.findIndex(item=>item.joke.id == joke.joke.id);
    if(idx<0){
        Fave.push(joke);
    }
    localStorage.setItem('items', JSON.stringify(Fave));
    updateFave();
}
function removeJoke(joke){
    idx = Fave.findIndex(item=>item.joke.id == joke.joke.id);
    Fave.splice(idx, 1);
    localStorage.setItem('items', JSON.stringify(Fave));
    updateFave();
}

function updateFave(){
    $faveJokes.html("");

    function showOneFaveJoke(joke){
        html_code = FaveJoke({joke: joke});
        var $node = $(html_code);
        $node.find(".filled-heart").click(function(){
          // console.log(joke.joke.value);
           removeJoke(joke);
        });
        $faveJokes.append($node);
    }

    Fave.forEach(showOneFaveJoke);
}


//Working with radio buttons//
$("input[name=radiogr]").click(function(){

    var radioValue = $("input[name='radiogr']:checked").val();
    if(radioValue){
        if (radioValue == 1){
        $("#search").val("");
        $('#searchrow').hide();
        $('#categ-options').hide();
        }
       else if (radioValue == 2) {
        $("#search").val("");
        $('#searchrow').hide();
        $('#categ-options').show();
       }
       else if(radioValue == 3){
        $('#categ-options').hide();
        $('#searchrow').show();
       }
       else{
        console.log('else');
        $('#categ-options').hide();
        $('#searchrow').hide();
    }
    }
});


var $all_jokes = $("#all_jokes");
$all_jokes.html("");

//GET JOKE REQUEST//
$('.btn-joke').click(function(){

    var radioValue = $("input[name='radiogr']:checked").val();
    if(radioValue){
        if (radioValue == 1){
        $.get("https://api.chucknorris.io/jokes/random", function(data){
            const date = new Date (data.updated_at.replace(' ', 'T'));
            const currentDate = new Date();
            var hours = Math.abs(currentDate - date) / 36e5;
            var one_joke = {
                joke: data,
                date: Math.round(hours)
            };
            html_code = Joke({joke: one_joke});
            var $node = $(html_code);
            $all_jokes.append($node);

            $node.find('.empty-heart').click(function(){
                $node.find('.filled-heart').show();
                addToFave(one_joke);
                $(this).hide();
            });
            
            $node.find('.filled-heart').click(function(){
                $node.find('.empty-heart').show();
                removeJoke(one_joke);
                $(this).hide();
            });
        });
        }
       else if (radioValue == 2) {
           if($('#btn-optns').find(".active").length > 0){
               var catgr =  $.trim($('#btn-optns').find(".active").text());
                $.get("https://api.chucknorris.io/jokes/random?category="+catgr, function(data){
                
                    const date = new Date (data.updated_at.replace(' ', 'T'));
                    const currentDate = new Date();
                    var hours = Math.abs(currentDate - date) / 36e5;
                    var one_joke = {
                        joke: data,
                        date: Math.round(hours)
                    };
                
                html_code = Joke({joke: one_joke});
                var $node = $(html_code);
                $all_jokes.append($node);

                $node.find('.empty-heart').click(function(){
                    $node.find('.filled-heart').show();
                    addToFave(one_joke);
                    $(this).hide();
                });
                
                $node.find('.filled-heart').click(function(){
                    $node.find('.empty-heart').show();
                    removeJoke(one_joke);
                    $(this).hide();
                });
     });
           }
       }
       else if(radioValue == 3){
        var search_res = $("#search").val();
        console.log(search_res);
        if(search_res){
            $.get("https://api.chucknorris.io/jokes/search?query="+search_res, function(data){
                
                  for(var i = 0; i<data.total;i++) {

                    const date = new Date (data.result[i].updated_at.replace(' ', 'T'));
                    const currentDate = new Date();
                    var hours = Math.abs(currentDate - date) / 36e5;
                    var one_joke = {
                        joke: data.result[i],
                        date: Math.round(hours)
                    };

                    html_code = Joke({joke: one_joke});
                    var $node = $(html_code);
            
                   $all_jokes.append($node);

                   $node.find('.empty-heart').click(function(){
                    $node.find('.filled-heart').show();
                    addToFave(one_joke);
                    $(this).hide();
                });
                
                $node.find('.filled-heart').click(function(){
                    $node.find('.empty-heart').show();
                    removeJoke(one_joke);
                    $(this).hide();
                });
                  }
                 
                 });
        }
       }
       else{
        console.log('else');
    }
    }
    
});

});