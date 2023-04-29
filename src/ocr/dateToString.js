export const dateToStringYMD = (date) => {
    let month = date.getMonth() + 1; //months from 1-12
    let day = date.getDate();
    let year = date.getFullYear();
    let newdate = year + "-" + month + "-" + day;
    return newdate
}

export const dateToStringHM = (date) => {
    let hour = date.getHours().toString()
    if (hour.length == 1) hour = '0' + hour
    let minute = date.getMinutes().toString()
    if (minute.length == 1) minute = '0' + minute
    let newtime = hour + ":" + minute;
    return newtime
}

export const dateToStringDMY = (date) => {
    let month = date.getMonth() + 1; //months from 1-12
    let day = date.getDate();
    let year = date.getFullYear();

    if(day < 10)
        day = '0' + day
    if(month < 10)
        month = '0' + month

    let newdate = day + "/" + month + "/" + year;
    return newdate
}