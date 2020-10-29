const fs = require('fs');

return fs.readFile('./HIMNOS.txt', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const songs = data.split('---').filter((song) => song !== '');
  const json = [];

  songs.forEach((song, index) => {
    const parts = song.split('***\n').filter((part) => part !== '');
    const item = {
      title: '',
      number: index + 1,
      chorus: null,
      startsWithChorus: false,
      stanzas: [],
      stanzasCount: 0,
      tags: null
    };

    parts.forEach((part, index) => {
      const lines = part.split('\n').filter((line) => line !== '');

      if (index === 0) {
        item.title = lines.join().replace(`## ${item.number}. `, '');
        console.log(item.number, item.title);
      } else {
        if (lines[0].includes('@CORO')) {
          lines.shift();
          item.chorus = lines;
          item.startsWithChorus = item.stanzasCount === 0;
        } else if (lines[0].includes('@TAGS')) {
          lines.shift();
          item.tags = lines;
        } else {
          item.stanzas.push(lines);
          item.stanzasCount++;
        }
      }
    });

    json.push(item);
  });

  fs.writeFile(
    './HIMNOS.json',
    JSON.stringify(json, null, 2),
    'utf-8',
    (err) => {
      if (err) return console.log(err);
    }
  );
});
