import { mock } from 'jest-mock-extended';
import { mockClear, MockProxy } from 'jest-mock-extended/lib/Mock';
import TOKEN from '../../../core/container/types.container';
import { createTestingModule } from '../../../utils/test/create-testing-module';
import { CreatePostInput } from '../post.input';
import { PostModule } from '../post.module';
import { PostResolver } from '../post.resolver';
import { PostService } from '../post.service';
import { faker } from '@faker-js/faker';
import { RequiredContext } from '../../../core/types/context.interface';
import { Role } from '../../../core/types/role.enum';
import { User } from '../../user/user.entity';

describe('PostResolver', () => {
  const mockedPostService: MockProxy<PostService> = mock<PostService>();
  let context: RequiredContext;
  let sut: PostResolver;

  beforeEach(async () => {
    // Bind test container
    const moduleRef = createTestingModule(PostModule);
    moduleRef.rebind(TOKEN.Services.Post).toConstantValue(mockedPostService);
    sut = moduleRef.get(PostResolver);
    context = {
      user: {
        id: faker.datatype.uuid(),
        role: Role.USER,
      },
    } as RequiredContext;
    mockClear(mockedPostService);
  });

  test('should be define', () => {
    expect(sut).toBeDefined();
  });

  describe('createOne()', () => {
    it('should create a new user', async () => {
      // Arrange

      const createPostDTO: CreatePostInput = {
        content: faker.lorem.paragraph(5),
        title: faker.lorem.sentence(),
      };

      mockedPostService.create.mockResolvedValue({
        id: faker.datatype.uuid(),
        content: createPostDTO.content,
        title: createPostDTO.title,
        userId: context.user.id,
        user: new User(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      });

      // Act
      const result = await sut.createPost(createPostDTO, context);

      // Assert
      expect(result).toMatchObject(createPostDTO);
      expect(result.userId).toBe(context.user.id);
    });
  });
});
