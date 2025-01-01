import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { profileRoute } from "./routes/profile";
import { reviewRoute } from "./routes/review";
import { collectionRoute } from "./routes/collection";
import { userRoute } from "./routes/users";

const app = new Hono()
  .route("", authRoute)
  .route("", profileRoute)
  .route("", reviewRoute)
  .route("", collectionRoute)
  .route("", userRoute);

export default app;
