export interface Imagem {
    src: string;
    checked: boolean;
}

export interface Traducao {
    id: string;
    palavraFiltro: string;
    traducao: string;
    classeGramatical: string;
    grupo: string;
    frequencia: string;
    checked: boolean;
}

export interface Pronuncia {
    classeGramatical: string;
    regiao: string;
    pronuncia: string;
    checked: boolean;
}

export interface Significado {
    id: string;
    classeGramatical: string;
    definicao: string;
    exemplos: string[];
    checked: boolean;
}

export interface Dicionario {
    dicionario: string;
    significados: Significado[];
}

export interface RootObject {
    palavra: string;
    traducoes: Traducao[];
    imagens: Imagem[];
    pronuncias: Pronuncia[];
    dicionarios: Dicionario[];
}

export class Anexo {
    nome!: string;
    url!: string;
}

export class Cartao {
    deckName!: string;
    front!: string;
    back!: string;
    anexos!: Anexo[];
}

