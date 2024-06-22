import { sastojak } from "./sastojak";

export class jelo{
    id: number;
    restoran: string;
    naziv: string;
    slika: string;
    cena: number;
    kolicina: number = 0;
    sastojci: sastojak[] = [];
}