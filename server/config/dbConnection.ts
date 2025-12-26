import mongoose from "mongoose";

const uri = process.env.Atlas_URI;

if (!uri) {
  throw new Error("Atlas_url is not defined");
}

export async function connectDb(): Promise<void> {
  // function name () : Promise<void> means it will return nothing
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        "Found error while connecting with DB config:",
        err.message,
      );
    } else {
      console.error("MongoDB connection failed:", err);
    }
    throw err;
  }
}
