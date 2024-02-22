const mongoose = require("mongoose");

const MONGO_URL = "mongodb://mongo:aGa323BC-CAd4EhCgedb36aDaFD35b1b@roundhouse.proxy.rlwy.net:21970"

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
