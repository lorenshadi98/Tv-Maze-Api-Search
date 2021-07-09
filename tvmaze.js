/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE_URL = ' https://tinyurl.com/tv-missing';
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const foundShows = []; // empty array for the found shows to be put in
  for (let response of res.data) {
    foundShows.push({
      id: response.show.id,
      name: response.show.name,
      summary: response.show.summary,
      image: response.show.image
        ? response.show.image.medium
        : MISSING_IMAGE_URL
    });
  }
  return foundShows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
           <div class="card" data-show-id="${show.id}">
           <img class="img-fluid" src="${show.image}">
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
               <button class="btn btn-primary">Episodes</button>
             </div>
           </div>
         </div>
        `
    );
    $item.find(':button').on('click', async function (evt) {
      evt.preventDefault();
      let episodeList = await getEpisodes(show.id);
      populateEpisodes(episodeList);
    });
    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // makes get request to retrieve list of tv episodes based on show id
  const episodeQuery = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  let episodesList = [];
  for (let episode of episodeQuery.data) {
    episodesList.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    });
  }
  return episodesList;
}

/** Populate episodes list:
 *     - given list of episodes, add episodes to DOM
 */
function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list');
  $episodeList.empty();

  for (const episode of episodes) {
    let $episodeItem = $(
      `<li>${episode.name} (Season ${episode.season}, Number  ${episode.number} )</li>`
    );
    $episodeList.append($episodeItem);
  }
  $('#episodes-area').show();
  //
  //
}
