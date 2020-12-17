import { Field, ObjectType } from 'type-graphql';
import { Base } from './base.entity';

@ObjectType({ description: `Images` })
export class Image extends Base {
  @Field()
  name!: string;
}
