#!/usr/bin/env node

import { minify } from 'html-minifier-terser';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: false,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyJS: true,
  minifyCSS: true,
  keepClosingSlash: true,
  caseSensitive: true,
  conservativeCollapse: false,
  preserveLineBreaks: false,
  removeAttributeQuotes: false,
  sortAttributes: true,
  sortClassName: true,
};

async function minifyHtmlInMdx(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const result = [];
    let inHtmlBlock = false;
    let htmlBuffer = [];
    let tagStack = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Detect start of HTML block
      if (
        trimmed.startsWith('<') &&
        !trimmed.startsWith('<!--') &&
        !inHtmlBlock
      ) {
        // Check if it's an opening tag
        const tagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
        if (tagMatch) {
          inHtmlBlock = true;
          htmlBuffer = [line];

          // Track opening tags
          const openTags = line.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
          const closeTags = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g) || [];
          const selfClosing =
            line.match(/<[a-zA-Z][a-zA-Z0-9]*[^>]*\/>/g) || [];

          openTags.forEach((tag) => {
            const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/)[1];
            if (!selfClosing.some((sc) => sc.includes(tagName))) {
              tagStack.push(tagName);
            }
          });

          closeTags.forEach(() => tagStack.pop());
        } else {
          result.push(line);
        }
      }
      // Continue collecting HTML
      else if (inHtmlBlock) {
        htmlBuffer.push(line);

        // Track tags
        const openTags = line.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
        const closeTags = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g) || [];
        const selfClosing = line.match(/<[a-zA-Z][a-zA-Z0-9]*[^>]*\/>/g) || [];

        openTags.forEach((tag) => {
          const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/)[1];
          if (!selfClosing.some((sc) => sc.includes(tagName))) {
            tagStack.push(tagName);
          }
        });

        closeTags.forEach(() => tagStack.pop());

        // Check if HTML block is complete (all tags closed)
        if (tagStack.length === 0) {
          const htmlContent = htmlBuffer.join('\n');

          try {
            const minified = await minify(htmlContent, minifyOptions);
            result.push(minified);
          } catch (e) {
            console.warn(
              `  ⚠ Could not minify block, keeping original:`,
              e.message.split('\n')[0]
            );
            result.push(htmlContent);
          }

          inHtmlBlock = false;
          htmlBuffer = [];
        }
      }
      // Regular markdown line
      else {
        result.push(line);
      }
    }

    // Handle any remaining HTML buffer
    if (htmlBuffer.length > 0) {
      const htmlContent = htmlBuffer.join('\n');
      try {
        const minified = await minify(htmlContent, minifyOptions);
        result.push(minified);
      } catch (e) {
        console.warn(`  ⚠ Could not minify remaining block, keeping original`);
        result.push(htmlContent);
      }
    }

    const output = result.join('\n');
    writeFileSync(filePath, output, 'utf-8');
    console.log(`✓ Minified HTML in: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run minify-mdx -- <file1.mdx> [file2.mdx ...]');
    console.error('Example: npm run minify-mdx -- src/docs/guides/html4.mdx');
    process.exit(1);
  }

  console.log(`Minifying HTML in ${args.length} file(s)...\n`);

  for (const file of args) {
    const filePath = resolve(process.cwd(), file);
    await minifyHtmlInMdx(filePath);
  }

  console.log(`\n✓ Minification complete!`);
}

main().catch(console.error);
