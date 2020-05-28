<template>
    <card>
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
        <button
            class="btn btn-xs float-right mx-2"
            @click="afficherJson = !afficherJson"
        >
            JSON
        </button>
        <h3 class="text-xl mb-4 italic font-medium">
            <span class="text-gray-400"> Composant : </span>
            <slot></slot>
        </h3>
        <table class="w-full border-collapse ">
            <thead>
                <tr>
                    <th></th>
                    <th class="border border-gray-400">Nombre de titres</th>
                    <th class="border border-gray-400">Valeur unitaire</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th class="border border-gray-400">Pleine propriété</th>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="
                                titre.demembrement.pleinePropriete.nb_titres
                            "
                            @input="
                                modifierTableau(
                                    'pleinePropriete',
                                    'nb_titres',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="
                                titre.demembrement.pleinePropriete.valeur_titre
                            "
                            @input="
                                modifierTableau(
                                    'pleinePropriete',
                                    'valeur_titre',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border border-gray-400">Nue propriété</th>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="titre.demembrement.nuePropriete.nb_titres"
                            @input="
                                modifierTableau(
                                    'nuePropriete',
                                    'nb_titres',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="
                                titre.demembrement.nuePropriete.valeur_titre
                            "
                            @input="
                                modifierTableau(
                                    'nuePropriete',
                                    'valeur_titre',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border border-gray-400">Usufruit</th>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="titre.demembrement.usufruit.nb_titres"
                            @input="
                                modifierTableau(
                                    'usufruit',
                                    'nb_titres',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                    <td class="border border-gray-400">
                        <input
                            class="text-right"
                            type="text"
                            :value="titre.demembrement.usufruit.valeur_titre"
                            @input="
                                modifierTableau(
                                    'usufruit',
                                    'valeur_titre',
                                    $event.target.value
                                )
                            "
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        <form class="mt-4">
            <input-json
                v-if="
                    afficherJson &&
                        typeof titre[cle] != 'number' &&
                        cle != 'demembrement'
                "
                v-for="cle in Object.keys(titre)"
                :key="cle"
                :cle="cle"
                :donnee="titre[cle]"
                @input="modifier"
            >
                {{ cle }}
            </input-json>
        </form>
    </card>
</template>

<script>
import { mapState } from 'vuex';

import Card from '../commons/Card.vue';
import InputJson from '../commons/InputJson.vue';

export default {
    components: {
        Card,
        InputJson
    },
    props: ['cleTitre'],
    data: function() {
        return {
            afficherJson: false
        };
    },
    computed: {
        ...mapState({
            titre: state => state.obj.titre[this.cleTitre]
        }),
        titre: {
            get() {
                return this.$store.state.donation.composants[this.cleTitre];
            }
        }
    },
    methods: {
        modifier(e) {
            this.$store.commit('donation/majTitre', {
                eventTarget: e.target,
                cleTitre: this.cleTitre
            });
        },
        modifierTableau(demembrement, donnee, valeur) {
            this.$store.commit('donation/majTitreTableau', {
                cleTitre: this.cleTitre,
                demembrement,
                donnee,
                valeur
            });
        },
        supprimer() {
            this.$store.commit('donation/suppressionTitre', this.cleTitre);
        }
    }
};
</script>

<style></style>
