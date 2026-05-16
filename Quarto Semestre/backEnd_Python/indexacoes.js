const { MongoClient } = require('mongodb');

class Indexacoes {
    constructor(db) {
        this.db = db;
    }

    async isSiteIndexed(url) {
        try {
            const result = await this.db.collection('indexacoes').findOne({ urlWeb: url });
            return result !== null;
        } catch (error) {
            console.error(`Erro ao verificar indexação do site: ${error}`);
            return false;
        }
    }

    async buscarSitePorUrl(url) {
        try {
            return await this.db.collection('indexacoes').findOne({ urlWeb: url });
        } catch (error) {
            console.error(`Erro ao buscar site: ${error}`);
            return null;
        }
    }

    async indexarSite(dadosSite) {
        try {
            await this.db.collection('indexacoes').updateOne(
                { urlWeb: dadosSite.urlWeb },
                { $set: dadosSite },
                { upsert: true }
            );
            console.log(`Site indexado com sucesso: ${dadosSite.urlWeb}`);
        } catch (error) {
            console.error(`Erro ao indexar site: ${error}`);
        }
    }
}

// Exemplo de uso:
async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('resist');
        const indexacoes = new Indexacoes(db);

        // Exemplo de como buscar um site
        const site = await indexacoes.buscarSitePorUrl("exemplo.com");
        console.log('Site encontrado:', site);

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await client.close();
    }
}

main().catch(console.error); 