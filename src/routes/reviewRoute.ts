import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";
import { validateInputs, authorizeUser } from "../middlewares";
import { createReviewSchema, updateReviewSchema } from "../schema";

export class ReviewRouter {
	private router: Router;
	private reviewController: ReviewController;
	constructor() {
		this.router = Router();
		this.reviewController = new ReviewController();
		this.initializeRouter();
	}
	private initializeRouter() {
		this.router.post(
			"/review-product/:productId",
			authorizeUser,
			validateInputs(createReviewSchema),
			this.reviewController.createReview.bind(this.reviewController),
		);
		//update review route
		this.router.patch(
			"/update-review/:reviewId",
			authorizeUser,
			validateInputs(updateReviewSchema),
			this.reviewController.updateReview.bind(this.reviewController),
		);
	}

	public getReviewRouter() {
		return this.router;
	}
}
