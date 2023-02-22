import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { isString } from 'class-validator';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.namePokemon =
      createPokemonDto.namePokemon.toLocaleLowerCase();
    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      return { data: newPokemon };
    } catch (err) {
      if (err.code === 11000) {
        Logger.error(`${err}`);
        throw new BadRequestException(
          `pokemon exists in db ${JSON.stringify(err.keyValue)}`,
        );
      }
      Logger.error(`${err}`);
      throw new InternalServerErrorException(`internal server -check logs`);
    }
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find();
    return pokemons;
  }

  async findOneByTerm(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
      return pokemon;
    }

    if (!isString(+term)) {
      pokemon = await this.pokemonModel.findOne({
        namePokemon: term.toLocaleLowerCase().trim(),
      });
      return pokemon;
    }

    if (!isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
      return pokemon;
    }

    if (!pokemon) {
      throw new NotFoundException(
        `No se encontro pokemones con este termino ${term}`,
      );
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOneByTerm(term);
    if (updatePokemonDto.namePokemon) {
      pokemon.namePokemon = updatePokemonDto.namePokemon;
      pokemon.no = updatePokemonDto.no;
    } else {
      throw new BadRequestException(`hey debe tener nombre`);
    }
    try {
      const updated = new this.pokemonModel(pokemon);
      const updatedPokemon = await updated.save();
      return updatedPokemon;
    } catch (err) {
      if (err.code === 11000) {
        Logger.error(`${err}`);
        throw new BadRequestException(
          `pokemon exists in db ${JSON.stringify(err.keyValue)}`,
        );
      }
      Logger.error(`${err}`);
      throw new InternalServerErrorException(`internal server -check logs`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
