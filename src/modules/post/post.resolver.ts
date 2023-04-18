import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { RequiredContext } from '../../core/types/context.interface';
import { Post } from './post.entity';
import { CreatePostInput, EditPostInput } from './post.input';
import { injectable as Injectable, inject as Inject } from 'inversify';
import { PostService } from './post.service';
import TOKEN from '../../core/container/types.container';

@Injectable()
@Resolver(() => Post)
export class PostResolver {
  constructor(@Inject(TOKEN.Services.Post) private readonly postService: PostService) {}

  @Query(() => Post, { nullable: true })
  async postById(@Arg('postId') postId: string): Promise<Post | null> {
    const response = await this.postService.findById(postId);
    return response;
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() { user }: RequiredContext,
  ): Promise<Post> {
    const response = await this.postService.create(input, user.id);
    return response;
  }

  @Authorized()
  @Mutation(() => Post)
  async editPost(
    @Arg('input') input: EditPostInput,
    @Ctx() { user }: RequiredContext,
  ): Promise<Post> {
    const response = await this.postService.editInfo(input, user.id);
    return response;
  }
}
