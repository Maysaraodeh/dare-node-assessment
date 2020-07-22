export const asyncHandler = (fn) => async (request, response, next) => {
  try {
    return await fn(request, response, next);
  } catch (error) {
    return next(error);
  }
};
