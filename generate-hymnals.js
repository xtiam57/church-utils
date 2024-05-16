const fs = require('fs');

const json = [];
const FILES = [
  {
    path: './src/himnarios/himnario-bautista.txt',
    book: 'Himnos Bautistas',
    keepNum: false
  },
  {
    path: './src/himnarios/himnario-majestuoso.txt',
    book: 'Himnos Majestuosos',
    keepNum: false
  },
  {
    path: './src/himnarios/himnario-gracia.txt',
    book: 'Himnos de Gracia',
    keepNum: true
  },
  {
    path: './src/himnarios/corario-bautista.txt',
    book: 'Corario Bautista',
    keepNum: false
  },
  {
    path: './src/himnarios/himnario-apendice.txt',
    book: 'Apéndice',
    keepNum: false
  }
];
const OUTPUT = './dist/himnario/index.json';

function process(data, book, keepNum = false) {
  const songs = data.split('---').filter((song) => song !== '');

  songs.forEach((song, index) => {
    const parts = song.split('***\r\n').filter((part) => part !== '');

    const item = {
      number: 1 + index,
      title: '',
      chorus: null,
      stanzas: [],
      startsWithChorus: false,
      repeatChorusAtEnd: false,
      authors: null,
      tags: null,
      book
    };

    parts.forEach((part, index) => {
      const lines = part.split('\r\n').filter((line) => line !== '');

      if (index === 0) {
        let title = lines.join().replace('## ', '').replace('.', '');
        const tempNumber = +title.match(/^\d+/gm);
        item.title = title.replace(tempNumber, '').trim();

        if (keepNum) {
          item.number = tempNumber;
        }
      } else {
        if (lines[0].includes('@CORO')) {
          lines.shift();
          item.chorus = lines.join('/n');
          item.startsWithChorus = item.stanzas.length === 0;
        } else if (lines[0].includes('@AUTHORS')) {
          lines.shift();
          item.authors = lines.join(', ');
        } else if (lines[0].includes('@TAGS')) {
          lines.shift();
          item.tags = lines.join(',');
        } else if (lines[0].includes('@REPETIR_CORO_AL_FINAL')) {
          item.repeatChorusAtEnd = true;
        } else {
          item.stanzas.push(lines.join('/n'));
        }
      }
    });

    item.stanzas = item.stanzas.map((stanza, index) => {
      const tempNumber = stanza.match(/^\d+/gm);
      return `${!tempNumber ? `${index + 1}) ` : ''}${stanza}`;
    });

    json.push(item);
  });
}

FILES.forEach((file, index) => {
  const data = fs.readFileSync(file.path, 'utf8');

  process(data, file.book, file.keepNum);

  if (index === FILES.length - 1) {
    fs.writeFile(OUTPUT, JSON.stringify(json, null, 2), 'utf-8', (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('Himnario generado!');
    });
  }
});
