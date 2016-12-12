/**
 * Created by xiongkuang on 11/29/16.
 */
var selectedarr = new Array();
var labels = ["str", "int", "agi"];
labels.forEach(function (d) {
    d3.select("#" + d + "label").on("click", function () {
        var images = d3.select("#" + d + "images").selectAll("img");
        var numselected = d3.select("#" + d + "images").selectAll(".pic.selected")[0].length;
        if (numselected != images[0].length) {
            images.attr("class", "pic selected brightnessfilter")
                .style("border", "1px solid white");
        } else if (numselected == images[0].length) {
            images.classed("selected", false)
                .style("border", "1px solid black");
        }
    });
});


function highlight()
{
    if (!this.classList.contains("selected"))
    {
        d3.select(this).attr("class", "pic selected brightnessfilter")
            .style("border", "1px solid white");
    }
    else
    {
        $(this).removeClass("selected");
        d3.select(this).style("border", "1px solid black");
    }
}

function selected()
{
    d3.select(".clear-button_timeline").remove();
    tripleFilterUpdate();
}

function sorting(a, b)
{
    return a.dname.localeCompare(b.dname)
};


function updateFilteredSelectionByHero() {

    filtered_data = {
        id32: user_data.id32,
        id64: user_data.id64,
        matches: [],
        user: user_data.user
    }
    // copy the user_data matches
    filtered_data.matches.push.apply(filtered_data.matches, user_data.matches);


    var selectedheroes = d3.selectAll(".selected")[0];
    selectedarr = [];//new Array();
    selectedheroes.forEach(function (d)
    {
        selectedarr.push(+d.getAttribute("value"));
    });

    // if filter is empty, use all heroes
    if (selectedarr.length == 0) {
        // already copied above so just return
        return;
    } else {
        // filter for only selected heroes
        filtered_data.matches = filtered_data.matches.filter(function(d,i) {
            var player_hero_id = d.player_info.hero_id;

            return selectedarr.indexOf(player_hero_id) > -1
        })
    }
}

function reselectHeroes() {
    // first reset selection to blank
    resetSelectedHeroes();
    // then select previous selection
    selectedarr.forEach( function (d,i) {
        d3.select("#" + dM.getHeroInfo(d).name)
            .classed("selected",true)
            .style("border", "1px solid white");
    });
}