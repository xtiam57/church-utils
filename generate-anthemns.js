const fs = require('fs');

fs.readFile('./src/himnario/himnario.txt', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const songs = data.split('---').filter((song) => song !== '');
  const json = [];

  songs.forEach((song, index) => {
    const parts = song.split('***\n').filter((part) => part !== '');

    const item = {
      number: 0,
      title: '',
      chorus: null,
      stanzas: [],
      startsWithChorus: false,
      authors: null,
      tags: null
    };

    parts.forEach((part, index) => {
      const lines = part.split('\n').filter((line) => line !== '');

      if (index === 0) {
        let title = lines.join().replace('## ', '').replace('.', '');
        item.number = +title.match(/^\d+/gm);
        item.title = title.replace(item.number, '').trim();
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
        } else {
          item.stanzas.push(lines.join('/n'));
        }
      }
    });

    json.push(item);
  });

  fs.writeFile(
    './dist/himnario/himnario.json',
    JSON.stringify(
      json.sort((a, b) => a.number - b.number),
      null,
      2
    ),
    'utf-8',
    (err) => {
      if (err) {
        return console.log(err);
      }
      const _index = json.reduce((prev, { title }) => {
        prev.push(title);
        return prev;
      }, []);

      createIndex(_index);
    }
  );
});

function createIndex(data) {
  fs.writeFile(
    './dist/himnario/_index.json',
    JSON.stringify(data, null, 2),
    'utf-8',
    () => {
      console.log('Himnario generado!');
    }
  );
}
