import { Review } from "../entities/review";
import { IBaseRepository } from "./base.repository";

export interface ReviewRepository extends IBaseRepository<Review> {
  searchReviews(search: string): Promise<Review[]>;
}
