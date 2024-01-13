// app.get('/remote/:name', (req, res) => {
//     const name = req.params.name
//     if(keys.Name === "NULL") {
//         res.json({
//             success: false,
//             message: `Name of Air does not added`
//         })
//     }else if (keys.Name.toLowerCase() != name.toLocaleLowerCase()) {
//         res.json({
//             success: false,
//             message: `${name} is not Found!!`
//         })
//     }else {
//         res.json({
//             success: true,
//             keys
//         }) 
//     }
// })

// //add or change remote air
// app.patch('/remote/:name', (req, res) => {
//     const new_name = req.params.name

//     if(keys.Name == "NULL" || new_name.toLocaleLowerCase() != keys.Name.toLocaleLowerCase()) {
//         //add or change the name AIR
//         keys.Name = new_name

//         //Write name in JSON
//         fs.writeFile('./key.json', JSON.stringify(keys, null, 2), (err) => {
//             if(err) {
//                 console.log(err)
//                 return
//             }else {
//                 res.json({
//                     success: true,
//                     keys
//                 })
//             }
//             console.log('Write Success! ');
//         });
//     }else {
//         res.json({
//             message: `${new_name} is alredy used`
//         })
//     }
// })
