const cron = require('node-cron')

class CronService {
    _tasks

    constructor() {
        this._tasks = []
    }  

    addTask(timeString, filterUrl, callback) {
        const task = cron.schedule(timeString, callback)
        this._tasks.push({ filterUrl, task })
    }

    async updateTask(timeString, { 
        filterUrl, 
        oldFilterUrl, 
        status 
    }, callback) {
        this.deleteTask(oldFilterUrl)

        const updatedTask = cron.schedule(timeString, callback)
        if (status === 'paused') updatedTask.stop()
   
        this._tasks.push({ filterUrl, task: updatedTask })
    }

    restoreTask(timeString, { filterUrl, status }, callback) {
        const task = cron.schedule(timeString, callback)
        if (status === 'paused') task.stop()

        this._tasks.push({ filterUrl, task })
    }

    startTask(filterUrl) {        
        const { task } = this.findTaskByUrl(filterUrl)
        task.start()
    }

    pauseTask(filterUrl) {
        const { task } = this.findTaskByUrl(filterUrl)
        task.stop()
    }

    deleteTask(filterUrl) {
        const taskExists = this.findTaskByUrl(filterUrl)
        if (!taskExists) return

        const { task } = taskExists
        task.stop()

        this.removeTaskByUrl(filterUrl)
    }

    findTaskByUrl(url) {
        return this._tasks.find(task => task.filterUrl === url)
    }

    removeTaskByUrl(url) {
        this._tasks = this._tasks.filter(task => task.filterUrl !== url)
    }
}

module.exports = {
    CronService
}