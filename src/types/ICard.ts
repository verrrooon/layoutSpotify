import { IImage } from './IImage'

export  interface ICard {
    id: string;
    description: string;
    name: string;
    images: IImage[];
  }