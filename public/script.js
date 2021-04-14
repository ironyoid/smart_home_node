
let mobileSelect1 = {};

document.addEventListener("DOMContentLoaded", function() {
   // PageInit();

});
let colorPicker = new iro.ColorPicker('#picker', {
    width: 200,
    height: 200,
    display: "inline-block",
    borderWidth: 1,
    borderColor: "#000",
});
function Switch(bt)
{
    let chck = document.getElementById(bt.id);
    let json_to = {
        "button": chck.id,
        "state":  chck.checked
    }
    console.log(json_to);
    $.ajax({
        type: 'post',
        url: '/buttons',
        data: JSON.stringify(json_to),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
        console.log(json_to);
        }
    });

    // if(chck.checked)
    // {
    //     $.get("/" + bt.id + "/on", onAjaxSuccess);
    // }
    // else
    // {
    //     $.get("/" + bt.id + "/off", onAjaxSuccess);
    // }

    function onAjaxSuccess(data)
    {

    }
}

function MrHide(bt)
{
    let chck = document.getElementById(bt.id);
    console.log(chck.checked);

}

function AddPoint(bt)
{
    let chck = document.getElementById(bt.id);
    let test = mobileSelect1.getValue();
    console.log(test);
    let node = document.createElement("LI");
    let textnode = document.createTextNode("test");
    node.appendChild(textnode);
    document.getElementById("points_list").appendChild(node); ;




}

let timerId = setTimeout(function request() {
    $.get("/switch_status", onAjaxSuccess);

    function OnOffToBool(str) {
        if(str === "ON") return true;
        else if(str === "OFF") return false  ;


    }

    function onAjaxSuccess(data)
    {
        /* sw_1 - wireless, sw_2 - wire, sw_3 - ir, sw_4 - music */
        document.getElementById("pump_state").innerHTML = data.pump_state.toUpperCase();
        document.getElementById("lamp_state").innerHTML = data.lamp_state.toUpperCase();
        document.getElementById("ir_state").innerHTML = data.ir_state.toUpperCase();
        document.getElementById("wireless_state").innerHTML = data.wireless_state.toUpperCase();

        document.getElementById("lamp").checked = OnOffToBool(data.lamp_state);
        document.getElementById("wireless_lamp").checked = OnOffToBool(data.wireless_state);
        document.getElementById("ir_lamp").checked = OnOffToBool(data.ir_state);
        document.getElementById("music").checked = OnOffToBool(data.music_state);

        document.getElementById('picker_wrap').hidden = !OnOffToBool(data.backlight);
        document.getElementById('backlight').checked = OnOffToBool(data.backlight);
        console.log(data);
    }
    timerId = setTimeout(request, 1000);
}, 1000);

function openCity(evt, cityName) {
    // Declare all variables
    let i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "flex";
    evt.currentTarget.className += " active";
}

