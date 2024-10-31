import { Request, Response, NextFunction, RequestHandler } from "express";

// Wrapper function
function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Execute the async function and catch any errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export { asyncHandler };
