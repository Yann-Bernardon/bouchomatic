<template>
    <div class="p-4">
        <button
            class="btn btn-big btn-color float-right  inline-flex items-center"
            @click="flow"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
            >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>

            Flow !
        </button>

        <input
            type="file"
            ref="inputUpload"
            accept=".json"
            @change="charger($event)"
            class="hidden"
        />
        <button
            class="btn btn-big float-right inline-flex items-center mr-2"
            @click="focusUploadInput"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Post
        </button>

        <button
            class="btn btn-big float-right inline-flex items-center mr-2"
            @click="enregistrer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Get
        </button>

        <h1 class="text-3xl mb-2 italic text-teal-600">Bouchomatic EE</h1>

        <demarche
            v-for="(cleDemarche, index) in listeDemarches"
            :cleDemarche="cleDemarche"
            :key="cleDemarche"
        >
            Démarche {{ index + 1 }}
        </demarche>

        <button class="btn btn-blue" @click="ajouterDemarche">
            Ajouter une démarche
        </button>
    </div>
</template>

<script>
import routes from '../static/routes.json';
import bouchon from '../static/bouchon.json';
import enums from '../static/enums.json';
import outils from '../static/outils.js';

import Demarche from '../components/demarches/Demarche.vue';

export default {
    components: {
        Demarche,
        routes: routes
    },
    data: function() {
        return {
            baseRoute: routes.baseURL + routes.namespace,
            enums
        };
    },
    methods: {
        ajouterDemarche() {
            this.$store.commit('donation/ajouterDemarche');
        },
        focusUploadInput() {
            this.$refs.inputUpload.click();
        },
        charger(event) {
            const fr = new FileReader();
            fr.onload = e => {
                const jsonStore = JSON.parse(e.target.result);
                this.$store.commit('donation/chargerJson', jsonStore);
            };
            fr.readAsText(event.target.files[0]);
        },

        // Enregistrement du JSON du store
        enregistrer() {
            const nomFichier = 'Sans nom.json';
            const jsonData = JSON.stringify(this.$store.state.donation);

            let blob = new Blob([jsonData], {
                type: 'text/plain;charset=utf-8;'
            });
            let lienTemporaire = document.createElement('a');
            if (lienTemporaire.download !== undefined) {
                // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                lienTemporaire.setAttribute('href', url);
                lienTemporaire.setAttribute('download', nomFichier);
                lienTemporaire.style.visibility = 'hidden';
                document.body.appendChild(lienTemporaire);
                lienTemporaire.click();
                document.body.removeChild(lienTemporaire);
            }
        },

        // Envois de l'ensemble des démarches
        flow() {
            /* =================================================================================
            Reconstitution du Saint-Flow pour chaque démarche saisie
            3.1.2.1 POST Demarche -> envoyerDemarche()
            3.1.2.1 POST mutation -> envoyerMutation() pour chaque donateur
            3.1.2.1 POST acteur (donataire) -> envoyerActeurs() pour chaque mutation
            3.1.4 POST acteur (donateur) -> envoyerActeurs() pour chaque mutation
            3.1.6 POST composant/argent -> envoyerComposants() -> envoyerArgent()
            3.1.6 POST composant/titres -> envoyerComposants() -> envoyerTitres()
            3.1.6 POST composant/autres -> envoyerComposants() -> envoyerAutres()
            4 POST HistoConsos
            4 PATCH Demarche
            * =============================================================================== */
            this.listeDemarches.forEach(this.envoyerDemarche);
        },

        // Appel API de création d'une démarche
        // 3.1.2.1 POST Demarche
        async envoyerDemarche(cleDemarche) {
            // Récupération dela démarche dans le store
            let demarche = this.$store.state.donation.demarches[cleDemarche];

            // Récupération des clés des acteurs, composants... de la démarche
            const cles = {
                donataire: demarche.donataire,
                donateurs: demarche.donateurs,
                argent: demarche.argent,
                titres: demarche.titres,
                autres: demarche.autres
            };

            // Nettoyage de l'objet démarche (suppressions des attributs générés par le bouchomatic)
            demarche = outils.nettoyer(demarche, bouchon.demarche);

            await this.$axios
                .$post(this.baseRoute + routes.post.demarches, demarche)
                .then(reponse => {
                    // Succès : Création d'une mutation par donateur
                    cles.donateurs.forEach(async cleDonateur => {
                        this.envoyerMutation(
                            reponse.demarche.id, // ID de la démarche créée
                            cleDonateur, // Donateur de la mutation
                            cles
                        );
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },

        // Appel API de création d'une mutation
        // 3.1.2.1 POST mutation
        async envoyerMutation(idDemarche, cleDonateur, cles) {
            // Création d'une mutation à partir du bouchon
            let mutation = outils.clone(bouchon.mutation);
            mutation.demarche = idDemarche;

            // POST Mutation
            await this.$axios
                .$post(this.baseRoute + routes.post.mutations, mutation)
                .then(reponse => {
                    this.envoyerActeurs(reponse.mutation.id, [
                        cles.donataire,
                        cleDonateur
                    ]);
                    this.envoyerComposants(reponse.mutation.id, cles);
                })
                .catch(err => {
                    console.log(err);
                });
        },

        // Appel API de création d'un acteur
        // 3.1.2.1 POST acteur (donataire)
        // 3.1.4 POST acteur (donateur)
        async envoyerActeurs(idMutation, clesActeurs) {
            clesActeurs.forEach(async cleActeur => {
                let acteur = this.$store.state.donation.acteurs[cleActeur];
                acteur = outils.nettoyer(acteur, bouchon.donataire);
                acteur.mutation = idMutation;

                await this.$axios
                    .$post(this.baseRoute + routes.post.acteurs, acteur)
                    .catch(err => {
                        console.log(err);
                    });
            });
        },

        // Appels API de création des composants
        async envoyerComposants(idMutation, cles) {
            // 3.1.6 POST composant/argent
            if (cles.argent) {
                this.envoyerArgent(idMutation, cles);
            }

            // 3.1.6 POST composant/titres
            if (cles.titres.length) {
                this.envoyerTitres(idMutation, cles);
            }

            // 3.1.6 POST composant/autres
            if (cles.autres.length) {
                this.envoyerAutres(idMutation, cles);
            }
        },

        // Appel API de création d'un 'composant Argent
        async envoyerArgent(idMutation, cles) {
            // 3.1.6 POST composant/argent
            let composantArgent = this.$store.state.donation.composants[
                cles.argent
            ];
            composantArgent = outils.nettoyer(composantArgent, bouchon.argent);
            composantArgent.mutation = idMutation;
            composantArgent.valeur =
                '' + composantArgent.valeur / cles.donateurs.length; // Partage de la valeur entre les donateurs et conversion en string

            this.$axios
                .$post(this.baseRoute + routes.post.argent, composantArgent)
                .catch(err => {
                    console.log(err);
                });
        },

        // Appel API de création des composants Titres
        // 3.1.6 POST composant/titres
        async envoyerTitres(idMutation, cles) {
            const libelleDemembrement = {
                pleinePropriete: enums.demembrement[0],
                nuePropriete: enums.demembrement[1],
                usufruit: enums.demembrement[2]
            };

            let i = 1; //Itérateur du rang du composant

            cles.titres.forEach(async cleTitre => {
                // Récupération de l'objet Titres structuré en "mode bouchomatic" (1 objet pour les 3 démembrements)
                const composantTitre = this.$store.state.donation.composants[
                    cleTitre
                ];

                // Clonage de l'objet titre en mode EE (1 objet par démembrement)
                let titreDemembre = outils.nettoyer(
                    composantTitre,
                    bouchon.titre
                );
                titreDemembre.mutation = idMutation;
                titreDemembre.rang = '' + i; // Conversion en string

                for (let dmbt in composantTitre.demembrement) {
                    titreDemembre.demembrement = libelleDemembrement[dmbt];
                    titreDemembre.nb_titres =
                        composantTitre.demembrement[dmbt].nb_titres;
                    titreDemembre.valeur_titre =
                        composantTitre.demembrement[dmbt].valeur_titre;
                    titreDemembre.valeur_total_titres =
                        '' +
                        (titreDemembre.nb_titres * titreDemembre.valeur_titre) /
                            cles.donateurs.length; // Partage de la valeur entre les donateurs et conversion en string

                    await this.$axios
                        .$post(
                            this.baseRoute + routes.post.titres,
                            titreDemembre
                        )
                        .catch(err => {
                            console.log(err);
                        });
                }
                i++;
            });
        },

        // Appel API de création des composants Autres
        // 3.1.6 POST composant/autres
        async envoyerAutres(idMutation, cles) {
            let i = 1; // Itérateur du rang du composant

            cles.autres.forEach(async cleAutre => {
                // Récupération de l'objet Autre
                let composantAutre = this.$store.state.donation.composants[
                    cleAutre
                ];
                composantAutre = outils.nettoyer(composantAutre, bouchon.autre);
                composantAutre.mutation = idMutation;
                composantAutre.rang = '' + i; // Conversion en string

                composantAutre.valeur =
                    '' + composantAutre.valeur / cles.donateurs.length; // Partage de la valeur entre les donateurs et conversion en string

                await this.$axios
                    .$post(this.baseRoute + routes.post.autres, composantAutre)
                    .catch(err => {
                        console.log(err);
                    });
                i++;
            });
        }
    },
    computed: {
        listeDemarches: {
            get() {
                return this.$store.state.donation.listeDemarches;
            }
        }
    }
};
</script>

<style>
.btn {
    @apply bg-transparent text-teal-700 font-semibold py-1 px-2 border border-teal-500 rounded;
}
.btn-xs {
    @apply px-1 py-0;
    font-size: 0.75rem;
}
.btn-big {
    @apply px-4 py-0 text-2xl font-normal;
}
.btn-color,
.btn:hover {
    @apply bg-teal-500 text-white border-transparent;
}
.btn-big:hover {
    @apply bg-transparent text-teal-700 border border-teal-500;
}
.btn:disabled,
.btn:disabled:hover {
    @apply bg-transparent text-gray-500 border-gray-400;
}
</style>
