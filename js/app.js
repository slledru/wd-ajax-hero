(() => {
  'use strict';

  const movies = [];

  const renderMovies = () => {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({ 'data-position': 'top', 'data-tooltip': movie.title });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({ src: movie.poster, alt: `${movie.poster} Poster` });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);
      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  $('.btn-large').click((event) => {
    event.preventDefault();

    let $xhr = $.getJSON(`https://omdb-api.now.sh/?s=${$('#search').val()}`);
    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }
      if (Array.isArray(data.Search)) {
        for (let movie of data.Search) {
          let newObject = {};
          newObject.title = movie.Title;
          newObject.poster = movie.Poster;
          newObject.year = movie.Year;
          newObject.plot = movie.Plot;
          newObject.id = movie.imdbID;
          movies.push(newObject);
        }
      }
      renderMovies();
      $('.modal-trigger').click((event) => {
        event.preventDefault();
        let title = $(event.target).parent().prev().first().text();
        let $xhr = $.getJSON(`http://www.omdbapi.com/?apikey=bbeb9642&t=${title}`);
        $xhr.done((data) => {
          if ($xhr.status !== 200) {
            return;
          }
          $($(event.target).attr('href')).children().first().children().last().text(data.Plot);
        });
      });
    });
  });
})();
