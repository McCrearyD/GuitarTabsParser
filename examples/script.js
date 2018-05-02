var inputElement = document.getElementsByClassName( "query-input" )[0];
var dropDown = document.getElementById( "dd" );

inputElement.addEventListener( "input", function( e ) {
    if ( e.srcElement.value.length < 1 ) {
        clearDropDown();
        dropDown.classList.remove( "show" );
        return;
    }

	getAutoComplete( e.srcElement.value, function( x ) {
        updateDropDown( x );
        dropDown.classList.add( "show" );
    } );
} );

inputElement.addEventListener( "focus", function() {
    if ( document.activeElement === inputElement ) {
        if ( dropDown.firstChild ) {
            dropDown.classList.add( "show" );
        }
    }
} );

inputElement.addEventListener( "keydown", function( e ) {
    if ( e.keyCode === 13 ) {
        getQuery( inputElement.value );
    }
} );

dropDown.addEventListener( "click", function( e ) {
    inputElement.value = e.srcElement.innerText;
    dropDown.classList.remove( "show" );
    getQuery( inputElement.value );
} );

function clearDropDown() {
    while ( dropDown.firstChild ) {
        dropDown.removeChild( dropDown.firstChild );
    }
}

function updateDropDown( suggestions ) {
    clearDropDown();
    let loopValue = suggestions.length < 10 ? suggestions.length : 10; 

    for ( let i = 0; i < loopValue; i++ ) {
        let a = document.createElement( "A" );
        a.appendChild( document.createTextNode( suggestions[i] ) );
        a.classList.add( "dropbtn" );
        dropDown.appendChild( a );
    }
}

function getQuery( query, callback ) {
    let client = new HttpClient();
    client.get( "http://localhost:8080/query?query=" + encodeURIComponent( query ), function( res ) {
        if ( res ) {
            console.log( JSON.parse( res ) );
        }
    } );
}

function getAutoComplete( string, callback ) {
	let client = new HttpClient();
	client.get( "http://localhost:8080/autocomplete?text=" + encodeURIComponent( string ), function( res ) {
        if ( res ) {
            callback( JSON.parse( res ) );
        }
	} );
}

var HttpClient = function() {
    this.get = function( aUrl, aCallback ) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

window.onclick = function( event ) {
  if ( !event.target.matches( '.dropbtn' ) && event.target !== inputElement ) {
    var dropdowns = document.getElementsByClassName( "dropdown-content" );
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
  }
}