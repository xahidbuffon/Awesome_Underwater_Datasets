#!/usr/bin/env -S deno run --allow-read --allow-write

import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts';
import { parse as fromYAML } from 'https://deno.land/std/encoding/yaml.ts';


const { log , clear } = console;

clear();

log('Building README.md from Datasets.yaml');


const folder = dirname(fromFileUrl(import.meta.url));
const datasets = join(folder,'Datasets.yaml');
const readme = join(folder,'..','README.md');


log('Dataset Path:',datasets);


const yaml = await Deno.readTextFile(datasets);
const data = fromYAML(yaml);


const separator = `<!${ '-'.repeat(77) }>`;


let content = [];
let links = [];

for(const category of data)
    makeCategory(category);

content.push(
    '' , separator , '' ,
    ...links
);

const combined = content.join('\n');

log(combined);

await Deno.writeTextFile(readme,combined);
    

function makeCategory(data,isSubcategory = false){
    
    content.push(...headline(data.name,isSubcategory ? 3 : 2));
    
    
    const { categories } = data;
    
    if(categories)
        for(const category of categories)
            makeCategory(category,true);
            
    const { items } = data;
    
    if(items){
        
        for(const item of items)
            makeItem(item);
    
        content.push('','<br>','');
    }
}


function makeItem(data){
    content.push(`- **${ data.name }**`,'');
    
    let line = [];
    
    const { paper } = data;
    
    if(data.paper)        
        iterate(data.paper,(paper,index) => {
            line.push(makePaper(paper,data.name,index));
            line.push('  ');
        });
        
    if(data.code)
        iterate(data.code,(code,index) => {
            line.push(makeCode(code,data.name,index));
            line.push('  ');
        });
    
    if(data.data)
        iterate(data.data,(d,index) => {
            line.push(makeData(d,data.name,index));
            line.push('  ');
        });
    
    
    links.push('');
    content.push(line.map((item) => '  ' + item).join('\n'),'');
}


function makePaper(...args){
    return linked('📄','Paper',...args);
}

function makeCode(...args){
    return linked('💾','Code',...args);
}

function makeData(...args){
    return linked('🗄','Data',...args);
}


function linked(icon,type, link , project , index ){
    
    if(typeof link === 'string')
        link = { link };
    
    let name = `${ type} ${ project }`;
    let title = type;
    
    if(index){
        name += ` ${ index }`;
        title += ` ${ index }`;
    }
    
    const reference = `[${ icon }][${ name }]`;
    
    if(data.note)
        title += ` ${ data.note }`;
        
    name = `[${ name }]: ${ link.link } '${ title }'`;
    
    links.push(name);
    
    return reference;
}


function headline(title,type = 1){
    return [ `${ '#'.repeat(type) } ${ title }` , '' ];
}


function iterate(object,f){

    if(Array.isArray(object))
        Object
        .entries(object)
        .forEach(([ index , data ]) => f(data,index));
    else
        f(object);
}