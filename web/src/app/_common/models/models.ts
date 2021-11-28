export interface Traducao {
    id: string;
    traducao: string;
    classeGramatical: string;
    grupo: string;
    frequencia: string;
}

export interface Pronuncia {
    classeGramatical: string;
    regiao: string;
    pronuncia: string;
}

export interface Significado {
    id: string;
    classeGramatical: string;
    definicao: string;
    exemplos: string[];
}

export interface Dicionario {
    dicionario: string;
    significados: Significado[];
}

export interface RootObject {
    palavra: string;
    traducoes: Traducao[];
    imagens: string[];
    pronuncias: Pronuncia[];
    dicionarios: Dicionario[];
}

