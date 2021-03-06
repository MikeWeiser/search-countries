const init = () => {

  
    let searchField = document.getElementById("searchFieldId");
    let searchButton = document.getElementById("search-btn");

    if (searchButton) {
        searchButton.addEventListener("click", validateForm);
    }
}

const validateForm = () => {
    
    let searchField = document.getElementById('searchFieldId');
    let typeField = document.getElementById('searchTypeId');

    let searchFieldValue = searchField.value;
    searchFieldValue = searchFieldValue.trim();

    let searchFieldLength = searchFieldValue.length;

    let typeFieldLength = typeField.value.length;
    
    if (searchFieldLength == 0 && typeFieldLength == 0) {
        typeField.style.borderColor = "red";
        searchField.style.borderColor = "red";

    } else if (searchFieldLength == 0) {
        searchField.style.borderColor = "red";
        typeField.style.borderColor = "gray";
        
    } else if (typeFieldLength == 0) {
        typeField.style.borderColor = "red";
        searchField.style.borderColor = "gray";

    } else {
        searchField.style.borderColor = "green";
        typeField.style.borderColor = "green";
        searchCountries();

    }  

    
}

const searchCountries = () => {

    let search_term = (document.getElementById('searchFieldId').value).trim();
    let search_type = document.getElementById('searchTypeId').value;
        
    ajaxRequest(search_term, search_type);
    
    
}

const ajaxRequest = (search_term, search_type) => {
    //console.log("in the ajaxRequest method");
    let request = new XMLHttpRequest();
    request.onreadystatechange =() => {
        if (request.readyState == 4 && request.status == 200) {
            let phpResponse = request.responseText;
            
            // function to handle php Response
            buildSearchResultsTable(phpResponse);

            // allows for next search:
            init();
        } 
        
    };
    request.open("GET", `api/index.php?term=${search_term}&type=${search_type}`, true);
    request.send();
    
}

const buildSearchResultsTable = (phpResponse) => {
    
    document.getElementById("searchResultsId").innerHTML = "";
    document.getElementById("compiledResultsId").innerHTML = "";

    if (phpResponse.substring(0,2) == "[{") {   

        let obj = JSON.parse(phpResponse);
        let searchResultsDiv = document.getElementById("searchResultsId");
        let compiledResultsDiv = document.getElementById("compiledResultsId");
        let countryCount = obj.length;
        let regionMap = new Map();
        let subregionMap = new Map();
        
        
        // traverse JSON data and add values to the HTML div
        for (let i = 0; i < countryCount; i++) {
           
           
            if (regionMap.has(obj[i].region)) {
                currentVal = regionMap.get(obj[i].region);
                regionMap.set(obj[i].region, currentVal + 1); 
            } else if (obj[i].region != "") {
                regionMap.set(obj[i].region, 1);
            }
    
            if (subregionMap.has(obj[i].subregion)) {
                currentVal = subregionMap.get(obj[i].subregion);
                subregionMap.set(obj[i].subregion, currentVal +1); 
            } else if (obj[i].subregion != "") {
                subregionMap.set(obj[i].subregion, 1);
                }
    
            
    
            const header = document.createElement('h2');
            const list = document.createElement('ul');
            //const nativeName = document.createElement('li');
            const alphaCode2 = document.createElement('li');
            const alphaCode3 = document.createElement('li');
            const flagImg = document.createElement('p');
            const region = document.createElement('li');
            const subregion = document.createElement('li');
            const population = document.createElement('li');
            const languageList = document.createElement('li')
            const languages = document.createElement('ul');
     
            header.textContent = obj[i].name;
            flagImg.innerHTML = "<img src=\"" + obj[i].flag + "\">";
            //nativeName.textContent = "Native name: " + obj[i].nativeName;
            alphaCode2.textContent = "Alpha code 2: " + obj[i].alpha2Code;
            alphaCode3.textContent = "Alpha code 3: " + obj[i].alpha3Code;
            region.textContent = "Region: " + obj[i].region;
            subregion.textContent = "Subregion: " + obj[i].subregion;
            population.textContent = "Population: " + obj[i].population;
            languageList.textContent = "Languages: ";
    
            const objLanguages = obj[i].languages;
    
            for (let j = 0; j < objLanguages.length; j++) {
                const languageListItem = document.createElement('li');
                languageListItem.innerHTML = "&#8226; " + objLanguages[j].name;
                languages.appendChild(languageListItem);
            }
    
            searchResultsDiv.appendChild(header);
            searchResultsDiv.appendChild(flagImg);
            searchResultsDiv.appendChild(list);
            //list.appendChild(nativeName);
            list.appendChild(alphaCode2);
            list.appendChild(alphaCode3);
            list.appendChild(region);
            list.appendChild(subregion);
            list.appendChild(population);
            list.appendChild(languageList);
            list.appendChild(languages);
     
        }
        // build a table with compiled results in separate div
        const countryCountHeader = document.createElement('h2');
    
        const compiledTable = document.createElement('table');
        const tableHeaderRow = document.createElement('tr');
        const tableHeaderData1 = document.createElement('th');
        const tableHeaderData2 = document.createElement('th');
    
        tableHeaderRow.appendChild(tableHeaderData1);
        tableHeaderRow.appendChild(tableHeaderData2)
    
        compiledTable.appendChild(tableHeaderRow);
    
    
        countryCountHeader.textContent = "Countries returned: " + countryCount;
        tableHeaderData1.textContent = "Region/Subregion     ";
        tableHeaderData2.textContent = "Total";
    
        compiledResultsDiv.appendChild(countryCountHeader);
        compiledResultsDiv.appendChild(compiledTable);
    
    
        for (let [key, value] of regionMap) {
            const tableRow = document.createElement('tr');
            const column1 = document.createElement('td');
            const column2 = document.createElement('td');
            
            column1.textContent = key;
            //column2.textContent = regionMap.get(region);
            column2.textContent = value;
    
            tableRow.appendChild(column1);
            tableRow.appendChild(column2);
    
            compiledTable.appendChild(tableRow);
        }
    
    
        for (let [key, value] of subregionMap) {
            const tableRow = document.createElement('tr');
            const column1 = document.createElement('td');
            const column2 = document.createElement('td');
            
            column1.textContent = key;
            //column2.textContent = regionMap.get(region);
            column2.textContent = value;
    
            tableRow.appendChild(column1);
            tableRow.appendChild(column2);
    
            compiledTable.appendChild(tableRow);
        }
    
    
        compiledResultsDiv.appendChild(countryCountHeader);
        compiledResultsDiv.appendChild(compiledTable);
    
        
    
    } else {
        const searchResultsDiv = document.getElementById("searchResultsId");
        const noResultsMessage = document.createElement('h2');
        noResultsMessage.textContent = "Sorry, no results were found.";
        searchResultsDiv.appendChild(noResultsMessage);
    }
}

//clear page on reload
const clearPage = () => {
    window.location.reload();
}
// call init on load
window.onload = init();