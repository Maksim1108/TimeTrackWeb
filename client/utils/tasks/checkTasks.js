const checkTasks = (tasks) => {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed_at == null) {
            count++;
        }
    }

    return count;
}

export default checkTasks;