const logger = require("../logger");
const flights = require("../models/flight");
const PAGE_SIZE = 10;

const add = async (data) => {
  try {
    const flight = new flights(data);
    await flight.save();
  } catch (err) {
    // logger.error("Error: " + err);
  }
};

const update = async (flightName, flightData) => {
  await flights.findOneAndUpdate({ name: flightName }, flightData);
};

const remove = async (flightName) => {
  await flights.findOneAndDelete({ name: flightName });
};

const search = async (name, scheduledDateStart, scheduledDateEnd, departure, destination, page) => {
  page = page || 10;
  let filter = {};
  const skip = (page - 1) * PAGE_SIZE;
  if (name) filter.name = name;
  if (destination) filter.destination = destination;
  if (departure) filter.departure = departure;
  if (scheduledDateStart && scheduledDateEnd) {
    filter.scheduledDate = { $gte: scheduledDateStart, $lt: scheduledDateEnd };
  } else if (scheduledDateStart) {
    filter.scheduledDate = { $gte: scheduledDateStart };
  } else if (scheduledDateEnd) {
    filter.scheduledDate = { $lte: scheduledDateEnd };
  }

  const totalCount = (await flights.find(filter)).length;
  const list = await flights.find(filter).skip(skip).limit(PAGE_SIZE);
  return { list, totalCount };
};

module.exports = {
  remove,
  update,
  add,
  search,
};
