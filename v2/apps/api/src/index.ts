import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { profileRoute } from "./routes/profile";
import { reviewRoute } from "./routes/review";
import { collectionRoute } from "./routes/collection";
import { userRoute } from "./routes/users";
import { favoritesRoute } from "./routes/favorites";
import { SessionService, UserService } from "@repo/core/services";
import { UserRepository, SessionRepository } from "@repo/repositories";
import { withDtoResponse } from "./utils/with-dto-response";
import { ISessionService, IUserService } from "@repo/core/services";

declare module "hono" {
  interface ContextVariableMap {
    userService: IUserService;
    sessionService: ISessionService;
  }
}

const app = new Hono()
  .use(async (c, next) => {
    c.set("userService", new UserService(new UserRepository()));
    c.set("sessionService", new SessionService(new SessionRepository()));

    await next();
  })
  .use(withDtoResponse())
  .route("", authRoute)
  .route("", profileRoute)
  .route("", reviewRoute)
  .route("", collectionRoute)
  .route("", userRoute)
  .route("", favoritesRoute);

export default app;
