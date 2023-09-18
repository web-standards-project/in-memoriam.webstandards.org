const { DateTime } = require("luxon");
const widont = require("widont");

function parse_date( date ){
	if ( ! date ) {
		return DateTime.now();
	}
	// try JS
	var the_date = DateTime.fromJSDate(date);
	// then try ISO
	if ( the_date.invalid ) {
		the_date = DateTime.fromISO(date);
	}
	// fallback to SQL
	if ( the_date.invalid ) {
		the_date = DateTime.fromSQL(date);
	}
	return the_date;
}

function objectToString( obj ){
	if ( obj instanceof String )
	{
		return obj;
	}
	let str = obj.title || obj.name || "";
	if ( obj.url )
	{
		return `<a href="${obj.url}">${str}</a>`;
	}
	return str;
}

module.exports = {
	
	readable_date: date => {
		return parse_date( date ).toFormat("dd LLL yyyy");
	},
	ymd_date: date => {
		return parse_date( date ).toISODate();
	},
	machine_date: date => {
		return parse_date( date ).toISO();
	},

	strip_links: text => {
		return text.replace(/<\/?a[^>]*>/gi, "");
	},

	trim_newlines: text => {
		return text.replace(/[\r\n]+/g, "");
	},

	widont: text => {
		return `${widont( text )}`;
	},

	isArray: obj => (obj instanceof Array),
	isString: obj => (obj instanceof String),
	isObject: obj => (obj instanceof Object),
	limit: (array, limit) => {
		return array.slice(0, limit);
	},

	toSentenceList: arr => {
		if ( ! ( arr instanceof Array ) ){
			arr = [ arr ];
		}
		let i = arr.length;
		if ( i === 1 ) {
			return objectToString(arr[0]);
		}
		if ( i === 2 ) {
			return `${objectToString(arr[0])} and ${objectToString(arr[1])}`;
		}
		let last = objectToString(arr.pop());
		let list = arr.map(item => objectToString(item));
		return `${list.join(", ")}, and ${last}`;
	},
	
	pluck( obj, prop, value) {
		let found = obj.find( el => el[prop] == value );
		// if ( prop == "id" ){
		// 	console.log( "searching", obj, `for ${prop} = ${value}` );
		// 	console.log( "found", found );
		// }
		return found;
	},
	gather( obj, prop, value) {
		let found = obj.filter( el => { 
			if ( el[prop] instanceof Array ) {
				return el[prop].indexOf( value ) > -1;
			} else {
				return el[prop] == value;
			}
		});
		// if ( prop == "id" ){
		// 	console.log( "searching", obj, `for ${prop} = ${value}` );
		// 	console.log( "found", found );
		// }
		return found;
	},
	filterTo( obj, prop, value) {
		return obj.filter( el => ( el[prop] == value || el.data[prop] == value ) );
	},

	path_in_scope: ( path, scope ) => {
		return path.indexOf( scope ) > -1;
	},

	minus: ( a, b ) => parseInt(a,10) - parseInt(b,10),
	size: array => !array ? 0 : array.length
};
