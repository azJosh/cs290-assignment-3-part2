window.favArray = []; //Global variable

//Load saved favorites
window.onload = function loadFav() {
    var favList = JSON.parse(localStorage.getItem('favList'));
    for (x in favList) {
    var resultEntry = new result();
    
    resultEntry.setId(favList[x].id);
    resultEntry.setUrl(favList[x].url);
    resultEntry.setDescription(favList[x].description);
    resultEntry.setLanguage(favList[x].language);
    
    printFavorite(resultEntry);
    favArray.push(resultEntry);
  }
}

function getGists() {
    var numPages = document.getElementsByName('filterNumPages')[0].value;
    for (var i = 1; i <= numPages; i++) {
        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {

          throw 'Unable to connect to the server';
          return;
    }
    var url = 'https://api.github.com/gists/public?page=' + i;
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            var gistsPage = JSON.parse(this.responseText);
            createGistsList(document.getElementById('gistsList'), gistsPage);
        }
    }
    httpRequest.open('GET', url);
    httpRequest.send();
  }
}

//Creating a new object.
function result() {
    this.id = '';
    this.url = '';
    this.description = '';
    this.language = '';
    this.getId = function() {
    return this.id;
    }
    this.getUrl = function() {
    return this.url;
    }
    this.getDescription = function() {
    return this.description;
    }
    this.getLanguage = function() {
    return this.language;
    }
    this.setId = function(id) {
    this.id = id;
    }
    this.setUrl = function(url) {
    this.url = url;
    }
    this.setDescription = function(description) {
    this.description = description;
    }
    this.setLanguage = function(language) {
    this.language = language;
    }
}

function createGistsList(section, resultPage) {
    for (var i in resultPage) {
        var resultEntry = new result();
        resultEntry.setId(resultPage[i].id);
        resultEntry.setUrl(resultPage[i].url);
        resultEntry.setDescription(resultPage[i].description);
        for (var j in resultPage[i]) {
            for (var k in resultPage[i][j]) {
                language = resultPage[i][j][k].language;
                if (typeof language !== 'undefined') {
                    resultEntry.setLanguage(resultPage[i][j][k].language);
                }else if(typeof language === 'object') {
                resultEntry.setLanguage('Null');
                }
            };
        };
        printList(section, resultEntry);
    };
}

function printList(section, resultEntry) {
       
    //Create the list of results
    var unsortList = document.createElement('ul');
    unsortList.innerText = '---------------------------------------------------';
    unsortList.id = resultEntry.getId();

    var listItem = document.createElement('div');

   //Add link for URL
    var link = document.createElement('a');
    link.href = resultEntry.getUrl();
    link.target = '_blank';
    link.innerText = resultEntry.getUrl();
    listItem.appendChild(link);
    unsortList.appendChild(listItem);

   //Print Descrition & language
    var listItem = document.createElement('div');
    listItem.innerHTML = 'Gist Description: ' + resultEntry.getDescription()  + "<br /> " + 'GistLanguage: ' + resultEntry.getLanguage();
    unsortList.appendChild(listItem);  
    
    //Add to favorites button
    var favButton = document.createElement('input');
    favButton.type = 'button';
    favButton.value = 'Add to My Favories List';
    favButton.onclick = function() {
    addFavorite(resultEntry);
    }
    filterPrintList(resultEntry, unsortList, listItem, favButton);
}

//Filter the languages for the results.
function filterPrintList(resultEntry, unsortList, listItem, favButton) {
    var python = document.getElementsByName('PythonCheck')[0].checked;
    var json = document.getElementsByName('JSONCheck')[0].checked;
    var javascript = document.getElementsByName('JavascriptCheck')[0].checked;
    var sql = document.getElementsByName('SQLCheck')[0].checked;
    if (!python && !json && !javascript && !sql) {
        var list = document.getElementById('gistsList');
        unsortList.appendChild(favButton);
        list.appendChild(unsortList);
        return;    
    }
    if (python && resultEntry.getLanguage() === 'Python') {
        var list = document.getElementById('gistsList');
        unsortList.appendChild(favButton);
        list.appendChild(unsortList);
        return
    }
    if (json && resultEntry.getLanguage() === 'JSON') {
        var list = document.getElementById('gistsList');
        unsortList.appendChild(favButton);
        list.appendChild(unsortList);
        return
     }
    if (javascript && resultEntry.getLanguage() === 'JavaScript') {
        var list = document.getElementById('gistsList');
        unsortList.appendChild(favButton);
        list.appendChild(unsortList);
        return
    }
    if (sql && resultEntry.getLanguage() === 'SQL') {
        var list = document.getElementById('gistsList');
        unsortList.appendChild(favButton);
        list.appendChild(unsortList);
        return
    }
}

//Add favorites to local storage.
function addFavorite(resultEntry) {
    favArray.push(resultEntry);
    var x = JSON.stringify(favArray);
    localStorage.setItem('favList', x);

    deleteLine(resultEntry);
    printFavorite(resultEntry);  
}

function printFavorite(resultEntry) {
  //Create the list of results
    var unsortList = document.createElement('ul');
    unsortList.innerText = '---------------------------------------------------';
    unsortList.id = resultEntry.getId();

    var listItem = document.createElement('div');

    //Add link for URL
    var link = document.createElement('a');
    link.href = resultEntry.getUrl();
    link.target = '_blank';
    link.innerText = resultEntry.getUrl();
    listItem.appendChild(link);
    unsortList.appendChild(listItem);

    //Print Descrition & language
    var listItem = document.createElement('div');
    listItem.innerHTML = 'Gist Description: ' + resultEntry.getDescription()  + "<br /> " + 'GistLanguage: ' + resultEntry.getLanguage();
    unsortList.appendChild(listItem); 

    var removeFavButton = document.createElement('input');
    removeFavButton.type = 'button';
    removeFavButton.value = 'Delete From My Favories List';
    removeFavButton.onclick = function() {
        deleteFav(resultEntry);
    }
    var list = document.getElementById('myFavorites');
    unsortList.appendChild(removeFavButton);
    list.appendChild(unsortList);
}

function deleteLine(resultEntry) {
    var list = document.getElementById('gistsList');
    var childList = document.getElementById(resultEntry.getId());
    list.removeChild(childList);
}

function deleteFav(resultEntry) {
    var list = document.getElementById('myFavorites');
    var listItem = document.getElementById(resultEntry.getId());
    list.removeChild(listItem);
    localStorage.removeItem('favList');
    for (var l = 0; l < favArray.length; l++) {
        if (resultEntry.getId() === favArray[l].getId()) {
            favArray.splice(l, 1);
        }
    }
    var x = JSON.stringify(favArray);
    localStorage.setItem('favList', x);
}

