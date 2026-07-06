import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

function loadJson(filename) {
  const raw = readFileSync(join(dataDir, filename), 'utf8');
  return JSON.parse(raw);
}

let cache = null;

export function loadSiteData() {
  if (!cache) {
    cache = {
      profile: loadJson('profile.json'),
      career: loadJson('career.json'),
      workExperience: loadJson('work-experience.json'),
      projects: loadJson('projects.json'),
      site: loadJson('site.json'),
    };
  }
  return cache;
}

export function clearDataCache() {
  cache = null;
}
