const fs = require('fs');

fs.readFile('./src/himnos/himnos.txt', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const songs = data.split('---').filter((song) => song !== '');
  const json = [];

  songs.forEach((song, index) => {
    const parts = song.split('***\n').filter((part) => part !== '');
    const item = {
      number: index + 1,
      title: '',
      chorus: null,
      stanzas: [],
      startsWithChorus: false,
      tags: null
    };

    parts.forEach((part, index) => {
      const lines = part.split('\n').filter((line) => line !== '');

      if (index === 0) {
        item.title = lines.join().replace(`## ${item.number}. `, '');
      } else {
        if (lines[0].includes('@CORO')) {
          lines.shift();
          item.chorus = lines.join('/n');
          item.startsWithChorus = item.stanzas.length === 0;
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
    './dist/himnos/himnos.json',
    JSON.stringify(json, null, 2),
    'utf-8',
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('Himnario generado!');
    }
  );
});
