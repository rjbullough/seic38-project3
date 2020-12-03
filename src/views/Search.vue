<template>
    <transition name="fade" mode="out-in" appear>
      <b-container v-if="$store.state.step === 1">
        <b-jumbotron header="Main" lead="What's the focus of your meal?" fluid>
          <b-img :src="require('../assets/woman-reclined-talking-character-by-Vexels.png')"
                 alt="Woman asking a question" fluid />
        </b-jumbotron>

          <v-select
              @input="setMain"
              :options="$store.state.ingredients.main"
              :value="$store.state.selected"
          ></v-select>

          <b-button variant="outline-secondary" class="mt-4" @click="setStep(1)">Continue to sides...</b-button>
      </b-container>

      <b-container v-if="$store.state.step === 2">
        <b-jumbotron header="Sides" lead="Are you pairing your meal with something?" fluid>
          <b-img :src="require('../assets/ginger-man-cooking-character-by-Vexels.png')" alt="Man preparing food" fluid
                 width="256" />
        </b-jumbotron>

          <v-select
              @input="setSecondary"
              :options="$store.state.ingredients.secondary"
              :value="$store.state.selected"
          ></v-select>

          <b-button-group>
            <b-button variant="outline-secondary" class="mt-4" @click="setStep(1)">Continue to preparation methods...</b-button>
            <b-button variant="outline-secondary" class="mt-4" @click="setStep(-1)">Go Back</b-button>
          </b-button-group>
      </b-container>

      <b-container v-if="$store.state.step === 3">
        <b-jumbotron header="Preparation" lead="How is your meal prepared?" fluid>
          <b-img :src="require('../assets/black-man-and-woman-cooking-character-by-Vexels.png')"
                 alt="2 people preparing food" fluid width="256" />
        </b-jumbotron>

          <v-select
              @input="setPrep"
              :options="$store.state.ingredients.prep"
              :value="$store.state.selected"
          ></v-select>

        <b-button-group>
          <b-button variant="outline-secondary" class="mt-4" @click="setStep(1)">Continue to flavour enhancers...</b-button>
          <b-button variant="outline-secondary" class="mt-4" @click="setStep(-1)">Go Back</b-button>
        </b-button-group>
      </b-container>

      <b-container v-if="$store.state.step === 4">
        <b-jumbotron header="Herbs and Spices" lead="Is your meal enhanced with any of the following?" fluid>
          <b-img :src="require('../assets/couple-cooking-a-pie-characters-by-Vexels.png')"
                 alt="A couple admiring a tasty pie" fluid width="256" />
        </b-jumbotron>

          <v-select
              @input="setSpice"
              :options="$store.state.ingredients.spice"
              :value="$store.state.selected"
          ></v-select>

        <b-button-group>
          <b-button variant="outline-secondary" class="mt-4" @click="setStep(1)">Continue to results...</b-button>
          <b-button variant="outline-secondary" class="mt-4" @click="setStep(-1)">Go Back</b-button>
        </b-button-group>
      </b-container>

      <b-container v-if="$store.state.step === 5">
        <b-jumbotron header="Try these" lead="Handpicked, just for you" fluid>
          <b-img :src="require('../assets/thanksgiving-dinner-gathering-character-by-Vexels.png')"
                 alt="Group of friends enjoying a drink" fluid
                 width="256" />
        </b-jumbotron>

          <div class="mb-5" v-for="result in results" :key="result.name">
            <p class="result-p">{{result.name}}</p>

            <div v-if="result.perfectMatches.length">
              <p>Perfect with {{ result.perfectMatches.join(" and ") }}</p>
            </div>

            <span>{{result.examples.join(', ')}}</span>

            <b-progress :value="result.match" variant="warning"></b-progress>
          </div>

        <b-button variant="outline-secondary" class="mt-4" @click="resetChoices">Start Over?</b-button>
      </b-container>
    </transition>
</template>

<script>
  import store from '../store/index';
  export default {
    methods: {
      setMain(itemId) {
        store.commit("setMainSelection", itemId);
      },
      setSecondary(itemId) {
        store.commit("setSecondarySelection", itemId);
      },
      setPrep(itemId) {
        store.commit("setPrepSelection", itemId);
      },
      setSpice(itemId) {
        store.commit("setSpiceSelection", itemId);
      },
      setStep(direction) {
        store.commit("setStep", direction);
      },
      resetChoices() {
        store.commit('resetState');
      }
    },
    computed: {
      main() {
        return store.state.ingredients.main
      },
      sides() {
        return store.state.ingredients.secondary
      },
      prep() {
        return store.state.ingredients.prep
      },
      spice() {
        return store.state.ingredients.spice
      },
      step() {
        return store.state.step
      },
      results() {
        return store.state.results
      }
    },
    watch: {
      step (newStep,) {
        if (newStep === 5) {
          store.commit("setFilteredSelections")
          store.dispatch('rankWines', store.state.selections)
        }
      }
    }
  }
</script>

<style scoped>
.result-p {
  font-size: 2em;
  font-weight: bold;
}
p.lead, h1 {
  font-family: 'Beth Ellen';
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
