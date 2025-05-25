import { Review } from "./review";

export class WatchableReview extends Review {
  isWatched: boolean;

  constructor(
    props: { isWatched: boolean } & ConstructorParameters<typeof Review>[number]
  ) {
    super(props);

    this.isWatched = props.isWatched;
  }
}
