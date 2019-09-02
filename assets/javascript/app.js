//jQuery function will begin once the page loads,
//populating the page with the initial buttons
$(function(){
    populateButtons(topics, "searchButton", "#buttons-go-here");

});

//array of pre-made search topics
var topics = ["nature", "Northern Lights", "penguins", "seals", "Samuel L. Jackson", "James Brown", "kittens", "ferrets"];

//renders buttons to the DOM
function populateButtons(topics, classToAdd, areaToAdd){
    $(areaToAdd).empty();
    for(let i =0; i< topics.length; i++){
        var button = $("<button>");
        button.addClass(classToAdd);
        button.attr("data-type", topics[i]);
        button.text(topics[i]);
        $(areaToAdd).append(button);
    }
};

//on-click function will grab user input and complete the
//AJAX call
$(document).on("click", ".searchButton", function(){
    var dataType = $(this).data("type");
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + dataType + "&api_key=VikWXpQW2mBa4Wu7t4dEKeRdwDaGl9x9&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
        //once we get the data, we create a div in which to place each rating and gif pairing 
        // also create variables to store particular indexes of the response variable
    }).then(function(response){
        console.log(response);
        for(let i = 0; i< response.data.length; i++){
            var searchDiv = $("<div class='gif-item'>");
            var rating = response.data[i].rating;
            var p = $("<p>").text("Rating: " + rating);
            //variables to specify both animated versions of gifs and still versions of gifs, located within the response variable
            var animated = response.data[i].images.fixed_height.url;
            var still = response.data[i].images.fixed_height_still.url;
            var image = $("<img>");
            //all images load to the page as still images first.
            image.attr("src", still);
            //data-still and data-animated attributes confirm for us the image/gif reference
            image.attr("data-still", still);
            image.attr("data-animated", animated);
            //data-state attribute confirms for us the state of the gif
            image.attr("data-state", "still");
            image.addClass("searchImage");
            searchDiv.append(p);
            searchDiv.append(image);
            $("#populate-gifs-here").append(searchDiv);
        }
        //need to use the document object because we are altering the already altered DOM
        $(document).on("click", ".searchImage", function(){
            //creates variable to store data-state of clicked image with class of searchImage
            var state = $(this).data("state");
            //if the state is still, pull from the src for still image, stored in the animated variable. Else, pull from the still image source variable
            if(state == still){
                $(this).attr("src", $(this).data("animated"));
                $(this).attr("data-state", "animated");
            } else{
                $(this).attr("src", $(this).data("still"));
                $(this).attr("data-state", "still");
            }
        })
        //add new buttons to #buttons-go-here in a separate on-click function
        $("#searchBtn").on("click", function(){
            //prevent page from reloading
            event.preventDefault();
            $("#populate-gifs-here").empty();
            //grab whatever is entered into the search bar
            //eq grabs the first version of the input, since this element already has an input type and value
            var newSearch = $("input").eq(0).val();
            //populate the array with the new search term
            topics.push(newSearch);
            populateButtons(topics, "searchButton", "#buttons-go-here");
            //input type of submit will reload the page, taking away the added buttons
            //returning false will prevent this from happening
            return false;
        })
    })

})

