

//real function
module.exports = function stringifyDate(element){
    return JSON.stringify(element).slice(0, 8).split('-').reverse().join('').replace(`"`, "")
}

module.exports = function randomDate(element) {
    const startM = 01
    const endM = 12
    const startY = 2019
    const endY = 2021

    let randomMonth = (Math.floor(Math.random() * (endM - startM + 1)) + startM).toString()
    let randomYear = (Math.floor(Math.random() * (endY - startY + 1)) + startY).toString()

    if(randomMonth.length === 1){
        randomMonth = `0${randomMonth}`
    }
    const date = randomMonth.concat(randomYear)
    //console.log(date)
    return date
}