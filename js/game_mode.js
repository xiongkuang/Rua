/**
 * Created by xiongkuang on 11/29/16.
 */
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