const renderGantChart = (tasks, element) => {
    const ganttCtx = element.getContext('2d');

    const backgroundColors = [
        'rgba(255, 183, 77, 0.8)',
    ];

    const ganttData = tasks.map((task, index) => {
        const startDate = task.created_at ? new Date(task.created_at) : new Date();
        const endDate = task.completed_at ? new Date(task.completed_at) : new Date();

        if (!task.completed_at) {
            endDate.setTime(Date.now());
            if (startDate > endDate) {
                endDate.setTime(startDate.getTime());
            }
        }

        return {
            task: task.name.toUpperCase(),
            start: startDate,
            end: endDate,
            color: backgroundColors[index % backgroundColors.length]
        };
    });

    ganttData.sort((a, b) => a.start - b.start);

    const minDate = ganttData.length > 0 ?
        new Date(Math.min(...ganttData.map(d => d.start))) :
        new Date();
    const maxDate = ganttData.length > 0 ?
        new Date(Math.max(...ganttData.map(d => d.end))) :
        new Date();

    new Chart(ganttCtx, {
        type: 'bar',
        data: {
            labels: ganttData.map(item => item.task),
            datasets: [{
                data: ganttData.map(item => ({
                    x: [item.start, item.end],
                    y: item.task
                })),
                backgroundColor: ganttData.map(item => item.color),
                borderColor: ganttData.map(item => item.color.replace('0.8', '1')),
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 0.8
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week',
                        displayFormats: {
                            week: 'd MMM'
                        },
                        tooltipFormat: 'd MMM yyyy'
                    },
                    min: minDate,
                    max: maxDate,
                    grid: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: () => '',
                        label: (ctx) => {
                            const start = ctx.raw.x[0];
                            const end = ctx.raw.x[1];
                            return `${start.toLocaleDateString('ru-RU')} - ${end.toLocaleDateString('ru-RU')}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

export default renderGantChart