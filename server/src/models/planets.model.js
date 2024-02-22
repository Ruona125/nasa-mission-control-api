const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");

const planets = require("./planets.mongo");

// const habitablePlantes = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}; //this function will filter out those plantes which are habitable

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    ) //this enable us to open up a readable stream
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlantes.push(data);
          savePlanets(data);
        }
      }) //this is used to read file
      .on("err", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable plantes found`);
        resolve();
      });
  });
};

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

const savePlanets = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name, //this will look for a document with kepler _name, that matches the document of the keplerName in that .csv file. it will look for a planet that exist
      },
      {
        keplerName: planet.kepler_name, //it will look for a planet that exists, if it doesn't exist, it will add it.
      },
      {
        upsert: true,
      }
    ); //it will update the planet
  } catch (err) {
    console.error(`could not save planet ${err}`);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
