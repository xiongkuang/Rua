/**
 * Created by xiongkuang on 11/29/16.
 */
//data global
var user_data;

//filtered data global
var filtered_data;

//margins and bounding boxes for each graph visualization
var bb_win_loss, bb_hero_pie, bb_item_percent, bb_hero_chord, bb_gpm, bb_xpm, bb_kda;


bb_records = {
    x: 0,
    y: 250,
    h: 200,
    w: 1060
}

bb_win_loss = {
    w: 250,
    h: 30,
    margin: {
        top: 40,
        right: 70,
        bottom: 20,
        left: 70
    }
};

bb_hero_pie = {
    w: 300,
    h: 300,
    margin: {
        top: 60,
        right: 20,
        bottom: 20,
        left: 20
    }
};

bb_item_percent = {
    w: 600,
    h: 300,
    margin: {
        top: 90,
        right: 20,
        bottom: 20,
        left: 50
    }
};

bb_hero_chord = {
    w: 400,
    h: 400,
    margin: {
        top: 110,
        right: 20,
        bottom: 20,
        left: 20
    }
};

bb_user_interact = {
    h: 400,
    w: 400,
    margin: {
        top: 110,
        right: 80,
        bottom: 20,
        left: 20
    }
}

bb_gpm = {
    h: 400,
    w: 400,
    margin: {
        top: 80,
        right: 50,
        bottom: 50,
        left: 50
    }
}

bb_xpm = {
    h: 400,
    w: 400,
    margin: {
        top: 80,
        right: 50,
        bottom: 50,
        left: 50
    }
}

bb_kda = {
    x: 0,
    y: 1500,
    h: 300,
    w: 900
}

var isChecked = $("#color-blind").is(":checked");

// button handlers for splash page to switch the divs around as desired

d3.selectAll(".move_on_button button")
    .on("click", function() {
        //force scroll to top if you're on the second page of the splash screen
        $(window).scrollTop("0px")
        d3.select("#not-splash")
            .style("display", null)
        d3.select("#splash")
            .style("display", "none");
    })


d3.select(".more_info_button button")
    .on("click", function() {
        d3.select("#splash")
            .style("display", "none");
        d3.select("#not-splash")
            .style("display", null);

        //hack around fix positioning
        d3.select("#page-header").style("position","absolute");
        //start the intro js
        introguide.start();
    })

// bind handlers for going back to main screen
function return_to_splash () {
    $(window).scrollTop("0px")
    introguide.exit();
    d3.select("#not-splash")
        .style("display", "none")
    d3.select("#splash")
        .style("display", null);
}



// start with move on button in "loading" state (Twitter Bootstrap)
$( ".move_on_button button" ).button("loading")
$( ".more_info_button button" ).button("loading")


// When DOM is ready, enable button
$(window).load(function() {

    $( ".move_on_button button" ).button("reset")
    $(".more_info_button button").button("reset")
})


//set up those boxes
svg_win_loss = d3.select("#win_loss_container").append("svg").attr({
    width: bb_win_loss.w + bb_win_loss.margin.left + bb_win_loss.margin.right + 20,
    height: bb_win_loss.h + bb_win_loss.margin.bottom + bb_win_loss.margin.top
})

svg_hero_pie = d3.select("#hero_pie_container").append("svg").attr({
    width: bb_hero_pie.w + bb_hero_pie.margin.left + bb_hero_pie.margin.right,
    height: bb_hero_pie.h + bb_hero_pie.margin.bottom + bb_hero_pie.margin.top
})

svg_item_percent= d3.select("#item_percent_container").append("svg").attr({
    width: bb_item_percent.w + bb_item_percent.margin.left + bb_item_percent.margin.right,
    height: bb_item_percent.h + bb_item_percent.margin.bottom + bb_item_percent.margin.top
})

svg_user_interact = d3.select("#user_interact_container").append("svg").attr({
    width: bb_user_interact.w + bb_user_interact.margin.left + bb_user_interact.margin.right,
    height: bb_user_interact.h + bb_user_interact.margin.bottom + bb_user_interact.margin.top
})

svg_gpm = d3.select("#gpm_container").append("svg").attr({
    width: bb_gpm.w + bb_gpm.margin.left + bb_gpm.margin.right,
    height: bb_gpm.h + bb_gpm.margin.bottom + bb_gpm.margin.top
})

svg_xpm = d3.select("#xpm_container").append("svg").attr({
    width: bb_xpm.w + bb_xpm.margin.left + bb_xpm.margin.right,
    height: bb_xpm.h + bb_xpm.margin.bottom + bb_xpm.margin.top
})

svg_hero_chord = d3.select("#hero_chord_container").append("svg").attr({
    width: bb_hero_chord.w + bb_hero_chord.margin.left + bb_hero_chord.margin.right,
    height: bb_hero_chord.h + bb_hero_chord.margin.bottom + bb_hero_chord.margin.top
})

var win_loss_graph = svg_win_loss.append("g")
    .attr("class", "win_loss")
    .attr("transform", "translate(" + bb_win_loss.margin.left + "," + bb_win_loss.margin.top + ")");

var hero_pie_graph = svg_hero_pie.append("g")
    .attr("class", "hero_pie")
    .attr("transform", "translate(" + (bb_hero_pie.w/2 + bb_hero_pie.margin.left) + "," + (bb_hero_pie.h / 2 + bb_hero_pie.margin.top) + ")");

var item_percent_graph = svg_item_percent.append("g")
    .attr("class", "item_percent")
    .attr("transform", "translate(" + bb_item_percent.margin.left + "," + bb_item_percent.margin.top + ")");

var user_interact_graph = svg_user_interact.append("g")
    .attr("class", "user_interact")
    .attr("transform", "translate(" + bb_user_interact.margin.left + "," + bb_user_interact.margin.top + ")");

var gpm_graph = svg_gpm.append("g")
    .attr("class", "gpm")
    .attr("transform", "translate(" + bb_gpm.margin.left + "," + bb_gpm.margin.top + ")");

var xpm_graph = svg_xpm.append("g")
    .attr("class", "xpm")
    .attr("transform", "translate(" + bb_gpm.margin.left + "," + bb_gpm.margin.top + ")");

var hero_chord_graph = svg_hero_chord.append("g")
    .attr("class", "hero_chord")
    .attr("transform", "translate(" + (bb_hero_chord.w/2 + bb_hero_chord.margin.left) + "," + (bb_hero_chord.h / 2 + bb_hero_chord.margin.top) + ")");

// var kda_graph = svg.append("g")
// 	.attr("class", "kda")
// 	.attr("transform", "translate(" + bb_kda.x + "," + bb_kda.y + ")");

var item_percent_x, item_percent_y, item_percent_xAxis, item_percent_yAxis, item_percent_color;
var hero_pie_radius, hero_pie_color, hero_pie_x, hero_pie_y, partition, hero_pie_arc, hero_pie_path;

//tool tip setup
var graph_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0,0]);

svg_hero_chord.call(graph_tip);
//svg_xpm.call(graph_tip);
//svg_gpm.call(graph_tip);

//function calls
d2.loadJson(function() {

    // Benjy's stuff
    hero_keys = d2.getKeys("heroes");
    var intheroes = new Array();
    var agiheroes = new Array();
    var strheroes = new Array();
    for (var i = 0; i < hero_keys.length; i++)
    {
        var hero = d2.getHeroInfoCopy(hero_keys[i]);
        if (hero)
        {
            if (hero.stat == "strength")
            {
                strheroes.push(hero);
            }
            else if (hero.stat == "agility")
            {
                agiheroes.push(hero);
            }
            else if (hero.stat == "intelligence")
            {
                intheroes.push(hero);
            }
        }
    };
    strheroes.sort(sorting);
    agiheroes.sort(sorting);
    intheroes.sort(sorting);
    strheroes.forEach(function (d)
    {
        var heroname = d.name;
        d3.select("#strimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#strimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#strimages").select("#" + heroname).on("click", highlight);
    });
    agiheroes.forEach(function (d)
    {
        var heroname = d.name;
        d3.select("#agiimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#agiimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#agiimages").select("#" + heroname).on("click", highlight);
    });
    intheroes.forEach(function (d)
    {
        var heroname = d.name;
        d3.select("#intimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#intimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#intimages").select("#" + heroname).on("click", highlight);
    });

    // creates sunburst parent-child nested array-dict object whatever format
    //for use in the hero sunburst, although without any data
    hero_flare = {};

    hero_flare.name = "flare"
    hero_flare.children = [{},{},{}];

    hero_flare.children[0].name = "agility";
    hero_flare.children[1].name = "strength";
    hero_flare.children[2].name = "intelligence";

    hero_flare.children[0].children = [];
    hero_flare.children[1].children = [];
    hero_flare.children[2].children = [];

    for (var i = 0; i < hero_keys.length; i++)
    {
        var hero = d2.getHeroInfoCopy(hero_keys[i]);

        hero.items = [];

        if (hero.stat == "agility") {
            hero_flare.children[0].children.push(hero);
        }

        if (hero.stat == "strength") {
            hero_flare.children[1].children.push(hero);
        }

        if (hero.stat == "intelligence") {
            hero_flare.children[2].children.push(hero);
        }


    }

    // first option in the dropdown selector
    loadData(d3.select("#userdropdown").node().value);
});

d3.select("#color-blind")
    .on("click", function() {
        tripleFilterUpdate();
    })

function tripleFilterUpdate(){
    // repopulate filtered_data by hero selection
    updateFilteredSelectionByHero();
    // further filter by game mode and lobby type
    filtered_data.matches = filtered_data.matches.filter(function(d){if((selected_modes.indexOf(d2.getGameModeInfo(d.game_mode).short_name) >= 0)&& (selected_lobby_modes.indexOf(d2.getLobbyInfo(d.lobby_type).short_name) >= 0)) return 1;});

    updateGraphs(filtered_data);
}

// reset selected heroes in the filter for user change - all to unselected
function resetSelectedHeroes(){
    d3.selectAll(".pic.selected").classed("selected", false).style("border", "2px solid black");
}

draw_win_loss();

draw_item_percent();

draw_gpm();

draw_xpm();

draw_user_interact();

function loadData(username) {

    d2.loadUserData(username, function(error,data) {

        user_data = data;
        filtered_data = data;

        // clear the filtered heroes and game modes
        selectedarr = [];
        resetGameMode();
        initGameMode();
        resetLobby();
        initLobby();
        resetSelectedHeroes();


        create_timeline(user_data);
        // updateGraphs(user_data)
        // filter out random modes etc. and updateGraphs
        tripleFilterUpdate();
    })
}

function updateGraphs (filtered_data) {

    //FOR VIDEO. DO NOT DELETE.
    // var angela_video_data = filtered_data;

    // var angela_matches = angela_video_data.matches;

    // for (var i = 0; i < angela_matches.length; i++) {
    // 	if (i%2 == 0) {
    // 		angela_matches[i].player_win = true;
    // 	}
    // 	if (i%5 == 0) {
    // 		angela_matches[i].player_win = true;
    // 	}

    // 	var all_players = angela_matches[i].players;

    // 	if (all_players.length == 10) {
    // 		for (var j = 0; j < 10; j++) {
    // 			var account_id_num = all_players[j].account_id;
    // 			if (account_id_num == 112495792) {
    // 				if (j%5 != 0) {
    // 					angela_matches[i].player_win = false;
    // 				}
    // 			}
    // 		}
    // 	}
    // }



    //FOR VIDEO. DO NOT DELETE.
    // var robbie_video_data = filtered_data;

    // var robbie_matches = robbie_video_data.matches;

    // for (var i = 0; i < robbie_matches.length; i++) {
    // 	if (robbie_matches[i].player_win == true) {
    // 		if (i%3 == 0) {
    // 			robbie_matches[i].player_win = false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id != 21) {
    // 			if (i%5 == 0) {
    // 				robbie_matches[i].player_info.hero_id = 22
    // 			}
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id == 32) {
    // 			robbie_matches[i].player_info.hero_id = 21
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id == 88) {
    // 			robbie_matches[i].player_info.hero_id = 21
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id == 29) {
    // 			robbie_matches[i].player_info.hero_id = 21
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id == 62) {
    // 			robbie_matches[i].player_info.hero_id = 21
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 		if (robbie_matches[i].player_info.hero_id == 39) {
    // 			robbie_matches[i].player_info.hero_id = 21
    // 			robbie_matches[i].player_win == false;
    // 		}
    // 	}
    // 	if (robbie_matches[i].player_info.item_0 == 102) {
    // 		if (i != 0 && robbie_matches[i].player_info.hero_id == 21) {
    // 			robbie_matches[i].player_win = true
    // 		}
    // 	}
    // 	if (robbie_matches[i].player_info.item_1 == 102) {
    // 		if (i != 0 && robbie_matches[i].player_info.hero_id == 21) {
    // 			robbie_matches[i].player_win = true;
    // 		}
    // 	}
    // 	if (robbie_matches[i].player_info.item_2 == 102) {
    // 		if (i != 0 && robbie_matches[i].player_info.hero_id == 21) {
    // 			robbie_matches[i].player_win = true
    // 		}
    // 	}
    // 	if (robbie_matches[i].player_info.item_3 == 102) {
    // 		if (i != 0 && robbie_matches[i].player_info.hero_id == 21) {
    // 			robbie_matches[i].player_win = false;
    // 		}
    // 	}

    // 	if (robbie_matches[i].player_info.item_0 == 180) {
    // 		robbie_matches[i].player_info.item_0 = 151
    // 		robbie_matches[i].player_win = false;
    // 	}
    // 	if (robbie_matches[i].player_info.item_1 == 180) {
    // 		robbie_matches[i].player_info.item_1 = 151
    // 		robbie_matches[i].player_win = false;
    // 	}
    // 	if (robbie_matches[i].player_info.item_2 == 180) {
    // 		robbie_matches[i].player_info.item_2 = 151
    // 		robbie_matches[i].player_win = false;
    // 	}
    // 	if (robbie_matches[i].player_info.item_3 == 180) {
    // 		robbie_matches[i].player_info.item_3 = 151
    // 		robbie_matches[i].player_win = false;
    // 	}
    // 	if (robbie_matches[i].player_info.item_4 == 180) {
    // 		robbie_matches[i].player_info.item_4 = 151
    // 		robbie_matches[i].player_win = false;
    // 	}
    // }



    //update function calls
    update_win_loss(filtered_data);

    update_item_percent(filtered_data);

    hero_pie(update_flare(filtered_data));

    create_matrix(filtered_data);

    update_gpm(filtered_data);

    update_xpm(filtered_data);

    update_user_interact(filtered_data);

    update_timeline(filtered_data);

    // draw_kda(filtered_data);

    //update chord diagram
    d3.select("input[name=hero_filter]").on("change", function() {
        d3.select("#hero_filter .filterInput").text(this.value);
        rerender(filtered_data);
    });

    updateRecords(filtered_data);

    // exit the end screen when we change the filter
    exit_end_screen();
}


// jQuery tooltip helper adapted from: http://www.davidjrush.com/blog/2011/12/simple-jquery-tooltip/
$(document).ready(function ()
{
    $("span.question").click(function ()
    {
        if ($( ".graph_description" ).length == 0) {
            $(this).append('<div class="graph_description">' +
                '<p><strong>Win-Loss Percentage:</strong> Win-loss percentage for current selected data <br></p>' +
                '<p><strong>Heroes Played:</strong> Heroes played grouped by their primary attribute- agility, intelligence, or strength, and ordered by the number of games in which you’ve played them. This graph is colored by primary attribute. <br></p>' +
                '<p><strong>Heroes Played Together Most Often:</strong> This graph shows which heroes have appeared together on the same team most frequently. Heroes are represented as arcs on the circumference of the circle, colored by primary attribute, and are linked by chords. These chords represent the number of games in which both heroes appeared on the same team. This graph is filterable to set a lower bound on the number of games in which the heroes appeared together, on the same team. <br></p>' +
                '<p><strong>Items Purchased as Percentage of Games Played:</strong> Percentage of games in which you ended the game with a given item. Bars are colored by win rate with that item- gray if the win rate is around 50%, red if win rate is low, and green if win rate is high. Sorting can be conducted by percentage, alphabetically by item name, and item cost (dropped items, such as Aegis and Cheese, sort as infinite cost). <br></p>' +
                '<p><strong>GPM Statistics:</strong> Scatterplot of GPM of hero for a given game against average GPM while playing that hero. Games falling above the line indicate that GPM this game was higher than average, while games falling below the line indicate that GPM this game was lower than average. Games are colored by win/loss. <br></p>' +
                '<p><strong>XPM Statistics:</strong> Scatterplot of XPM of hero for a given game against average XPM while playing that hero. Games falling above the line indicate that XPM this game was higher than average, while games falling below the line indicate that GPM this game was lower than average. Games are colored by win/loss. <br></p>' +
                "<p><strong>Users Played with More than Once:</strong> Bubble graph, where bubbles are sized by number of games played together. Users played with only once are not shown. Users can be colored in two ways: by number of games played with you, or by your winrate playing with them. Clicking on the user bubble takes you to their Steam homepage. <br></p>" +
                '</div>');
            $(this).addClass( "question-selected" )
        } else {
            $( ".graph_description" ).remove()
            $(this).removeClass( "question-selected" )
        }
    })
});

//win loss rect graph
//transition working
function draw_win_loss() {

    win_loss_graph.append("rect")
        .attr("width", bb_win_loss.w)
        .attr("height", bb_win_loss.h)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "loss_rect")
        .attr("class", "loss");

    win_loss_graph.append("rect")
        .attr("width", bb_win_loss.w/2)
        .attr("height", bb_win_loss.h)
        .attr("x", 0)
        .attr("id", "win_rect")
        .attr("y", 0)
        .attr("class", "win");

    win_loss_graph
        .append("text")
        .attr("x", -65)
        .attr("y", 20)
        .attr("class", "win text")
        .attr("text-anchor", "start")
        .text("HWELLO!!!")
        .style("fill", "black");

    win_loss_graph
        .append("text")
        .attr("x", 315)
        .attr("y", 20)
        .attr("class", "loss text")
        .attr("text-anchor", "end")
        .text("HWELLO!!!")
        .style("fill", "black");

    win_loss_graph.append("text")
        .attr("transform", "translate(130,-10)")
        .attr("text-anchor", "middle")
        .text("Win-Loss Percentage")
        .style("font-weight", null);
}

//update the win loss graph if user filters data
function update_win_loss(data) {

    var win_count = 0;
    var total_matches = data.matches.length;

    data.matches.map(function(d,i) {
        if (d.player_win == true) {
            win_count += 1;
        }
    });

    if (d3.select(".win_loss").attr("visibility") == "hidden") {
        var duration = 0;
    }
    else {
        duration = 1000;
    }

    if (isNaN((win_count/total_matches)*bb_win_loss.w) == false) {
        d3.select("rect.win")
            .transition()
            .duration(duration)
            .attr("width", (win_count/total_matches)*bb_win_loss.w);
    }
    else {
        d3.select("rect.win")
            .transition()
            .duration(duration)
            .attr("width", 0);
    }

    if (win_count != 0) {
        d3.select(".win.text")
            .text(((win_count/total_matches) * 100).toFixed(1) + "%");

        d3.select(".loss.text")
            .text(((total_matches - win_count)/total_matches * 100).toFixed(1) + "%");
    }
    else {
        d3.select(".win.text")
            .text("No data");
        d3.select(".loss.text")
            .text("No data");
    }

}


function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function hero_pie_transition(data){

    hero_pie_path
        .data(data)
        .exit()
        .transition()
        .attr("visibility", "hidden")
        .remove();

    hero_pie_path
        .data(data)
        .enter()
        .append("path")
        .attr("class", "hero_pie")
        .attr("visibility", "visible")
        .on("click", click)
        .on("mouseover", function(d) {

            var tooltip = true;

            var name;
            var number_text;

            if (d.value == 1) {
                number_text = " game";
            }
            else {
                number_text = " games"
            }

            if ("dname" in d) {
                name = d.dname;
            }
            else if (d.name == "flare") {
                tooltip = false
            }
            else {
                name = capitalizeFirstLetter(d.name) + " Heroes";
            }

            var basic_tip = "<div id='tooltip_text'><strong>"+ name +"</strong>"+ "<br>" + d.value + number_text + "</br></div>";

            if ("dname" in d) {
                var img_tip = "<div id='hero_sunburst_tip'><img src='" + d.img + "'' width='64px' height='36px'></div>";
            }
            else {
                var img_tip = "";
            }

            graph_tip.html(img_tip + basic_tip);

            if (tooltip) {
                graph_tip.show(d);
            }

            d3.select(this)
                .style("fill", "aquamarine");
        })
        .on("mouseout", function(d) {
            graph_tip.hide(d);

            d3.select(this)
                .style("fill", function(d) { return color((d.children ? d : d.parent).name); });
        })
        .transition()
        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        .attr("d", hero_pie_arc);
}

function click(d) {
    hero_pie_path.transition()
        .duration(750)
        .attrTween("d", clickArcTween(d))
};

// Interpolate the scales!
function clickArcTween(d) {
    var xd = d3.interpolate(hero_pie_x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(hero_pie_y.domain(), [d.y, 1]),
        yr = d3.interpolate(hero_pie_y.range(), [d.y ? 20 : 0, hero_pie_radius]);
    return function(d, i) {
        return i
            ? function(t) { return hero_pie_arc(d); }
            : function(t) { hero_pie_x.domain(xd(t)); hero_pie_y.domain(yd(t)).range(yr(t)); return hero_pie_arc(d); };
    };
}

function findLargest3(array1){
// sort descending

    array1.sort(function(a,b) {
        if (a[1] < b[1]) { return 1; }
        else if (a[1] == b[1]) { return 0; }
        else { return -1; }
    });

    return array1.slice(0,3)
}

//creates hero sunburst graph based on hero flare json data
function hero_pie(flare) {

    for (var i = 0; i < hero_flare.children.length; i++) {

        for (var j = 0; j < hero_flare.children[i].children.length; j++) {

            var current_children = hero_flare.children[i].children[j];

            if ("items" in current_children) {

                var max_item_array = [];

                for (var k = 0; k < hero_flare.children[i].children[j].items.length; k ++) {

                    var current_item = hero_flare.children[i].children[j].items[k];

                    max_item_array.push([current_item.dname, current_item.number]);

                }

            }

            hero_flare.children[i].children[j].item_max = findLargest3(max_item_array)

        }
    }

    hero_pie_radius = Math.min(bb_hero_pie.w, bb_hero_pie.h) / 2;

    hero_pie_color = d3.scale.ordinal()
        .domain(["flare","agility", "strength", "intelligence"])
        //get them to be the correct dota colors
        .range(["white", "#2BAC00", "#E38800","#1A88FC"])
    //.range(["white","#167c13", "#b9500b", "#257dae"]);

    hero_pie_x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    hero_pie_y = d3.scale.sqrt()
        .range([0, hero_pie_radius]);

    partition = d3.layout.partition()
        .value(function(d) { return d.games_played; });

    var zero_arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(0)
        .innerRadius(function(d) { return Math.max(0, hero_pie_y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, hero_pie_y(d.y + d.dy)); });

    hero_pie_arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, hero_pie_x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, hero_pie_x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, hero_pie_y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, hero_pie_y(d.y + d.dy)); });

    hero_pie_path = hero_pie_graph.selectAll("path")
        .data(partition.nodes(flare), function (d) { return d.name });

    hero_pie_path
        .enter().append("path")
        .attr("class", "hero_pie")
        .attr("d", zero_arc)
        .on("click", click)
        .on("mouseover", function(d) {

            var tooltip = true;

            var name;
            var number_text;

            if (d.value == 1) {
                number_text = " game";
            }
            else {
                number_text = " games"
            }

            if ("dname" in d) {
                name = d.dname;
            }
            else if (d.name == "flare") {
                tooltip = false
            }
            else {
                name = capitalizeFirstLetter(d.name) + " Heroes";
            }

            var basic_tip = "<div id='tooltip_text'><strong>"+ name +"</strong>"+ "<br>" + d.value + number_text + "</br></div>";

            if ("item_max" in d) {

                //if buy less than three items, you noob or maybe doob. No item array for you!
                if (d.item_max.length < 3) {
                    basic_tip = "<div id='tooltip_text'><strong>"+ name +"</strong>"+ "<br>" + d.value + number_text + "</br></div>";
                }

                else {

                    var item_text1, item_text2, item_text3;

                    //look i has a ternary
                    item_text1 = (d.item_max[0][1] == 1) ? "time" : "times";
                    item_text2 = (d.item_max[1][1] == 1) ? "time" : "times";
                    item_text3 = (d.item_max[2][1] == 1) ? "time" : "times";

                    basic_tip = "<div id='tooltip_text'><strong>"+ name +"</strong>"+ "<br>" + d.value + number_text + "</br>" + "<br><strong>Most bought items: </strong><br>" + d.item_max[0][0] + ", " + d.item_max[0][1] + " " + item_text1 + "<br>" + d.item_max[1][0] + ", " + d.item_max[1][1] + " " + item_text2 + "<br>" + d.item_max[2][0] + ", " + d.item_max[2][1] + " " + item_text3 + "</br></div>";
                }
            }

            if ("dname" in d) {
                var img_tip = "<div id='hero_sunburst_tip'><img src='" + d.img + "'' width='64px' height='36px'></div>";
            }
            else {
                var img_tip = "";
            }

            graph_tip.html(img_tip + basic_tip);

            if (tooltip) {
                graph_tip.direction('e')
                graph_tip.show(d);
            }

            d3.select(this)
                .style("fill", "aquamarine");
        })
        .on("mouseout", function(d) {
            graph_tip.hide(d);
            graph_tip.direction('n');

            d3.select(this)
                .style("fill", function(d) { return hero_pie_color((d.children ? d : d.parent).name); });
        })
        .each(stash); // store the initial angles

    hero_pie_path
        .style("fill", "white")
        .transition()
        .duration(1000)
        .attrTween("d", heroPieArcTween)
        .style("fill", function(d) {
            return hero_pie_color((d.children ? d : d.parent).name); });

    d3.select(self.frameElement).style("height", height + "px");

    hero_pie_graph.selectAll("text").remove();

    hero_pie_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -bb_hero_pie.h/2 - 30)
        .text("Heroes Played");

    hero_pie_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -bb_hero_pie.h/2 - 10)
        .style("font-size", "12px")
        .text("Click center to zoom out. Click arcs to zoom in.");

}

// the below functions for arc interpolation come from
// http://johan.github.io/d3/ex/sunburst.html

// Stash the old values for transition.
function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function heroPieArcTween(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function(t) {
        var b = i(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return hero_pie_arc(b);
    };
}

// update the hero_flare to contain the counts for `data`
function update_flare(data) {

    // heroes
    // zero counts
    for (var i = 0; i < hero_flare.children.length; i++) {
        for (var j = 0; j < hero_flare.children[i].children.length; j++) {
            hero_flare.children[i].children[j].games_played = 0;
            hero_flare.children[i].children[j].items = [];

            // for (var k = 0; k < hero_flare.children[i].children[j].items.length; k++) {
            // 	hero_flare.children[i].children[j].items[k].number = 0;
            // }

        }
    }

    data.matches.forEach(function(d,i) {

        var current_hero = d2.getHeroInfo(d.player_info.hero_id)

        // find which child array holds the heroes for this stat
        var children_pos = hero_flare.children.map(function (d) { return d.name }).indexOf(current_hero.stat);
        var cur = hero_flare.children[children_pos].children;

        // find which element of that array holds this hero
        var hero_pos = cur.map(function (d) { return d.dname }).indexOf(current_hero.dname)
        cur[hero_pos].games_played += 1;

    })

    //deep copy attempts
    //item_flare = jQuery.extend(true, {}, hero_flare);
    //item_flare = JSON.parse(JSON.stringify(hero_flare));

    //get items to each hero and enumerate a count
    for (var i = 0; i < data.matches.length; i++) {

        if (data.matches[i].players.length == 5) {
            continue;
        }

        for (var j = 0; j < 6; j++) {

            var current_item = d2.getItemInfoCopy(data.matches[i].player_info["item_"+j]);

            if (current_item.dname == "empty") {
                continue;
            }
            var current_hero = d2.getHeroInfo(data.matches[i].player_info.hero_id);

            // find which child array holds the heroes for this stat
            var children_pos = hero_flare.children.map(function (d) { return d.name }).indexOf(current_hero.stat);
            var cur = hero_flare.children[children_pos].children;

            // find which element of that array holds this hero
            var hero_pos = cur.map(function (d) { return d.dname }).indexOf(current_hero.dname)

            if (!("items" in cur[hero_pos])) {
                cur[hero_pos]["items"] = [];
            }

            var item_pos = cur[hero_pos].items.map(function(d) {return d.name}).indexOf(current_item.name);

            if (item_pos == -1) {
                current_item.number = 1;
                cur[hero_pos]["items"].push(current_item);
            }
            else {
                cur[hero_pos]["items"][item_pos].number += 1;
            }
        }

    }

    return hero_flare;
}


//draws the item percent bar chart
function draw_item_percent() {

    var formatPercent = d3.format(".0%");

    item_percent_color = d3.scale.linear();

    item_percent_x = d3.scale.ordinal()
        .rangeBands([0, bb_item_percent.w], .3 , .5)
        .domain(["item1"]);

    item_percent_y = d3.scale.linear()
        .range([bb_item_percent.h,0])

    item_percent_xAxis = d3.svg.axis()
        .scale(item_percent_x)
        .orient("bottom")
        .ticks(0);

    item_percent_yAxis = d3.svg.axis()
        .scale(item_percent_y)
        .orient("left")
        .tickFormat(formatPercent);

    item_percent_graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bb_item_percent.h + ")")
        .call(item_percent_xAxis);

    item_percent_graph.append("g")
        .attr("class", "y axis")
        .call(item_percent_yAxis);

    item_percent_graph.append("g")
        .attr("class", "bars")

    item_percent_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -40)
        .attr("x", 350)
        .text("Items Purchased as Percentage of Games Played");

}


function draw_legend(graph) {

    graph.selectAll(".legend").remove();

    var gradient = graph.append("svg:defs")
        .attr("class", "grad")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    if ($("#color-blind").is(":checked")) {
        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", "#762a83")
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "50%")
            .attr("stop-color", "#8d8d8d")
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ff7f00")
            .attr("stop-opacity", 1);
    }

    else {
        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", "#1a9641")
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "50%")
            .attr("stop-color", "#8d8d8d")
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#d7191c")
            .attr("stop-opacity", 1);
    }

    graph.append("svg:rect")
        .attr("class", "grad")
        .attr("width", 150)
        .attr("height", 25)
        .attr("x", 246)
        .attr("y", -30)
        .style("fill", "url(#gradient)")
        .style("stroke-width", "1px")
        .style("stroke", "white")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    graph.append("text")
        .attr("x", 243)
        .attr("y", -15)
        .attr("class", "legend")
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .text("100% win")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    graph.append("text")
        .attr("class", "legend")
        .attr("x", 460)
        .attr("y", -15)
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .text("100% loss")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);
}


//updates the item percent bar chart based on user's data selection
function update_item_percent(data) {

    //console.log(data)

    var items = []

    //initialize all items with a count of 0
    d3.json("data/items.json", function(error,dat) {

        //for coloring by cost
        // var extent_array = [];

        // for (id in dat) {
        // 	extent_array.push(dat[id].cost);
        // }

        if (isChecked) {
            item_percent_color.range(["#762a83","#ff7f00"])
        }
        else {
            item_percent_color.range(["#d7191c","#1a9641"])
        }

        for (id in dat) {
            dat[id].count = 0;
            dat[id].num_wins = 0;
            dat[id].hero_array = [];
        }

        var total_count = data.matches.length;

        //count all of the items
        data.matches.forEach(function(d,i) {
            for (j in dat) {

                var hero = d.player_info.hero_id;

                var index = dat[j].hero_array.map(function(d){return d[0]}).indexOf(hero);

                if (dat[j].id == d.player_info.item_0) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }
                }
                else if (dat[j].id == d.player_info.item_1) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }

                }
                else if (dat[j].id == d.player_info.item_2) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }
                }
                else if (dat[j].id == d.player_info.item_3) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }
                }
                else if (dat[j].id == d.player_info.item_4) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }
                }
                else if (dat[j].id == d.player_info.item_5) {
                    dat[j].count += 1;
                    if (d.player_win == true) {
                        dat[j].num_wins += 1;
                    }

                    if (index == -1) {
                        dat[j].hero_array.push([hero, 1]);
                    }
                    else {
                        dat[j].hero_array[index][1] += 1;
                    }
                }
            }
        })

        //consolidate into correct form that we want
        for (k in dat) {
            if (dat[k].count != 0 && dat[k].name != "empty") {
                dat[k].percent = dat[k].count/total_count;
                dat[k].winrate = (dat[k].num_wins/dat[k].count);
                items.push(dat[k])
            }
        }

        var extent_array = [];
        for (id in dat) {
            extent_array.push(dat[id].winrate);
        }

        //item_percent_color.domain(d3.extent(extent_array));
        item_percent_color.domain([0,.5,1])
        if ($("#color-blind").is(":checked")) {
            item_percent_color.range(["#ff7f00", "#8d8d8d", "#762a83"]);
        }
        else {
            item_percent_color.range(["#d7191c", "#8d8d8d", "#1a9641"]);
        }

        if (d3.select(".item_percent").attr("visibility") == "hidden") {
            var duration = 0;
        }
        else {
            duration = 1000;
        }

        item_percent_x.domain(items.map(function(d) {
            return d.name;
        }));
        item_percent_y.domain([0, d3.max(items, function(d) {
            return d.percent;
        })]);

        var bars = item_percent_graph.select(".bars")
            .selectAll(".bar")
            .data(items, function(d) {
                return d.name;
            })

        bars.exit()
            .transition()
            .duration(500)
            .attr("width", 0)
            .remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) {
                //console.log(d)
                //console.log(d.winrate)
                return item_percent_color(d.winrate);
            })
            .attr("x", 0)
            .attr("y", bb_item_percent.h)
            .attr("height", 0)
            .on("mouseover", function(d) {

                if (d.dname == "Aegis of the Immortal" || d.dname == "Cheese") {
                    var cost = "Dropped Item";
                }
                else {
                    cost = d.cost
                }

                //console.log(d)

                //for video
                // if (d.dname == "Force Staff") {
                // 	d.winrate = .96;
                // }
                // if (d.dname == "Armlet of Mordiggian") {
                // 	d.winrate = .037
                // }

                var basic_tip = "<div id='tooltip_text'><strong><span style='color:red';>" + d.dname +
                    "</span></strong>" + "<br> Number of Games: " + d.count +
                    "<br> Cost: " + cost + "<br> Winrate: " + (100*d.winrate).toFixed(1) +
                    "%<br></div>"
                var img_tip = "<div id='item_percent_tooltip_img'><img src='" + d.img + "' height='40px' width='53.125px'></div>"

                var most_purchased = "<br><div id='item_percent_tooltip_most_purchased'><strong>Most purchased on: </strong><br>";

                var topthree = findLargest3(d.hero_array);

                for (var i = 0; i < topthree.length; i++) {
                    var img_text = "<img src='" + d2.getHeroInfo(topthree[i][0]).img + "' height='36px' width='64px'>"
                    most_purchased = most_purchased + img_text
                }

                most_purchased = most_purchased + "</div>"

                graph_tip.html(img_tip + basic_tip + most_purchased);
                graph_tip.show(d);
            })
            .on("mouseout", function(d) {
                graph_tip.hide(d);
            })
            .transition().duration(duration);

        bars
            .transition()
            .duration(duration)
            .attr("x", function(d) {
                return item_percent_x(d.name);
            })
            .attr("y", function(d) {
                return item_percent_y(d.percent);
            })
            .attr("height", function(d) {
                return bb_item_percent.h - item_percent_y(d.percent);
            })
            .attr("width", item_percent_x.rangeBand)
            .attr("fill", function(d) {
                return item_percent_color(d.winrate);
            });

        item_percent_graph.select(".y.axis")
            .transition()
            .duration(duration)
            .call(item_percent_yAxis);

        item_percent_graph.select(".x.axis")
            .transition()
            .duration(duration)
            .call(item_percent_xAxis);

        draw_legend(item_percent_graph);

    })

    //sorting by value

    d3.select("input#value").on("change", change);

    var sortTimeout = setTimeout(function() {
        d3.select("input#value").property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = item_percent_x.domain(items.sort(this.checked
            ? function(a, b) { return b.percent - a.percent; }
            : function(a, b) { return d3.ascending(a.name, b.name); })
            .map(function(d) { return d.name; }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function(d, i) { return i * 10; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.name); });

        transition.select(".x.axis")
            .call(item_percent_xAxis)
            .selectAll("g")
            .delay(delay);
    }

    //sorting by item

    d3.select("input#item").on("change", change_item);

    function change_item() {

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = item_percent_x.domain(items.sort(this.checked
            ? function(a, b) { return d3.ascending(a.name, b.name); }
            : function(a, b) { return d3.ascending(a.percent, b.percent); })
            .map(function(d) { return d.name; }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function(d, i) { return i * 10; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.name); });

        transition.select(".x.axis")
            .call(item_percent_xAxis)
            .selectAll("g")
            .delay(delay);
    }

    //sorting by cost

    d3.select("input#cost").on("change", change_cost);

    function change_cost() {

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = item_percent_x.domain(items.sort(this.checked
            ? function(a, b) {
            if (a.dname == "Aegis of the Immortal" || a.dname == "Cheese") {
                a.cost = 100000;
            }
            if (b.dname == "Aegis of the Immortal" || b.dname == "Cheese") {
                b.cost = 100000;
            }
            return d3.ascending(a.cost, b.cost);
        }
            : function(a, b) { return d3.ascending(a.name, b.name); })
            .map(function(d) { return d.name; }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function(d, i) { return i * 10; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.name); });

        transition.select(".x.axis")
            .call(item_percent_xAxis)
            .selectAll("g")
            .delay(delay);
    }
}

function k_combinations(set, k) {
    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i+1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}


function create_matrix (data) {

    var filter_value = d3.select("input[name=hero_filter]")[0][0].value;
    //d3.select("input[name=hero_filter]")[0][0].value;

    var matrix = [];

    for (var k = 0; k < 111; k++) {
        var new_array = [];
        for (var l = 0; l < 111; l++) {
            new_array.push(0);
        }
        matrix.push(new_array);
    }

    for (var i = 0; i < data.matches.length; i++) {

        var set = [];
        var gamemode = data.matches[i].game_mode;
        var continue_on = false;

        //filter out gamemodes we don't want, like ones with five players, etc.
        if (gamemode == 15 || gamemode == 7 || gamemode == 0 ||
            gamemode == 6 || gamemode == 8 || gamemode == 9 ||
            gamemode == 10 || gamemode == 11 || gamemode == 12 ||
            gamemode == 13 || gamemode == 14 || gamemode ==  15 || gamemode == 18) {
            continue;
        }

        //filter out games with less than 10 players
        if (data.matches[i].players.length < 10) {
            continue;
        }

        //filter out games where a player did not pick a hero
        data.matches[i].players.map(function(d) {
            if (d.hero_id == 0) {
                continue_on = true;
            }
        })

        if (continue_on == true) {
            continue;
        }

        for (var j = 0; j < 9; j++) {
            set.push(data.matches[i].players[j].hero_id);
        }

        var combinations_rad = k_combinations(set.slice(0,5),2);
        var combinations_dire = k_combinations(set.slice(5,10),2);

        for (var c = 0; c < combinations_rad.length; c ++) {
            matrix[combinations_rad[c][0]][combinations_rad[c][1]] += 1;
            matrix[combinations_rad[c][1]][combinations_rad[c][0]] += 1;
        }
        for (var c = 0; c < combinations_dire.length; c ++) {
            matrix[combinations_dire[c][0]][combinations_dire[c][1]] += 1;
            matrix[combinations_dire[c][1]][combinations_dire[c][0]] += 1;
        }
    }

    var new_dict = {};
    var lookup_dict = {};
    var counter = 0;
    var new_arr = [];


    for (var y = 1; y < 111; y ++) {
        for (var z = 1; z < 111; z++) {
            if (matrix[y][z] <= filter_value) {
                matrix[y][z] = 0;
            }
            else {
                //it stays
                // if (y == 24 || z == 24) {
                // 	// console.log(y,z)
                // 	// console.log(matrix[y][z])
                // }
                if (!(y in new_dict)) {
                    new_dict[y] = counter;
                    new_arr[counter] = [];
                    lookup_dict[counter] = y;
                    counter++;
                }
                if (!(z in new_dict)) {
                    new_dict[z] = counter;
                    new_arr[counter] = [];
                    lookup_dict[counter] = z;
                    counter++;
                }
                new_arr[new_dict[y]][new_dict[z]] = matrix[y][z];
            }
        }
    }

    for (var i = 0; i < new_arr.length; i++) {
        for (var j = 0; j < new_arr.length; j++){
            if (new_arr[i][j] === undefined) {
                new_arr[i][j] = 0;
            }
        }
    }

    d3.selectAll(".chord").remove();
    d3.selectAll(".arcs").remove();

    draw_hero_chord_graph(new_arr, lookup_dict);
}


var chord_tip = d3.select("#hero_chord_container").append("div").attr("class", "chordtip hidden")


function draw_hero_chord_graph(matrix, lookup_dict) {

    hero_chord_graph.selectAll("text").remove();
    hero_chord_graph.selectAll(".error_message").remove();

    if (matrix.length == 0) {
        hero_chord_graph.append("text")
            .attr("class", "error_message")
            .attr("x", -100)
            .attr("y", 0)
            .style("font-size", "12px")
            .text("Sorry, no data meets your selection criteria.");
    }

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var hero_chord_width = bb_hero_chord.w,
        hero_chord_height = bb_hero_chord.h,
        innerRadius = Math.min(hero_chord_width, hero_chord_height) * .41,
        outerRadius = innerRadius * 1.1;

    var fill = d3.scale.ordinal()
        .domain(["agility", "strength", "intelligence"])
        .range(["#2BAC00", "#E38800","#1A88FC"]);

    var groupings = [];

    for (var i = 0; i < chord.groups().length; i++) {
        chord.groups()[i].hero_id = lookup_dict[chord.groups()[i].index]
    }

    var arcs = hero_chord_graph.append("g").attr("class","arcs").selectAll("path")
        .data(chord.groups)
        .enter()
        .append("path")
        .on("mouseover", function(d,i) {

            var hero_info = d2.getHeroInfo(d.hero_id);

            var basic_tip = "<div id='tooltip_text'><strong>"+ hero_info.dname +"</strong></div>";

            var img_tip = "<div id='hero_sunburst_tip'><img src='" + hero_info.img + "'' width='64px' height='36px'></div>";

            graph_tip.html(img_tip + basic_tip);

            graph_tip.direction('e');
            graph_tip.show(d);

            fade(.1)(d,i);

        })
        .on("mouseout", function(d,i){
            graph_tip.direction('n');
            graph_tip.hide(d);
            fade(.7)(d,i);

        })
        .style("fill", function(d) {
            //console.log(d)
            //console.log(lookup_dict)
            return fill(d2.getHeroInfo(d.hero_id).stat);
        })
        .style("opacity", 0)
        .transition().duration(1000)
        .style("opacity", 1)
        .style("stroke", "white")
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))

    hero_chord_graph.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter()
        .append("path")
        .style("fill", function(d) {
            return fill(d2.getHeroInfo(lookup_dict[d.target.index]).stat);
        })
        .style("opacity", 0)
        .on("mouseover", function(d) {
            var mouse = d3.mouse(svg_hero_chord.node()).map( function(d) { return parseInt(d); } );

            //toggle the hide on the tooltip
            chord_tip.classed("hidden", false)
                .attr("z-index", "10000")
                .attr("style", "left:"+(mouse[0]+50)+"px;top:"+(mouse[1]+50)+"px")
                .html(function(e){

                    var source = d.source.index;
                    var target = d.target.index;

                    var name1 = d2.getHeroName(chord.groups()[source].hero_id);
                    var name2 = d2.getHeroName(chord.groups()[target].hero_id);

                    return name1 + " - " + name2 + "<br>Number of Games: " + d.source.value
                });
        })
        .on("mouseout", function(d){
            chord_tip.classed("hidden", true);
        })
        .transition().duration(1000)
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("opacity", .7);

    hero_chord_graph
        .append("text")
        .attr("y", -270)
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text("Heroes Played Together Most Often");

    hero_chord_graph
        .append("text")
        .attr("y", -245)
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text("Hover over circle arc to highlight a hero.")
        .style("fill", "black")
        .style("font-size", "12px");

    hero_chord_graph
        .append("text")
        .attr("y", -230)
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text("Hover over a chord to see the number of games between two heroes.")
        .style("fill", "black")
        .style("font-size", "12px");

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
        return function(g, i) {
            //console.log(i)
            hero_chord_graph.selectAll(".chord path")
                .filter(function(d) {
                    //console.log(d)
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
        };
    }

}

function rerender(data) {

    d3.selectAll(".chord")
        .transition()
        .style("opacity", 0)
        .duration(1000)
        .remove();

    d3.selectAll(".arcs")
        .transition()
        .style("opacity", 0)
        .duration(1000)
        .remove();

    create_matrix(data);

}

var gpm_x, gpm_y, gpm_color, gpm_xAxis, gpm_yAxis;
var gpm_xdomain, gpm_ydomain;

function draw_gpm() {
    gpm_x = d3.scale.linear()
        .range([0, bb_gpm.w]);

    gpm_y = d3.scale.linear()
        .range([bb_gpm.h, 0]);

    if ($("#color-blind").is(":checked")) {
        gpm_color = d3.scale.ordinal()
            .domain([true, false])
            .range(["#762a83", "#ff7f00"]);
    }
    else {
        gpm_color = d3.scale.ordinal()
            .domain([true, false])
            .range(["#1a9641", "#d7191c"]);
    }

    gpm_xAxis = d3.svg.axis()
        .scale(gpm_x)
        .orient("bottom");

    gpm_yAxis = d3.svg.axis()
        .scale(gpm_y)
        .orient("left");

    gpm_graph.append("defs").append("clipPath")
        .attr("transform", "translate(0,-5)")
        .attr("id", "gpm_clip")
        .append("rect")
        .attr("width", bb_gpm.w)
        .attr("height", bb_gpm.h+5);

    gpm_graph.append("g")
        .attr("class", "gpm_brush");

    gpm_graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bb_gpm.h + ")")
        .call(gpm_xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 0)
        .attr("x", bb_gpm.w)
        .attr("dy", "-.71em")
        .style("text-anchor", "end")
        .text("Average GPM of hero");

    gpm_graph.append("g")
        .attr("class", "y axis")
        .call(gpm_yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GPM of hero in game");

    if (isNaN(gpm_x(1)) == false) {
        gpm_graph.append('line')
            .attr("class", "forty-five")
            .attr('x1', gpm_x(0))
            .attr('x2', gpm_x(1))
            .attr('y1', gpm_y(0))
            .attr('y2', gpm_y(1))
            .style("stroke", "black")
            .style("stroke-width", "3px")
            .attr("clip-path", "url(#gpm_clip)");
    }

    d3.selectAll(".circle")
        .attr("clip-path", "url(#gpm_clip)");

    gpm_graph.append("text")
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("x", bb_gpm.w/2)
        .text("GPM Statistics")

    gpm_graph.append("text")
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("x", bb_gpm.w/2)
        .style("font-size", "12px")
        .text("Select a region to zoom in. Click 'Clear Zoom' to zoom out.")

    gpm_graph.append("text")
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("x", bb_gpm.w/2)
        .style("font-size", "12px")
        .text("Click on a game to bring up the corresponding endgame screen.")

}

var gpm_brush;

function update_gpm(data) {

    d3.select(".clear-button_gpm").remove();

    var gpm_dict = {};

    data.matches.map(function(d) {
        var player = d.player_info;
        if (!(player.hero_id in gpm_dict)) {
            gpm_dict[player.hero_id] = []
        }
        gpm_dict[player.hero_id].push(d);
    });

    var gpm_array = [];

    //now calculate all of the averages
    for (id in gpm_dict) {
        var total = gpm_dict[id].reduce(function(rest,match) {
            return (rest + match.player_info.gold_per_min);
        }, 0)
        var hero_average = total/gpm_dict[id].length;

        gpm_dict[id].map(function(d) {
            d.player_info.hero_avg_gpm = hero_average;
            gpm_array.push(d)
        });
    }

    var max_value = Math.max(
        d3.max(gpm_array, function(d) {
            return d.player_info.hero_avg_gpm;}),
        d3.max(gpm_array, function(d) {
            return d.player_info.gold_per_min;
        }));

    gpm_brush = d3.svg.brush()
        .x(gpm_x)
        .y(gpm_y)
        .on("brushend", gpm_brushend);

    gpm_xdomain = [0, max_value];
    gpm_ydomain = [0, max_value];

    gpm_x.domain(gpm_xdomain);
    gpm_y.domain(gpm_ydomain);

    d3.select(".gpm_brush").call(gpm_brush);

    // use match id to key data
    var datapoints = gpm_graph.selectAll(".dot")
        .data(gpm_array, function(d) { return d.match_id })

    datapoints.exit().remove();

    datapoints
        .enter().append("circle")
        .attr("class", function(d) {
            return (d.player_win) ? "dot win" : "dot loss"
        })
        .attr("match_id", function(d) { return d.match_id })
        .attr("cx", gpm_x(0))
        .attr("cy", gpm_y(0))
        .attr("r", 3.5)
        .on("mouseover", function(d) {
            // update dot styling
            var sel = d3.selectAll("[match_id='" + d.match_id + "']")
                .classed("match_dot_hover", true)
                .attr("r", 5);

            sel.moveToFront();

            //console.log(d.player_info.hero_avg_gpm)
            var format = d3.format(".2f");

            var text = "<strong>" + d2.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>GPM this Game: " + d.player_info.gold_per_min + "<br>Average GPM on this hero: " + format(d.player_info.hero_avg_gpm);

            //get the correct hero image and build the tooltip with an image
            var hero_data = d2.getHeroInfo(d.player_info.hero_id);

            var hero_image = hero_data.img;

            var img_tip = "<div id='scatter_tooltip_img'><img src='" + hero_image + "' height='40px' width='71.125px'></div>"

            graph_tip.html(img_tip + text);
            graph_tip.show(d)
        })
        .on("mouseout", function(d) {
            // update dot styling, but only if not selected
            if (d3.select(this).classed("end_screen_selected") == false) {
                d3.selectAll("#timeline .match_dot_hover").attr("r", 3)
                d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
            }

            // but we always want to remove the match_dot_hover class
            d3.selectAll("#timeline .match_dot_hover").classed("match_dot_hover", false)
            d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false)

            graph_tip.hide(d);
        })
        .on("click", update_end_screen)
        .attr("clip-path", "url(#gpm_clip)");

    datapoints
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
            return gpm_x(d.player_info.hero_avg_gpm)
        })
        .attr("cy", function(d) {
            return gpm_y(d.player_info.gold_per_min)
        });

    gpm_graph.select(".x.axis")
        .transition()
        .duration(1000)
        .call(gpm_xAxis);

    gpm_graph.select(".y.axis")
        .transition()
        .duration(1000)
        .call(gpm_yAxis);

    if (isNaN(gpm_x(max_value)) == false) {
        gpm_graph.select(".forty-five")
            .attr("x2", gpm_x(max_value))
            .attr("y2", gpm_y(max_value));
    }

}

var gpm_clear_button;

function gpm_brushend() {

    var gpm_x_domain = [gpm_brush.extent()[0][0], gpm_brush.extent()[1][0]]
    var gpm_y_domain = [gpm_brush.extent()[0][1], gpm_brush.extent()[1][1]]

    // equal domain ends means click on graph
    // coerce dates to numbers to check equality
    if (+gpm_x_domain[0] == +gpm_x_domain[1] && +gpm_y_domain[0] == +gpm_y_domain[1]) {
        return;
    }

    get_button = d3.select(".clear-button_gpm");
    if (get_button.empty() === true)
    {
        gpm_clear_button = gpm_graph.append("g")
            .attr("transform", "translate(" + (bb_gpm.w - 100) + "," + (bb_gpm.h - 440) + ")")
            .attr("class", "clear-button_gpm");

        gpm_clear_button.append("rect")
            .attr("width", 102)
            .attr("height", 20)
            .attr("y", -17)
            .attr("x", -4)
            .attr("rx", "10px")
            .attr("ry", "10px")
            .style("fill", "#9f9f9f");

        gpm_clear_button
            .append('text')
            .attr("y", 0)
            .attr("x", 0)
            .text("Clear Zoom")
            .style("fill", "black");
    }

    gpm_x.domain(gpm_x_domain);
    gpm_y.domain(gpm_y_domain);

    gpm_transition();

    d3.select(".gpm_brush").call(gpm_brush.clear());

    // add the on click events for the button
    gpm_clear_button.on('click', function ()
    {
        // reset everything
        gpm_x.domain(gpm_xdomain);
        gpm_y.domain(gpm_ydomain);

        gpm_transition();

        gpm_clear_button.remove();
    });

    function gpm_transition() {

        gpm_graph.select(".x.axis")
            .transition()
            .duration(1000)
            .call(gpm_xAxis);

        gpm_graph.select(".y.axis")
            .transition()
            .duration(1000)
            .call(gpm_yAxis);

        var x_vals = [];
        var y_vals = [];

        gpm_graph.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("cx",function(d) {
                x_vals.push(d.player_info.hero_avg_gpm);
                return (gpm_x(d.player_info.hero_avg_gpm));
            })
            .attr("cy",function(d) {
                y_vals.push(d.player_info.gold_per_min);
                return gpm_y(d.player_info.gold_per_min);
            });

        var max_arr = Math.max(
            d3.max(x_vals, function(d) {
                return d;
            }),
            d3.max(y_vals, function(d) {
                return d;
            }));

        if (isNaN(gpm_x.domain()[1]) == false) {
            gpm_graph.selectAll(".forty-five")
                .transition()
                .duration(1000)
                .attr("x1", gpm_x(0))
                .attr("y1", gpm_y(0))
                .attr("x2", gpm_x(max_arr))
                .attr("y2", gpm_y(max_arr));
        }
    }
}

var xpm_x, xpm_y, xpm_color, xpm_xAxis, xpm_yAxis;
var xpm_xdomain, xpm_ydomain;
var xpm_brush;

function draw_xpm() {
    xpm_x = d3.scale.linear()
        .range([0, bb_xpm.w]);

    xpm_y = d3.scale.linear()
        .range([bb_xpm.h, 0]);

    if ($("#color-blind").is(":checked")) {
        xpm_color = d3.scale.ordinal()
            .domain([true, false])
            .range(["#762a83", "#ff7f00"]);
    }
    else {
        xpm_color = d3.scale.ordinal()
            .domain([true, false])
            .range(["#1a9641", "#d7191c"]);
    }

    xpm_xAxis = d3.svg.axis()
        .scale(xpm_x)
        .orient("bottom");

    xpm_yAxis = d3.svg.axis()
        .scale(xpm_y)
        .orient("left");

    xpm_graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bb_xpm.h + ")")
        .call(xpm_xAxis)
        .append("text")
        .attr("class", "labels")
        .attr("y", 0)
        .attr("x", bb_xpm.w)
        .attr("dy", "-.71em")
        .style("text-anchor", "end")
        .text("Average XPM on hero");

    xpm_graph.append("g")
        .attr("class", "y axis")
        .call(xpm_yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("XPM of hero in game");

    xpm_graph.append('line')
        .attr("class", "forty-five")
        .attr('x1', xpm_x(0))
        .attr('x2', xpm_x(1))
        .attr('y1', xpm_y(0))
        .attr('y2', xpm_y(1))
        .style("stroke", "black")
        .style("stroke-width", "3px")
        .attr("clip-path", "url(#xpm_clip)");

    xpm_graph.append("defs").append("clipPath")
        .attr("transform", "translate(0,-5)")
        .attr("id", "xpm_clip")
        .append("rect")
        .attr("width", bb_xpm.w)
        .attr("height", bb_xpm.h+5);

    xpm_graph.append("g")
        .attr("class", "xpm_brush");

    xpm_graph.append("text")
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("x", bb_xpm.w/2)
        .text("XPM Statistics")

    xpm_graph.append("text")
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("x", bb_xpm.w/2)
        .style("font-size", "12px")
        .text("Select a region to zoom in. Click 'Clear Zoom' to zoom out.")

    xpm_graph.append("text")
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("x", bb_xpm.w/2)
        .style("font-size", "12px")
        .text("Click on a game to bring up the corresponding endgame screen.")

}


d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

function update_xpm(data) {

    d3.select(".clear-button_xpm").remove();

    xpm_brush = d3.svg.brush()
        .x(xpm_x)
        .y(xpm_y)
        .on("brushend", xpm_brushend);

    var xpm_dict = {};

    data.matches.map(function(d) {
        var player = d.player_info;
        if (!(player.hero_id in xpm_dict)) {
            xpm_dict[player.hero_id] = []
        }
        xpm_dict[player.hero_id].push(d);
    });

    var xpm_array = [];

    //now calculate all of the averages
    for (id in xpm_dict) {
        var total = xpm_dict[id].reduce(function(rest,match) {
            return (rest + match.player_info.xp_per_min);
        }, 0)
        var hero_average = total/xpm_dict[id].length;

        xpm_dict[id].map(function(d) {
            d.player_info.hero_avg_xpm = hero_average;
            xpm_array.push(d)
        });
    }

    var max_value = Math.max(
        d3.max(xpm_array, function(d) {
            return d.player_info.hero_avg_xpm;}),
        d3.max(xpm_array, function(d) {
            return d.player_info.xp_per_min;
        }));

    xpm_xdomain = [0, max_value];
    xpm_ydomain = [0, max_value];

    xpm_x.domain(xpm_xdomain);
    xpm_y.domain(xpm_ydomain);

    d3.select(".xpm_brush")
        .call(xpm_brush);

    // use match id to bind key data
    var datapoints = xpm_graph.selectAll(".dot")
        .data(xpm_array, function(d) { return d.match_id })

    datapoints.exit().remove();

    datapoints
        .enter().append("circle")
        .attr("class", function(d) {
            return (d.player_win) ? "dot win" : "dot loss"
        })
        .attr("match_id", function(d) { return d.match_id })
        .attr("r", 3.5)
        .attr("opacity", ".98")
        .on("mouseover", function(d) {
            // update dota styling
            var sel = d3.selectAll("[match_id='" + d.match_id + "']")
                .classed("match_dot_hover", true)
                .attr("r", 5)

            sel.moveToFront();

            var format = d3.format(".2f");

            var text = "<strong>" + d2.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>XPM this Game: " + d.player_info.xp_per_min + "<br>Average XPM on this hero: " + format(d.player_info.hero_avg_gpm);

            //get the correct hero image and build the tooltip with an image
            var hero_data = d2.getHeroInfo(d.player_info.hero_id);

            var hero_image = hero_data.img;

            var img_tip = "<div id='scatter_tooltip_img'><img src='" + hero_image + "' height='40px' width='71px'></div>"

            graph_tip.html(img_tip + text);
            graph_tip.show(d)
        })
        .on("mouseout", function(d) {
            // update dot styling, but only if not selected
            if (d3.select(this).classed("end_screen_selected") == false) {
                d3.selectAll("#timeline .match_dot_hover").attr("r", 3)
                d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
            }

            // but we always want to remove the match_dot_hover class
            d3.selectAll("#timeline .match_dot_hover").classed("match_dot_hover", false)
            d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false)

            graph_tip.hide(d);
        })
        .on("click", update_end_screen)
        .attr("clip-path", "url(#xpm_clip)");

    datapoints
        .attr("cx", xpm_x(0))
        .attr("cy", xpm_y(0))
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
            return xpm_x(d.player_info.hero_avg_gpm)
        })
        .attr("cy", function(d) {
            return xpm_y(d.player_info.gold_per_min)
        });

    xpm_graph.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xpm_xAxis);

    xpm_graph.select(".y.axis")
        .transition()
        .duration(1000)
        .call(xpm_yAxis);

    if (isNaN(xpm_x(max_value)) == false) {
        xpm_graph.select(".forty-five")
            .attr("x2", xpm_x(max_value))
            .attr("y2", xpm_y(max_value));
    }

}

var xpm_clear_button;

function xpm_brushend() {

    var xpm_x_domain = [xpm_brush.extent()[0][0], xpm_brush.extent()[1][0]]
    var xpm_y_domain = [xpm_brush.extent()[0][1], xpm_brush.extent()[1][1]]

    // equal domain ends means click on graph
    // coerce dates to numbers to check equality
    if (+xpm_x_domain[0] == +xpm_x_domain[1] && +xpm_y_domain[0] == +xpm_y_domain[1]) {
        return;
    }

    get_button = d3.select(".clear-button_xpm");

    if (get_button.empty() === true)
    {
        xpm_clear_button = xpm_graph.append("g")
            .attr("transform", "translate(" + (bb_xpm.w - 100) + "," + (bb_xpm.h - 440) + ")")
            .attr("class", "clear-button_xpm");

        xpm_clear_button.append("rect")
            .attr("width", 102)
            .attr("height", 20)
            .attr("y", -17)
            .attr("x", -4)
            .attr("rx", "10px")
            .attr("ry", "10px")
            .style("fill", "#9f9f9f");

        xpm_clear_button
            .append('text')
            .attr("y", 0)
            .attr("x", 0)
            .text("Clear Zoom")
            .style("fill", "black");
    }

    xpm_x.domain(xpm_x_domain);
    xpm_y.domain(xpm_y_domain);

    xpm_transition();

    d3.select(".xpm_brush").call(xpm_brush.clear());
    // add the on click events for the button
    xpm_clear_button.on('click', function ()
    {
        // reset everything
        xpm_x.domain(xpm_xdomain);
        xpm_y.domain(xpm_ydomain);

        xpm_transition();

        xpm_clear_button.remove();
    });

    function xpm_transition() {

        xpm_graph.select(".x.axis")
            .transition()
            .duration(1000)
            .call(xpm_xAxis);

        xpm_graph.select(".y.axis")
            .transition()
            .duration(1000)
            .call(xpm_yAxis);

        var x_vals = [];
        var y_vals = [];

        xpm_graph.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("cx",function(d) {
                x_vals.push(d.player_info.hero_avg_gpm);
                return (xpm_x(d.player_info.hero_avg_gpm));
            })
            .attr("cy",function(d) {
                y_vals.push(d.player_info.xp_per_min);
                return xpm_y(d.player_info.xp_per_min);
            });

        var max_arr = Math.max(
            d3.max(x_vals, function(d) {
                return d;
            }),
            d3.max(y_vals, function(d) {
                return d;
            }));

        if (isNaN(gpm_x.domain()[1]) == false) {
            xpm_graph.selectAll(".forty-five")
                .transition()
                .duration(1000)
                .attr("x1", xpm_x(0))
                .attr("y1", xpm_y(0))
                .attr("x2", xpm_x(max_arr))
                .attr("y2", xpm_y(max_arr));
        }
    }
}

var diameter, user_interact_color, bubble, user_flare, node;

function draw_user_interact(){

    if ($("#color-blind").is(":checked")) {
        user_interact_color_win = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#ff7f00", "#8d8d8d", "#762a83"]);
    }
    else {
        user_interact_color_win = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#d7191c", "#8d8d8d", "#1a9641"]);
    }

    diameter= bb_user_interact.w;
    user_interact_color = d3.scale.ordinal()
        .domain([])
        .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]);

    bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5)

    user_interact_graph.attr("class", "bubble");

    user_flare = {
        name: "user_flare",
        child_dict: {},
        children: []
    };

    user_interact_graph.selectAll(".error").remove();

    user_interact_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -75)
        .attr("x", 180)
        .text("Users Played with More than Once")

    user_interact_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -60)
        .attr("x", 180)
        .style("font-size", "12px")
        .text("Click a user to see their Steam profile.")

    if (user_flare.children.length == 0) {
        user_interact_graph.append("text")
            .attr("class", "error")
            .attr("y", 100)
            .text("Sorry, no data matches your selection criteria.")
            .style("font-size", "12px")
            .attr("dx", "3.3em")
        return;
    }
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.count, wins: node.num_wins});
    }

    recurse(null, root);
    return {children: classes};
}

function update_user_interact(data) {

    user_interact_graph.selectAll(".error").remove();

    user_flare = {
        name: "user_flare",
        child_dict: {},
        children: []
    };

    for (var i = 0; i < data.matches.length; i++) {
        var all_players = data.matches[i].players;

        if (all_players.length == 10) {
            for (var j = 0; j < 10; j++) {

                var account_id_num = all_players[j].account_id;

                if (account_id_num === undefined) {
                    continue;
                }
                if (account_id_num == 4294967295) {
                    continue;
                }

                if (!(account_id_num in user_flare.child_dict)) {
                    user_flare.child_dict[account_id_num] = {
                        name: account_id_num,
                        count: 1,
                        num_wins: 0
                    };
                }
                else {
                    user_flare.child_dict[account_id_num].count += 1;
                    if (data.matches[i].player_win == true) {
                        user_flare.child_dict[account_id_num].num_wins += 1;
                    }
                }

            }

        }
    }

    for (var k in user_flare.child_dict) {
        if (user_flare.child_dict[k].count == 1) {
            delete user_flare.child_dict[k];
        }
        else {
            user_flare.children.push(user_flare.child_dict[k]);
        }
    }

    if (user_flare.children.length == 0) {
        user_interact_graph.selectAll(".node").remove();

        user_interact_graph.append("text")
            .attr("class", "error")
            .attr("y", 100)
            .text("Sorry, no data matches your selection criteria.")
            .style("font-size", "12px")
            .attr("dx", "3.3em")
        return;
    }

    d3.selectAll(".node").remove();

    node = user_interact_graph.selectAll(".node")
        .data(bubble.nodes(classes(user_flare), function(d) {
            return d.className;
        })
            .filter(function(d) {return !d.children;}))

    node
        .enter().append("g")
        .attr("class", "node")
        .append("a")
        .attr("xlink:href", function(d) {
            return d2.getUserInfo(d.className).profileurl
        })
        .style("fill", function(d) {
            if (d3.select("input#winrate").property("checked")) {
                return user_interact_color_win(d.wins/d.value);
            }
            else {
                return user_interact_color(d.value)
            }
        })
        .attr("xlink:show", "new") //opens link in a new tab
        .append("circle")
        .attr("z-index", "1")
        .attr("r", function(d) {return d.r})
        .on("mouseover", function(d) {

            format = d3.format(".2%")

            graph_tip.html("User: " + d2.getUserName(d.className) + "<br>Number of games: " + d.value + "<br>Winrate Playing Together : " + format(d.wins/d.value));

            //from Video
            // if (d2.getUserName(d.className) == "Nukeydog") {
            // 	graph_tip.html("User: " + "Robbie" + "<br>Number of games: " + d.value + "<br>Winrate Playing Together : " + "11.0%");
            // 	d.wins = 0;
            // }

            if (d.className != user_data.id32) {
                graph_tip.show(d);
            }
        })
        .on("mouseout", function(d) {

            graph_tip.hide(d);
        })


    if ($("#color-blind").is(":checked")) {
        user_interact_color_win = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#ff7f00", "#8d8d8d", "#762a83"]);
    }
    else {
        user_interact_color_win = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#d7191c", "#8d8d8d", "#1a9641"]);
    }

    node
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })

    node.selectAll("circle")
        .style("fill", function(d) {
            if (d3.select("input#winrate").property("checked")) {
                return user_interact_color_win(d.wins/d.value);
            }
            else {
                return user_interact_color(d.value)
            }
        });

    d3.selectAll(".node").append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function(d) {
            var username = d2.getUserName(d.className)
            //from Video
            // if (username == "Nukeydog") {
            // 	username = "Robbie"
            // }
            if (username.length < d.r*.3) {
                return username
            }
        })
        .style("fill", "black")
        .style("font-size", "12px");


    if($("input#winrate").is(":checked")) {
        draw_legend(user_interact_graph);
    }

    d3.select("input#rainbow").on("change", function() {

        user_interact_graph.selectAll(".legend").transition().duration(1000).style("opacity", 0).remove();
        user_interact_graph.selectAll(".grad").transition().duration(1000).style("opacity", 0).remove();

        d3.selectAll(".node circle").transition().duration(1000).style("fill", function(d){ return user_interact_color(d.value) })

    });

    d3.select("input#winrate").on("change", function() {
        d3.selectAll(".node circle").transition().duration(1000).style("fill", function(d){ return user_interact_color_win(d.wins/d.value) })
        draw_legend(user_interact_graph);
    });

}
