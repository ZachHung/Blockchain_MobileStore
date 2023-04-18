import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { getEnv } from '../../utils/get-env';
import { UserTokens } from './user.types';
import jwt from 'jsonwebtoken';
import { mutationReturn } from '../../utils/return-type';
import { GraphQLError } from 'graphql';
import { injectable as Injectable, inject as Inject } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { UserRepository } from './user.repository';
import Service from '../../core/shared/service';

dotenv.config();
@Injectable()
export class UserService implements Service<User> {
  constructor(@Inject(TOKEN.Repositories.User) private readonly userRepository: UserRepository) {}
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneWhere('id', id);
    if (!user) throw new GraphQLError('User not found!');
    return user;
  }

  async register(input: RegisterInput): Promise<User> {
    let { password } = input;
    password = await bcrypt.hash(password, +getEnv('SALT_ROUND'));
    const newUser = this.userRepository.create({ ...input, password });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async login(input: LoginInput): Promise<UserTokens> {
    const { password, usernameOrEmail } = input;
    const user = await this.userRepository.findOneBy([
      { username: usernameOrEmail },
      { email: usernameOrEmail },
    ]);

    if (!user) throw new GraphQLError('Invalid credentials');
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) throw new GraphQLError('Invalid credentials');

    const accessToken = jwt.sign({ id: user.id, role: user.role }, getEnv('SECRET_JWT'), {
      expiresIn: getEnv('JWT_EXPIRED'),
    });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, getEnv('SECRET_REFRESH'), {
      expiresIn: getEnv('REFRESH_EXPIRED'),
    });

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  async getAll(): Promise<User[]> {
    const userList = await this.userRepository.find();
    return userList;
  }

  async editInfo(input: EditInfoInput, userId: string): Promise<User> {
    const update = await mutationReturn<User>(
      // User query builder because of issue https://github.com/typeorm/typeorm/issues/2415
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...input })
        .where('id = :id ', {
          id: userId,
        })
        .returning('*')
        .execute(),
    );
    return update;
  }

  async changePassword(input: ChangePasswordInput, userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    // Check password hash
    if (!user) throw new GraphQLError('Invalid credentials');
    const isValidPass = await bcrypt.compare(input.oldPassword, user.password);
    if (!isValidPass) throw new GraphQLError('Invalid credentials');

    const newPassword = await bcrypt.hash(input.newPassword, +getEnv('SALT_ROUND'));
    return await mutationReturn<User>(
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: newPassword })
        .where('id = :id ', {
          id: userId,
        })
        .returning('*')
        .execute(),
    );
  }
}
