<template>
    <card class="p-4 mb-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="float-right cursor-pointer mx-2"
            @click="supprimer"
        >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>

        <h2 class="text-2xl mb-4 italic font-medium">
            <slot></slot>
        </h2>
        <div class="grid grid-cols-3 gap-4">
            <acteur
                :cleActeur="demarche.donataire"
                :donneesParDefaut="donneesParDefautDonataire"
            >
                Donataire
            </acteur>

            <acteur
                v-for="(donateur, index) in demarche.donateurs"
                :key="donateur"
                :cleActeur="donateur"
                :donneesParDefaut="donneesParDefautDonateur"
                :rang="
                    $store.state.donation.demarches[
                        cleDemarche
                    ].donateurs.indexOf(donateur)
                "
            >
                Donateur {{ index + 1 }}
            </acteur>

            <div v-if="demarche.donateurs.length == 1">
                <button class="btn" @click="ajouterDonateur">
                    Ajouter un donateur
                </button>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-4">
            <argent v-if="demarche.argent" :cleArgent="demarche.argent" />
            <titre
                v-for="(cleTitre, index) in demarche.titres"
                :cleTitre="cleTitre"
                :key="cleTitre"
            >
                Titre {{ index + 1 }}
            </titre>

            <autre
                v-for="(cleAutre, index) in demarche.autres"
                :cleAutre="cleAutre"
                :key="cleAutre"
                :donneesParDefaut="donneesParDefautAutre"
            >
                Autre bien {{ index + 1 }}
            </autre>
            <div>
                <button
                    class="btn mb-1"
                    @click="ajouterArgent"
                    :disabled="demarche.argent > 0"
                >
                    Ajouter un composant "Argent"
                </button>
                <br />
                <button class="btn mb-1" @click="ajouterTitre">
                    Ajouter un composant "Titres"
                </button>
                <br />
                <button class="btn" @click="ajouterAutre">
                    Ajouter un composant "Autres"
                </button>
            </div>
        </div>
    </card>
</template>

<script>
import Acteur from '../acteurs/Acteur.vue';
import Argent from '../composants/Argent.vue';
import Titre from '../composants/Titre.vue';
import Autre from '../composants/Autre.vue';

import Card from '../commons/Card.vue';

export default {
    components: {
        Card,
        Acteur,
        Argent,
        Titre,
        Autre
    },
    props: ['cleDemarche'],
    data: function() {
        return {
            donneesParDefautDonataire: {
                identifiant: 'SPI',
                nom: 'Nom',
                date_naissance: 'Date de naissance',
                situations_particulieres: 'Situations particulières'
            },
            donneesParDefautDonateur: {
                identifiant: 'SPI',
                nom: 'Nom',
                prenom: 'Prenom',
                date_naissance: 'Date de naissance',
                lien_parente: 'Lien de parenté'
            },
            donneesParDefautAutre: {
                demembrement: 'Démembrement',
                valeur: 'Valeur'
            }
        };
    },
    computed: {
        demarche: {
            get() {
                return this.$store.state.donation.demarches[this.cleDemarche];
            }
        }
    },
    methods: {
        ajouterDonateur() {
            this.$store.commit('donation/ajouterDonateur', this.cleDemarche);
        },
        ajouterArgent() {
            this.$store.commit('donation/ajouterArgent', this.cleDemarche);
        },
        ajouterTitre() {
            this.$store.commit('donation/ajouterTitre', this.cleDemarche);
        },
        ajouterAutre() {
            this.$store.commit('donation/ajouterAutre', this.cleDemarche);
        },
        supprimer() {
            this.$store.commit(
                'donation/suppressionDemarche',
                this.cleDemarche
            );
        }
    }
};
</script>

<style></style>
