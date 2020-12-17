import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Base {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
