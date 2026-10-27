import jwt from 'jsonwebtoken';

import auth from '../../src/middleware/auth';
import { issueToken } from '../../src/services/authService';

const createResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const createRequest = (authorization, body = {}) => ({
  headers: authorization ? { authorization } : {},
  body
});

describe('auth middleware', () => {
  it('rejects requests without an authorization header', () => {
    const res = createResponse();
    const next = jest.fn();

    auth(createRequest(undefined), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects malformed headers', () => {
    const res = createResponse();
    const next = jest.fn();

    auth(createRequest('Token abc'), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects tokens signed with another secret', () => {
    const res = createResponse();
    const next = jest.fn();
    const foreignToken = jwt.sign({ userId: '123' }, 'not-our-secret');

    auth(createRequest(`Bearer ${foreignToken}`), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts a valid token and exposes its payload', () => {
    const res = createResponse();
    const next = jest.fn();
    const req = createRequest(`Bearer ${issueToken({ userId: 'abc123' })}`);

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.auth.userId).toBe('abc123');
  });

  it('rejects when the body id does not match the token', () => {
    const res = createResponse();
    const next = jest.fn();
    const req = createRequest(`Bearer ${issueToken({ userId: 'abc123' })}`, { userId: 'other' });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
