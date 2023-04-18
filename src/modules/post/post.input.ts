import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Post } from './post.entity';

@InputType()
export class CreatePostInput implements Partial<Post> {
  @IsNotEmpty()
  @Field()
  public readonly title!: string;

  @IsNotEmpty()
  @Field()
  public readonly content!: string;
}

@InputType()
export class EditPostInput implements Partial<Post> {
  @IsUUID()
  @Field()
  public readonly id: string;

  @IsOptional()
  @Field({ nullable: true })
  public readonly title?: string;

  @IsOptional()
  @Field({ nullable: true })
  public readonly content?: string;
}
