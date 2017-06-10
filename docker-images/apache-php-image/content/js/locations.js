$(function() {
    console.log("Loading locations");
    function loadLocations() {
        $.getJSON("/api/students/", function(locations) {
            console.log(locations);
            var message = "You are nowhere";
            if (locations.length > 0) {
                message = locations[0].city + ", " + locations[0].state;
            }
            $(".skills").text(message);
        });
    };
    loadLocations();

    setInterval(loadLocations, 2000);
});