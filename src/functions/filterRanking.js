const getScore = require('../functions/getScore')
// recibe un array de courses y y los parametros de rankings
//ranking1 = 1 ranking2 = 2 ranking3=3
function filterRanking(array, ranking1, ranking2,ranking3,ranking4,ranking5){ 
    // console.log(typeof(ranking1),typeof(ranking2),typeof(ranking3))
    console.log((ranking1),(ranking2),(ranking3),(ranking4),(ranking5))
    const filtered = [];
    if (ranking1&&ranking2&&ranking3&&ranking4&&ranking5) return array 
    if (!ranking1&&!ranking2&&!ranking3&&!ranking4&&!ranking5) return array
    else if(ranking1&&ranking2&&ranking3&&ranking4) {
        array.forEach((c)=>{
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 3 || average == 4) {                
                filtered.push(c)
            }
        })
    }else if(ranking2&&ranking3&&ranking4&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 2 || average == 3 ||average == 4 || average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking3&&ranking4&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 3 ||average == 4 || average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking2&&ranking4&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 4 || average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking2&&ranking3&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 3 || average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking2&&ranking3) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 3) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking2&&ranking4) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 4) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking2&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ||average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking3&&ranking4) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 3 ||average == 4) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking3&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 3 ||average == 5) {                
                filtered.push(c)
            }
        })
    }else if(ranking1&&ranking4&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 4 ||average == 5) {                
                filtered.push(c)
            }
        })
    }
    else  if(ranking1&&ranking2) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 2 ) {                
                filtered.push(c)
            }
        })
    } else if(ranking1&&ranking3) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 3 ) {                
                filtered.push(c)
            }
        })
    } else if(ranking1&&ranking4) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 4 ) {                
                filtered.push(c)
            }
        })
        
    } else if(ranking1&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 || average == 5 ) {                
                filtered.push(c)
            }
        })
        
    } else if(ranking2&&ranking3) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 2 || average == 3 ) {                
                filtered.push(c)
            }
        })
        
    }else if(ranking2&&ranking4) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 2 || average == 4 ) {                
                filtered.push(c)
            }
        })
        
    }else if(ranking2&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 2 || average == 5 ) {                
                filtered.push(c)
            }
        })
        
    }else if(ranking3&&ranking4) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 3 || average == 4 ) {                
                filtered.push(c)
            }
        })
        
    }else if(ranking3&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 3 || average == 5 ) {                
                filtered.push(c)
            }
        })
        
    }else if(ranking4&&ranking5) {
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 4 || average == 5 ) {                
                filtered.push(c)
            }
        })
        
    }
    else if (ranking1 ){
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 1 ) {                
                filtered.push(c)
            }
        })
    } else if (ranking2 ){
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 2 ) {                
                filtered.push(c)
            }
        })
    } else if (ranking3 ){
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 3 ) {                
                filtered.push(c)
            }
        })
    }else if (ranking4 ){
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 4 ) {                
                filtered.push(c)
            }
        })
    } else if (ranking5 ){
        array.forEach((c)=>{						
            const average = Math.round(getScore(c))						
            if(average == 5 ) {                
                filtered.push(c)
            }
        })
    }
    return filtered;
}









module.exports =filterRanking