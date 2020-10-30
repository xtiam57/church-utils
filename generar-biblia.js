const fs = require('fs');
const books = require('./src/biblia/_index.json');

let booksWritten = 0;

books.forEach((book, index) => {
  fs.readFile(`./src/biblia/${book.key}.txt`, 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
    }

    const chapters = data.split('***\n').filter((chapter) => chapter !== '');
    const json = [];

    chapters.forEach((chapter) => {
      const lines = chapter.split('\n').filter((line) => line !== '');
      json.push(lines);
    });

    fs.writeFile(
      `./dist/biblia/${book.key}.json`,
      JSON.stringify(json, null, 2),
      'utf-8',
      (error) => {
        if (error) {
          console.log(error);
        }

        // Extra info
        book.number = index + 1;
        book.chapters = json.length;
        book.verses = json.reduce((count, b) => count + b.length, 0);

        booksWritten++;

        if (booksWritten === books.length) {
          createIndex();
        }
      }
    );
  });
});

function createIndex() {
  fs.writeFile(
    './dist/biblia/_index.json',
    JSON.stringify(books, null, 2),
    'utf-8',
    () => {
      console.log('Biblia generada!');
    }
  );
}
