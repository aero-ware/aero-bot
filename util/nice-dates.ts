const msToTime = (ms: number) => {
    const iso = new Date(ms).toISOString();
    const [date, time] = iso.split("T");
    const [hours, mins, secs] = time.split(":").map((d) => parseInt(d));
    const [years, months, days] = date.split("-").map((d) => parseInt(d));
    let reply = [];
    if (1970 - years !== 0) reply.push(`${1970 - years} ${1970 - years === 1 ? "year" : "years"}`);
    if (months - 1 !== 0) reply.push(`${months - 1} ${months - 1 === 1 ? "month" : "months"}`);
    if (days - 1 !== 0) reply.push(`${days - 1} ${days - 1 === 1 ? "day" : "days"}`);
    if (hours !== 0) reply.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (mins !== 0) reply.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    if (secs !== 0) reply.push(`${Math.floor(secs)} ${Math.floor(secs) === 1 ? "second" : "seconds"}`);
    return reply.join(", ");
};

export default msToTime;
