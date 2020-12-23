// me doing LITERAL MAGIC to turn a ms (number) into a nice string...
// this really did take me longer to do than the mute command smh
const msToTime = ms => {
    if (!ms) return null
    const iso = new Date(ms).toISOString()
    const [date, time] = iso.split('T')
    const [hours, mins, secs] = time.split(':')
    const [years, months, days] = date.split('-')
    let reply = []
    if (parseInt(1970 - years) !== 0) reply.push(`${parseInt(1970 - years)} ${parseInt(1970 - years) === 1 ? 'year' : 'years'}`)
    if (parseInt(months - 1) !== 0) reply.push(`${parseInt(months - 1)} ${parseInt(months - 1) === 1 ? 'month' : 'months'}`)
    if (parseInt(days - 1) !== 0) reply.push(`${parseInt(days - 1)} ${parseInt(days - 1) === 1 ? 'day' : 'days'}`)
    if (parseInt(hours) !== 0) reply.push(`${parseInt(hours)} ${parseInt(hours) === 1 ? 'hour' : 'hours'}`)
    if (parseInt(mins) !== 0) reply.push(`${parseInt(mins)} ${parseInt(mins) === 1 ? 'minute' : 'minutes'}`)
    if (parseFloat(secs) !== 0) reply.push(`${Math.floor(parseFloat(secs))} ${Math.floor(parseFloat(secs)) === 1 ? 'second' : 'seconds'}`)
    return reply.join(', ')
}

module.exports = msToTime