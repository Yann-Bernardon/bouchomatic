import { Server, Model } from 'miragejs';
import routes from '../static/routes.json';

export function makeServer({ environment = 'development' } = {}) {
    let server = new Server({
        environment,

        routes() {
            this.urlPrefix = routes.baseURL;
            this.namespace = routes.namespace;

            // POST Demarche
            this.post(routes.post.demarches, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.id = Math.floor(Math.random() * 100);

                return { demarche: attrs };
            });

            // POST Mutation
            this.post(routes.post.mutations, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.mut_id = Math.floor(Math.random() * 100);

                return { mutation: attrs };
            });

            // POST Acteur
            this.post(routes.post.acteurs, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.id = Math.floor(Math.random() * 100);

                return { acteur: attrs };
            });

            // POST Composant/argent
            this.post(routes.post.argent, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.id = Math.floor(Math.random() * 100);

                return { composant: attrs };
            });

            // POST Composant/titres
            this.post(routes.post.titres, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.id = Math.floor(Math.random() * 100);

                return { composant: attrs };
            });

            // POST Composant/titres
            this.post(routes.post.autres, (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                attrs.id = Math.floor(Math.random() * 100);

                return { composant: attrs };
            });
        }
    });

    return server;
}
