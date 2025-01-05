import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { profileRoute } from "./routes/profile";
import { reviewRoute } from "./routes/review";
import { collectionRoute } from "./routes/collection";
import { userRoute } from "./routes/users";
import { favoritesRoute } from "./routes/favorites";
import {
  IReviewService,
  SessionService,
  UserService,
  CollectionService,
  ICollectionService,
  IFavoriteCollectionService,
  FavoriteCollectionService,
  ISubscriptionService,
  SubscriptionService,
} from "@repo/core/services";
import {
  UserRepository,
  SessionRepository,
  CollectionRepository,
  FavoriteCollectionRepository,
  SubscriptionRepository,
} from "@repo/repositories";
import { withDtoResponse } from "./utils/with-dto-response";
import { ISessionService, IUserService } from "@repo/core/services";
import { User } from "@repo/core/entities";

declare module "hono" {
  interface ContextVariableMap {
    userService: IUserService;
    sessionService: ISessionService;
    reviewService: IReviewService;
    collectionService: ICollectionService;
    favoriteCollectionService: IFavoriteCollectionService;
    subscriptionService: ISubscriptionService;

    user?: User;
  }
}

const app = new Hono()
  .use(async (c, next) => {
    c.set("userService", new UserService(new UserRepository()));
    c.set("sessionService", new SessionService(new SessionRepository()));
    c.set(
      "collectionService",
      new CollectionService(new CollectionRepository(), new UserRepository())
    );
    c.set(
      "favoriteCollectionService",
      new FavoriteCollectionService(
        new FavoriteCollectionRepository(),
        new CollectionRepository(),
        new UserRepository()
      )
    );
    c.set(
      "subscriptionService",
      new SubscriptionService(
        new SubscriptionRepository(),
        new UserRepository()
      )
    );

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
