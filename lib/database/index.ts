import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  global.mongoose.promise =
    global.mongoose.promise ||
    mongoose.connect(MONGO_URI, {
      dbName: "leaseBuddies",
      bufferCommands: false,
    }).then((mongoose) => mongoose.connection);

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
};
