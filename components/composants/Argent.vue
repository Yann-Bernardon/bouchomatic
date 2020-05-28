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
        <h3 class="text-xl mb-4 italic font-medium">
            <span class="text-gray-400"> Composant : </span>Argent
        </h3>
        <div class="grid grid-cols-2 gap-3 my-1 mx-20">
            <label for="valeur" class="flex-1 text-right font-semibold">
                Valeur
            </label>
            <input
                type="text"
                name="valeur"
                v-model="argent.valeur"
                class="box-content border px-2"
            />
        </div>
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
    props: ['cleArgent'],
    data: function() {
        return {
            afficherJson: false
        };
    },
    computed: {
        ...mapState({
            argent: state => state.obj.argent[this.cleArgent]
        }),
        argent: {
            get() {
                return this.$store.state.donation.composants[this.cleArgent];
            }
        }
    },
    methods: {
        supprimer() {
            this.$store.commit('donation/suppressionArgent', this.cleArgent);
        }
    }
};
</script>

<style></style>
