import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { jwtUtils } from '../utils/jwt';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Support both cookie and Authorization Bearer header
    const tokenFromCookie = req.cookies?.accessToken;
    const tokenFromHeader = req.headers.authorization?.split(' ')[1];
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const decoded = jwtUtils.verifyToken(token, config.jwt_access_secret as string);

    if (!decoded.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }

    const { role, id } = decoded.data as JwtPayload;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    req.user = decoded.data as JwtPayload;
    next();
  });
};

export default auth;
