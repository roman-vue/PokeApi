import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Pokemon extends Document {
  @Prop({ unique: true, index: true })
  namePokemon: string;
  @Prop({ unique: true, index: true })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
