// recibe un array de courses y y los parametros de nivel
function filterPrice(array, price1, price2,price3){ 
    
    console.log(price1,price2,price3)//price1 = free
    //price2 = paid
    const filtered = [];
     
    if (price1&&price2&&price3) return array 
    if (!price1&&!price2&&!price3) return array 
    if (price1&&price2) return array 
    if (price1&&price3) {
        array.forEach((c)=>{						
            if(c.price == 0 ||c.numbersOfDiscounts>0) {                
                filtered.push(c)
            }
        })
    } else if (price2&&price3) {
        array.forEach((c)=>{						
            if(c.price > 0 ||c.numbersOfDiscounts>0) {                
                filtered.push(c)
            }
        })
    }
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
    } else if(price3) {
        array.forEach((c)=>{						
            if(c.numbersOfDiscounts >0) {                
                filtered.push(c)
            }
        })
    } 
    return filtered;
}









module.exports =filterPrice