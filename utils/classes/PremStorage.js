class PremUser {
    /**
     * @returns {PremUser}
     * @param {String} id user id
     * @param {Number} level tier level
     */
    constructor(id, level) {
        this.id = id
        this.level = level
        this.embedColor = "default" // for custom embed color on all messages
        this.lastDaily = "none"
        this.lastWeekly = "none"
        this.status = status.ACTIVE
        this.revokeReason = "none"
        this.startDate = new Date().getTime()
        this.expireDate = new Date().setDate(new Date().getDate() + 35)

        return this
    }

    /**
     * @returns {PremUser}
     * @param {Number} level 
     */
    setLevel(level) {
        this.level = level

        return this
    }

    /**
     * @returns {PremUser}
     * @param {String} color
     */
    setEmbedColor(color) {
        this.embedColor = color

        return this
    }

    /**
     * @returns {PremUser}
     * @param {Date} date
     */
    setLastDaily(date) {
        this.lastDaily = date

        return this
    }


    /**
     * @returns {PremUser}
     * @param {Date} date
     */
    setLastWeekly(date) {
        this.lastWeekly = date

        return this
    }

    /**
     * @returns {PremUser}
     * @param {Number} status
     */
    setStatus(status) {
        this.status = status

        return this
    }

    /**
     * @returns {PremUser}
     * @param {String} reason
     */
    setReason(reason) {
        this.revokeReason = reason

        return this
    }

    /**
     * @returns {PremUser}
     * @param {Date} date
     */
    setStartDate(date) {
        this.startDate = date

        return this
    }

    /**
     * @returns {PremUser}
     * @param {Date} date
     */
    setExpireDate(date) {
        this.expireDate = date
        
        return this
    }

    /**
     * @returns {String}
     */
    getLevelString() {
        switch (this.level) {
        case 0:
            return "none"
        case 1:
            return "BRONZE"
        case 2:
            return "SILVER"
        case 3:
            return "GOLD"
        case 4: 
            return "PLATINUM"
        }
    }

    static getLevelString(number) {
        switch (number) {
        case 0:
            return "none"
        case 1:
            return "BRONZE"
        case 2:
            return "SILVER"
        case 3:
            return "GOLD"
        case 4: 
            return "PLATINUM"
        }
    }

    renew() {
        this.expireDate = new Date().setDate(new Date().getDate() + 35)
    }

    async expire() {
        const { requestDM } = require("../../nypsi")
        const d = await requestDM(this.id, `your **${this.getLevelString()}** membership has expired, join the support server if this is an error ($support)`)

        this.status = status.INACTIVE
        this.level = 0
    }

    /**
     * @returns {PremUser}
     * @param {Object} object
     */
    static fromData(object) {
        const a = new PremUser(object.id, object.level)
        a.setEmbedColor(object.embedColor)
        a.setLastDaily(object.lastDaily)
        a.setLastWeekly(object.lastWeekly)
        a.setStatus(object.status)
        a.setReason(object.revokeReason)
        a.setStartDate(object.startDate)
        a.setExpireDate(object.expireDate)

        return a
    }
}

exports.PremUser = PremUser

const status = {
    INACTIVE: 0,
    ACTIVE: 1,
    REVOKED: 2
}

exports.status = status