export default {
    dateTime(date) {
        let splitted = date.split(/\T|\./)
        return `${splitted[0]}, ${splitted[1]}`
    },

    date(date) {
        let splitted = date.split(/\T|\./)
        return `${splitted[0]}`    
    },

    time(date) {
        let splitted = date.split(/\T|\./)
        return `${splitted[1]}`
    }
}