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
            @click="changerSpi"
            title="Changer de SPI"
        >
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
            />
        </svg>
        <!-- Icone "Poubelle" -->
        <svg
            v-if="rang == 1"
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
            <slot></slot>
            <!-- Icone "Rafraichir le SPI" -->
        </h3>
        <form>
            <input-json
                v-if="!afficherJson"
                v-for="cle in Object.keys(donneesParDefaut)"
                :key="cle"
                :cle="cle"
                :donnee="acteur[cle]"
                @input="modifier"
            >
                {{ donneesParDefaut[cle] }}
            </input-json>

            <input-json
                v-if="afficherJson && typeof acteur[cle] != 'number'"
                v-for="cle in Object.keys(acteur)"
                :key="cle"
                :cle="cle"
                :donnee="acteur[cle]"
                @input="modifier"
            >
                {{ cle }}
            </input-json>
        </form>
    </card>
</template>

<script>
import { mapState } from 'vuex';

import enums from '../../static/enums.json';

import Card from '../commons/Card.vue';
import InputJson from '../commons/InputJson.vue';

export default {
    components: {
        Card,
        InputJson
    },
    props: ['cleActeur', 'donneesParDefaut', 'rang'],
    data: function() {
        return {
            afficherJson: false,
            enums
        };
    },
    computed: {
        ...mapState({
            acteur: state => state.obj.acteurs[this.cleActeur]
        }),
        acteur: {
            get() {
                return this.$store.state.donation.acteurs[this.cleActeur];
            }
        }
    },
    methods: {
        modifier(e) {
            this.$store.commit('donation/majActeur', {
                eventTarget: e.target,
                cleActeur: this.cleActeur
            });
        },
        changerSpi() {
            let nouveauSpi = '';
            for (let i = 0; i < 10; i++) {
                nouveauSpi += Math.floor(Math.random() * 10);
            }
            let cleSpi = (nouveauSpi % 511) + '';
            cleSpi = cleSpi.padStart(3, '0');

            this.$store.commit('donation/majSpi', {
                cleActeur: this.cleActeur,
                spi: nouveauSpi + cleSpi
            });
        },
        supprimer() {
            this.$store.commit('donation/suppressionActeur', this.cleActeur);
        }
    }
};
</script>

<style></style>
