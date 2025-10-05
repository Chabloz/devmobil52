import Automaton from '../class/Automaton.js';
import AutomatonInFlatTorus from '../class/Automaton/InFlatTorus.js';

import {domOn} from '../lib/dom.js';
import randomColor from '../lib/randomColor.js';
import MainLoop from '../lib/mainloop.js';
import Keyboard from '../class/Keyboard.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const keyboard = new Keyboard(false);

/* configuration */
let freq = 30;
let gen = 1;
let tileSize = 10;
let isAliveProb = 0.5;
let mapIsFlatTorus = true;
let birthRule = new Set([3]);
let survivalRule = new Set([2, 3]);
let pause = false;
let automaton;

function generateAutomaton() {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;

  const aliveColor = randomColor();
  const width = Math.round(ctx.canvas.width / tileSize);
  const height = Math.round(ctx.canvas.height / tileSize);
  const opt = {width, height, isAliveProb, tileSize, aliveColor, birthRule, survivalRule};
  if (mapIsFlatTorus) {
    automaton = new AutomatonInFlatTorus(opt);
  } else {
    automaton = new Automaton(opt);
  }
}
generateAutomaton();

/* DOM */
function updateDom() {
  const domFreq = document.querySelector('#freq');
  if (domFreq) domFreq.textContent = freq;
  const domGen = document.querySelector('#generation');
  if (domGen) domGen.textContent = gen;
  const domTileSize = document.querySelector('#tile-size');
  if (domTileSize) domTileSize.textContent = tileSize;
  const domAliveProb = document.querySelector('#alive-prob');
  const alivePercent = Math.round(isAliveProb * 100);
  if (domAliveProb) domAliveProb.textContent = alivePercent;
  const fpsValue = Math.round(MainLoop.getFPS());
  const domFps = document.querySelector('#fps');
  if (domFps) domFps.textContent = fpsValue;

  const domMap = document.querySelector('#map');
  if (domMap) {
    domMap.textContent = mapIsFlatTorus ? domMap.dataset.flatTorus : domMap.dataset.rectangle;
  }

  const mobileFreqSlider = document.querySelector('#mobile-freq');
  if (mobileFreqSlider && mobileFreqSlider.value-0 !== freq) mobileFreqSlider.value = freq;
  const mobileFreqValue = document.querySelector('#mobile-freq-value');
  if (mobileFreqValue) mobileFreqValue.textContent = freq;
  const mobileFreqDisplay = document.querySelector('#mobile-freq-display');
  if (mobileFreqDisplay) mobileFreqDisplay.textContent = freq;

  const mobileTileSlider = document.querySelector('#mobile-tile');
  if (mobileTileSlider && mobileTileSlider.value-0 !== tileSize) mobileTileSlider.value = tileSize;
  const mobileTileValue = document.querySelector('#mobile-tile-value');
  if (mobileTileValue) mobileTileValue.textContent = tileSize;
  const mobileTileDisplay = document.querySelector('#mobile-tile-display');
  if (mobileTileDisplay) mobileTileDisplay.textContent = tileSize;

  const mobileAliveSlider = document.querySelector('#mobile-alive');
  if (mobileAliveSlider && mobileAliveSlider.value-0 !== alivePercent) mobileAliveSlider.value = alivePercent;
  const mobileAliveValue = document.querySelector('#mobile-alive-value');
  if (mobileAliveValue) mobileAliveValue.textContent = `${alivePercent}%`;
  const mobileAliveDisplay = document.querySelector('#mobile-alive-display');
  if (mobileAliveDisplay) mobileAliveDisplay.textContent = `${alivePercent}%`;

  const mobileMapButton = document.querySelector('#mobile-map');
  if (mobileMapButton) mobileMapButton.textContent = `Map: ${mapIsFlatTorus ? 'Flat Torus' : 'Rectangle'}`;
  const mobileMapDisplay = document.querySelector('#mobile-map-display');
  if (mobileMapDisplay) mobileMapDisplay.textContent = mapIsFlatTorus ? 'Flat Torus' : 'Rectangle';

  const mobilePause = document.querySelector('#mobile-pause');
  if (mobilePause) mobilePause.textContent = pause ? 'Resume' : 'Pause';

  const mobileGen = document.querySelector('#mobile-generation');
  if (mobileGen) mobileGen.textContent = gen;
  const mobileFps = document.querySelector('#mobile-fps');
  if (mobileFps) mobileFps.textContent = fpsValue;

  for (let ruleNum = 0; ruleNum < 9; ruleNum++) {
    const birthApplied = birthRule.has(ruleNum);
    document.querySelectorAll(`[data-rule-type="b"][data-rule-num="${ruleNum}"]`).forEach(dom => {
      if (dom.tagName === 'INPUT') {
        dom.checked = birthApplied;
      } else {
        birthApplied ? dom.classList.add('apply') : dom.classList.remove('apply');
      }
    });
    const survivalApplied = survivalRule.has(ruleNum);
    document.querySelectorAll(`[data-rule-type="s"][data-rule-num="${ruleNum}"]`).forEach(dom => {
      if (dom.tagName === 'INPUT') {
        dom.checked = survivalApplied;
      } else {
        survivalApplied ? dom.classList.add('apply') : dom.classList.remove('apply');
      }
    });
  }
}

/* Keyboard management */
keyboard.onKeyDown('p', () => {
  pause = !pause;
});

keyboard.onKeyDown('w', () => {
  freq = Math.min(500, freq + 1);
  MainLoop.setSimulationTimestep(1000/freq);
});

keyboard.onKeyDown('s', () => {
  freq = Math.max(1, freq - 1);
  MainLoop.setSimulationTimestep(1000/freq);
});

keyboard.onKeyDown('m', () => {
  mapIsFlatTorus = !mapIsFlatTorus;
  generateAutomaton();
});

keyboard.onKeyDown('r', () => {
  generateAutomaton();
});

keyboard.onKeyDown('z', () => {
  tileSize = Math.min(100, tileSize + 1);
  generateAutomaton();
});

keyboard.onKeyDown('h', () => {
  tileSize = Math.max(4, tileSize - 1);
  generateAutomaton();
});

keyboard.onKeyDown('a', () => {
  isAliveProb = Math.max(0, isAliveProb - 0.01);
});

keyboard.onKeyDown('d', () => {
  isAliveProb = Math.min(1, isAliveProb + 0.01);
});

/* Rules management */
domOn('.rule', 'click', evt => {
  const dom = evt.currentTarget;
  const ruleType = dom.dataset.ruleType;
  const ruleNum = dom.dataset.ruleNum-0;
  const rule = ruleType == 'b' ? birthRule : survivalRule
  rule.has(ruleNum) ? rule.delete(ruleNum) : rule.add(ruleNum);
})

domOn('input[data-rule-type]', 'change', evt => {
  const dom = evt.currentTarget;
  const ruleType = dom.dataset.ruleType;
  const ruleNum = dom.dataset.ruleNum-0;
  const rule = ruleType == 'b' ? birthRule : survivalRule;
  if (dom.checked) {
    rule.add(ruleNum);
  } else {
    rule.delete(ruleNum);
  }
  updateDom();
});

domOn('#mobile-menu-toggle', 'click', evt => {
  const button = evt.currentTarget;
  const panel = document.querySelector('#mobile-panel');
  if (!panel) return;
  const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
  panel.hidden = !nextExpanded;
});

domOn('#mobile-freq', 'input', evt => {
  freq = Math.min(500, Math.max(1, evt.currentTarget.value-0));
  MainLoop.setSimulationTimestep(1000/freq);
  updateDom();
});

domOn('#mobile-tile', 'input', evt => {
  tileSize = Math.min(100, Math.max(4, evt.currentTarget.value-0));
  generateAutomaton();
  updateDom();
});

domOn('#mobile-alive', 'input', evt => {
  isAliveProb = Math.min(100, Math.max(0, evt.currentTarget.value-0)) / 100;
  updateDom();
});

domOn('#mobile-pause', 'click', () => {
  pause = !pause;
  updateDom();
});

domOn('#mobile-map', 'click', () => {
  mapIsFlatTorus = !mapIsFlatTorus;
  generateAutomaton();
  updateDom();
});

domOn('#mobile-reset', 'click', () => {
  generateAutomaton();
  updateDom();
});

// Cells click management
domOn('canvas', 'click', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / tileSize);
  const y = Math.floor((event.clientY - rect.top) / tileSize);
  automaton.toggleState({x, y});
});

/* Main loop */
MainLoop.setSimulationTimestep(1000/freq);

MainLoop.setUpdate(dt => {
  if (pause) return;
  automaton.applyRule()
  gen++;
});

MainLoop.setDraw(() => {
  updateDom();
  automaton.drawTiles(ctx)
});

MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  console.log('panic');
  MainLoop.resetFrameDelta();
});

MainLoop.start();