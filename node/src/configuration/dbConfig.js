const mongoose = require('mongoose');

//mongoose.connect("mongodb://localhost:27017/fypDB", {});
mongoose.connect("mongodb+srv://leeyongyee0918:OwRA8MKVUkDHsY94@fyp.7dodkn3.mongodb.net/fypDB",{});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

module.exports = mongoose;

// const connectedToMongoDB = async () => {
//     try {
//         await mongoose.connect("mongodb://localhost:27017/fypDB");
//         console.log("Connected to MongoDB");
//     } catch(error) {
//         console.error(`MongoDB connection error: ${error} `);
//     }
// }

// module.exports = {mongoose, connectedToMongoDB};