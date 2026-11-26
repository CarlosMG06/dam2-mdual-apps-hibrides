/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// init Materialize
M.AutoInit();

// Carregar noms de personatges al tab1
document.addEventListener('DOMContentLoaded', function() {
  const loadBtn = document.getElementById('load-character-names-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      fetchCharacterNamesList();
    });
  }
});

function fetchCharacterNamesList() {
  // Obtenir 10 noms de personatges aleatoris
  const characterNamesList = $('#character-names-list');
  characterNamesList.html('<div class="progress"><div class="indeterminate"></div></div>');
  const randomPage = Math.floor(Math.random() * 500) + 1;
  $.ajax({
    method: "GET",
    url: `https://api.disneyapi.dev/character?page=${randomPage}&pageSize=15`,
    dataType: "json"
  }).done(function (response) {
    characterNamesList.empty();
    if(response.data.length > 0) {
      response.data.forEach(function(character) {
        const item = $('<a></a>')
          .addClass('collection-item')
          .attr('href', '#!')
          .text(character.name)
          .data('characterId', character._id)
          .on('click', function(e) {
            e.preventDefault();
            loadCharacterDetails(character._id);
          });
        characterNamesList.append(item);
      });
    } else {
      characterNamesList.html('<span class="collection-item red-text">No s\'han trobat personatges.</span>');
    }
  }).fail(function () {
    characterNamesList.html('<span class="collection-item red-text">Error carregant noms de personatges.</span>');
  });
}

// Carregar detalls del personatge al tab2
function loadCharacterDetails(characterId) {
  const detailsDiv = $('#character-details');
  detailsDiv.html('<div class="progress"><div class="indeterminate"></div></div>');
  $.ajax({
    method: "GET",
    url: `https://api.disneyapi.dev/character/${characterId}`,
    dataType: "json"
  }).done(function(response) {
    const character = response.data;
    detailsDiv.empty();
    let html = '';
    html += `<h4 class='center-align'><strong>${character.name}</strong></h4>`;
    html += `<div class='center-align'><img src='${character.imageUrl}' alt='${character.name}' style='max-width:100%;height:auto;margin-bottom:1em;'/></div>`;
    if (character.films && character.films.length > 0) {
      html += `<p><strong>Pel·lícules:</strong> ${character.films.join(', ')}</p>`;
    }
    if (character.shortFilms && character.shortFilms.length > 0) {
      html += `<p><strong>Curtmetratges:</strong> ${character.shortFilms.join(', ')}</p>`;
    }
    if (character.tvShows && character.tvShows.length > 0) {
      html += `<p><strong>Sèries de TV:</strong> ${character.tvShows.join(', ')}</p>`;
    }
    if (character.videoGames && character.videoGames.length > 0) {
      html += `<p><strong>Videojocs:</strong> ${character.videoGames.join(', ')}</p>`;
    }
    if(character.parkAttractions && character.parkAttractions.length > 0) {
      html += `<p><strong>Atraccions de parcs:</strong> ${character.parkAttractions.join(', ')}</p>`;
    }
    if(character.allies && character.allies.length > 0) {
      html += `<p><strong>Aliats:</strong> ${character.allies.join(', ')}</p>`;
    }
    if(character.enemies && character.enemies.length > 0) {
      html += `<p><strong>Enemics:</strong> ${character.enemies.join(', ')}</p>`;
    }
    detailsDiv.html(html);

    // Saltar a tab2
    var elems = document.getElementsByClassName('tabs');
    var instance = M.Tabs.getInstance(elems[0]);
    instance.select('image-test2');
  }).fail(function() {
    detailsDiv.html('<span class="red-text">Error carregant els detalls del personatge.</span>');
  });
}

// Carregar previsualitzacions de personatges a tab3 amb Materialize Cards
document.addEventListener('DOMContentLoaded', function() {
  const loadCardsBtn = document.getElementById('load-character-cards-btn');
  if (loadCardsBtn) {
    loadCardsBtn.addEventListener('click', function() {
      fetchCharacterPreviewCards();
    });
  }
});

function fetchCharacterPreviewCards() {
  const cardsRow = $('#character-preview-row');
  cardsRow.html('<div class="progress"><div class="indeterminate"></div></div>');
  const randomPage = Math.floor(Math.random() * 500) + 1;
  $.ajax({
    method: "GET",
    url: `https://api.disneyapi.dev/character?page=${randomPage}&pageSize=15`,
    dataType: "json"
  }).done(function (data) {
    cardsRow.empty();
    if(data.data.length > 0) {
      data.data.forEach(function(character) {
        const col = $('<div></div>').addClass('col s12 m6 l4');
        const card = $('<div></div>').addClass('card medium');
        const cardImage = $('<div></div>').addClass('card-image').append(
          $('<img>').attr('src', character.imageUrl).attr('alt', character.name)
        );
        const cardContent = $('<div></div>').addClass('card-content').append(
          $('<p></p>').text(character.name)
        );
        const cardAction = $('<div></div>').addClass('card-action');
        const actionBtn = $('<a></a>')
          .attr('href', '#!')
          .text('Veure detalls')
          .on('click', function(e) {
            e.preventDefault();
            loadCharacterDetails(character._id);
          });
        cardAction.append(actionBtn);
        card.append(cardImage, cardContent, cardAction);
        col.append(card);
        cardsRow.append(col);
      });
    } else {
      cardsRow.html('<span class="red-text">No s\'han trobat personatges.</span>');
    }
  }).fail(function() {
    cardsRow.html('<span class="red-text">Error carregant previsualitzacions de personatges.</span>');
  });
}