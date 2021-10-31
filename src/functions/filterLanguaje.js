// recibe un array de courses y y los parametros de languajes
//languaje1 = "spanish" languaje2 = "english" languaje3="others"
function filterLanguaje(array, languaje1, languaje2,languaje3){ 
    
    const filtered = [];
    if (languaje1&&languaje2&&languaje3) return array 
    if (!languaje1&&!languaje2&&!languaje3) return array 
    else  if(languaje1&&languaje2) {
        array.forEach((c)=>{						
            if(c.languaje == "spanish" || c.languaje == "english" ) {                
                filtered.push(c)
            }
        })
    } else if(languaje1&&languaje3) {
        array.forEach((c)=>{						
            if(c.languaje == "spanish" || c.languaje == "others" ) {                
                filtered.push(c)
            }
        })
    } else if(languaje2&&languaje3) {
        array.forEach((c)=>{						
            if(c.languaje == "english" || c.languaje == "others" ) {                
                filtered.push(c)
            }
        })
    } else if (languaje1 ){
        array.forEach((c)=>{						
            if(c.languaje == "spanish" ) {                
                filtered.push(c)
            }
        })
    } else if (languaje2 ){
        array.forEach((c)=>{						
            if(c.languaje == "english" ) {                
                filtered.push(c)
            }
        })
    } else if (languaje3 ){
        array.forEach((c)=>{						
            if(c.languaje == "others" ) {                
                filtered.push(c)
            }
        })
    }
    return filtered;
}









module.exports =filterLanguaje