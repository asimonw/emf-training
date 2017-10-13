new Vue({
  el: '#app',
  data: {
    title: 'Collection',
    url: 'http://todomvc.com/examples/vue/',
    content: [
      {
        title: 'Report',
        summary: 'Some good insights.',
        showSummary: false,
        editMode: false
      },
      {
        title: 'Case Study',
        summary: 'A concrete example.',
        showSummary: false,
        editMode: false
      }
    ]
  },
  methods: {
    toggleSummary: function (doc) {
      let currentState = doc.showSummary;
      this.content.forEach(function (otherDoc) {
        if (otherDoc.showSummary) otherDoc.showSummary = false;
      })
      doc.showSummary = !currentState;
    },
    editSummary: function (doc, index) {
      doc.editMode = !doc.editMode;
      // console.log(this.$refs.input);
    },
    addSummary: function (doc, event) {
      doc.summary = event.target.value;
      doc.editMode = false;
      doc.showSummary = true;
    },
    addDoc: function (event) {
      this.content.push({
        title: event.target.value,
        summary: '',
        showSummary: false,
        editMode: true
      });
      this.$refs.input.value = '';
    }
  }
});
