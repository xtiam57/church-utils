const fs = require('fs');

const table = [];

fs.readFile('./src/himnos/himnos.txt', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  console.log(
    `\nGenerando himnos usando: ${__dirname}\\src\\himnos\\himnos.txt\n`
  );

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
    table.push({
      number: item.numero,
      title: item.titulo,
      stanzas: item.estrofas.length,
      hasChorus: item.coro !== null
    });
  });

  fs.writeFile(
    './dist/himnos/himnos.json',
    JSON.stringify(json, null, 2),
    'utf-8',
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.table(table);
    }
  );
});
