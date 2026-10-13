const display = document.getElementById('display');
const cursor = document.getElementById('cursor');
let expression = '';

if (cursor) {
  document.body.classList.add('has-custom-cursor');

  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('button, #display').forEach((element) => {
    element.addEventListener('pointerenter', () => cursor.classList.add('hover'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('hover'));
  });
}

function syncDisplay() {
  display.value = expression || '0';
}

function append(value) {
  if (expression === 'Error') {
    expression = '';
  }

  if (value === '.') {
    const currentNumber = expression.split(/[+\-*\/]/).pop();
    if (currentNumber.includes('.')) {
      return;
    }

    if (!expression || /[+\-*\/]/.test(expression.slice(-1))) {
      expression += '0.';
      syncDisplay();
      return;
    }
  }

  if (/[+\-*\/]/.test(value)) {
    if (!expression) {
      if (value === '-') {
        expression = '-';
        syncDisplay();
      }
      return;
    }

    const lastChar = expression.slice(-1);
    if (/[+\-*\/]/.test(lastChar)) {
      expression = expression.slice(0, -1) + value;
      syncDisplay();
      return;
    }
  }

  if (value === '%') {
    const lastChar = expression.slice(-1);
    if (!expression || /[+\-*\/%]/.test(lastChar)) {
      return;
    }
  }

  expression += value;
  syncDisplay();
}

function deletedisplay() {
  if (expression === 'Error') {
    expression = '';
    syncDisplay();
    return;
  }

  expression = expression.slice(0, -1);
  syncDisplay();
}

function cleardisplay() {
  expression = '';
  syncDisplay();
}

function calculate() {
  if (!expression || !/[0-9]/.test(expression)) {
    return;
  }

  let sanitized = expression.trim();

  if (/[+\-*\/]$/.test(sanitized)) {
    sanitized = sanitized.slice(0, -1);
  }

  sanitized = sanitized.replace(/%/g, '/100');
  sanitized = sanitized.replace(/[^0-9+\-*/.()]/g, '');

  if (!sanitized) {
    return;
  }

  try {
    const result = Function(`"use strict"; return (${sanitized});`)();
    expression = Number.isFinite(result) ? String(result) : 'Error';
  } catch (error) {
    expression = 'Error';
  }

  syncDisplay();
}

syncDisplay();
