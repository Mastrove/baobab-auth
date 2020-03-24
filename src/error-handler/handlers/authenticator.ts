import jwt from 'jsonwebtoken';

export default (error) => {
  const status = 403;
  let content;

  if (error instanceof jwt.TokenExpiredError) {
    content = 'expired access token';
  } else if (error instanceof jwt.JsonWebTokenError) {
    content = 'invalid access token';
  }

  return { status, content };
};
