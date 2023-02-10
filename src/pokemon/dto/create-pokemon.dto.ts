import { IsString, MinLength, IsInt, IsPositive, Min } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  readonly namePokemon: string;
  @IsInt()
  @IsPositive()
  @Min(1)
  readonly no: number;
}
