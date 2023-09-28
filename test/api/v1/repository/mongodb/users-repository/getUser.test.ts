import { ObjectId } from 'mongodb';
import {
  usersCollection,
} from '../../../../../../src/api/v1/repository/mongodb/users-repository/usersCollection';
import { getUser } from '../../../../../../src/api/v1/repository/mongodb';

jest.mock(
  '../../../../../../src/api/v1/repository/mongodb/users-repository/usersCollection', () => ({
    usersCollection: {
      findOne: jest.fn(),
    },
  }));

jest.mock('../../../../../../src/api/v1/repository/mongodb/db', () => ({
  getCollection: jest.fn(),
}));

describe('getUser', () => {
  beforeEach(() => {
    (usersCollection.findOne as jest.Mock).mockClear();
  });

  it('should return user if exists', async () => {
    const mockUser = {
      _id: new ObjectId(),
      email: 'test@example.com',
      password: 'testPassword',
    };

    (usersCollection.findOne as jest.Mock).mockResolvedValue(mockUser);

    const user = await getUser({ id: mockUser._id.toString() });

    expect(user).toEqual({
      id: mockUser._id.toString(),
      email: mockUser.email,
      password: mockUser.password,
    });
  });

  it('should return null if user does not exist', async () => {
    (usersCollection.findOne as jest.Mock).mockResolvedValue(null);

    const user = await getUser({ id: new ObjectId().toString() });

    expect(user).toBeNull();
  });

  it('should return null for invalid ObjectID', async () => {
    const user = await getUser({ id: 'invalidObjectID' });

    expect(user).toBeNull();
  });
});
