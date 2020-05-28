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
        <form>
            <input-json
                v-if="!afficherJson"
                v-for="cle in Object.keys(donneesParDefaut)"
                :key="cle"
                :cle="cle"
                :donnee="autre[cle]"
                @input="modifier"
            >
                {{ donneesParDefaut[cle] }}
            </input-json>

            <input-json
                v-if="afficherJson && typeof autre[cle] != 'number'"
                v-for="cle in Object.keys(autre)"
                :key="cle"
                :cle="cle"
                :donnee="autre[cle]"
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
    props: ['cleAutre', 'donneesParDefaut'],
    data: function() {
        return {
            afficherJson: false
        };
    },
    computed: {
        ...mapState({
            autre: state => state.obj.autre[this.cleAutre]
        }),
        autre: {
            get() {
                return this.$store.state.donation.composants[this.cleAutre];
            }
        }
    },
    methods: {
        modifier(e) {
            this.$store.commit('donation/majAutre', {
                eventTarget: e.target,
                cleAutre: this.cleAutre
            });
        },
        supprimer() {
            this.$store.commit('donation/suppressionAutre', this.cleAutre);
        }
    }
};
</script>

<style></style>
