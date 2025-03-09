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
  IImageService,
  ImageService,
} from "@repo/core/services";
import {
  UserRepository,
  SessionRepository,
  CollectionRepository,
  FavoriteCollectionRepository,
  SubscriptionRepository,
  ReviewRepository,
  FilmRepository,
  CollectionLikeRepository,
} from "@repo/repositories";
import { withEntityCheck } from "./utils/check-entity";
import { ISessionService, IUserService } from "@repo/core/services";
import { Session } from "@repo/core/entities";
import { UnofficialKpProvider } from "@repo/film-providers";
import { searchRoute } from "./routes/search";
import { sessionMiddleware } from "./utils/session-middleware";
import { uploadRoute } from "./routes/upload";
import { sessionCookieMiddleware } from "./utils/session-cookie-middleware";

declare module "hono" {
  interface ContextVariableMap {
    userService: IUserService;
    sessionService: ISessionService;
    reviewService: IReviewService;
    collectionService: ICollectionService;
    favoriteCollectionService: IFavoriteCollectionService;
    subscriptionService: ISubscriptionService;
    imageService: IImageService;

    session?: Session;
  }
}

// Providers
const filmProvider = new UnofficialKpProvider();

// Repositories
const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();
const collectionRepository = new CollectionRepository();
const favoriteCollectionRepository = new FavoriteCollectionRepository();
const reviewRepository = new ReviewRepository();
const filmRepository = new FilmRepository();
const subscriptionRepository = new SubscriptionRepository();
const collectionLikeRepository = new CollectionLikeRepository();

// Services
const userService = new UserService(userRepository);
const sessionService = new SessionService(sessionRepository);
const collectionService = new CollectionService(
  collectionRepository,
  userRepository,
  collectionLikeRepository,
  favoriteCollectionRepository
);
const filmService = new FilmService(filmRepository);
const favoriteCollectionService = new FavoriteCollectionService(
  favoriteCollectionRepository,
  collectionRepository,
  userRepository,
  collectionService
);
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  userRepository
);
const reviewService = new ReviewService(
  reviewRepository,
  filmService,
  filmProvider,
  collectionService,
  userRepository
);
const imageService = new ImageService();

const api = new Hono()
  .use(async (c, next) => {
    c.set("userService", userService);
    c.set("sessionService", sessionService);
    c.set("collectionService", collectionService);
    c.set("favoriteCollectionService", favoriteCollectionService);
    c.set("reviewService", reviewService);
    c.set("subscriptionService", subscriptionService);
    c.set("imageService", imageService);

    await next();
  })
  .use(withEntityCheck())
  .use(sessionMiddleware)
  .use(sessionCookieMiddleware)
  .route("auth", authRoute)
  .route("profile", profileRoute)
  .route("reviews", reviewRoute)
  .route("collections", collectionRoute)
  .route("users", userRoute)
  .route("search", searchRoute)
  .route("favorites", favoritesRoute)
  .route("upload", uploadRoute);

Deno.serve({ port: 8080 }, api.fetch);

export type Api = typeof api;
