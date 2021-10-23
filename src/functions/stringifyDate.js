module.exports = function stringifyDate(element){
    return JSON.stringify(element).slice(0, 8).split('-').reverse().join('').replace(`"`, "")
}