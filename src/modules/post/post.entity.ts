import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../core/shared/entity';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Column()
  @Field()
  public title!: string;

  @Column()
  @Field()
  public content!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  public user!: User;
  @Column({ type: 'uuid' })
  public userId!: string;
}
