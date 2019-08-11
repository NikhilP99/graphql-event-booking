import { verify } from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = verify(token, 'secretkey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
 
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
