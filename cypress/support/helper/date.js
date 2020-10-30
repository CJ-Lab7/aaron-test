export default class Date {

    /**
     * Converts a seven character format, e.g. 05Mar19, into a mmddyyyy format
     * with backslashes, e.g. 03/05/2019. Assumes the 21st centry, i.e. all years
     * begin with '20'.
     * 
     * @param {String} sevenCharacterFormat A day/month/year format, e.g. 05Mar19.
     */
    static mmddyyyy(sevenCharacterFormat) {
        let day = /[0-9]+[a-zA-Z]/g.exec(sevenCharacterFormat).toString()
        day = day.substring(0, day.length - 1)
        let month = /[a-zA-Z]+/g.exec(sevenCharacterFormat).toString()
        month = this.threeLetterMonth[month]
        let year = /[a-zA-Z][0-9]+/g.exec(sevenCharacterFormat).toString()
        year = year.substring(1, year.length)
        let final = month + '/' + day + '/20' + year
        return final
    }

    /**
     * An object for a three letter month string
     * and its corresponding number string.
     */
    static threeLetterMonth = {
        "Jan": "1",
        "Feb": "2",
        "Mar": "3",
        "Apr": "4",
        "May": "5",
        "Jun": "6",
        "Jul": "7",
        "Aug": "8",
        "Sep": "9",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12"
    }
}