
const BackLightModes = ['OFF', 'RAINBOW', 'FILLER', 'CYCLE', 'DOTS', 'USER'];
let point = [];
let mobileSelect1 = {};
let pt_num = 0;
let week_on = 0;
let week_off  = 0;
let weekend_on  = 0;
let weekend_off  = 0;
let tempChart;
let humChart;
let colorPicker = new iro.ColorPicker('#picker', {
    width: 200,
    height: 200,
    display: "inline-block",
    borderWidth: 1,
    borderColor: "#000",
});
let led_lenta = {
    r: 0,
    g: 0,
    b: 0,
    brg: 2,
    mode: 0,
};
function newDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

colorPicker.on('input:end', function(color) {

   // console.log(color.rgb);
    led_lenta.r = color.rgb.r;
    led_lenta.g = color.rgb.g;
    led_lenta.b = color.rgb.b;
    $.ajax({
        type: 'post',
        url: '/led_lenta_send',
        data: JSON.stringify(led_lenta),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
        //    console.log(data);
        }
    });
});

class Point {

    constructor(str, id) {
        this.points_storage = {weekday: str[0], time: str[1], mliters: parseInt(str[2])};
        this.id = `${id}`;
        this.div = `<div class=\"point\" id = ${this.id} >\n` +
            "      <div class=\"point_text\">\n" +
            `${this.points_storage.weekday + '  ' + this.points_storage.time + " " + this.points_storage.mliters}\n` +
            "      </div>\n" +
            "      <div class=\"point_pics\">\n" +
            `        <img src=\"/pics/edit.png\" width=\"20\" height=\"20\" id = edit_${this.id}  style=\"margin: 0px 10px;\">\n` +
            `<img src=\"/pics/delete.png\" width=\"20\" height=\"20\" name = \"del\" onclick=\"DeleteClick(document.getElementById(${id}))\" style=\"margin: 0px 15px;\">\n ` +
            "      </div>";
    }

    Update() {

        this.Delete();
        this.div = `<div class=\"point\" id = ${this.id} >\n` +
            "      <div class=\"point_text\">\n" +
            `${this.points_storage.weekday + '  ' + this.points_storage.time + " " + this.points_storage.mliters}\n` +
            "      </div>\n" +
            "      <div class=\"point_pics\">\n" +
            `        <img src=\"/pics/edit.png\" width=\"20\" height=\"20\" id = edit_${this.id}  style=\"margin: 0px 10px;\">\n` +
            `<img src=\"/pics/delete.png\" width=\"20\" height=\"20\" name = \"del\" onclick=\"DeleteClick(document.getElementById(${this.id}))\" style=\"margin: 0px 15px;\">\n ` +
            "      </div>";

        this.Show();
    }
    Show(){
        function Compare(array, data)
        {
            for(let i = 0; i < array.length; i++)
            {
                if(array[i] === data) return i;
            }
            return false;
        }

        $('.pump_chart').append(this.div);

        this.EditSelect = new MobileSelect({
            trigger: `#edit_${this.id}`,
            wheels: [
                {data: weekdayArr},
                {data: timeArr},
                {data: mlitersArr},
            ],
            position: [Compare(weekdayArr, this.points_storage.weekday ),Compare(timeArr, this.points_storage.time ),Compare(mlitersArr, this.points_storage.mliters.toString())],
            callback: EditPoint,
            triggerDisplayData: false
        });
    }

     Delete(){
        $(`#${this.id}`).detach();
    }
    SetId(id){
      //  console.log(this.id, id);
        $(`#${this.id}`).attr('id', id);
        this.id = id;
    }

}
function BackLightF(id, indexArr, test)
{
    $(`${id}`).text(test);
    led_lenta.r = colorPicker.color.rgb.r;
    led_lenta.g = colorPicker.color.rgb.g;
    led_lenta.b = colorPicker.color.rgb.b;
    if(test == 'USER')
    {
        document.getElementById('picker_wrap').hidden = false;
    }
    else
    {
        document.getElementById('picker_wrap').hidden = true;
    }
    led_lenta.mode = indexArr;
    $.ajax({
        type: 'post',
        url: '/led_lenta_send',
        data: JSON.stringify(led_lenta),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
           // console.log(data);
        }
    });
}
class WeekSchedule {

    constructor(time, id) {
        this.timeArr = ['08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00',
            '14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00',
            '21:30','22:00','22:30','23:00','23:30'];
        this.time = time;
        this.id = id;
        $(`#${this.id}`).text(time);
        //console.log("time: %s res: %d", time, this.FindTime(time,timeArr));
        
        this.WeekonSelect = new MobileSelect({
            trigger: `#${this.id}`,
            title: "Time",
            wheels: [
                {data: this.timeArr},
            ],
            position: [this.FindTime(time,timeArr)],
            callback: this.Update
        });
    }
    FindTime(time, arr)
    {
        for(let i = 0; i < arr.length; i++)
        {
            if(time == arr[i])
            {
                return i;
            }
        }
        return 0;
    }
    Update(id,indexArr,test)
    {
        this.time = test;
        let json_to = {
            "time": this.time,
        }
        //console.log(json_to);
       // console.log(`/${id.substr(1)}`);
        $.ajax({
            type: 'post',
            url: `/${id.substr(1)}`,
            data: JSON.stringify(json_to),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data){
                this.time = data.time;
              //  console.log(this.time);
            }
        });
    }

}

UpdateChart = function(myChart, data)
{
    //myChart.reset();
    myChart.data.labels = []
    myChart.data.datasets[0].data = []
    for(let i = 0; i < data.data.length; i++)
    {
        let tm = new Date(parseInt(data.data[i].x * 1000));
        myChart.data.labels[i] = tm;
        myChart.data.datasets[0].data[i] = data.data[i].y;
    }
    myChart.update();
}

const chartFactory = function(id, lable) {
    var ctx = document.getElementById(id);
    const labels = []

    const chart_data = {
        labels: labels,
        datasets: [{
            label: lable,
            data: [],
            showLine: true,
            tension: 0.2,
            backgroundColor: [
                //'rgba(255, 99, 132, 0.2)',
                 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                //'rgba(255, 99, 132, 1)',
                 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            pointBackgroundColor: [
                'rgba(255, 99, 132, 0.9)',
            ],
            pointBorderColor: [
                'rgba(255, 99, 132, 0.9)',
            ],
            borderWidth: 2
        }]
    }
    const myChart = new Chart(ctx, {
        type: 'line',
        data: chart_data,
        options: {
            elements: {
                pointStyle:"circle",
                radius:7,
            },
            legend: {
                display: false
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: lable
                    }
                },
                x: {
                    type: 'time',
                    time: {
                        // Luxon format string
                        tooltipFormat: 'DD T',
                        unit: 'hour',
                        displayFormats: {
                            'millisecond': 'D H:MM',
                            'second': 'D H:MM',
                            'minute': 'D H:MM',
                            'hour': 'D H:MM',
                            'day': 'D H:MM',
                            'week': 'D H:MM',
                            'month': 'D H:MM',
                            'quarter': 'D H:MM',
                            'year': 'D H:MM',
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
            }
        }
    });
    return myChart;
}

document.addEventListener("DOMContentLoaded", function () {

    request();

    $.ajax({
        type: 'post',
        url: '/floppa_req',
        data: JSON.stringify({}),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data){
            console.log(data)
            document.getElementById("myRange").value = data.brightness;
            FloppaBrg(document.getElementById("myRange"));
            const radio = document.getElementsByName("floppa")
            const tbl = ["floppa_off", "floppa_inside", "floppa_outside"];
            for(let i of radio)
            {
                
                if(i.id == tbl[data.state])
                {
                    console.log(i)
                    i.checked = true;
                }
            }
        }
    });

    tempChart = chartFactory("TempChart", "Temperature");
    humChart = chartFactory("HumChart", "Humidity");

    CheckRadio = function (name) {
        var rad = document.getElementsByName(name);
        for (var i = 0; i < rad.length; i++) {
            if (rad[i].checked) {
                return rad[i].id;
            }
        }
    }

$.ajax({
    type: 'post',
    url: '/statistics',
    data: JSON.stringify({radio:CheckRadio("Temperature").slice(0,-2), class:"Temperature"}),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function(data){
        UpdateChart(tempChart, data);
    }
});
$.ajax({
    type: 'post',
    url: '/statistics',
    data: JSON.stringify({radio:CheckRadio("Humidity").slice(0,-2), class:"Humidity"}),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function(data){
        UpdateChart(humChart, data);
    }
});

    $.ajax({
        type: 'post',
        url: '/chart_status',
        data: "",
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: ParseChart
    });
    $.ajax({
        type: 'post',
        url: '/led_lenta',
        data: "",
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data){
            //console.log("data.mode = %s", data.mode)
            BackLight = new MobileSelect({
                trigger: '#led_mode',
                wheels: [
                  {data: BackLightModes},
                ],
                 position: [data.mode],
                 callback: BackLightF,
                 triggerDisplayData: false
              });
              colorPicker.color.rgb = {r: data.r,g: data.g,b: data.b}
              BackLightF("#led_mode", parseInt(data.mode), BackLightModes[data.mode])
        }
    });
    $.ajax({
        type: 'post',
        url: '/week_status',
        data: "",
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data){
            week_on = new WeekSchedule(data.week_on, "week_on");
            week_off = new WeekSchedule(data.week_off, "week_off");
            weekend_on = new WeekSchedule(data.weekend_on, "weekend_on");
            weekend_off = new WeekSchedule(data.weekend_off, "weekend_off");
            //console.log(data);
        }
    });

    $.ajax({
        type: 'post',
        url: '/schedule_sw_status',
        data: " ",
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
           // console.log(data);
            //document.getElementById('sc_block_id1').hidden = !data.state;
            //document.getElementById('sc_block_id2').hidden = !data.state;
            //document.getElementById('lamp_schedule_sw').checked = data.state;

        }
    });

});

function ScheduleSwitch(bt)
{
    let chck = document.getElementById(bt.id);
    let json_to = {
        "state": chck.checked,
    }
    //console.log(json_to);
    $.ajax({
        type: 'post',
        url: '/schedule_sw',
        data: JSON.stringify(json_to),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
            //console.log(data);
            //document.getElementById('sc_block_id1').hidden = !data.state;
           // document.getElementById('sc_block_id2').hidden = !data.state;
        }
    });
}
function Switch(bt)
{
    let chck = document.getElementById(bt.id);
    let json_to = {
        "button": chck.id,
        "state":  chck.checked
    }
    //console.log(json_to);
    $.ajax({
        type: 'post',
        url: '/buttons',
        data: JSON.stringify(json_to),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
        //console.log(json_to);
        }
    });

}

function  AddPointOnClick(id,indexArr,test)
{
    if(test === null)
    {
        alert("You tried to add empty point...");
        return;
    }
    for(let i = 0; i < point.length; i++)
    {
        if((point[i].points_storage.weekday === test[0]) && (point[i].points_storage.time === test[1]))
        {
            alert("You tried to add two points on same time...");
            return;
        }
    }
    if(pt_num > 3)
    {
        alert("You tried to add more then four points...");
        return;
    }
    point[pt_num] = new Point(test, pt_num);
    point[pt_num].Show();
    pt_num++;
    let pt = [];
    for(let i = 0; i < point.length; i++)
    {
        pt.push(point[i].points_storage);
    }

    $.ajax({
        type: 'post',
        url: '/chart_t',
        data: JSON.stringify(pt),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {

        }

    });

}

function EditPoint(id,indexArr,test)
{
    for(let i = 0; i < point.length; i++)
    {
        if((point[i].points_storage.weekday === test[0]) && (point[i].points_storage.time === test[1]))
        {
            alert("You tried to add two points on same time...");
            return;
        }
    }
    let str = id.substr(6);
    //console.log(str);
    //console.log(test);
    point[parseInt(str)].points_storage.weekday = test[0];
    point[parseInt(str)].points_storage.time = test[1];
    point[parseInt(str)].points_storage.mliters = parseInt(test[2]);
    //console.log(point[parseInt(str)].points_storage);
    point[parseInt(str)].Update();
    let pt = [];
    for(let i = 0; i < point.length; i++)
    {
        pt.push(point[i].points_storage);
    }
    $.ajax({
        type: 'post',
        url: '/chart_t',
        data: JSON.stringify(pt),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {

        }

    });

}
function DeleteClick(bt)
{
   // console.log(parseInt(bt.id));
    point[parseInt(bt.id)].Delete();
    point.splice(parseInt(bt.id), 1);
    for(let i = 0; i < point.length; i++)
    {
        point[i].SetId(`${i}`);
    }
    pt_num--;
    let pt = [];
    for(let i = 0; i < point.length; i++)
    {
        pt.push(point[i].points_storage);
    }

    $.ajax({
        type: 'post',
        url: '/chart_t',
        data: JSON.stringify(pt),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: ParseChart
    });
}

function ParseChart(data) {
    for(let i = 0; i < point.length; i++) {
        point[i].Delete();
    }
    point.splice(0, point.length);
    pt_num = 0;

    for(let i = 0; i < data.length; i++) {
        let str = [];
        str[0] = data[i].weekday;
        str[1] = data[i].time;
        str[2] = data[i].mliters;

        point[pt_num] = new Point(str, pt_num);
        point[pt_num].Show();
        pt_num++;
    }

}

function request() {
    $.get("/switch_status", SSSuccess);
    function OnOffToBool(str) {
        if(str === "ON") return true;
        else if(str === "OFF") return false  ;

    }
    function SSSuccess(data)
    {
        //console.log(data);
        /* sw_1 - wireless, sw_2 - wire, sw_3 - ir, sw_4 - music */
        document.getElementById("pump_state").innerHTML = data.pump_state.toUpperCase();
        document.getElementById("lamp_state").innerHTML = data.lamp_real.toUpperCase();
        document.getElementById("ir_state").innerHTML = data.ir_state.toUpperCase();
        document.getElementById("wireless_state").innerHTML = data.wireless_state.toUpperCase();

        document.getElementById("lamp").checked = OnOffToBool(data.lamp_state);
        document.getElementById("wireless_lamp").checked = OnOffToBool(data.wireless_state);
        document.getElementById("ir_lamp").checked = OnOffToBool(data.ir_state);
        document.getElementById("music").checked = OnOffToBool(data.music_state);

        //document.getElementById('picker_wrap').hidden = !OnOffToBool(data.backlight);
       // document.getElementById('backlight').checked = OnOffToBool(data.backlight);

        document.getElementById('temp_data').innerHTML = data.temp.toString() + "°C";
        document.getElementById('hum_data').innerHTML = data.hum.toString() + "%";

    }
    timerId = setTimeout(request, 1000);
}

let timerId = setTimeout(request, 1000);

function Tabs(evt, cityName) {
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

ChartRadio = function(radio) {

    $.ajax({
        type: 'post',
        url: '/statistics',
        data: JSON.stringify({radio:radio.id.slice(0,-2), class:radio.name}),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data){
            if(data.class == "Temperature")
            {
                UpdateChart(tempChart, data);
            }
            else if(data.class == "Humidity")
            {
                UpdateChart(humChart, data);
            }
        }
    });
}

FloppaRadio = function(radio) {
    const tmp = {
        'floppa_off':0,
        'floppa_inside':1,
        'floppa_outside':2,
    }
    $.ajax({
        type: 'post',
        url: '/floppa_state',
        data: JSON.stringify({state:tmp[radio.id]}),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data){
        }
    });
}

FloppaBrg = function(item) {
    const tmp = Math.floor(parseInt(item.value) / (255 / 100));
    document.getElementById('floppa_brg').innerHTML = tmp.toString() + "%"
}

FloppaSend = function(item) {
    $.ajax({
        type: 'post',
        url: '/floppa_brg',
        data: JSON.stringify({brightness:parseInt(item.value)}),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data){
        }
    });
}