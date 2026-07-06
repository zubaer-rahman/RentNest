import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getPropertyReviews = catchAsync(async (req, res) => {
  const { propertyId } = req.params;
  const result = await ReviewService.getPropertyReviews(propertyId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getPropertyReviews,
};
