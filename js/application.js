//# sourceURL=application.js

/*
Copyright (C) 2015 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
This is the entry point to the application and handles the initial loading of required JavaScript files.
*/

var resourceLoader;

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */
App.onLaunch = function(options) {
    var javascriptFiles = [
        `${options.BASEURL}js/ResourceLoader.js`,
        `${options.BASEURL}js/Presenter.js`,
        `${options.BASEURL}js/Config.js`
    ];

    /**
     * evaluateScripts is responsible for loading the JavaScript files neccessary
     * for you app to run. It can be used at any time in your apps lifecycle.
     * 
     * @param - Array of JavaScript URLs  
     * @param - Function called when the scripts have been evaluated. A boolean is
     * passed that indicates if the scripts were evaluated successfully.
     */
    evaluateScripts(javascriptFiles, function(success) {
        if (success) {
            resourceLoader = new ResourceLoader(options.BASEURL);

            var index = resourceLoader.loadResource(`${options.BASEURL}templates/Index.xml.js`,
                function(resource) {
                    var doc = Presenter.makeDocument(resource);
                    doc.addEventListener("select", Presenter.load.bind(Presenter));
                    navigationDocument.pushDocument(doc);
                });
        } else {
            /*
            Be sure to handle error cases in your code. You should present a readable, and friendly
            error message to the user in an alert dialog.

            See alertDialog.xml.js template for details.
            */
            var alert = createAlert("Evaluate Scripts Error", "There was an error attempting to evaluate the external JavaScript files.\n\n Please check your network connection and try again later.");
            navigationDocument.presentModal(alert);

            throw ("Playback Example: unable to evaluate scripts.");
        }
    });
}

App.onResume = function (options) {
  App.reload();
};


/**
 * This convenience funnction returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc
}

var confirmAdd = function(imdbId) {
    var confirmTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
           <alertTemplate>
              <title>Add to Wanted List?</title>
              <button type="confirm">
                 <text>Confirm</text>
              </button>
              <button type="cancel">
                 <text>Cancel</text>
              </button>
           </alertTemplate>
        </document>
    `
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(confirmTemplate, "application/xml");

    navigationDocument.presentModal(alertDoc);
    alertDoc.addEventListener('select', function(event) {
        var type = event.target.getAttribute('type');

        if (type == 'cancel') {
            navigationDocument.dismissModal();
        }
        if (type == 'confirm') {
            navigationDocument.dismissModal();

            var url = CPDomain + '/api/' + CPApiKey + '/movie.add?identifier=' + imdbId;

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var myArr = JSON.parse(xmlhttp.responseText);
                    console.log("Added");
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    });
}

var confirmMarkAsDone = function(id, element) {
    var confirmTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
           <alertTemplate>
              <title>Remove from Wanted List?</title>
              <button type="confirm">
                 <text>Confirm</text>
              </button>
              <button type="cancel">
                 <text>Cancel</text>
              </button>
           </alertTemplate>
        </document>
    `
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(confirmTemplate, "application/xml");

    navigationDocument.presentModal(alertDoc);
    alertDoc.addEventListener('select', function(event) {
        var type = event.target.getAttribute('type');

        if (type == 'cancel') {
            navigationDocument.dismissModal();
        }
        if (type == 'confirm') {
            navigationDocument.dismissModal();

            var url = CPDomain + '/api/' + CPApiKey + '/media.delete/?id=' + id + '&delete_from=wanted';

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log("Done");
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    });
}

/**
 * @description - an example implementation of search that reacts to the 
 * keyboard onTextChange (see Presenter.js) to filter the lockup items based on the search text
 * @param {Document} doc - active xml document 
 * @param {String} searchText - current text value of keyboard search input
 */
var buildResults = function(doc, searchText) {

    //simple filter and helper function
    var regExp = new RegExp(searchText, "i");
    var matchesText = function(value) {
        return regExp.test(value);
    }
    
    var xmlhttp = new XMLHttpRequest();
    var url = CPDomain + '/api/' + CPApiKey + '/search/?t=JTxyqOB0&q='+encodeURIComponent(searchText);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            myFunction(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr) {
        //Create parser and new input element
        var domImplementation = doc.implementation;
        var lsParser = domImplementation.createLSParser(1, null);
        var lsInput = domImplementation.createLSInput();

        //set default template fragment to display no results
        lsInput.stringData = `<list>
          <section>
            <header>
              <title>No Results Found</title>
            </header>
          </section>
        </list>`;

        console.log(arr);

        if ("movies" in arr) {
            results = arr.movies.reverse();
            lsInput.stringData = `<shelf><header><title>Results</title></header><section id="Results">`;
            for (var i = results.length - 1; i >= 0; i--) {
                    lsInput.stringData += `<lockup addToWanted="${results[i].imdb}">
                  <img src="${results[i].images.poster[0]}" width="350" height="520" />
                  <title>${results[i].original_title}</title>
                </lockup>`;
            };
            lsInput.stringData += `</section></shelf>`;
        }

        lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
    }
}
