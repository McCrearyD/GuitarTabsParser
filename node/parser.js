module.exports = {
	difficulty: function( s ) {
		if ( !s || !/.*?difficulty:/i.test( s ) ) {
			return "unknown";
		}

		return s.replace( "Difficulty: ", "" );
	},
	tuning: function( s ) {
		if ( !s ) {
			return [ "E", "A", "D", "G", "B", "E" ];
		}
		
		return s.split( " " );
	},
	tabs: function( content ) {
		return parse( content );
	}
};

function getOrder( content ) {
	let order = content.match( /\[.*\]/gm );

	for ( let i in order ) {
		order[i] = order[i].replace( "[", "" ).replace( "]", "" );
	}

	return order;
}

function parse( content ) {
	let output = {};

	output.order = getOrder( content );
	output.sections = {};

	for ( let i in output.order ) {
		let sec = output.order[i];

		if ( sec === "order" ) {
			throw new Error( "Section name cannot be \'" + sec + "\'." );
		}

		console.log()
		output.sections[sec] = parseSection( sec, content );
	}

	return output;
}

function parseSection( section, content ) {
	let re = new RegExp( "\\[" + section + "\\].*([^\\0]*?)(?:\\[|\\*{36})", "i" );
	let inner = re.exec( content )[1];

	inner = inner.split( "\n" );

	let measures = [];
	let measure = {};
	let step = {};
	let broke = false;
	let count = 0;
	let notes = [];
	let measureCount = 0;

	for ( let i = 0; i < inner.length; i++ ) {
		let line = inner[i];
		let previous = null;

		if ( i - 1 >= 0 ) {
			previous = inner[i-1];
		}

		if ( line.length > 0 ) {
			if ( /^.*\|/.test( line ) ) {
				measure = {};
				measure.steps = [];

				let hasStarted = false;

				for ( let c = line.indexOf( "|" ) + 1; c < line.length; c++ ) {
					step = {};
					broke = false;
					count = 0;

					for ( let j = i; j <= i + 6; j++ ) {
						let innerLine = inner[j];
						let character = innerLine[c];

						if ( character !== "|" ) {
							hasStarted = true;
						} else {
							broke = true;
							break;
						}

						if ( character && character !== "-" ) {
							step["string_" + ( j - i + 1 )] = character;
							count ++;
						}
					}

					if ( previous && previous.length >= c ) {
						let s = previous.substring( c, c + 1 ).replace( /\s/gm, "" );

						if ( s.length > 0 ) {
							step.chord = s;
						}
					}

					if ( !broke ) {
						if ( count > 0 ) {
							measure.steps.push( step );
						} else {
							measure.steps.push( null );
						}
					} else if ( hasStarted ) {
						if ( measure.steps.length > 0 ) {
							measures.push( measure );
							measureCount++;
						}
						
						measure = {};
						measure.steps = [];
					}
				}
				
				i+=6;
			} else if ( !line.startsWith( "    " ) ) {
				notes.push( { 
					line: line,
					"previous-measure": measureCount
				} );
			}
		}
	}

	return { 
		measures: measures,
		notes: notes
	};
}