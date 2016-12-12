/**
 * Created by xiongkuang on 10/22/16.
 */
var user_data;
var filtered_data;
//margins and bounding boxes for each graph visualization
var bb_win_loss, bb_hero_pie, bb_item_percent, bb_hero_chord, bb_gpm, bb_xpm, bb_kda;


bb_records = {x: 0, y: 250, h: 200, w: 1060};

bb_win_loss = {w: 550, h: 3, margin: {top: 40, right: 70, bottom: 20, left: 70}};

bb_hero_pie = {w: 300, h: 300, margin: {top: 60, right: 20, bottom: 20, left: 20}};

bb_item_percent = {w: 600, h: 300, margin: {top: 90, right: 20, bottom: 20, left: 50}};

bb_hero_chord = {w: 400, h: 400, margin: {top: 110, right: 20, bottom: 20, left: 20}};

bb_user_interact = {h: 400, w: 400, margin: {top: 110, right: 80, bottom: 20, left: 20}};

bb_gpm = {h: 400, w: 400, margin: {top: 80, right: 50, bottom: 50, left: 50}};

bb_xpm = {h: 400, w: 400, margin: {top: 80, right: 50, bottom: 50, left: 50}};

bb_kda = {x: 0, y: 1500, h: 300, w: 900};

// button handlers for splash page to switch the divs around as desired
d3.selectAll(".move_on_button button")
    .on("click", function () {
        $(window).scrollTop("0px");
        d3.select("#not-splash")
            .style("display", null);
        d3.select("#splash")
            .style("display", "none");
    });


// bind handlers for going back to main screen
function return_to_splash() {
    $(window).scrollTop("0px");
    d3.select("#not-splash")
        .style("display", "none");
    d3.select("#splash")
        .style("display", null);
}


// start with move on button in "loading" state
$(".move_on_button button").button("loading");


// When DOM is ready, enable button
$(window).load(function () {
    $(".move_on_button button").button("reset");
});


//set up those boxes
svg_win_loss = d3.select("#win_loss_container").append("svg").attr({
    width: bb_win_loss.w + bb_win_loss.margin.left + bb_win_loss.margin.right + 20,
    height: bb_win_loss.h + bb_win_loss.margin.bottom + bb_win_loss.margin.top,
    id: "win_loss_bar"
});

svg_hero_pie = d3.select("#hero_pie_container").append("svg").attr({
    width: bb_hero_pie.w + bb_hero_pie.margin.left + bb_hero_pie.margin.right,
    height: bb_hero_pie.h + bb_hero_pie.margin.bottom + bb_hero_pie.margin.top
});

svg_item_percent = d3.select("#item_percent_container").append("svg").attr({
    width: bb_item_percent.w + bb_item_percent.margin.left + bb_item_percent.margin.right,
    height: bb_item_percent.h + bb_item_percent.margin.bottom + bb_item_percent.margin.top
});


svg_gpm = d3.select("#gpm_container").append("svg").attr({
    width: bb_gpm.w + bb_gpm.margin.left + bb_gpm.margin.right,
    height: bb_gpm.h + bb_gpm.margin.bottom + bb_gpm.margin.top
});

svg_xpm = d3.select("#xpm_container").append("svg").attr({
    width: bb_xpm.w + bb_xpm.margin.left + bb_xpm.margin.right,
    height: bb_xpm.h + bb_xpm.margin.bottom + bb_xpm.margin.top
});


var win_loss_graph = svg_win_loss.append("g")
    .attr("class", "win_loss")
    .attr("transform", "translate(" + bb_win_loss.margin.left + "," + bb_win_loss.margin.top + ")");

var hero_pie_graph = svg_hero_pie.append("g")
    .attr("class", "hero_pie")
    .attr("transform", "translate(" + (bb_hero_pie.w / 2 + bb_hero_pie.margin.left) + "," + (bb_hero_pie.h / 2 + bb_hero_pie.margin.top) + ")");

var item_percent_graph = svg_item_percent.append("g")
    .attr("class", "item_percent")
    .attr("transform", "translate(" + bb_item_percent.margin.left + "," + bb_item_percent.margin.top + ")");


var gpm_graph = svg_gpm.append("g")
    .attr("class", "gpm")
    .attr("transform", "translate(" + bb_gpm.margin.left + "," + bb_gpm.margin.top + ")");

var xpm_graph = svg_xpm.append("g")
    .attr("class", "xpm")
    .attr("transform", "translate(" + bb_gpm.margin.left + "," + bb_gpm.margin.top + ")");

var item_percent_x, item_percent_y, item_percent_xAxis, item_percent_yAxis, item_percent_color;
var hero_pie_radius, hero_pie_color, hero_pie_x, hero_pie_y, partition, hero_pie_arc, hero_pie_path;

//tool tip setup
var graph_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0]);

svg_xpm.call(graph_tip);
svg_gpm.call(graph_tip);

//function calls
dM.loadJson(function () {

    // Benjy's stuff
    hero_keys = dM.getKeys("heroes");
    var intheroes = [];
    var agiheroes = [];
    var strheroes = [];
    for (var i = 0; i < hero_keys.length; i++) {
        var hero = dM.getHeroInfoCopy(hero_keys[i]);
        if (hero) {
            if (hero.stat == "strength") {
                strheroes.push(hero);
            }
            else if (hero.stat == "agility") {
                agiheroes.push(hero);
            }
            else if (hero.stat == "intelligence") {
                intheroes.push(hero);
            }
        }
    }
    strheroes.sort(sorting);
    agiheroes.sort(sorting);
    intheroes.sort(sorting);
    strheroes.forEach(function (d) {
        var heroname = d.name;
        d3.select("#strimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#strimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#strimages").select("#" + heroname).on("click", highlight);
    });
    agiheroes.forEach(function (d) {
        var heroname = d.name;
        d3.select("#agiimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#agiimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#agiimages").select("#" + heroname).on("click", highlight);
    });
    intheroes.forEach(function (d) {
        var heroname = d.name;
        d3.select("#intimages").append("img").attr("id", heroname).attr("class", "pic brightnessfilter");
        d3.select("#intimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
        d3.select("#intimages").select("#" + heroname).on("click", highlight);
    });

    // creates sunburst parent-child nested array-dict object whatever format
    hero_flare = {};

    hero_flare.name = "flare";
    hero_flare.children = [{}, {}, {}];

    hero_flare.children[0].name = "agility";
    hero_flare.children[1].name = "strength";
    hero_flare.children[2].name = "intelligence";

    hero_flare.children[0].children = [];
    hero_flare.children[1].children = [];
    hero_flare.children[2].children = [];

    for (var i = 0; i < hero_keys.length; i++) {
        var hero = dM.getHeroInfoCopy(hero_keys[i]);

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
    .on("click", function () {
        tripleFilterUpdate();
    });

function tripleFilterUpdate() {
    // repopulate filtered_data by hero selection
    updateFilteredSelectionByHero();
    // further filter by game mode and lobby type
    filtered_data.matches = filtered_data.matches.filter(function (d) {
        if ((selected_modes.indexOf(dM.getGameModeInfo(d.game_mode).short_name) >= 0) && (selected_lobby_modes.indexOf(dM.getLobbyInfo(d.lobby_type).short_name) >= 0)) return 1;
    });

    updateGraphs(filtered_data);
}

// reset selected heroes in the filter for user change - all to unselected
function resetSelectedHeroes() {
    d3.selectAll(".pic.selected").classed("selected", false).style("border", "2px solid black");
}

draw_win_loss();
draw_item_percent();
draw_gpm();
draw_xpm();


function loadData(username) {

    dM.loadUserData(username, function (error, data) {

        user_data = data;
        filtered_data = data;
        selectedarr = [];
        resetGameMode();
        initGameMode();
        resetLobby();
        initLobby();
        resetSelectedHeroes();
        tripleFilterUpdate();
    })
}

function updateGraphs(filtered_data) {
    //update function calls
    update_win_loss(filtered_data);
    update_item_percent(filtered_data);
    hero_pie(update_flare(filtered_data));
    update_gpm(filtered_data);
    update_xpm(filtered_data);
    updateRecords(filtered_data);
    exit_end_screen();
}


//win loss rect graph
function draw_win_loss() {

    win_loss_graph.append("rect")
        .attr("width", bb_win_loss.w)
        .attr("height", bb_win_loss.h)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "loss_rect")
        .attr("class", "loss");

    win_loss_graph.append("rect")
        .attr("width", bb_win_loss.w / 2)
        .attr("height", bb_win_loss.h)
        .attr("x", 0)
        .attr("id", "win_rect")
        .attr("y", 0)
        .attr("class", "win");

    win_loss_graph
        .append("text")
        .attr("x", -65)
        .attr("y", 7)
        .attr("class", "win text")
        .attr("text-anchor", "start")
        .text("Nod data!!!")
        .style("fill", "black");

    win_loss_graph
        .append("text")
        .attr("x", 615)
        .attr("y", 7)
        .attr("class", "loss text")
        .attr("text-anchor", "end")
        .text("No data!!!")
        .style("fill", "black");

    win_loss_graph.append("text")
        .attr("transform", "translate(280,-25)")
        .attr("text-anchor", "middle")
        .attr("font-size", "10")
        .text("Win-Loss Percentage")
        .attr("fill", "white")
        .attr("id", "win_loss_text")
        .style("font-weight", null);
}

//update the win loss graph if user filters data
function update_win_loss(data) {

    var win_count = 0;
    var total_matches = data.matches.length;

    data.matches.map(function (d, i) {
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

    if (isNaN((win_count / total_matches) * bb_win_loss.w) == false) {
        d3.select("rect.win")
            .transition()
            .duration(duration)
            .attr("width", (win_count / total_matches) * bb_win_loss.w);
    }
    else {
        d3.select("rect.win")
            .transition()
            .duration(duration)
            .attr("width", 0);
    }

    if (win_count != 0) {
        d3.select(".win.text")
            .text(((win_count / total_matches) * 100).toFixed(1) + "%");

        d3.select(".loss.text")
            .text(((total_matches - win_count) / total_matches * 100).toFixed(1) + "%");
    }
    else {
        d3.select(".win.text")
            .text("No data");
        d3.select(".loss.text")
            .text("No data");
    }

}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function click(d) {
    hero_pie_path.transition()
        .duration(750)
        .attrTween("d", clickArcTween(d))
}
// Interpolate the scales!
function clickArcTween(d) {
    var xd = d3.interpolate(hero_pie_x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(hero_pie_y.domain(), [d.y, 1]),
        yr = d3.interpolate(hero_pie_y.range(), [d.y ? 20 : 0, hero_pie_radius]);
    return function (d, i) {
        return i
            ? function (t) {
            return hero_pie_arc(d);
        }
            : function (t) {
            hero_pie_x.domain(xd(t));
            hero_pie_y.domain(yd(t)).range(yr(t));
            return hero_pie_arc(d);
        };
    };
}

function findLargest3(array1) {
    array1.sort(function (a, b) {
        if (a[1] < b[1]) {
            return 1;
        }
        else if (a[1] == b[1]) {
            return 0;
        }
        else {
            return -1;
        }
    });

    return array1.slice(0, 3)
}

//creates hero sunburst graph based on hero flare json data
function hero_pie(flare) {

    for (var i = 0; i < hero_flare.children.length; i++) {
        for (var j = 0; j < hero_flare.children[i].children.length; j++) {
            var current_children = hero_flare.children[i].children[j];
            if ("items" in current_children) {
                var max_item_array = [];
                for (var k = 0; k < hero_flare.children[i].children[j].items.length; k++) {
                    var current_item = hero_flare.children[i].children[j].items[k];
                    max_item_array.push([current_item.dname, current_item.number]);
                }
            }
            hero_flare.children[i].children[j].item_max = findLargest3(max_item_array)
        }
    }

    hero_pie_radius = Math.min(bb_hero_pie.w, bb_hero_pie.h) / 2;

    hero_pie_color = d3.scale.ordinal()
        .domain(["flare", "agility", "strength", "intelligence"])
        .range(["rgba(0,0,0,0)", "#188a15", "#b6310d", "#0f7fb4"]);

    hero_pie_x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    hero_pie_y = d3.scale.sqrt()
        .range([0, hero_pie_radius]);

    partition = d3.layout.partition()
        .value(function (d) {
            return d.games_played;
        });

    var zero_arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(0)
        .innerRadius(function (d) {
            return Math.max(0, hero_pie_y(d.y));
        })
        .outerRadius(function (d) {
            return Math.max(0, hero_pie_y(d.y + d.dy));
        });

    hero_pie_arc = d3.svg.arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, hero_pie_x(d.x)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, hero_pie_x(d.x + d.dx)));
        })
        .innerRadius(function (d) {
            return Math.max(0, hero_pie_y(d.y));
        })
        .outerRadius(function (d) {
            return Math.max(0, hero_pie_y(d.y + d.dy));
        });

    hero_pie_path = hero_pie_graph.selectAll("path")
        .data(partition.nodes(flare), function (d) {
            return d.name
        });

    hero_pie_path
        .enter().append("path")
        .attr("class", "hero_pie")
        .attr("d", zero_arc)
        .on("click", click)
        .on("mouseover", function (d) {

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

            var basic_tip = "<div id='tooltip_text'><strong>" + name + "</strong>" + "<br>" + d.value + number_text + "</br></div>";

            if ("item_max" in d) {
                if (d.item_max.length < 3) {
                    basic_tip = "<div id='tooltip_text'><strong>" + name + "</strong>" + "<br>" + d.value + number_text + "</br></div>";
                }

                else {

                    var item_text1, item_text2, item_text3;

                    //look i has a ternary
                    item_text1 = (d.item_max[0][1] == 1) ? "time" : "times";
                    item_text2 = (d.item_max[1][1] == 1) ? "time" : "times";
                    item_text3 = (d.item_max[2][1] == 1) ? "time" : "times";

                    basic_tip = "<div id='tooltip_text'><strong>" + name + "</strong>" + "<br>" + d.value + number_text + "</br>" + "<br><strong>Most bought items: </strong><br>" + d.item_max[0][0] + ", " + d.item_max[0][1] + " " + item_text1 + "<br>" + d.item_max[1][0] + ", " + d.item_max[1][1] + " " + item_text2 + "<br>" + d.item_max[2][0] + ", " + d.item_max[2][1] + " " + item_text3 + "</br></div>";
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
                graph_tip.direction('e');
                graph_tip.show(d);
            }
            if (tooltip) {
                d3.select(this)
                    .style("fill", "rgba(255,255,255,0.7)");
            }
        })
        .on("mouseout", function (d) {
            graph_tip.hide(d);
            graph_tip.direction('n');

            d3.select(this)
                .style("fill", function (d) {
                    return hero_pie_color((d.children ? d : d.parent).name);
                });
        })
        .each(stash); // store the initial angles

    hero_pie_path
        .transition()
        .duration(1000)
        .attrTween("d", heroPieArcTween)
        .style("fill", function (d) {
            return hero_pie_color((d.children ? d : d.parent).name);
        });

    d3.select(self.frameElement).style("height", height + "px");

    hero_pie_graph.selectAll("text").remove();

    hero_pie_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -bb_hero_pie.h / 2 - 30)
        .text("Heroes Played");

    hero_pie_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -bb_hero_pie.h / 2 - 10)
        .style("font-size", "12px")
        .text("Click center to zoom out. Click arcs to zoom in.");

}


// http://johan.github.io/d3/ex/sunburst.html
// Stash the old values for transition.
function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function heroPieArcTween(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function (t) {
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
        }
    }

    data.matches.forEach(function (d, i) {

        var current_hero = dM.getHeroInfo(d.player_info.hero_id);

        // find which child array holds the heroes for this stat
        var children_pos = hero_flare.children.map(function (d) {
            return d.name
        }).indexOf(current_hero.stat);
        var cur = hero_flare.children[children_pos].children;

        // find which element of that array holds this hero
        var hero_pos = cur.map(function (d) {
            return d.dname
        }).indexOf(current_hero.dname);
        cur[hero_pos].games_played += 1;

    });


    //get items to each hero and enumerate a count
    for (var i = 0; i < data.matches.length; i++) {

        if (data.matches[i].players.length == 5) {
            continue;
        }

        for (var j = 0; j < 6; j++) {

            var current_item = dM.getItemInfoCopy(data.matches[i].player_info["item_" + j]);

            if (current_item.dname == "empty") {
                continue;
            }
            var current_hero = dM.getHeroInfo(data.matches[i].player_info.hero_id);

            // find which child array holds the heroes for this stat
            var children_pos = hero_flare.children.map(function (d) {
                return d.name
            }).indexOf(current_hero.stat);
            var cur = hero_flare.children[children_pos].children;

            // find which element of that array holds this hero
            var hero_pos = cur.map(function (d) {
                return d.dname
            }).indexOf(current_hero.dname);

            if (!("items" in cur[hero_pos])) {
                cur[hero_pos]["items"] = [];
            }

            var item_pos = cur[hero_pos].items.map(function (d) {
                return d.name
            }).indexOf(current_item.name);

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
        .rangeBands([0, bb_item_percent.w], .3, .5)
        .domain(["item1"]);

    item_percent_y = d3.scale.linear()
        .range([bb_item_percent.h, 0]);

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
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + bb_item_percent.h + ")")
        .call(item_percent_xAxis);

    item_percent_graph.append("g")
        .attr("class", "y axis")
        .attr("id", "y-axis")
        .call(item_percent_yAxis);

    item_percent_graph.append("g")
        .attr("class", "bars");

    item_percent_graph.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -40)
        .attr("x", 350)
        .text("Items Purchased as Percentage of Games Played");

}


function draw_legend(graph) {

    graph.selectAll(".legend").remove();
}


//updates the item percent bar chart based on user's data selection
function update_item_percent(data) {
    var items = [];

    //initialize all items with a count of 0
    d3.json("data/items.json", function (error, dat) {
        item_percent_color.range(["#F68065", "#6CC062"]);
        for (id in dat) {
            dat[id].count = 0;
            dat[id].num_wins = 0;
            dat[id].hero_array = [];
        }

        var total_count = data.matches.length;

        //count all of the items
        data.matches.forEach(function (d, i) {
            for (j in dat) {

                var hero = d.player_info.hero_id;

                var index = dat[j].hero_array.map(function (d) {
                    return d[0]
                }).indexOf(hero);

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
        });

        //consolidate into correct form that we want
        for (k in dat) {
            if (dat[k].count != 0 && dat[k].name != "empty") {
                dat[k].percent = dat[k].count / total_count;
                dat[k].winrate = (dat[k].num_wins / dat[k].count);
                items.push(dat[k])
            }
        }

        var extent_array = [];
        for (id in dat) {
            extent_array.push(dat[id].winrate);
        }

        //item_percent_color.domain(d3.extent(extent_array));
        item_percent_color.domain([0, .5, 1]);
        item_percent_color.range(["#d7191c", "#8d8d8d", "#1a9641"]);


        if (d3.select(".item_percent").attr("visibility") == "hidden") {
            var duration = 0;
        }
        else {
            duration = 1000;
        }

        item_percent_x.domain(items.map(function (d) {
            return d.name;
        }));
        item_percent_y.domain([0, d3.max(items, function (d) {
            return d.percent;
        })]);

        var bars = item_percent_graph.select(".bars")
            .selectAll(".bar")
            .data(items, function (d) {
                return d.name;
            });

        bars.exit()
            .transition()
            .duration(500)
            .attr("width", 0)
            .remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", function (d) {
                return item_percent_color(d.winrate);
            })
            .attr("x", 0)
            .attr("y", bb_item_percent.h)
            .attr("height", 0)
            .on("mouseover", function (d) {

                if (d.dname == "Aegis of the Immortal" || d.dname == "Cheese") {
                    var cost = "Dropped Item";
                }
                else {
                    cost = d.cost
                }

                var basic_tip = "<div id='tooltip_text'><strong><span style='color:red';>" + d.dname +
                    "</span></strong>" + "<br> Number of Games: " + d.count +
                    "<br> Cost: " + cost + "<br> Winrate: " + (100 * d.winrate).toFixed(1) +
                    "%<br></div>";
                var img_tip = "<div id='item_percent_tooltip_img'><img src='" + d.img + "' height='40px' width='53.125px'></div>";

                var most_purchased = "<br><div id='item_percent_tooltip_most_purchased'><strong>Most purchased on: </strong><br>";

                var topthree = findLargest3(d.hero_array);

                for (var i = 0; i < topthree.length; i++) {
                    var img_text = "<img src='" + dM.getHeroInfo(topthree[i][0]).img + "' height='36px' width='64px'>";
                    most_purchased = most_purchased + img_text
                }

                most_purchased = most_purchased + "</div>";

                graph_tip.html(img_tip + basic_tip + most_purchased);
                graph_tip.show(d);
            })
            .on("mouseout", function (d) {
                graph_tip.hide(d);
            })
            .transition().duration(duration);

        bars
            .transition()
            .duration(duration)
            .attr("x", function (d) {
                return item_percent_x(d.name);
            })
            .attr("y", function (d) {
                return item_percent_y(d.percent);
            })
            .attr("height", function (d) {
                return bb_item_percent.h - item_percent_y(d.percent);
            })
            .attr("width", item_percent_x.rangeBand)
            .attr("fill", function (d) {
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

    });

    //sorting by value
    d3.select("input#value").on("change", change);

    var sortTimeout = setTimeout(function () {
        d3.select("input#value").property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = item_percent_x.domain(items.sort(this.checked
            ? function (a, b) {
            return b.percent - a.percent;
        }
            : function (a, b) {
            return d3.ascending(a.name, b.name);
        })
            .map(function (d) {
                return d.name;
            }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function (d, i) {
                return i * 10;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.name);
            });

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
            ? function (a, b) {
            return d3.ascending(a.name, b.name);
        }
            : function (a, b) {
            return d3.ascending(a.percent, b.percent);
        })
            .map(function (d) {
                return d.name;
            }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function (d, i) {
                return i * 10;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.name);
            });

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
            ? function (a, b) {
            if (a.dname == "Aegis of the Immortal" || a.dname == "Cheese") {
                a.cost = 100000;
            }
            if (b.dname == "Aegis of the Immortal" || b.dname == "Cheese") {
                b.cost = 100000;
            }
            return d3.ascending(a.cost, b.cost);
        }
            : function (a, b) {
            return d3.ascending(a.name, b.name);
        })
            .map(function (d) {
                return d.name;
            }))
            .copy();

        var transition = svg_item_percent.transition().duration(750),
            delay = function (d, i) {
                return i * 10;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.name);
            });

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
        head = set.slice(i, i + 1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
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

    gpm_color = d3.scale.ordinal()
        .domain([true, false])
        .range(["#1a9641", "#d7191c"]);


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
        .attr("height", bb_gpm.h + 5);

    gpm_graph.append("g")
        .attr("class", "gpm_brush");

    gpm_graph.append("g")
        .attr("class", "x axis")
        .attr("id", "x-axis")
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
        .attr("id", "y-axis")
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
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .attr("clip-path", "url(#gpm_clip)");
    }

    d3.selectAll(".circle")
        .attr("clip-path", "url(#gpm_clip)");

    gpm_graph.append("text")
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("x", bb_gpm.w / 2)
        .text("GPM Statistics")

}

var gpm_brush;

function update_gpm(data) {

    d3.select(".clear-button_gpm").remove();

    var gpm_dict = {};

    data.matches.map(function (d) {
        var player = d.player_info;
        if (!(player.hero_id in gpm_dict)) {
            gpm_dict[player.hero_id] = []
        }
        gpm_dict[player.hero_id].push(d);
    });

    var gpm_array = [];

    //now calculate all of the averages
    for (id in gpm_dict) {
        var total = gpm_dict[id].reduce(function (rest, match) {
            return (rest + match.player_info.gold_per_min);
        }, 0);
        var hero_average = total / gpm_dict[id].length;

        gpm_dict[id].map(function (d) {
            d.player_info.hero_avg_gpm = hero_average;
            gpm_array.push(d)
        });
    }

    var max_value = Math.max(
        d3.max(gpm_array, function (d) {
            return d.player_info.hero_avg_gpm;
        }),
        d3.max(gpm_array, function (d) {
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
        .data(gpm_array, function (d) {
            return d.match_id
        });

    datapoints.exit().remove();

    datapoints
        .enter().append("circle")
        .attr("class", function (d) {
            return (d.player_win) ? "dot win" : "dot loss"
        })
        .attr("match_id", function (d) {
            return d.match_id
        })
        .attr("cx", gpm_x(0))
        .attr("cy", gpm_y(0))
        .attr("r", 3.5)
        .on("mouseover", function (d) {
            // update dot styling
            var sel = d3.selectAll("[match_id='" + d.match_id + "']")
                .classed("match_dot_hover", true)
                .attr("r", 5);

            sel.moveToFront();

            var format = d3.format(".2f");

            var text = "<strong>" + dM.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>GPM this Game: " + d.player_info.gold_per_min + "<br>Average GPM on this hero: " + format(d.player_info.hero_avg_gpm);

            //get the correct hero image
            var hero_data = dM.getHeroInfo(d.player_info.hero_id);

            var hero_image = hero_data.img;

            var img_tip = "<div id='scatter_tooltip_img'><img src='" + hero_image + "' height='40px' width='71.125px'></div>";

            graph_tip.html(img_tip + text);
            graph_tip.show(d)
        })
        .on("mouseout", function (d) {
            // update dot styling, but only if not selected
            if (d3.select(this).classed("end_screen_selected") == false) {
                d3.selectAll(".match_dot_hover").attr("r", 3);
                d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
            }

            // but we always want to remove the match_dot_hover class
            d3.selectAll(".match_dot_hover").classed("match_dot_hover", false);
            d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false);

            graph_tip.hide(d);
        })
        .on("click", update_end_screen)
        .attr("clip-path", "url(#gpm_clip)");

    datapoints
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            return gpm_x(d.player_info.hero_avg_gpm)
        })
        .attr("cy", function (d) {
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

    var gpm_x_domain = [gpm_brush.extent()[0][0], gpm_brush.extent()[1][0]];
    var gpm_y_domain = [gpm_brush.extent()[0][1], gpm_brush.extent()[1][1]];
    if (+gpm_x_domain[0] == +gpm_x_domain[1] && +gpm_y_domain[0] == +gpm_y_domain[1]) {
        return;
    }

    get_button = d3.select(".clear-button_gpm");
    if (get_button.empty() === true) {
        gpm_clear_button = gpm_graph.append("g")
            .attr("transform", "translate(" + (bb_gpm.w - 100) + "," + (bb_gpm.h - 440) + ")")
            .attr("class", "clear-button_gpm");

        gpm_clear_button.append("rect")
            .attr("width", 88)
            .attr("height", 23)
            .attr("y", -17)
            .attr("x", -4)
            .style("fill", "#9f9f9f");

        gpm_clear_button
            .append('text')
            .attr("y", 0)
            .attr("x", 0)
            .text("Clear Zoom");
    }

    gpm_x.domain(gpm_x_domain);
    gpm_y.domain(gpm_y_domain);

    gpm_transition();

    d3.select(".gpm_brush").call(gpm_brush.clear());

    // add the on click events for the button
    gpm_clear_button.on('click', function () {
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
            .attr("cx", function (d) {
                x_vals.push(d.player_info.hero_avg_gpm);
                return (gpm_x(d.player_info.hero_avg_gpm));
            })
            .attr("cy", function (d) {
                y_vals.push(d.player_info.gold_per_min);
                return gpm_y(d.player_info.gold_per_min);
            });

        var max_arr = Math.max(
            d3.max(x_vals, function (d) {
                return d;
            }),
            d3.max(y_vals, function (d) {
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

    xpm_color = d3.scale.ordinal()
        .domain([true, false])
        .range(["#1a9641", "#d7191c"]);


    xpm_xAxis = d3.svg.axis()
        .scale(xpm_x)
        .orient("bottom");

    xpm_yAxis = d3.svg.axis()
        .scale(xpm_y)
        .orient("left");

    xpm_graph.append("g")
        .attr("class", "x axis")
        .attr("id", "x-axis")
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
        .attr("id", "y-axis")
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
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .attr("clip-path", "url(#xpm_clip)");

    xpm_graph.append("defs").append("clipPath")
        .attr("transform", "translate(0,-5)")
        .attr("id", "xpm_clip")
        .append("rect")
        .attr("width", bb_xpm.w)
        .attr("height", bb_xpm.h + 5);

    xpm_graph.append("g")
        .attr("class", "xpm_brush");

    xpm_graph.append("text")
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("x", bb_xpm.w / 2)
        .text("XPM Statistics")


}


d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
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

    data.matches.map(function (d) {
        var player = d.player_info;
        if (!(player.hero_id in xpm_dict)) {
            xpm_dict[player.hero_id] = []
        }
        xpm_dict[player.hero_id].push(d);
    });

    var xpm_array = [];

    //now calculate all of the averages
    for (id in xpm_dict) {
        var total = xpm_dict[id].reduce(function (rest, match) {
            return (rest + match.player_info.xp_per_min);
        }, 0);
        var hero_average = total / xpm_dict[id].length;

        xpm_dict[id].map(function (d) {
            d.player_info.hero_avg_xpm = hero_average;
            xpm_array.push(d)
        });
    }

    var max_value = Math.max(
        d3.max(xpm_array, function (d) {
            return d.player_info.hero_avg_xpm;
        }),
        d3.max(xpm_array, function (d) {
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
        .data(xpm_array, function (d) {
            return d.match_id
        });

    datapoints.exit().remove();

    datapoints
        .enter().append("circle")
        .attr("class", function (d) {
            return (d.player_win) ? "dot win" : "dot loss"
        })
        .attr("match_id", function (d) {
            return d.match_id
        })
        .attr("r", 3.5)
        .attr("opacity", ".98")
        .on("mouseover", function (d) {
            // update dota styling
            var sel = d3.selectAll("[match_id='" + d.match_id + "']")
                .classed("match_dot_hover", true)
                .attr("r", 5);

            sel.moveToFront();

            var format = d3.format(".2f");

            var text = "<strong>" + dM.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>XPM this Game: " + d.player_info.xp_per_min + "<br>Average XPM on this hero: " + format(d.player_info.hero_avg_gpm);

            //get the correct hero image and build the tooltip with an image
            var hero_data = dM.getHeroInfo(d.player_info.hero_id);

            var hero_image = hero_data.img;

            var img_tip = "<div id='scatter_tooltip_img'><img src='" + hero_image + "' height='40px' width='71px'></div>";

            graph_tip.html(img_tip + text);
            graph_tip.show(d)
        })
        .on("mouseout", function (d) {
            // update dot styling, but only if not selected
            if (d3.select(this).classed("end_screen_selected") == false) {
                d3.selectAll(".match_dot_hover").attr("r", 3);
                d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
            }

            // but we always want to remove the match_dot_hover class
            d3.selectAll(".match_dot_hover").classed("match_dot_hover", false);
            d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false);

            graph_tip.hide(d);
        })
        .on("click", update_end_screen)
        .attr("clip-path", "url(#xpm_clip)");

    datapoints
        .attr("cx", xpm_x(0))
        .attr("cy", xpm_y(0))
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            return xpm_x(d.player_info.hero_avg_gpm)
        })
        .attr("cy", function (d) {
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

    var xpm_x_domain = [xpm_brush.extent()[0][0], xpm_brush.extent()[1][0]];
    var xpm_y_domain = [xpm_brush.extent()[0][1], xpm_brush.extent()[1][1]];
    if (+xpm_x_domain[0] == +xpm_x_domain[1] && +xpm_y_domain[0] == +xpm_y_domain[1]) {
        return;
    }

    get_button = d3.select(".clear-button_xpm");

    if (get_button.empty() === true) {
        xpm_clear_button = xpm_graph.append("g")
            .attr("transform", "translate(" + (bb_xpm.w - 100) + "," + (bb_xpm.h - 440) + ")")
            .attr("class", "clear-button_xpm");

        xpm_clear_button.append("rect")
            .attr("width", 88)
            .attr("height", 23)
            .attr("y", -17)
            .attr("x", -4)
            .style("fill", "#9f9f9f");

        xpm_clear_button
            .append('text')
            .attr("y", 0)
            .attr("x", 0)
            .style("margin", "15px 13px")
            .text("Clear Zoom");
    }

    xpm_x.domain(xpm_x_domain);
    xpm_y.domain(xpm_y_domain);

    xpm_transition();

    d3.select(".xpm_brush").call(xpm_brush.clear());
    // add the on click events for the button
    xpm_clear_button.on('click', function () {
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
            .attr("cx", function (d) {
                x_vals.push(d.player_info.hero_avg_gpm);
                return (xpm_x(d.player_info.hero_avg_gpm));
            })
            .attr("cy", function (d) {
                y_vals.push(d.player_info.xp_per_min);
                return xpm_y(d.player_info.xp_per_min);
            });

        var max_arr = Math.max(
            d3.max(x_vals, function (d) {
                return d;
            }),
            d3.max(y_vals, function (d) {
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

function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) node.children.forEach(function (child) {
            recurse(node.name, child);
        });
        else classes.push({packageName: name, className: node.name, value: node.count, wins: node.num_wins});
    }

    recurse(null, root);
    return {children: classes};
}


