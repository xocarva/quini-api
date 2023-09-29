import z from 'zod';
import {
  partialUserSchema,
  partialUserWithIdSchema,
  userSchema,
  userWithIdSchema,
} from '../../../../src/api/v1/schemas';

describe('userSchema', () => {
  it('should validate a correct user', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(() => userSchema.parse(user)).not.toThrow();
  });

  it('should invalidate a user with incorrect email', () => {
    const user = {
      email: 'notAnEmail',
      password: 'password123',
    };

    expect(() => userSchema.parse(user)).toThrow(z.ZodError);
  });

  it('should invalidate a user with a short password', () => {
    const user = {
      email: 'test@example.com',
      password: 'short',
    };

    expect(() => userSchema.parse(user)).toThrow(z.ZodError);
  });

  it('should allow an optional name', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John',
    };

    expect(() => userSchema.parse(user)).not.toThrow();
  });

  it('should validate without a name', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(() => userSchema.parse(user)).not.toThrow();
  });
});

describe('partialUserSchema', () => {
  it('should validate a partial user', () => {
    const user = {
      email: 'test@example.com',
    };

    expect(() => partialUserSchema.parse(user)).not.toThrow();
  });

  it('should invalidate a partial user with incorrect email', () => {
    const user = {
      email: 'notAnEmail',
    };

    expect(() => partialUserSchema.parse(user)).toThrow(z.ZodError);
  });
});

describe('userWithIdSchema', () => {
  it('should validate a user with ID', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
      id: '123',
    };

    expect(() => userWithIdSchema.parse(user)).not.toThrow();
  });

  it('should invalidate a user without ID', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(() => userWithIdSchema.parse(user)).toThrow(z.ZodError);
  });
});

describe('partialUserWithIdSchema', () => {
  it('should validate a partial user with ID', () => {
    const user = {
      id: '123',
    };

    expect(() => partialUserWithIdSchema.parse(user)).not.toThrow();
  });

  it('should validate a partial user without ID', () => {
    const user = {
      email: 'test@example.com',
    };

    expect(() => partialUserWithIdSchema.parse(user)).not.toThrow();
  });
});
