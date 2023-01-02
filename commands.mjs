import ejs from 'ejs';
import { program } from 'commander';
import fs from 'fs';

program.command('sketch:add')
  .requiredOption('-t, --title <title>')
  .description('add sketch')
  .action(async args => {
    console.log('run sketch:add command');
    const html = await ejs.renderFile('./template/index.ejs', args);
    fs.mkdirSync(`./src/sketches/${args.title}`);
    fs.writeFileSync(`./src/sketches/${args.title}/index.html`, html);
    console.log(`make: ./src/sketches/${args.title}/index.html`);
    fs.copyFileSync('./template/sketch.js', `./src/sketches/${args.title}/sketch.js`);
    console.log(`make: ./src/sketches/${args.title}/sketch.js`);
  })

program.parse(process.argv)
