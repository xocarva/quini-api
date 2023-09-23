import { login } from '../../../../src/api/v1/services/auth';
import { getUser } from '../../../../src/api/v1/repository';
import { generateToken, verifyPassword } from '../../../../src/utils';
import { DatabaseError, NotFoundError, UnauthorizedError } from '../../../../src/errors';
import { UserWithId } from '../../../../src/api/v1/schemas';

jest.mock('../../../../src/api/v1/repository/mongodb/db');
jest.mock('../../../../src/api/v1/repository');
jest.mock('../../../../src/utils');

describe('login', () => {
  const credentials = { email: 'test@example.com', password: 'password' };
  const user: UserWithId = { id: '1', email: credentials.email, password: 'hashedPassword' };
  const token = 'token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when given valid credentials', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(user);
    (verifyPassword as jest.Mock).mockResolvedValueOnce(true);
    (generateToken as jest.Mock).mockReturnValueOnce(token);

    const result = await login(credentials);

    expect(result).toBe(token);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledWith({ email: credentials.email });
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(verifyPassword).toHaveBeenCalledWith(credentials.password, user.password);
    expect(generateToken).toHaveBeenCalledTimes(1);
    expect(generateToken).toHaveBeenCalledWith({ user: { id: user.id } });
  });

  it('should throw a NotFoundError when given an email that does not exist', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);

    await expect(login(credentials)).rejects.toThrow(NotFoundError);

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledWith({ email: credentials.email });
    expect(verifyPassword).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it('should throw an UnauthorizedError when given an incorrect password', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(user);
    (verifyPassword as jest.Mock).mockResolvedValueOnce(false);

    await expect(login(credentials)).rejects.toThrow(UnauthorizedError);

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledWith({ email: credentials.email });
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(verifyPassword).toHaveBeenCalledWith(credentials.password, user.password);
    expect(generateToken).not.toHaveBeenCalled();
  });

  it('should throw a DatabaseError when there is an error getting the user', async () => {
    (getUser as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(login(credentials)).rejects.toThrow(DatabaseError);

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledWith({ email: credentials.email });
    expect(verifyPassword).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });
});
