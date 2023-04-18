import { DataSource } from 'typeorm';
import TOKEN from '../../../core/container/types.container';
import { Role } from '../../../core/types/role.enum';
import { createTestingModule } from '../../../utils/test/create-testing-module';
import { setupConnection } from '../../../utils/test/setup-DB';
import { User } from '../../user/user.entity';
import { UserModule } from '../../user/user.module';
import { Post } from '../post.entity';
import { CreatePostInput, EditPostInput } from '../post.input';
import { PostModule } from '../post.module';
import { PostService } from '../post.service';

describe('PostService', () => {
  let post: Post;
  let connection: DataSource;
  let sut: PostService;
  let user: User;

  beforeAll(async () => {
    // Connect to Test DB
    connection = await setupConnection(Post, User);

    // Bind test container
    const moduleRef = createTestingModule(PostModule, UserModule);
    moduleRef.bind<DataSource>(TOKEN.DataSource.Postgres).toConstantValue(connection);
    sut = moduleRef.get(TOKEN.Services.Post);

    // Create User for Testing
    user = connection.getRepository(User).create({
      username: 'test',
      age: 21,
      email: 'zachhung911@gmail.com',
      password: 'testpass',
      firstName: 'test',
      lastName: 'test',
      role: Role.USER,
    });
    await connection.getRepository(User).save(user);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('createPost()', () => {
    test('should created a new post', async () => {
      // Arrange
      const createPostInput: CreatePostInput = {
        content: 'test content',
        title: 'test title',
      };

      // Act
      const result = await sut.create(createPostInput, user.id);
      post = result;

      // Assert
      expect(result).toMatchObject(createPostInput);
      expect(result.userId).toBe(user.id);
      expect(result.user).toMatchObject(user);
    });
  });

  describe('find()', () => {
    test('should return the same post we just created', async () => {
      const result = await sut.findById(post.id);
      expect(result).not.toBeNull();
      expect(result?.user).toMatchObject(user);
      expect(result?.userId).toBe(user.id);
    });

    test("should return null when can't find post", async () => {
      const result = await sut.findById('');
      expect(result).toBeNull();
    });
  });

  describe('edit()', () => {
    test('should return the edited post', async () => {
      const editInput1: EditPostInput = {
        id: post.id,
        content: 'updated content',
      };
      const editInput2: EditPostInput = {
        id: post.id,
      };
      const editInput3: EditPostInput = {
        id: post.id,
        content: 'updated content',
        title: 'updated title',
      };

      const result1 = await sut.editInfo(editInput1, user.id);
      const result2 = await sut.editInfo(editInput2, user.id);
      const result3 = await sut.editInfo(editInput3, user.id);

      expect(result1).toMatchObject(editInput1);
      expect(result2).toMatchObject(editInput2);
      expect(result3).toMatchObject(editInput3);
    });
  });
});
