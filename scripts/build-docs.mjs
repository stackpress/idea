import fs from 'node:fs/promises';
import path from 'node:path';
import renderTemplate from '@stackpress/lib/Template';

const root = process.cwd();
const specsDir = path.join(root, 'specs');
const docsDir = path.join(root, 'docs');
const brandDir = path.join(root, 'language');
const templateDir = path.join(root, 'scripts', 'templates');
const templateCache = new Map();

const sections = [
  {
    id: 'start',
    title: 'Start',
    matcher: (doc) => doc.sourceRel === 'getting-started.md'
  },
  {
    id: 'concepts',
    title: 'Concepts',
    matcher: (doc) => doc.sourceRel.startsWith('concepts/')
  },
  {
    id: 'how-to',
    title: 'How-To',
    matcher: (doc) => doc.sourceRel.startsWith('how-to/')
  },
  {
    id: 'reference',
    title: 'Reference',
    matcher: (doc) => doc.sourceRel.startsWith('reference/') || doc.sourceRel.startsWith('api/')
  },
  {
    id: 'examples',
    title: 'Examples',
    matcher: (doc) => doc.sourceRel.startsWith('examples/')
  }
];

async function loadTemplate(name) {
  if (!templateCache.has(name)) {
    const filepath = path.join(templateDir, name);
    templateCache.set(name, await fs.readFile(filepath, 'utf8'));
  }
  return templateCache.get(name);
}

async function renderFileTemplate(name, props) {
  return renderTemplate(await loadTemplate(name), props);
}

await build();

async function build() {
  const docs = await collectDocs(specsDir);
  const orderedDocs = orderDocs(docs);
  const pageMap = new Map(orderedDocs.map((doc) => [doc.sourceRel, doc]));

  await fs.rm(docsDir, { recursive: true, force: true });
  await fs.mkdir(path.join(docsDir, 'assets', 'brand'), { recursive: true });
  await fs.writeFile(path.join(docsDir, '.nojekyll'), '');
  await fs.copyFile(
    path.join(templateDir, 'site.css'),
    path.join(docsDir, 'assets', 'site.css')
  );

  await copyBrandAssets();

  for (let index = 0; index < orderedDocs.length; index++) {
    const doc = orderedDocs[index];
    const previous = orderedDocs[index - 1] || null;
    const next = orderedDocs[index + 1] || null;
    const html = await renderDocPage(doc, orderedDocs, pageMap, previous, next);
    const outputDir = path.join(docsDir, doc.siteRel);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
  }

  const homeHtml = await renderHomePage(orderedDocs);
  await fs.writeFile(path.join(docsDir, 'index.html'), homeHtml, 'utf8');
}

async function copyBrandAssets() {
  for (const name of ['idea.svg', 'idea.png', 'icon.png']) {
    await fs.copyFile(
      path.join(brandDir, name),
      path.join(docsDir, 'assets', 'brand', name)
    );
  }
}

async function collectDocs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const docs = [];

  for (const entry of entries) {
    const fullpath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      docs.push(...await collectDocs(fullpath));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const sourceRel = path.relative(specsDir, fullpath).split(path.sep).join('/');
    const siteRel = sourceRel.endsWith('/README.md')
      ? sourceRel.slice(0, -'/README.md'.length)
      : sourceRel.slice(0, -'.md'.length);
    const markdown = await fs.readFile(fullpath, 'utf8');
    const title = extractTitle(markdown, entry.name.replace(/\.md$/, ''));
    const summary = extractSummary(markdown);

    docs.push({
      fullpath,
      sourceRel,
      siteRel,
      markdown,
      title,
      summary
    });
  }

  return docs;
}

function orderDocs(docs) {
  const weights = new Map([
    ['getting-started.md', 0],
    ['concepts/overview.md', 10],
    ['concepts/the-idea-file.md', 11],
    ['concepts/schema-building.md', 12],
    ['how-to/run-a-schema.md', 20],
    ['how-to/split-schemas-with-use.md', 21],
    ['how-to/write-a-plugin.md', 22],
    ['how-to/use-the-vscode-extension.md', 23],
    ['reference/specification.md', 30],
    ['reference/cli.md', 31],
    ['reference/plugin-api.md', 32],
    ['api/parser/README.md', 33],
    ['api/parser/Compiler.md', 34],
    ['api/parser/Exception.md', 35],
    ['api/parser/Lexer.md', 36],
    ['api/parser/Tokens.md', 37],
    ['api/parser/Trees.md', 38],
    ['api/transformer/README.md', 39],
    ['api/transformer/Terminal.md', 40],
    ['api/transformer/Transformer.md', 41],
    ['examples/README.md', 50]
  ]);

  return docs.sort((a, b) => {
    const wa = weights.has(a.sourceRel) ? weights.get(a.sourceRel) : 1000;
    const wb = weights.has(b.sourceRel) ? weights.get(b.sourceRel) : 1000;
    if (wa !== wb) {
      return wa - wb;
    }
    return a.sourceRel.localeCompare(b.sourceRel);
  });
}

async function renderHomePage(docs) {
  const grouped = groupDocs(docs);
  const cards = (await Promise.all(grouped.map(async(section) => {
    const lead = section.items[0];
    const href = relativeHref('index.html', `${lead.siteRel}/`);
    return renderFileTemplate('fragments/nav-card.html', {
      sectionTitle: escapeHtml(section.title),
      href,
      title: escapeHtml(lead.title),
      summary: escapeHtml(lead.summary || 'Explore this section of the Idea specification and tooling docs.')
    });
  }))).join('');

  const workflow = (await Promise.all([
    {
      title: 'Define',
      text: 'Model your domain in a permissive .idea schema that stays readable as the project grows.'
    },
    {
      title: 'Transform',
      text: 'Run the transformer with local or package plugins to interpret metadata and create output.'
    },
    {
      title: 'Generate',
      text: 'Ship diagrams, docs, interfaces, APIs, forms, or any project-specific artifact from one source.'
    }
  ].map((item) => renderFileTemplate('fragments/workflow-card.html', {
    title: item.title,
    heading: `${item.title} your idea`,
    text: item.text
  })))).join('');

  const main = await renderFileTemplate('home.html', {
    startHref: relativeHref('index.html', 'getting-started/'),
    examplesHref: relativeHref('index.html', 'examples/'),
    heroBrandHref: 'assets/brand/idea.svg',
    heroCode: highlightIdeaCode(`model User {
  id String @id
  name String
  email String
}

plugin "./schema-diagram.mjs" {
  output "./generated/schema.mmd"
}`),
    workflow,
    cards
  });

  return wrapPage({
    pageTitle: 'Idea Documentation',
    bodyClass: 'page-home',
    main
  });
}

async function renderDocPage(doc, docs, pageMap, previous, next) {
  const { html, headings, lead } = renderMarkdown(doc.markdown, doc.sourceRel);
  const nav = await renderSidebar(docs, doc);
  const toc = await renderToc(headings);
  const section = sectionLabel(doc);
  const sourceUrl = `https://github.com/stackpress/idea/blob/main/specs/${doc.sourceRel}`;
  const pager = await renderPager(doc, previous, next);
  const currentSiteRel = `${doc.siteRel}/index.html`;
  const displayTitle = toPlainText(doc.title);
  const main = await renderFileTemplate('doc.html', {
    nav,
    section: escapeHtml(section),
    title: escapeHtml(displayTitle),
    lead: escapeHtml(lead || doc.summary || 'Reference documentation for the Idea schema language and toolchain.'),
    sourceUrl,
    homeHref: relativeHref(currentSiteRel, 'index.html'),
    content: html,
    pager,
    toc
  });

  return wrapPage({
    pageTitle: `${displayTitle} | Idea`,
    bodyClass: 'page-doc',
    currentSiteRel,
    main
  });
}

function wrapPage({ pageTitle, bodyClass, main, currentSiteRel = 'index.html' }) {
  return renderFileTemplate('layout.html', {
    pageTitle: escapeHtml(pageTitle),
    bodyClass,
    iconHref: relativeHref(currentSiteRel, 'assets/brand/icon.png'),
    siteCssHref: relativeHref(currentSiteRel, 'assets/site.css'),
    homeHref: relativeHref(currentSiteRel, 'index.html'),
    brandImageHref: relativeHref(currentSiteRel, 'assets/brand/idea.png'),
    startHref: relativeHref(currentSiteRel, 'getting-started/'),
    conceptsHref: relativeHref(currentSiteRel, 'concepts/overview/'),
    howToHref: relativeHref(currentSiteRel, 'how-to/run-a-schema/'),
    referenceHref: relativeHref(currentSiteRel, 'reference/specification/'),
    examplesHref: relativeHref(currentSiteRel, 'examples/'),
    githubIcon: githubIcon(),
    themeIcon: themeIcon(),
    main
  });
}

async function renderSidebar(docs, currentDoc) {
  const grouped = groupDocs(docs);
  const groups = await Promise.all(grouped.map(async(section) => {
    const items = (await Promise.all(section.items.map((doc) => renderFileTemplate('fragments/sidebar-link.html', {
      activeClass: doc.sourceRel === currentDoc.sourceRel ? 'is-active' : '',
      href: relativeHref(`${currentDoc.siteRel}/index.html`, `${doc.siteRel}/`),
      title: escapeHtml(toPlainText(doc.title))
    })))).join('');
    return renderFileTemplate('fragments/sidebar-group.html', {
      title: escapeHtml(section.title),
      items
    });
  }));
  return renderFileTemplate('fragments/sidebar.html', {
    groups: groups.join('')
  });
}

async function renderToc(headings) {
  if (!headings.length) {
    return renderFileTemplate('fragments/toc-empty.html', {});
  }

  const items = (await Promise.all(headings
    .filter((heading) => heading.level <= 3)
    .map((heading) => renderFileTemplate('fragments/toc-item.html', {
      id: heading.id,
      text: escapeHtml(toPlainText(heading.text))
    })))).join('');
  return renderFileTemplate('fragments/toc.html', { items });
}

async function renderPager(currentDoc, previous, next) {
  const prevHtml = previous
    ? await renderFileTemplate('fragments/pager-link.html', {
      href: relativeHref(`${currentDoc.siteRel}/index.html`, `${previous.siteRel}/`),
      label: 'Previous',
      title: escapeHtml(toPlainText(previous.title))
    })
    : '<span></span>';
  const nextHtml = next
    ? await renderFileTemplate('fragments/pager-link.html', {
      href: relativeHref(`${currentDoc.siteRel}/index.html`, `${next.siteRel}/`),
      label: 'Next',
      title: escapeHtml(toPlainText(next.title))
    })
    : '<span></span>';

  return renderFileTemplate('fragments/pager.html', {
    previous: prevHtml,
    next: nextHtml
  });
}

function groupDocs(docs) {
  return sections
    .map((section) => ({
      title: section.title,
      items: docs.filter(section.matcher)
    }))
    .filter((section) => section.items.length);
}

function sectionLabel(doc) {
  const section = sections.find((item) => item.matcher(doc));
  return section ? section.title : 'Documentation';
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? toPlainText(match[1].trim()) : fallback;
}

function extractSummary(markdown) {
  const paragraphs = markdown
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !block.startsWith('#') && !block.startsWith('```') && !block.startsWith('- ') && !block.startsWith('1.'));

  return paragraphs[0] ? paragraphs[0].replace(/\s+/g, ' ').trim() : '';
}

function renderMarkdown(markdown, currentSourceRel) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  const headings = [];
  let lead = '';

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const text = toPlainText(rawText);
      const id = slugify(rawText);
      headings.push({ level, text, id });
      if (!lead && level === 1) {
        lead = '';
      }
      if (level === 1) {
        index += 1;
        continue;
      }
      html.push(`<h${level} id="${id}">${parseInline(rawText, currentSourceRel)}</h${level}>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const content = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        content.push(lines[index]);
        index += 1;
      }
      index += 1;
      const code = content.join('\n');
      const codeHtml = renderCodeBlock(language, code);
      if (codeHtml.kind === 'mermaid') {
        html.push(codeHtml.html);
      } else {
        html.push(`<pre><code class="${escapeHtml(codeHtml.className)}">${codeHtml.html}</code></pre>`);
      }
      continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      html.push('<hr />');
      index += 1;
      continue;
    }

    if (trimmed.startsWith('|') && isTableSeparator(lines[index + 1] || '')) {
      const tableLines = [trimmed];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      html.push(renderTable(tableLines, currentSourceRel));
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      html.push(`<blockquote>${quoteLines.map((item) => parseInline(item, currentSourceRel)).join('<br />')}</blockquote>`);
      continue;
    }

    const listMatch = trimmed.match(/^([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const ordered = /\d+\./.test(listMatch[1]);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        const match = current.match(/^([-*]|\d+\.)\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(`<li>${parseInline(match[2], currentSourceRel)}</li>`);
        index += 1;
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim()) {
      const current = lines[index].trim();
      if (
        /^(#{1,6})\s+/.test(current) ||
        current.startsWith('```') ||
        current.startsWith('>') ||
        /^[-*_]{3,}$/.test(current) ||
        (current.startsWith('|') && isTableSeparator(lines[index + 1] || '')) ||
        /^([-*]|\d+\.)\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }
    const text = paragraph.join(' ');
    if (!lead) {
      lead = text;
    }
    html.push(`<p>${parseInline(text, currentSourceRel)}</p>`);
  }

  return { html: html.join('\n'), headings, lead };
}

function renderTable(tableLines, currentSourceRel) {
  const [headerLine, , ...bodyLines] = tableLines;
  const headers = splitTableRow(headerLine);
  const rows = bodyLines.map(splitTableRow);

  return `
    <table>
      <thead>
        <tr>${headers.map((cell) => `<th>${parseInline(cell, currentSourceRel)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${parseInline(cell, currentSourceRel)}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function parseInline(text, currentSourceRel) {
  const escaped = escapeHtml(text);
  const imageMatches = [];
  let output = escaped.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => {
    const token = `@@IMG${imageMatches.length}@@`;
    imageMatches.push(`<img src="${escapeAttribute(convertHref(href, currentSourceRel))}" alt="${escapeAttribute(alt)}" />`);
    return token;
  });

  const linkMatches = [];
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const token = `@@LINK${linkMatches.length}@@`;
    const url = convertHref(href, currentSourceRel);
    const external = /^(https?:|mailto:)/.test(url);
    linkMatches.push(`<a href="${escapeAttribute(url)}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${parseInlineSpans(label)}</a>`);
    return token;
  });

  output = parseInlineSpans(output);
  output = output.replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`);

  for (let index = 0; index < imageMatches.length; index++) {
    output = output.replace(`@@IMG${index}@@`, imageMatches[index]);
  }
  for (let index = 0; index < linkMatches.length; index++) {
    output = output.replace(`@@LINK${index}@@`, linkMatches[index]);
  }

  return output;
}

function parseInlineSpans(text) {
  const placeholders = [];
  let output = text;

  output = output.replace(/`([^`]+)`/g, (_, code) => {
    const token = `__CODE_${placeholders.length}__`;
    placeholders.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  for (let index = 0; index < placeholders.length; index++) {
    output = output.replace(`__CODE_${index}__`, placeholders[index]);
  }

  return output;
}

function renderCodeBlock(language, code) {
  const normalizedLanguage = normalizeLanguage(language);
  if (language === 'mermaid') {
    return {
      kind: 'mermaid',
      html: `<div class="mermaid-block"><div class="mermaid-diagram" data-mermaid data-mermaid-source="${escapeAttribute(code)}">${escapeHtml(code)}</div><pre class="mermaid-fallback"><code class="language-mermaid">${escapeHtml(code)}</code></pre></div>`
    };
  }

  if (isIdeaCode(normalizedLanguage, code)) {
    return {
      kind: 'pre',
      className: 'language-idea',
      html: highlightIdeaCode(code)
    };
  }

  if (isScriptCode(normalizedLanguage)) {
    return {
      kind: 'pre',
      className: `language-${normalizedLanguage || 'plain'}`,
      html: escapeHtml(code)
    };
  }

  return {
    kind: 'pre',
    className: `language-${normalizedLanguage || 'plain'}`,
    html: escapeHtml(code)
  };
}

function isIdeaCode(language, code) {
  if (language === 'idea') {
    return true;
  }

  if (language && !['ts', 'text', 'txt', 'plaintext', ''].includes(language)) {
    return false;
  }

  return /\b(model|plugin|prop|enum|type|use)\b/.test(code) && /@\w+/.test(code);
}

function highlightIdeaCode(code) {
  return code
    .split('\n')
    .map((line) => {
      return applyTokenRules(escapeHtml(line), [
        [/(\/\/.*)$/g, 'token-comment'],
        [/("[^"]*")/g, 'token-string'],
        [/\b(-?\d+(?:\.\d+)?)\b/g, 'token-number'],
        [/(@[a-zA-Z_][\w.]*(?:\([^)]*\))?)/g, 'token-attr'],
        [/\b(plugin|model|prop|enum|type|use|true|false|null)\b/g, 'token-keyword'],
        [/\b(String|Int|Float|Boolean|Date|ID)\b/g, 'token-type']
      ]);
    })
    .join('\n');
}

function applyTokenRules(input, rules) {
  const placeholders = [];
  const wrap = (value, className) => {
    const token = String.fromCharCode(0xE000 + placeholders.length);
    placeholders.push(`<span class="${className}">${value}</span>`);
    return token;
  };

  let output = input;
  for (const [regex, className] of rules) {
    output = output.replace(regex, (match) => wrap(match, className));
  }

  for (let index = 0; index < placeholders.length; index++) {
    output = output.replace(String.fromCharCode(0xE000 + index), placeholders[index]);
  }

  return output;
}

function isScriptCode(language) {
  return ['ts', 'tsx', 'js', 'jsx', 'javascript', 'typescript', 'json', 'bash', 'sh', 'shell', 'sql'].includes(language || '');
}

function normalizeLanguage(language = '') {
  const normalized = language.trim().toLowerCase();
  if (normalized === 'js') return 'javascript';
  if (normalized === 'ts') return 'typescript';
  if (normalized === 'shell' || normalized === 'sh') return 'bash';
  if (normalized === 'text' || normalized === 'txt' || normalized === 'plaintext') return 'plain';
  return normalized;
}


function githubIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.83 1.18 3.08 0 4.41-2.68 5.38-5.24 5.66.41.35.78 1.04.78 2.1 0 1.52-.01 2.75-.01 3.12 0 .31.2.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>';
}

function themeIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.45-10.45 1 1 0 0 0-1.19-1.33A10 10 0 1 0 23 15.05 1 1 0 0 0 21.64 13Z"/></svg>';
}

function convertHref(href, currentSourceRel) {
  if (!href) {
    return href;
  }

  if (/^(https?:|mailto:)/.test(href)) {
    if (href.startsWith('https://github.com/stackpress/idea/blob/main/specs/')) {
      const sourceRel = href.slice('https://github.com/stackpress/idea/blob/main/specs/'.length);
      const [filePart, hash = ''] = sourceRel.split('#');
      return relativeHref(`${specToSiteRel(currentSourceRel)}/index.html`, `${specToSiteRel(filePart)}/${hash ? `#${hash}` : ''}`);
    }
    return href;
  }

  if (href.startsWith('#')) {
    return href;
  }

  const [filePart, hash = ''] = href.split('#');

  if (filePart.endsWith('.md')) {
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(currentSourceRel), filePart));
    return relativeHref(`${specToSiteRel(currentSourceRel)}/index.html`, `${specToSiteRel(resolved)}/${hash ? `#${hash}` : ''}`);
  }

  return href;
}

function specToSiteRel(sourceRel) {
  return sourceRel.endsWith('/README.md')
    ? sourceRel.slice(0, -'/README.md'.length)
    : sourceRel.slice(0, -'.md'.length);
}

function relativeHref(fromFile, toTarget) {
  const fromDir = path.posix.dirname(fromFile.split(path.sep).join('/'));
  const [targetPath, hash = ''] = toTarget.split('#');
  const normalizedTarget = targetPath.endsWith('index.html')
    ? targetPath
    : targetPath.endsWith('/')
      ? `${targetPath}index.html`
      : targetPath;
  let rel = path.posix.relative(fromDir, normalizedTarget) || 'index.html';
  if (!rel.startsWith('.')) {
    rel = `./${rel}`;
  }
  return hash ? `${rel}#${hash}` : rel;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toPlainText(value) {
  return String(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}
