
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