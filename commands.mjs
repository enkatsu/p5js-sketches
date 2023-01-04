import ejs from 'ejs';
import { program } from 'commander';
import fs from 'fs';

program.command('sketch:add')
  .requiredOption('-t, --title <title>')
  .description('add sketch')
  .action(async args => {
    const sketchPath = `./src/sketches/${args.title}`;

    if (fs.existsSync(sketchPath)) {
      console.error(`${sketchPath} is exist`);
      return;
    }

    console.log('run sketch:add command');
    const html = await ejs.renderFile('./template/index.ejs', args);
    fs.mkdirSync(sketchPath);
    fs.writeFileSync(`${sketchPath}/index.html`, html);
    console.log(`make: ${sketchPath}/index.html`);
    fs.copyFileSync('./template/sketch.js', `${sketchPath}/sketch.js`);
    console.log(`make: ${sketchPath}/sketch.js`);
  })

program.parse(process.argv)
