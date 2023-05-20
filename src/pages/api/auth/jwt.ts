import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config({ path: __dirname + '/.env' });
import { JWT } from 'next-auth/jwt';

// Usually I keep the token between 5 minutes - 15 minutes

function generateAccessToken(token: JWT) {
  return jwt.sign(
    { userId: token.sub },
    process.env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: '1m',
    },
  );
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
function generateRefreshToken(token: JWT) {
  return jwt.sign(
    {
      userId: token.sub,
      jti: token.jti,
    },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: '8h',
    },
  );
}

export function generateTokens(token: JWT) {
  const accessToken = generateAccessToken(token);
  const refreshToken = generateRefreshToken(token);

  return {
    accessToken,
    refreshToken,
  };
}

export function hashToken(token: string) {
  return crypto.createHash('sha512').update(token).digest('hex');
}

export const expiresAt = (token: string) => {
  const t = jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret) as {
    exp: number;
  };
  return t.exp;
};
