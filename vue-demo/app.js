new Vue({
  el: '#app',
  data: {
    title: 'Collection',
    url: 'http://todomvc.com/examples/vue/',
    content: [
      {
        title: 'Report',
        summary: 'Some good insights.',
        showSummary: false
      },
      {
        title: 'Case Study',
        summary: 'A concrete example.',
        showSummary: false
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
    }
  }
});
