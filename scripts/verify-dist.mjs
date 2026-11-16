import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const site = 'https://ezhub.cn';
const paths = ['/', '/products/', '/products/enote/', '/products/buildingstore/', '/about/'];
const dist = new URL('../dist/', import.meta.url);
const read = (file) => readFileSync(new URL(file, dist), 'utf8');

function pageHead(file) {
  const head = read(file).match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, `${file} 缺少 head`);

  const tags = [...head.matchAll(/<(meta|link)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)]
    .map(([, tag, attributes]) => ({
      tag,
      ...Object.fromEntries([...attributes.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
        .map(([, name, doubleQuoted, singleQuoted]) => [name, doubleQuoted ?? singleQuoted])),
    }));

  return {
    title: head.match(/<title>([^<]+)<\/title>/i)?.[1],
    canonicals: tags.filter(({ tag, rel }) => tag === 'link' && rel === 'canonical')
      .map(({ href }) => href),
    meta(key, attribute = 'name') {
      return tags.filter((tag) => tag.tag === 'meta' && tag[attribute] === key)
        .map(({ content }) => content);
    },
  };
}

const expectedUrls = paths.map((path) => new URL(path, site).href);
for (const [index, path] of paths.entries()) {
  const file = `${path.slice(1)}index.html`;
  const url = expectedUrls[index];
  const { title, canonicals, meta } = pageHead(file);
  const descriptions = meta('description');
  assert.ok(title && descriptions.length === 1 && descriptions[0], `${file} 缺少标题或描述`);
  assert.deepEqual(canonicals, [url], `${file} 的 Canonical 缺失、重复或不匹配`);
  assert.deepEqual(meta('robots'), [], `${file} 出现意外的 robots 指令`);

  for (const [key, value] of Object.entries({
    'og:type': 'website',
    'og:site_name': 'EZHub',
    'og:locale': 'zh_CN',
    'og:title': title,
    'og:description': descriptions[0],
    'og:url': url,
  })) {
    assert.deepEqual(meta(key, 'property'), [value], `${file} 的 ${key} 缺失、重复或不匹配`);
  }
  assert.deepEqual(meta('twitter:card'), ['summary'], file);
  assert.deepEqual(meta('twitter:title'), [title], file);
  assert.deepEqual(meta('twitter:description'), descriptions, file);
  console.log(`Canonical ${url}`);
}

const notFound = pageHead('404.html');
assert.deepEqual(notFound.meta('robots'), ['noindex'], '404.html 缺少唯一的 noindex 指令');
assert.deepEqual(notFound.canonicals, [], '404.html 包含 Canonical');
console.log('404.html 已声明 noindex，且省略 Canonical');

function sitemapLocations(file, root, entry) {
  const xml = read(file);
  const document = new RegExp(`^\\s*(?:<\\?xml[^>]*\\?>\\s*)?<${root}\\b([^>]*)>([\\s\\S]*)</${root}>\\s*$`);
  const [, attributes, body] = xml.match(document) ?? [];
  assert.ok(attributes?.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), `${file} 的根元素或命名空间无效`);

  // Astro 产物每项只写 loc，逐项核对并拒绝额外字段。
  const item = new RegExp(`<${entry}>\\s*<loc>([^<>]+)</loc>\\s*</${entry}>`, 'g');
  const locations = [...body.matchAll(item)].map(([, location]) => location.trim());
  assert.ok(locations.length && !body.replace(item, '').trim(), `${file} 的条目无效`);
  return locations;
}

const sitemapIndex = 'sitemap-index.xml';
assert.deepEqual(read('robots.txt').trim().split(/\r?\n/).filter(Boolean), [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${new URL(sitemapIndex, site).href}`,
], 'robots.txt 的抓取规则或 Sitemap Index 不匹配');

const children = sitemapLocations(sitemapIndex, 'sitemapindex', 'sitemap');
assert.equal(new Set(children).size, children.length, 'Sitemap Index 包含重复的子文件');
const urls = children.flatMap((location) => {
  const url = new URL(location);
  assert.ok(url.origin === site && /^\/sitemap-\d+\.xml$/.test(url.pathname)
    && url.href === `${site}${url.pathname}`, `Sitemap 子文件地址无效 ${location}`);
  return sitemapLocations(url.pathname.slice(1), 'urlset', 'url');
});

assert.deepEqual(urls.toSorted(), expectedUrls.toSorted(), 'Sitemap 收录范围不匹配');
console.log(`Sitemap 子文件 ${children.join(', ')}`);
for (const url of urls) console.log(`Sitemap ${url}`);
console.log('robots.txt 与 Sitemap Index 一致');
