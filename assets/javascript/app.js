//jQuery function will begin once the page loads,
//populating the page with the initial buttons
$(function(){
    populateButtons(topics, "searchButton", "#buttons-go-here");
    for( var z=0; z<localStorage.length; z++){
        favoriteTopics.push(localStorage.getItem(localStorage.key(z)));
    }
    console.log(favoriteTopics);
    populateButtons(favoriteTopics, "favorite-search-button", "#buttons-go-here");
});

//array of pre-made search topics
var topics = ["nature", "Northern Lights", "penguins", "seals", "Samuel L. Jackson", "James Brown", "kittens", "ferrets"];
var image;
var favoriteTopics = [];

//creates buttons
function populateButtons(unicorn, classToAdd, areaToAdd){
    for(let i =0; i< unicorn.length; i++){
        var button = $("<button>");
        button.addClass(classToAdd);
        button.attr("data-type", unicorn[i]);
        button.text(unicorn[i]);
        $(areaToAdd).append(button);
    }
};

function callAjax (dataType){
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + dataType + "&api_key=VikWXpQW2mBa4Wu7t4dEKeRdwDaGl9x9&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        //renders gifs to the DOM
        for(let j = 0; j< response.data.length; j++){
            var searchDiv = $("<div class='gif-item'>");
            var rating = response.data[j].rating;
            var upperRating = rating.toUpperCase();
            var p = $("<p>").text("Rating: " + upperRating);
            //variables to specify both animated versions of gifs and still versions of gifs, located within the response variable
            var animated = response.data[j].images.fixed_height.url;
            var still = response.data[j].images.fixed_height_still.url;
            image = $("<img>");
            //all images load to the page as still images first.
            image.attr({
                "src": still,
                "data-still": still,
                "data-animated": animated,
                "data-state": "still"
                })  
            image.addClass("searchImage");
            searchDiv.append(p);
            searchDiv.append(image);
            $("#populate-gifs-here").append(searchDiv);
        }
    })
};

$(document).on("click", ".searchButton, .favorite-search-button", function(){
    $("#populate-gifs-here").empty();   
    var dataType = $(this).data("type");
    callAjax(dataType);
});

$(document).on("click", ".searchImage", function(){
    //creates variable to store data-state of clicked image with class of searchImage
    //cannot be .data("state"), as that only specifies the initial data state; the gif will not be able to change to its animated data-state attribute, and thus the else statement will never fire and the gif will be in constant motion.
    var state = $(this).attr("data-state");
    //pull from the src for still image, stored in the animated variable. Else, pull from the still image source variable
    if(state === "still"){
        $(this).attr({
            "src": $(this).data("animated"),
            "data-state": "animated"
        })
    } else {
        $(this).attr({
            "src": $(this).data("still"),
            "data-state": "still"
        })
    }
}); 

//add new buttons to #buttons-go-here in a separate on-click function
$("#searchBtn").on("click", function(){
    //prevent page from reloading. This is needed due to the button's bubmit type attribute.
    event.preventDefault();
    //grab whatever is entered into the search bar
    //eq grabs the first version of the input, since this element already has an input type and value
    var newSearch = $("input").eq(0).val();
    //populate the array with the new search term
    topics.push(newSearch);
    $("#search-input").val("");
    $("#buttons-go-here").empty();
    populateButtons(topics, "searchButton", "#buttons-go-here");
    populateButtons(favoriteTopics, "favorite-search-button", "#buttons-go-here");
    //input type of submit will reload the page, taking away the added buttons
    //returning false will prevent this from happening
    return false;
});

$("#favoriteBtn").on("click", function(){
    //prevent page from reloading. This is needed due to the button's bubmit type attribute.
    event.preventDefault();
    //grab whatever is entered into the search bar
    //eq grabs the first version of the input, since this element already has an input type and value
    var newFavSearch = $("input").eq(0).val();
    //populate the array with the new search term
    favoriteTopics.push(newFavSearch);
    // store the item in local storage to populate the favorite topics buttons upon reload
    localStorage.setItem("Favorite Topic", newFavSearch);
    $("#search-input").val("");
    $("#buttons-go-here").empty();
    populateButtons(topics, "searchButton", "#buttons-go-here");
    populateButtons(favoriteTopics, "favorite-search-button", "#buttons-go-here");
    //input type of submit will reload the page, taking away the added buttons
    //returning false will prevent this from happening
    return false;
});
