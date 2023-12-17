import * as Papa from 'papaparse';

interface Book {
  id: string;
  id_user: string;
  key: string;
  author: string;
  title: string;
  date: number;
  city: string;
  description?: string;
  quantity: number;
  lbc: string;
  udc: string;
  ISBN: string;
  publication_type: string;
}

const generateAndDownloadCSV = (data: Book[]) => {
  const dataWithoutIds = data.map(({ author, title, date, city, description, quantity, lbc, udc, ISBN, publication_type }) => (
    {
      'Автор': author,
      'Название публикации': title,
      'Дата публикации': date,
      'Город': city,
      'Количество': quantity,
      'ББК': lbc,
      'УДК': udc,
      'ISBN': ISBN,
      'Тип публикации': publication_type,
      'Описание': description,
    }));

  const csvData = Papa.unparse(dataWithoutIds, {
    header: true,
    encoding: 'utf-8',
    delimiter: ';',
    quotes: true,
  });

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, 'books.csv');
  } else if ('download' in link) {
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'books.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } else {
    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvData));
  }
};

export default generateAndDownloadCSV;
