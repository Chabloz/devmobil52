import MainLoop from "mainloop.js";
import { Automaton } from './class/Automaton.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

let cellSize = 10;
let rows = Math.floor(ctx.canvas.height / cellSize);
let cols = Math.floor(ctx.canvas.width / cellSize);
let aliveProbability = 0.5;
let automaton = new Automaton({rows, cols, cellSize, aliveProbability});
let isPaused = false;

// Options panel UI
document.getElementById('menu-toggle').addEventListener('click', () => {
  const panel = document.getElementById('panel');
  panel.classList.toggle('hidden');
});

document.getElementById('freq').addEventListener('input', (event) => {
  MainLoop.setSimulationTimestep(1000 / parseInt(event.target.value));
});

document.getElementById('tile').addEventListener('input', (event) => {
  cellSize = parseInt(event.target.value);
  rows = Math.floor(ctx.canvas.height / cellSize);
  cols = Math.floor(ctx.canvas.width / cellSize);
  automaton = new Automaton({rows, cols, cellSize, aliveProbability});
});

document.getElementById('alive').addEventListener('input', (event) => {
  aliveProbability = parseInt(event.target.value) / 100;
});

document.getElementById('pause').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pause').textContent = isPaused ? 'Play' : 'Pause';
  isPaused ? MainLoop.stop() : MainLoop.start();
});

document.getElementById('reset').addEventListener('click', () => {
  automaton = new Automaton({rows, cols, cellSize, aliveProbability});
  if (isPaused) automaton.draw(ctx);
});

document.querySelectorAll('input[data-rule-type="s"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const checkedSurvival = document.querySelectorAll('input[data-rule-type="s"]:checked');
    const survivalRules = [...checkedSurvival].map(cb => parseInt(cb.dataset.ruleNum));
    automaton.setSurvivalRule(survivalRules);
  });
});

document.querySelectorAll('input[data-rule-type="b"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const checkedBirth = document.querySelectorAll('input[data-rule-type="b"]:checked');
    const birthRules = [...checkedBirth].map(cb => parseInt(cb.dataset.ruleNum));
    automaton.setBirthRule(birthRules);
  });
});

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.clientX ?? (event.touches && event.touches[0].clientX);
  const clientY = event.clientY ?? (event.touches && event.touches[0].clientY);
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (automaton.isValid(row, col)) automaton.switchState(row, col);
  if (isPaused) automaton.draw(ctx);
});

function tickPhysic(dt) {
  automaton.applyRule();
}

function tickRender() {
  automaton.draw(ctx);
}

MainLoop
  .setUpdate(tickPhysic)
  .setDraw(tickRender)
  .start();