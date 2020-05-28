<template>
    <div class="grid grid-cols-2 gap-3 my-1 mx-20">
        <label :for="cle" class="flex-1 text-right font-semibold">
            <slot></slot>
        </label>
        <div>
            <template v-if="typeof donnee == 'string'">
                <select
                    v-if="enums.hasOwnProperty(cle)"
                    :name="cle"
                    :value="donnee"
                    @input="$emit('input', $event)"
                    class="box-content block appearance-none w-full bg-white border px-1"
                >
                    <option v-for="valeur of enums[cle]" :value="valeur">
                        {{ valeur }}
                    </option>
                </select>
                <input
                    v-else
                    type="text"
                    :name="cle"
                    :value="donnee"
                    @input="$emit('input', $event)"
                    class="box-content border px-2"
                />
            </template>
            <div v-else v-for="attr in enums[cle]">
                <input
                    type="checkbox"
                    :name="cle"
                    :value="donnee"
                    :libelle="attr"
                    @input="$emit('input', $event)"
                />
                <label :for="cle">
                    {{ attr }}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import enums from '../../static/enums.json';

export default {
    props: ['cle', 'donnee'],
    data: function() {
        return {
            enums
        };
    },
    computed: {}
};
</script>

<style></style>
