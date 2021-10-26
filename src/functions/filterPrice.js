// recibe un array de courses y y los parametros de nivel
function filterPrice(array, price1, price2,){ 
    
    console.log(price1,price2)//price1 = free
    //price2 = paid
    const filtered = [];
    if (price1&&price2) return array 
    if (!price1&&!price2) return array 
    else  if(price1) {
        array.forEach((c)=>{						
            if(c.price == 0) {                
                filtered.push(c)
            }
        })
    } else if(price2) {
        array.forEach((c)=>{						
            if(c.price >0) {                
                filtered.push(c)
            }
        })
    } 
    return filtered;
}









module.exports =filterPrice