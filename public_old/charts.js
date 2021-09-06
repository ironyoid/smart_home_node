var ctx = document.getElementById('myChart');
const labels = [];
var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        labels: labels,
        datasets: [{
            label: '# of Votes',
            data: [{
                x: 0,
                y: 5
            }, {
                x: 5,
                y: 10
            }, {
                x: 8,
                y: 5
            }, {
                x: 15,
                y: 0
            }],
            showLine: true,
            tension: 0.2,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            }
        }
    }
});