# MDX HTML Minifier

A script to minify HTML blocks within MDX files while preserving markdown prose and formatting.

## What it does

- ✅ Minifies HTML tags and attributes
- ✅ Minifies inline JavaScript (e.g., `onclick` handlers)
- ✅ Minifies inline CSS
- ✅ Removes unnecessary whitespace
- ✅ Sorts attributes and class names
- ✅ Preserves markdown content (headings, paragraphs, code blocks, etc.)
- ✅ Preserves frontmatter

## What it doesn't do

- ❌ Does not minify markdown prose
- ❌ Does not minify code blocks
- ❌ Does not change markdown formatting

## Usage

### Minify a single file

```bash
npm run minify-mdx -- src/docs/guides/html4.mdx
```

### Minify multiple files

```bash
npm run minify-mdx -- src/docs/guides/html2.mdx src/docs/guides/html3.mdx src/docs/guides/html4.mdx
```

### Minify with glob patterns (requires shell expansion)

```bash
npm run minify-mdx -- src/docs/guides/html*.mdx
```

## How it works

The script:

1. Reads the MDX file line by line
2. Detects HTML blocks by looking for opening tags (`<div>`, `<button>`, etc.)
3. Tracks opening and closing tags to determine when an HTML block is complete
4. Minifies complete HTML blocks using `html-minifier-terser`
5. Preserves all non-HTML content (markdown, frontmatter, etc.)
6. Writes the result back to the file

## Example

### Before minification

```mdx
<button
  type="button"
  class="mt-4 btn btn-primary"
  onclick="(function(){
    var data = { title: 'Hello' };
    console.log(data);
  })()"
>
  Click Me
</button>
```

### After minification

```mdx
<button
  class="btn btn-primary mt-4"
  onclick="(function(){var data={title:'Hello'};console.log(data)})()"
  type="button"
>
  Click Me
</button>
```

## Configuration

Minification options are defined in `scripts/minify-mdx.js`:

```javascript
const minifyOptions = {
  collapseWhitespace: true,
  removeComments: false,
  removeRedundantAttributes: true,
  minifyJS: true,
  minifyCSS: true,
  // ... more options
};
```

## Troubleshooting

### HTML block not minified

If an HTML block isn't being minified, it might be because:

1. **Unclosed tags**: Make sure all opening tags have matching closing tags
2. **Mixed content**: Markdown content inside HTML blocks may confuse the parser
3. **Invalid HTML**: The minifier will skip blocks it can't parse

### Minification errors

If you see warnings like:

```
⚠ Could not minify block, keeping original: Parse Error
```

The script will preserve the original HTML and continue processing. Check the HTML syntax in that block.

## Known Limitations

### Complex inline JavaScript

HTML blocks with very complex inline JavaScript (especially with nested quotes and HTML entities) may not minify correctly. For example:

```html
<button
  onclick="(function(){ var html='<div class=&quot;foo&quot;>...</div>'; })()"
></button>
```

**Workaround**: Use the first button's approach with `&apos;` entities, or manually minify the JavaScript before adding it to the MDX file.

### Multi-line attributes

Attributes spanning multiple lines work, but the minifier may have trouble if there are quote mismatches or unclosed strings.

**Workaround**: Ensure all quotes are properly escaped or use HTML entities (`&quot;`, `&apos;`).

## Dependencies

- `html-minifier-terser` - HTML/CSS/JS minifier

## Notes

- **Backup your files** before running the script, or use version control
- The script modifies files in place
- Minified HTML is harder to read/edit - consider keeping formatted versions for development
- The script is designed for MDX files with inline HTML, not pure HTML files
