//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const courses =require("./testCourses");
const category = require("./testCategories")
const { default: fetch } = require('node-fetch');

const cargaCategoria = async () => {
   category.forEach( (c) => {
    const response= fetch('http://localhost:3001/courses/newcategory',{
      method: 'POST',
      headers:{ "Content-Type": "application/json"},
      body: JSON.stringify(c)
    })
   })
}
const cargaCursos = async () => {
  courses.forEach((c)=>{ 
    const response= fetch('http://localhost:3001/courses/newcourse',{
  method: 'POST',
  headers:{ "Content-Type": "application/json"},
  body: JSON.stringify(c)
})
  })
}


// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
   cargaCategoria();
   cargaCursos();

  });

 
});
