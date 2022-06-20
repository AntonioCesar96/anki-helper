export class LivrosClasse {
    public livros: any = [
        {
            nome: 'biblia',
            seletorPaginacao: 'a[href^="#calibre_link"]',
            idsEsconder: []
        },
        {
            nome: 'soft-skills',
            seletorPaginacao: 'a[href^="#calibre_link"]',
            idsEsconder: ['#calibre_link-0', '#calibre_link-4', '#calibre_link-13', '.calibreToc', '.calibreEbNav',
                '.calibreMeta', '.calibreEbookContent']
        },
        {
            nome: 'The-Art-of-Communicating',
            seletorPaginacao: '#calibre_link-8 a[href^="#calibre_link"]',
            idsEsconder: ['.calibreMeta', '.calibreToc', '.calibreEbNav', '.calibreEbookContent',
                '#calibre_link-8', '#calibre_link-21', '#calibre_link-29']
        },
        {
            nome: 'Thinking-Fast-and-Slow',
            seletorPaginacao: '#calibre_link-10 a[href^="#calibre_link"]',
            idsEsconder: ['.calibreMeta', '.calibreToc', '.calibreEbNav', '.calibreEbookContent',
                '#calibre_link-8', '#calibre_link-36', '#calibre_link-61', '#calibre_link-142',
                '#calibre_link-19', '#calibre_link-43', '#calibre_link-10', '#calibre_link-140', '#calibre_link-4',
                '#calibre_link-30', '#calibre_link-20', '#calibre_link-97', '#calibre_link-51', '#calibre_link-123', 
                '#calibre_link-168', '#calibre_link-50']
        },
    ];



}