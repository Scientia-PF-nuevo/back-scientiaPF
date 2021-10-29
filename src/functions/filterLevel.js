// recibe un array de courses y y los parametros de nivel
function filterLevel(array, level1, level2,level3){ 
    
    
    const filtered = [];
    if (level1&&level2&&level3) return array 
    if (!level1&&!level2&&!level3) return array 
    else  if(level1&&level2) {
        array.forEach((c)=>{						
            if(c.level == "begginer" || c.level == "middle" ) {                
                filtered.push(c)
            }
        })
    } else if(level1&&level3) {
        array.forEach((c)=>{						
            if(c.level == "begginer" || c.level == "expert" ) {                
                filtered.push(c)
            }
        })
    } else if(level2&&level3) {
        array.forEach((c)=>{						
            if(c.level == "middle" || c.level == "expert" ) {                
                filtered.push(c)
            }
        })
    } else if (level1 ){
        array.forEach((c)=>{						
            if(c.level == "begginer" ) {                
                filtered.push(c)
            }
        })
    } else if (level2 ){
        array.forEach((c)=>{						
            if(c.level == "middle" ) {                
                filtered.push(c)
            }
        })
    } else if (level3 ){
        array.forEach((c)=>{						
            if(c.level == "expert" ) {                
                filtered.push(c)
            }
        })
    }
    return filtered;
}









module.exports =filterLevel