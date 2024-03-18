var normaliseSpelling = function (builder) {
  var pipelineFunction = function ( token ){
    const tokenString = token.toString();
    const rewrittenToken = tokenString.replace(
      /([àáâãäå])|([çčć])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ùúûü])/ig, 
      function (tokenString, a, c, e, i, n, o, u ) {
        if (a) return 'a';
        if (c) return 'c';
        if (e) return 'e';
        if (i) return 'i';
        if (n) return 'n';
        if (o) return 'o';
        if (u) return 'u';
    });
  
    return token.update(function () { 
      return rewrittenToken; 
    })
  } 
  // Register the pipeline function so the index can be serialised
  lunr.Pipeline.registerFunction(pipelineFunction, 'normaliseSpelling')
  // Add the pipeline function to both the indexing pipeline and the
  // searching pipeline
  builder.pipeline.before(lunr.stemmer, pipelineFunction)
  builder.searchPipeline.before(lunr.stemmer, pipelineFunction)
};
(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];

        appendString += '<li class="post-preview"><article><h2 class="post-title">' + item.title + '</h2>';
        appendString += '<p class="post-meta">Publicado: ' + item.date + '</p>';
        appendString += '<div class="post-entry"><strong>Empresa:</strong> ' + item.company + '</div>';
        if(item.description.length){
          appendString += '<div class="post-entry"><strong>Descripción:</strong> ' + item.description + '</div>';
        }
        if(item.requirements.length){
          appendString += '<div class="requisito-view"><span class="dots"></span><span class="more"><div class="post-entry"><strong>Requisitos:</strong>' + item.requirements + '</span></div>';
        }
        appendString += '<div class="post-entry" style="margin-top: 5px;"><strong>Contacto:</strong></div>';        
        if(item.whatsapp.length){
          appendString +=  '<div style="display: inline-flex;"><img src="/assets/img/icon-whatsapp.svg" width="20px" alt="email">&nbsp;<a href="https://api.whatsapp.com/send?phone=507'+ item.whatsapp + '" target="_blank">' + item.whatsapp + '</a></div><br/>';
        }
        if(item.email.length){
          appendString +=  '<div style="display: inline-flex;"><img src="/assets/img/icon-mail.svg" width="20px" alt="email">&nbsp;<a href="mailto:'+ item.email + '">' + item.email + '</a></div><br/>';
        }
        if(item.url.length){
          appendString +=  '<div style="display: inline-flex;"><img src="/assets/img/icon-url.svg" width="20px" alt="url">&nbsp;<a href="'+ item.url + '" target="_blank">Ir a un URL externo</a></div><br/>';
        }
        appendString += '</article></li>';      
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<div class="alert alert-warning" role="alert"><strong>No se encontraron resultados!</strong><br><i class="fas fa-info-circle"></i> Intenta con otra palabra clave más amplia</div>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {

    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.

    var idx = lunr(function () {

      this.use(normaliseSpelling)

      this.field('id');
      this.field('title');
      this.field('company');
      this.field('province');
      this.field('tags');

      for (var key in window.store) { 
        this.add({
          'id': key,
          'title': window.store[key].title,
          'company': window.store[key].company,
          'province': window.store[key].province,
          'tags': window.store[key].tags
        });
      }
    });
    var results = idx.search(searchTerm);
    displaySearchResults(results, window.store);
  }
})();
