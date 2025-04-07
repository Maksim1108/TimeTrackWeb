const renderBarChart = (tasks) => {
    const ctx = document.getElementById('timeChart').getContext('2d');

    function timeToHours(timeStr) {
        const [hh, mm, ss] = timeStr.split(':').map(Number);
        return hh + (mm / 60) + (ss / 3600);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tasks.map(task => task.name),
            datasets: [{
                label: 'Execution time (hours)',
                data: tasks.map(task => timeToHours(task.timer)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                ],
            }],
        },
        options: {
            scales: {
                y: {
                    title: { display: true, text: 'Hours' },
                    beginAtZero: true,
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const hours = ctx.raw;
                            const hh = Math.floor(hours);
                            const mm = Math.round((hours - hh) * 60);
                            return `${hh} h ${mm} min`;
                        },
                    },
                },
            },
        },
    });
}

export default renderBarChart