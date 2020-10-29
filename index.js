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
      numero: index + 1,
      titulo: '',
      coro: null,
      estrofas: [],
      empiezaConCoro: false,
      etiquetas: null
    };

    parts.forEach((part, index) => {
      const lines = part.split('\n').filter((line) => line !== '');

      if (index === 0) {
        item.titulo = lines.join().replace(`## ${item.numero}. `, '');
        console.log(item.numero, item.titulo);
      } else {
        if (lines[0].includes('@CORO')) {
          lines.shift();
          item.coro = lines.join('/n');
          item.empiezaConCoro = item.estrofas.length === 0;
        } else if (lines[0].includes('@TAGS')) {
          lines.shift();
          item.etiquetas = lines.join(',');
        } else {
          item.estrofas.push(lines.join('/n'));
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
