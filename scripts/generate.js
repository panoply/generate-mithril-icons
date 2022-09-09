const { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { extname, join, resolve, basename, dirname } = require('path');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const { magentaBright, greenBright, green, white, cyanBright } = require('ansis/colors');
const { log } = console;


const config = {
  /**
   * Directory containing SVG files (icons)
   */
  input: 'svgs',
  /**
   * The output directory where "map" should be written
   */
  output: 'src/icons',
  /**
   * Whether to upcase the export Svg names
   */
  upcase: true,
}

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

function upcase(str) {

  return str[0].toUpperCase() + str.slice(1)

}

function camelCase(str) {

  return str.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, x => x.toUpperCase())
    .replace( / /g, '' );
}

/* -------------------------------------------- */
/* BEGIN                                        */
/* -------------------------------------------- */

/**
 * `/src/icons`
 */
const ICON_GEN = resolve(process.cwd(), config.output);

if (!existsSync(ICON_GEN)) mkdirSync(ICON_GEN);

/**
 * `/svgs/*.svg`
 */
const SVGS_DIR = resolve(process.cwd(), config.input);

/**
 * Get contents between opening and closing `<svg>` tags.
 *
 * @param {string} svg
 * @returns {{attibutes: string, contents: string }}
 */
function getSvgContents (svg) {

  const $ = cheerio.load(svg);
  const { viewBox } = $('svg').attr();
  const content = minify($('svg').html(), { collapseWhitespace: true });

  return {
    viewBox,
    content
  };

}

/**
 * Generate Mithril Icon Vnodes
 *
 * @param {string} name The icon name
 * @param {string} viewBox The viewBox attribute value
 * @param {string} content Inner `<svg>` contents
 * @param {'feather'|'custom'} type Icon pack
 */
function generateVnode (name, viewBox, content) {

  const prepend = [
    'import m from \'mithril\';\n'
  ].join('\n');

  const comment = '/** Custom Icon */';

  const naming = config.upcase
    ? upcase(camelCase(name))
    : camelCase(name)

  const xport = `export const ${naming} = (attrs = {})`;
  const attrs = `{ ...attrs, viewBox: '${viewBox}' }`;
  const vnode = `${xport} => m('svg', ${attrs}, m.trust('${content}'))`;

  return `${prepend}\n${comment}\n${vnode}`;

}

/**
 * Build Custom Icon Exports
 *
 * @param {string[]} svgFiles Custom SVG files list
 * @param {function} getSvg SVG function getter
 */
function buildCustomIcons (svgFiles, getSvg) {

  const xport = [];
  const names = [];

  log(white.bold`Creating Icons` + '\n');

  xport.push('\n// ICONS -------------------------------\n');

  const padding = svgFiles.reduce((n, file) => {
    if (n < file.length) n = file.length
    return n
  }, 0)

  for (const svgFile of svgFiles) {

    const _name = basename(svgFile, '.svg');
    const file = readFileSync(join(SVGS_DIR, svgFile));
    const { content, viewBox } = getSvgContents(file);
    const vnode = generateVnode(_name, viewBox, content);

    // WRITE SVG VNODE
    writeFileSync(join(config.output, `${_name}.js`), vnode);

    const name = config.upcase ? upcase(camelCase(_name)) : camelCase(_name);

    // RECORD REFS
    names.push(name);
    xport.push(`export { ${name} } from './${_name}'`);

    const WS = ' '.repeat(padding - svgFile.length + 3)

    // LOG
    log(` ${magentaBright(_name)}${WS} >     ${cyanBright(name)}`);
  }

  // LOG
  log('\n' + green`Generated ${greenBright.bold`${svgFiles.length}`} vnode icons`);

  return {
    xport,
    names
  };

}


/**
 * Write Lines to File
 *
 * @param {string} directory
 * @param {string} filename
 * @param {string[]} lines
 */
function writeLinesToFile (directory, filename, ...lines) {

  const outputPath = join(directory, filename);
  const content = [ ...lines, '' ].join('\n');


  log(` ${magentaBright(filename)}`);

  writeFileSync(outputPath, content);

}

/* -------------------------------------------- */
/*                  WRITE FILES                 */
/* -------------------------------------------- */

const svgFiles = readdirSync(SVGS_DIR).filter(file => extname(file) === '.svg');
const getSvg = svgFile => readFileSync(join(SVGS_DIR, svgFile));
const { xport, names } = buildCustomIcons(svgFiles, getSvg);

// LOG
log('\n' + white.bold`JavaScript Files` + '\n');

// SVGS
writeLinesToFile(ICON_GEN, 'index.js', xport.join('\n'));

log('\n' + green`Generated ${greenBright.bold`${names.length + 3}`} files in total` + '\n');

