// Edition des diapos
import Vue from 'vue';
import bouchon from '../static/bouchon.json';
import outils from '../static/outils.js';

export const state = () => ({
    trousseau: 0, // Utilisé comme fournisseur de clés uniques pour tous les objets
    listeDemarches: [],
    demarches: {},
    acteurs: {},
    composants: {}
});

const mutations = {
    // Démarches
    // Ajout d'une demarche
    ajouterDemarche(state, demarche = bouchon.demarche) {
        let nouvelleDemarche = outils.clone(demarche);
        const cleDemarche = state.trousseau++;
        const cleDonataire = state.trousseau++;
        const cleDonateur = state.trousseau++;

        // Création du donataire
        let nouveauDonataire = outils.clone(bouchon.donataire);
        nouveauDonataire.cleDemarche = cleDemarche;
        Vue.set(state.acteurs, cleDonataire, nouveauDonataire);

        // Création du premier donateur
        let nouveauDonateur = outils.clone(bouchon.donateur);
        nouveauDonateur.cleDemarche = cleDemarche;
        Vue.set(state.acteurs, cleDonateur, nouveauDonateur);

        // Création de la démarche
        nouvelleDemarche.donataire = cleDonataire;
        nouvelleDemarche.donateurs = [cleDonateur];
        nouvelleDemarche.argent = null;
        nouvelleDemarche.titres = [];
        nouvelleDemarche.autres = [];
        state.listeDemarches.push(cleDemarche);
        Vue.set(state.demarches, cleDemarche, nouvelleDemarche);
    },
    // Suppression d'une démarche
    suppressionDemarche(state, cleDemarche) {
        Vue.delete(
            state.listeDemarches,
            state.listeDemarches.indexOf(cleDemarche)
        );
        Vue.delete(state.demarches, cleDemarche);
    },

    // Acteurs
    // Ajout du second donateur
    ajouterDonateur(state, cleDemarche) {
        const donateur1 =
            state.acteurs[state.demarches[cleDemarche].donateurs[0]];
        let nouveauDonateur = outils.clone(donateur1);
        Object.assign(nouveauDonateur, bouchon.donateur2Delta);

        const cleDonateur = state.trousseau++;
        Vue.set(state.acteurs, cleDonateur, nouveauDonateur);
        Vue.set(state.demarches[cleDemarche].donateurs, 1, cleDonateur);
    },

    // Modification d'un acteur
    majActeur(state, { eventTarget, cleActeur }) {
        if (eventTarget.type == 'checkbox') {
            const valeur = eventTarget.attributes.getNamedItem('libelle').value;
            if (eventTarget.checked) {
                Vue.set(
                    state.acteurs[cleActeur][eventTarget.name],
                    state.acteurs[cleActeur][eventTarget.name].length,
                    valeur
                );
            } else {
                Vue.delete(
                    state.acteurs[cleActeur][eventTarget.name],
                    state.acteurs[cleActeur][eventTarget.name].indexOf(valeur)
                );
            }
        } else {
            Vue.set(
                state.acteurs[cleActeur],
                eventTarget.name,
                eventTarget.value
            );
        }
    },

    // Mise à jour du SPI
    majSpi(state, { cleActeur, spi }) {
        Vue.set(state.acteurs[cleActeur], 'identifiant', spi);
    },

    // Suppression d'un acteur
    suppressionActeur(state, cleActeur) {
        const cleDemarche = state.acteurs[cleActeur].cleDemarche;
        state.demarches[cleDemarche].donateurs.splice(
            state.demarches[cleDemarche].donateurs.indexOf(cleActeur),
            1
        );
        Vue.delete(state.acteurs, cleActeur);
    },

    // Composants
    // Ajout d'un composant Argent
    ajouterArgent(state, cleDemarche) {
        const cleArgent = state.trousseau++;
        let nouvelArgent = outils.clone(bouchon.argent);
        nouvelArgent.cleDemarche = cleDemarche;
        Vue.set(state.composants, cleArgent, nouvelArgent);
        Vue.set(state.demarches[cleDemarche], 'argent', cleArgent);
    },

    // Suppression d'un composant Argent
    suppressionArgent(state, cleArgent) {
        const cleDemarche = state.composants[cleArgent].cleDemarche;
        Vue.set(state.demarches[cleDemarche], 'argent', null);
        Vue.delete(state.composants, cleArgent);
    },

    // Ajout d'un composant Titres
    ajouterTitre(state, cleDemarche) {
        const cleTitre = state.trousseau++;
        let nouveauTitre = outils.clone(bouchon.titre);
        nouveauTitre.cleDemarche = cleDemarche;
        Vue.set(state.composants, cleTitre, nouveauTitre);
        Vue.set(
            state.demarches[cleDemarche].titres,
            state.demarches[cleDemarche].titres.length,
            cleTitre
        );
    },

    // Modification du JSON d'un titre
    majTitre(state, { eventTarget, cleTitre }) {
        Vue.set(
            state.composants[cleTitre],
            eventTarget.name,
            eventTarget.value
        );
    },

    // Modification d'un titre par le tableau
    majTitreTableau(state, { cleTitre, demembrement, donnee, valeur }) {
        Vue.set(
            state.composants[cleTitre].demembrement[demembrement],
            donnee,
            valeur
        );
    },

    // Suppression d'un composant Titre
    suppressionTitre(state, cleTitre) {
        const cleDemarche = state.composants[cleTitre].cleDemarche;
        state.demarches[cleDemarche].titres.splice(
            state.demarches[cleDemarche].titres.indexOf(cleTitre),
            1
        );
        Vue.delete(state.composants, cleTitre);
    },

    // Ajout d'un composant Autres
    ajouterAutre(state, cleDemarche) {
        const cleAutre = state.trousseau++;
        let nouveauAutre = outils.clone(bouchon.autre);
        nouveauAutre.cleDemarche = cleDemarche;
        Vue.set(state.composants, cleAutre, nouveauAutre);
        Vue.set(
            state.demarches[cleDemarche].autres,
            state.demarches[cleDemarche].autres.length,
            cleAutre
        );
    },

    // Modification du JSON d'un composant Autre
    majAutre(state, { eventTarget, cleAutre }) {
        Vue.set(
            state.composants[cleAutre],
            eventTarget.name,
            eventTarget.value
        );
    },

    // Suppression d'un composant Autre
    suppressionAutre(state, cleAutre) {
        const cleDemarche = state.composants[cleAutre].cleDemarche;
        state.demarches[cleDemarche].autres.splice(
            state.demarches[cleDemarche].autres.indexOf(cleAutre),
            1
        );
        Vue.delete(state.composants, cleAutre);
    },

    chargerJson(state, json) {
        Object.keys(state).forEach(data => {
            Vue.set(state, data, json[data]);
        });
    }
};

const actions = {};

const getters = {};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
