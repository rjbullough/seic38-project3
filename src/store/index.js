import Vue from 'vue'
import Vuex from 'vuex'
import data from '../data/data.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ingredients: {
      main: data.ingredients.filter(ingredient => ingredient.type === "main"),
      secondary: data.ingredients.filter(ingredient => ingredient.type === "secondary"),
      prep: data.ingredients.filter(ingredient => ingredient.type === "prep"),
      spice: data.ingredients.filter(ingredient => ingredient.type === "spice")
    },
    step: 1,
    selections: [],
    results: [],
  },
  mutations: {
    setMainSelection(state, selection) {
      state.selections[0] = selection.id;
    },
    setSecondarySelection(state, selection) {
      state.selections[1] = selection.id;
    },
    setPrepSelection(state, selection) {
      state.selections[2] = selection.id;
    },
    setSpiceSelection(state, selection) {
      state.selections[3] = selection.id;
    },
    setStep(state, direction) {
      state.step += direction
    },
    setFilteredSelections(state) {
      state.selections = state.selections.filter((element) => element);
    },
    setResults(state, newResults) {
      state.results = state.results.concat(...newResults)
    },
    resetState(state) {
      state.step = 1;
      state.selections = [];
      state.results = [];
    }
  },
  actions: {
    rankWines({commit}, selections) {
      let scores = [];
      let matches = [];
      // Gather all wines and see if they pair with any of our selections.  Weight these pairings based on our choices.
      data.wineTypes.forEach(wine => {
        scores.push({name: wine.name, score: 0, examples: wine.examples, id: wine.id, matches: [], perfectMatches: []});
        wine.pairing.forEach(pairing => {
          selections.forEach(choice => {
            if (choice === pairing.id) {
              const typeWeight = getTypeWeightById(data.ingredients, choice);
              const weight = pairing.weight * typeWeight;
              const isPerfectMatch = pairing.weight === 2;
              scores = calculateScores(scores, wine.name, weight, choice, isPerfectMatch)
            }
          })
        })
      })

      let maximumScore = 0;

      selections.forEach(choice => {
        let typeWeight = getTypeWeightById(data.ingredients, choice);
        maximumScore += typeWeight * 2;
      })

      scores.forEach(scoreObject => {
        let match = (scoreObject.score / maximumScore) * 100
        match = Math.round(50 + (match / 2));
        matches.push({
          name: scoreObject.name,
          match: match,
          examples: scoreObject.examples,
          id: scoreObject.id,
          matches: scoreObject.matches,
          perfectMatches: scoreObject.perfectMatches
        })
      })

      matches.sort((a, b) => (a.match < b.match) ? 1: -1);

      matches = matches.slice(0, 2);

      // console.log('shortened matches', matches)

      commit('setResults', matches);

      function calculateScores(rankings, name, score, ingredient, isPerfectMatch) {
        rankings.find((object, index) => {
          if(object.name === name) {
            rankings[index]['score'] += score;
            let label = getIngredientLabelById(data.ingredients, ingredient);
            isPerfectMatch
                ? (rankings[index]['perfectMatches'].push(label))
                : (rankings[index]['matches'].push(label))
            return true;
          }
        })
        return rankings;
      }

      function getTypeWeightById(ingredients, id) {
        let typeWeight = null;
        ingredients.find((object) => {
          if (object.id === id) {
            switch (object.type) {
              case 'main': typeWeight = 4; break;
              case 'secondary': typeWeight = 2; break;
              case 'prep': typeWeight = 1; break;
              case 'spice': typeWeight = 1; break;
            }
            return true;
          }
        })
        return typeWeight;
      }

      function getIngredientLabelById(ingredients, id) {
        let label = null;
        ingredients.find((object) => {
          if (object.id === id) {
            label = object.label;
            return true;
          }
        })
        return label;
      }
  }
}
})
