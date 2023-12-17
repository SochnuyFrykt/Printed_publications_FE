// const parseTextByRegex = text => {
// 	console.log(text)
// 	let array = text
// 		.replace(/[\n\r]+/g, ' ')
// 		.replace('|', ' ')
// 		.substring(10, text.length - 1)
// 		.split(' ')

// 	const regExp = {
// 		bbkRegex: /ББК/,
// 		udkRegex: /УДК/,
// 		author: /[1-2][0,9][0-9][0-9]/,
// 		titleRegex: /\//,
// 		yearRegex: /Copyright/,
// 		isbnRegex: /ISBN/,
// 		cityRegex: /[М,С,Т,Н,И]/,
// 	}

// 	let result = new Map()
// 	console.log(array)

// 	for (let i = 0; i < array.length; i++) {
// 		if (regExp.yearRegex.test(array[i])) {
// 			result.set('Год публикации', array[i + 2])
// 		} else if (regExp.cityRegex.test(array[i]) && array[i + 1] == ':') {
// 			result.set('Город издания', array[i])
// 		} else if (regExp.isbnRegex.test(array[i])) {
// 			result.set('ISBN', array[i + 1])
// 		} else if (regExp.bbkRegex.test(array[i])) {
// 			result.set('ББК', array[i + 1])
// 		} else if (regExp.udkRegex.test(array[i])) {
// 			result.set('УДК', array[i + 1])
// 		} else if (array[i] === result.get('Год публикации')) {
// 			result.set('Автор', `${array[i + 1]} ${array[i + 2]} ${array[i + 3]}`)
// 		} else if (regExp.titleRegex.test(array[i])) {
// 			result.set(
// 				'Название книги',
// 				`${array[i - 4]} ${array[i - 3]} ${array[i - 2]} ${array[i - 1]}`
// 			)
// 		}
// 		result.set('Тип издания', 'Художественное')
// 	}

// 	console.log(result)
// 	return result
// }



// export default parseTextByRegex


const parseTextByRegex = text => {
	let array = text
		.replace(/[\n\r]+/g, ' ')
		.replace('|', ' ')
		.substring(10, text.length - 1)
		.split(' ')

	const regExp = {
		bbkRegex: /ББК/,
		udkRegex: /УДК/,
		author: /[1-2][0,9][0-9][0-9]/,
		titleRegex: /\//,
		yearRegex: /Copyright/,
		isbnRegex: /ISBN/,
		cityRegex: /[М,С,Т,Н,И]/,
	}

	let result = {
		'Год публикации': '',
		'Город издания': '',
		'ISBN': '',
		'ББК': '',
		'УДК': '',
		'Автор': '',
		'Название книги': '',
	}

	for (let i = 0; i < array.length; i++) {
		if (regExp.yearRegex.test(array[i])) {
			result['Год публикации'] = array[i + 2]
		} else if (regExp.cityRegex.test(array[i]) && array[i + 1] == ':') {
			result['Город издания'] = array[i]
		} else if (regExp.isbnRegex.test(array[i])) {
			result['ISBN'] = array[i + 1]
		} else if (regExp.bbkRegex.test(array[i])) {
			result['ББК'] = array[i + 1]
		} else if (regExp.udkRegex.test(array[i])) {
			result['УДК'] = array[i + 1]
		} else if (array[i] === result['Год публикации']) {
			result['Автор'] = `${array[i + 1]} ${array[i + 2]} ${array[i + 3]}`
		} else if (regExp.titleRegex.test(array[i])) {
			result['Название книги'] =
				`${array[i - 4]} ${array[i - 3]} ${array[i - 2]} ${array[i - 1]}`

		}
		result['Тип издания'] = 'Художественное'
	}

	// console.log(result)
	return result
}

export default parseTextByRegex

// Попробовал чуть переделать парсер

// const parseTextByRegex = text => {
// 	const cleanText = text.replace(/[\n\r]+/g, ' ').replace('|', ' ').replace(/\s+/g, ' ').trim();
// 	const array = cleanText.split(' ');

// 	const regExp = {
// 		bbkRegex: /ББК/,
// 		udkRegex: /УДК/,
// 		authorRegex: /^[А-ЯЁ][а-яё]+(\s[А-ЯЁ]\.)?\s[А-ЯЁ]\.$/,
// 		titleRegex: /^[^:]+:$/,
// 		yearRegex: /\d{4}/,
// 		isbnRegex: /ISBN/,
// 		cityRegex: /[М,С,Т,Н,И]/,
// 	};

// 	let result = {
// 		'Год публикации': '',
// 		'Город издания': '',
// 		'ISBN': '',
// 		'ББК': '',
// 		'УДК': '',
// 		'Автор': '',
// 		'Название книги': '',
// 		'Тип издания': 'Художественное',
// 	};

// 	for (let i = 0; i < array.length; i++) {
// 		if (regExp.yearRegex.test(array[i])) {
// 			result['Год публикации'] = array[i];
// 		} else if (regExp.cityRegex.test(array[i]) && array[i + 1] === ':') {
// 			result['Город издания'] = array[i];
// 		} else if (regExp.isbnRegex.test(array[i])) {
// 			result['ISBN'] = array[i + 1];
// 		} else if (regExp.bbkRegex.test(array[i])) {
// 			result['ББК'] = array[i + 1];
// 		} else if (regExp.udkRegex.test(array[i])) {
// 			result['УДК'] = array[i + 1];
// 		} else if (regExp.authorRegex.test(array[i] + ' ' + array[i + 1] + ' ' + array[i + 2])) {
// 			result['Автор'] = array[i] + ' ' + array[i + 1] + ' ' + array[i + 2];
// 		} else if (regExp.titleRegex.test(array[i])) {
// 			result['Название книги'] = array[i].replace(':', '');
// 		}
// 	}

// 	return result;
// };

// export default parseTextByRegex;
