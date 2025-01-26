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
  ReviewService,
  FilmService,
} from "@repo/core/services";
import {
  UserRepository,
  SessionRepository,
  CollectionRepository,
  FavoriteCollectionRepository,
  SubscriptionRepository,
  ReviewRepository,
  FilmRepository,
} from "@repo/repositories";
import { withDtoResponse } from "./utils/with-dto-response";
import { ISessionService, IUserService } from "@repo/core/services";
import { User } from "@repo/core/entities";
import { UnofficialKpProvider } from "@repo/film-providers";
import { searchRoute } from "./routes/search";

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

const api = new Hono()
  .use(async (c, next) => {
    const filmProvider = new UnofficialKpProvider();

    const userRepository = new UserRepository();
    const sessionRepository = new SessionRepository();
    const collectionRepository = new CollectionRepository();
    const favoriteCollectionRepository = new FavoriteCollectionRepository();
    const reviewRepository = new ReviewRepository();
    const filmRepository = new FilmRepository();
    const subscriptionRepository = new SubscriptionRepository();
    const userService = new UserService(userRepository);
    const sessionService = new SessionService(sessionRepository);
    const collectionService = new CollectionService(
      collectionRepository,
      userRepository
    );
    const filmService = new FilmService(filmRepository);
    const favoriteCollectionService = new FavoriteCollectionService(
      favoriteCollectionRepository,
      collectionRepository,
      userRepository
    );
    const subscriptionService = new SubscriptionService(
      subscriptionRepository,
      userRepository
    );
    const reviewService = new ReviewService(
      reviewRepository,
      filmService,
      filmProvider,
      collectionService
    );

    c.set("userService", userService);
    c.set("sessionService", sessionService);
    c.set("collectionService", collectionService);
    c.set("favoriteCollectionService", favoriteCollectionService);
    c.set("reviewService", reviewService);
    c.set("subscriptionService", subscriptionService);

    await next();
  })
  .use(withDtoResponse())
  .route("", authRoute)
  .route("", profileRoute)
  .route("", reviewRoute)
  .route("", collectionRoute)
  .route("", userRoute)
  .route("", searchRoute)
  .route("", favoritesRoute);

export default api;

export type Api = typeof api;
