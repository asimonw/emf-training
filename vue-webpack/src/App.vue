<template>
  <div id="app">
    <app-header :name="title"></app-header>
    <ul>
      <app-asset v-for="asset in content"
          :key="asset.id"
          :title="asset.title"
          :summary="asset.summary"
          :show="asset.showSummary"
          :edit="asset.editMode"
          :toggleShow="toggleSummary.bind(null, asset)"
          @toggleEdit="asset.editMode = $event"
          @edit="editSummary(asset, $event)">
      </app-asset>
    </ul>
    <app-add-new></app-add-new>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Asset from './components/Asset.vue';
import AddNew from './components/AddNew.vue';

export default {
  data() {
    return {
      title: 'Collection',
      content: [
        {
          id: 1,
          title: 'Report',
          summary: 'Some good insights.',
          showSummary: false,
          editMode: false
        },
        {
          id: 2,
          title: 'Case Study',
          summary: 'A concrete example.',
          showSummary: false,
          editMode: false
        }
      ]
    }
  },
  methods: {
    toggleSummary(doc) {
      let currentState = doc.showSummary;
      this.content.forEach(function (otherDoc) {
        if (otherDoc.showSummary) otherDoc.showSummary = false;
      })
      doc.showSummary = !currentState;
    },
    editSummary(doc, event) {
      doc.summary = event;
      doc.editMode = false;
    }
  },
  components: {
    appHeader: Header,
    appAsset: Asset,
    appAddNew: AddNew
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
