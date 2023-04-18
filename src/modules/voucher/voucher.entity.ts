import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  public readonly id!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id)
  public user?: User;

  @Column({ type: 'uuid' })
  public userId?: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
