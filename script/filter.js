/**
 * Created by xiongkuang on 11/29/16.
 * much of code of this file come from : https://github.com/rkgibson2/data-driven-dota
 */


var selectedarr = [];
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


function highlight() {
    if (!this.classList.contains("selected")) {
        d3.select(this).attr("class", "pic selected brightnessfilter")
            .style("border", "1px solid white");
    }
    else {
        $(this).removeClass("selected");
        d3.select(this).style("border", "1px solid black");
    }
}

function selected() {
    d3.select(".clear-button_timeline").remove();
    tripleFilterUpdate();
}

function sorting(a, b) {
    return a.dname.localeCompare(b.dname)
}
function updateFilteredSelectionByHero() {

    filtered_data = {
        id32: user_data.id32,
        id64: user_data.id64,
        matches: [],
        user: user_data.user
    };
    // copy the user_data matches
    filtered_data.matches.push.apply(filtered_data.matches, user_data.matches);


    var selectedheroes = d3.selectAll(".selected")[0];
    selectedarr = [];//new Array();
    selectedheroes.forEach(function (d) {
        selectedarr.push(+d.getAttribute("value"));
    });

    // if filter is empty, use all heroes
    if (selectedarr.length == 0) {
        // already copied above so just return

    } else {
        // filter for only selected heroes
        filtered_data.matches = filtered_data.matches.filter(function (d, i) {
            var player_hero_id = d.player_info.hero_id;

            return selectedarr.indexOf(player_hero_id) > -1
        })
    }
}

function reselectHeroes() {
    // first reset selection to blank
    resetSelectedHeroes();
    // then select previous selection
    selectedarr.forEach(function (d, i) {
        d3.select("#" + dM.getHeroInfo(d).name)
            .classed("selected", true)
            .style("border", "1px solid white");
    });
}


all_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
init_modes = ["AR", "CD", "CM", "RD", "SD", "AP"];
selected_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
update_selected_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];

function changeColor(gamemode) {
    if (update_selected_modes.indexOf(gamemode) < 0) {
        document.getElementById(gamemode).style.border = "2px solid white";
        update_selected_modes.push(gamemode);
        //tripleFilterUpdate();

    }
    else {
        var index = update_selected_modes.indexOf(gamemode);
        update_selected_modes.splice(index, 1);
        document.getElementById(gamemode).style.border = "none";
        //tripleFilterUpdate();
    }
}

function resetGameMode() {
    all_modes.forEach(function (d) {
        if (selected_modes.indexOf(d) < 0) {
            document.getElementById(d).style.border = "2px solid white";
            selected_modes.push(d);
        }
    });
}

function reselectGameMode() {
    update_selected_modes = selected_modes.slice();
    // first reset selection to all unselected
    all_modes.forEach(function (d) {
        document.getElementById(d).style.border = "none";
    });
    // then select previous selection
    selected_modes.forEach(function (d) {
        document.getElementById(d).style.border = "2px solid white";
    });
}
function initGameMode() {
    selected_modes = init_modes.slice();
}


all_lobby_modes =["public", "practice", "tournament", "tutorial", "co_op_bot", "team_match", "solo_queue", "ranked"];

init_lobby_modes = ["public", "practice", "tournament", "tutorial", "co_op_bot", "team_match", "solo_queue", "ranked"];
selected_lobby_modes = ["public", "practice", "tournament", "tutorial", "co_op_bot", "team_match", "solo_queue", "ranked"];

update_selected_lobby_modes =["public", "practice", "tournament", "tutorial", "co_op_bot", "team_match", "solo_queue", "ranked"];

function changeLobbyColor(gamemode) {
    if (update_selected_lobby_modes.indexOf(gamemode) < 0) {
        document.getElementById(gamemode).style.border = "2px solid white";
        update_selected_lobby_modes.push(gamemode);

    }
    else {
        var index = update_selected_lobby_modes.indexOf(gamemode);
        update_selected_lobby_modes.splice(index, 1);
        document.getElementById(gamemode).style.border = "none";
    }
}

function resetLobby() {
    all_lobby_modes.forEach(function (d) {
        if (selected_lobby_modes.indexOf(d) < 0) {
            document.getElementById(d).style.border = "2px solid white";
            selected_lobby_modes.push(d);
        }
    });
}

function filterLobby() {
    //for game modes
    selected_modes = update_selected_modes.slice();

    // for lobby modes
    selected_lobby_modes = update_selected_lobby_modes.slice();
    tripleFilterUpdate();
}

function reselectLobby() {
    // reselect game mode function first
    reselectGameMode();
    update_selected_lobby_modes = selected_lobby_modes.slice();
    // first reset selection to all unselected
    all_lobby_modes.forEach(function (d) {
        document.getElementById(d).style.border = "none";
    });
    // then select previous selection
    selected_lobby_modes.forEach(function (d) {
        document.getElementById(d).style.border = "2px solid white";
    });
}
function initLobby() {
    selected_lobby_modes = init_lobby_modes.slice();
}