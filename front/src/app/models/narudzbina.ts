import { deoNarudzbine } from "./deoNarudzbine";

export class narudzbina{
    id: number;
    restoran: string;
    status: string;
    minVremeDostave: number;
    maxVremeDostave: number;
    datum: Date;
    gost: string;
    deoNarudzbine: deoNarudzbine[] = [];
    cena: number; 
}