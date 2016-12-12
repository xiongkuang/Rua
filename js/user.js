/**
 * Created by xiongkuang on 11/29/16.
 */
users = [
    {username: "Aui_2000", realname: "aui_2000"},
    {username: "Na`Vi.Dendi", realname: "dendi"},
    {username: "Merlini", realname: "merlini"},
    {username: "bangkura", realname: "bangkura"},
    {username: "Chun", realname: "chun"},
];

users.sort(function (a, b) {
    return d3.ascending(a.username.toLowerCase(), b.username.toLowerCase())
})

d3.select("#selectuser")
    .append("select")
    .attr("id", "userdropdown")
    .attr("class", "form-control")
    .on("change", function () {
        loadData(d3.select("#userdropdown").node().value)
    })
    .selectAll("option")
    .data(users)
    .enter().append("option")
    .attr("value", function (d) {
        return d.realname
    })
    .text(function (d) {
        return d.username
    });

// set default value
d3.select("[value=bangkura]").property("selected", true)