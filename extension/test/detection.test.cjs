const test=require('node:test');const assert=require('node:assert/strict');
const {classifyProject}=require('../out/projectDetection/classify');
const classify=contents=>classifyProject({names:Object.keys(contents),contents});
test('detects an R package, R project, Git worktree marker and Quarto project independently',()=>{
 const p=classify({DESCRIPTION:'Package: example\nVersion: 1.0.0', '.git':'gitdir: ../repo', '_quarto.yml':'project:\n  type: website'});
 for(const k of ['isRPackage','isRProject','isGitRepository','isQuartoProject'])assert.equal(p[k],true);
 assert.equal(p.isPythonProject,false);assert.equal(p.isShinyR,false);
});
test('DESCRIPTION without Package is not an R package',()=>{assert.equal(classify({DESCRIPTION:'Title: test'}).isRPackage,false)});
test('detects apps from imports, not dependencies alone or comments',()=>{
 const p=classify({'app.py':'from shiny import App\nimport streamlit as st\nfrom fastapi import FastAPI','pyproject.toml':'[project]'});
 for(const k of ['isPythonProject','isShinyPython','isStreamlit','isFastAPI'])assert.equal(p[k],true);
 const deps=classify({'requirements.txt':'shiny\nstreamlit\nfastapi','app.py':'# import shiny\nprint("hello")'});
 assert.equal(deps.isShinyPython,false);assert.equal(deps.isStreamlit,false);assert.equal(deps.isFastAPI,false);
});
test('detects both conventional R Shiny structures',()=>{
 assert.equal(classify({'app.R':''}).isShinyR,true);
 assert.equal(classify({'ui.R':'','server.R':''}).isShinyR,true);
 assert.equal(classify({'server.R':''}).isShinyR,false);
});
