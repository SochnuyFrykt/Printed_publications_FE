function parseTextByRegex(): string[] {
  const matches: string[] = [];
	const text = "УДК 1234, ББК 5678, ISBN 978-3-16-148410-0";
	const regexArr = [/\bУДК\b/g, /\bББК\b/g, /\bISBN\b/g];
  regexArr.forEach((regex) => {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
    }
  });

  return matches;
}

const matches = parseTextByRegex();
console.log(matches); // Output: ['UDC', 'BBK', 'ISBN']

export default parseTextByRegex;