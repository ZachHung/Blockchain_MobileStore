import { IsNotEmpty, IsPositive, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Event } from './event.entity';

@InputType()
export class CreateEventInput implements Partial<Event> {
  @Field()
  @IsNotEmpty()
  public readonly name!: string;

  @Field()
  @IsPositive()
  @Max(100)
  public readonly discountPercentage!: number;

  @Field()
  @Min(1)
  public maxQuantity!: number;
}
