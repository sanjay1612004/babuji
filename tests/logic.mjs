import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundled = await build({ entryPoints: ['src/game/logic.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { onWalkableGround, canMoveTo, nextInSequence, cleanSample, segmentText, sanitizeProgress } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
assert.equal(onWalkableGround(0, 6), true);
for (const [x,z] of [[-21,7],[-18,-18],[5,-25],[24,-10],[23,15],[0,26]]) { assert.equal(onWalkableGround(x,z),true); assert.equal(onWalkableGround(x*.65,z*.65),true); }
assert.equal(onWalkableGround(100,100),false); assert.equal(onWalkableGround(18,0),false);
const obstacles=[{x:0,z:0,width:2,depth:2,height:4}]; assert.equal(canMoveTo(0,0,obstacles),false); assert.equal(canMoveTo(1.2,0,obstacles),false); assert.equal(canMoveTo(1.5,0,obstacles),true);
assert.deepEqual(nextInSequence(['React','Node'],[],'Node'),{valid:false,route:[],complete:false}); assert.deepEqual(nextInSequence(['React','Node'],['React'],'Node'),{valid:true,route:['React','Node'],complete:true});
assert.equal(cleanSample('  Atlas   M2\r\n\n  18 November 2026 '),'Atlas M2\n18 November 2026'); assert.deepEqual(segmentText('Hello, உலகம்!'),['Hello',',','உலகம்','!']); assert.deepEqual(segmentText(''),[]);
assert.deepEqual(sanitizeProgress(null),{completed:[],visited:[],data:{}}); const restored=sanitizeProgress({completed:['identity','identity','fake'],visited:['lab','nope'],data:{ragStage:Infinity,text:'a'.repeat(600)}}); assert.deepEqual(restored.completed,['identity']); assert.deepEqual(restored.visited,['lab']); assert.equal(restored.data.ragStage,undefined); assert.equal(restored.data.text.length,500);
const content = await build({ entryPoints: ['src/content.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { projectNamesForTechnology } = await import(`data:text/javascript;base64,${Buffer.from(content.outputFiles[0].text).toString('base64')}`);
assert.deepEqual(projectNamesForTechnology('Node.js'), ['Interngo','FC Labs']);
assert.deepEqual(projectNamesForTechnology('React Compiler'), ['Interngo']);
assert.deepEqual(projectNamesForTechnology('Python'), ['AOKAH']);
assert.deepEqual(projectNamesForTechnology('LLM'), ['AOKAH']);
console.log('PASS: ground and bridge boundaries, collision clearance, ordered mission validation, text processing, Unicode segmentation, defensive progress restoration.');
