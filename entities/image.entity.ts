import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: `Images` })
export class Image {
  @Field()
  name: string;
}
