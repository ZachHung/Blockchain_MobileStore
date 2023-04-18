import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  public readonly id!: string;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public discountPercentage!: number;

  @Column()
  @Field()
  public maxQuantity!: number;

  @Column({ default: 0 })
  @Field()
  public inStock!: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  public editBy?: User;

  @Column({ type: 'uuid', nullable: true })
  public userId?: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
