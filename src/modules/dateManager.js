class CustomDate
{
    constructor(day, month, year)
    {
        this.day = day;
        this.month = month;
        this.year = year;

        this.week = this.getWeekFromDate();
    }

    static createFromDateObject(date)
    {
        if (!date)
        {
            date = new Date();
        }
        return new CustomDate(date.getDate(), date.getMonth(), date.getFullYear());
    }

    getWeekFromDate()
    {
        let currentDate = new Date(this.year, this.month, this.day, new Date().getHours(), new Date().getMinutes());
        let beginningOfYear = new Date(this.year, 0, 1);
        let days = Math.floor((currentDate - beginningOfYear) / (24 * 60 * 60 * 1000));
        
        let weekNumber = Math.ceil(days / 7);
        
        return weekNumber;
    }

    getStringFromDate()
    {
        let day = this.day.toString().padStart(2, "0");
        let month = this.month.toString().padStart(2, "0");
        return `${day}.${month} ${this.year}`;
    }
}

class DateManager
{
    static getTodayDate()
    {
        let date = new Date();
        return new CustomDate(date.getDate(), date.getMonth(), date.getFullYear());
    }

    static getTodayWeek()
    {
        return this.getTodayDate().getWeekFromDate();
    }

    static areDatesEqual(date1, date2)
    {
        if (!date1 || !date2) return false;
        return date1.day === date2.day && 
               date1.month === date2.month && 
               date1.year === date2.year;
    }
}

export {DateManager, CustomDate};