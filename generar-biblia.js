const fs = require('fs');
const books = require('./src/biblia/_index.json');

const table = [];

books.forEach((book, index) => {
  return fs.readFile(`./src/biblia/${book}.txt`, 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
    }

    const chapters = data.split('***\n').filter((chapter) => chapter !== '');
    const json = [];

    chapters.forEach((chapter) => {
      const lines = chapter.split('\n').filter((line) => line !== '');
      json.push(lines);
    });

    return fs.writeFile(
      `./dist/biblia/${book}.json`,
      JSON.stringify(json, null, 2),
      'utf-8',
      (error) => {
        if (error) {
          console.log(error);
        }
        table.push({
          number: index + 1,
          book: `${book}.json`,
          chapters: json.length
        });

        if (index === books.length - 1) {
          console.table(table);
        }
      }
    );
  });
});
