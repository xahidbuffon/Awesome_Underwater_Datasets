#!/usr/bin/env -S deno run --allow-read --allow-write

import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts';
import { parse as fromYAML } from 'https://deno.land/std/encoding/yaml.ts';


const { log , clear } = console;

clear();

log('Building README.md from Datasets.yaml');


const folder = dirname(fromFileUrl(import.meta.url));
const datasets = join(folder,'Datasets.yaml');


log('Dataset Path:',datasets);


const yaml = await Deno.readTextFile(datasets);
const data = fromYAML(yaml);

log(data);