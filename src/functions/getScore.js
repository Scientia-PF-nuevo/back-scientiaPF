module.exports = function getScore(obj){
    let suma = 0;
    let average;
    //console.log(c)
    const SCs = obj.reviews.map((r, index) => {
        suma = suma + r.score;
        //console.log(suma)
        average = suma / index;
    });
    return average
}