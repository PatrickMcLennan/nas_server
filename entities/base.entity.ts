import { Property } from '@mikro-orm/core';
import { Field } from 'type-graphql';

export abstract class Base {
  @Field()
  @Property()
  createdAt = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
