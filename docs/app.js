// Año footer
document.getElementById('year').textContent = new Date().getFullYear();

// Claves de almacenamiento
const STORAGE = { BEST: 'linux-modern-quiz_best', LAST: 'linux-modern-quiz_last' };

/**
 * Preguntas (todas single-choice)
 */
const QUESTIONS = [
  {
    id: "q1",
    type: "single",
    prompt: "Busca el patrón \\bprintf\\( en un repo Git, incluyendo ocultos e ignorados, excluyendo .git/ y node_modules/, con PCRE2 y números de línea. ¿Cuál comando rg es correcto?",
    context:
`Requisitos:
- Incluir ocultos (--hidden)
- Ignorar .gitignore (mostrar ignorados) (--no-ignore)
- Excluir .git/ y node_modules/ (-g '!.../')
- Usar PCRE2 (-P) y números (-n)`,
    options: [
      { key: "a", code: true, label: `rg -n -P --hidden --no-ignore -g '!.git/' -g '!node_modules/' '\\\\bprintf\\('` },
      { key: "b", code: true, label: `rg -n --hidden -S -g '!node_modules/' '\\\\bprintf\\('` },
      { key: "c", code: true, label: `rg -P -uu '\\\\bprintf\\('` },
      { key: "d", code: true, label: `rg -n -P --hidden --no-ignore '\\\\bprintf\\(' .git node_modules` },
    ],
    correct: "a",
    explain: "La combinación requerida: -P (PCRE2), --hidden, --no-ignore y exclusiones con -g '!.git/' y -g '!node_modules/'. -n explicita números."
  },
  {
    id: "q2",
    type: "single",
    prompt: "Con fd encuentra todos los .sh (bajo cwd) incluyendo ocultos e ignorados y muestra rutas relativas. ¿Cuál comando es correcto?",
    context:
`Pistas:
- fd usa REGEX por defecto
- -H incluye ocultos; -I incluye ignorados; -t f solo archivos
- --strip-cwd-prefix rutas limpias`,
    options: [
      { key: "a", code: true, label: `fd -H -I -t f '\\\\.sh$' --strip-cwd-prefix` },
      { key: "b", code: true, label: `fd -a -gi '*.sh'` },
      { key: "c", code: true, label: `fd -H -g '*.sh' --relative-paths` },
      { key: "d", code: true, label: `fd -uu -e sh -x echo` },
    ],
    correct: "a",
    explain: "El patrón REGEX \\.sh$, -H (ocultos), -I (ignorados), -t f (archivos) y --strip-cwd-prefix (rutas relativas)."
  },
  {
    id: "q3",
    type: "single",
    prompt: "Muestra líneas 120–160 de src/app.py con números, resaltado y sin pager.",
    options: [
      { key: "a", code: true, label: `bat --line-range 120:160 --style=numbers,changes --paging=never src/app.py` },
      { key: "b", code: true, label: `bat -n -r 120:160 src/app.py` },
      { key: "c", code: true, label: `bat --line-range :160 --style=plain src/app.py` },
      { key: "d", code: true, label: `bat --pager=off --lines 120..160 src/app.py` },
    ],
    correct: "a",
    explain: "`--line-range 120:160` recorta; `--style=numbers,changes` añade números y marcas; `--paging=never` evita pager."
  },
  {
    id: "q4",
    type: "single",
    prompt: "Lista el directorio actual con eza: largo, ocultos, tamaños legibles, info Git, dirs primero, orden modif desc.",
    options: [
      { key: "a", code: true, label: `eza -lah --git --group-directories-first -s modified -r` },
      { key: "b", code: true, label: `eza -l -a -h --git --sort=size` },
      { key: "c", code: true, label: `eza -lah --git --sort=modified --reverse` },
      { key: "d", code: true, label: `eza -lha --git --group-directories-first` },
    ],
    correct: "a",
    explain: "`-l -a -h`, `--git`, `--group-directories-first`, `-s modified` y `-r` (desc)."
  },
  {
    id: "q5",
    type: "single",
    prompt: "Selecciona la combinación correcta para: (1) resumen claro de sistemas de archivos; (2) top de uso por subdirectorios (profundidad 2).",
    options: [
      { key: "a", code: true, label: `1) duf\n2) dust -d 2 .` },
      { key: "b", code: true, label: `1) df -h\n2) du -h -d 2 .` },
      { key: "c", code: true, label: `1) dust\n2) duf -d 2 .` },
      { key: "d", code: true, label: `1) ncdu\n2) df -h` },
    ],
    correct: "a",
    explain: "duf reemplaza df con tabla clara; dust reemplaza du con vista compacta y `-d 2` limita profundidad."
  },
  {
    id: "q6",
    type: "single",
    prompt: "Función de shell 'j' que integra zoxide + fzf para cd al directorio elegido.",
    options: [
      { key: "a", code: true, label:
`j(){ local d; d="$(zoxide query -l | fzf --height=40% --reverse --prompt='zoxide > ')" || return; cd "$d" || return; }` },
      { key: "b", code: true, label:
`j(){ cd "$(fzf)" || return; }` },
      { key: "c", code: true, label:
`j(){ zoxide add . && cd ..; }` },
      { key: "d", code: true, label:
`j(){ cd "$(zoxide query -i)" || return; }` },
    ],
    correct: "a",
    explain: "`zoxide query -l` lista destinos; `fzf` selecciona; `cd \"$d\"`."
  },
  {
    id: "q7",
    type: "single",
    prompt: "Benchmark justo entre 'rg foo src/' y 'grep -R foo src/' con 5 warmups, 10 repeticiones y salida JSON.",
    options: [
      { key: "a", code: true, label: `hyperfine -w 5 -r 10 'rg foo src/' 'grep -R foo src/' --export-json bench.json` },
      { key: "b", code: true, label: `hyperfine --warmup 5 --runs 10 rg foo src/ grep -R foo src/ > bench.json` },
      { key: "c", code: true, label: `hyperfine -W 5 -N 10 'rg foo src/' 'grep -R foo src/' --json bench.json` },
      { key: "d", code: true, label: `time rg foo src/ && time grep -R foo src/` },
    ],
    correct: "a",
    explain: "`-w 5` warmups, `-r 10` runs, comillas por comando, `--export-json bench.json`."
  },
  {
    id: "q8",
    type: "single",
    prompt: "Configura git para usar 'delta' como pager por defecto y navegación en diffs (global).",
    options: [
      { key: "a", code: true, label:
`git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.syntax-theme Dracula` },
      { key: "b", code: true, label:
`git config --global pager.diff delta
git config --global pager.show delta` },
      { key: "c", code: true, label:
`git config --global core.pager less
git config --global color.ui always` },
      { key: "d", code: true, label:
`git delta --global enable` },
    ],
    correct: "a",
    explain: "Se establece delta como pager y se activa navegación; el tema es opcional."
  },
];

// Render
const list = document.getElementById('questions');
list.innerHTML = QUESTIONS.map((q, idx) => renderQuestion(q, idx+1)).join('');

// Botones
document.getElementById('gradeBtn').addEventListener('click', grade);
document.getElementById('resetBtn').addEventListener('click', resetQuiz);

// Mostrar best score si existe
showBestScoreHint();

function renderQuestion(q, n){
  const opts = q.options.map(o => `
    <label class="option">
      <input type="radio" name="${q.id}" value="${o.key}" aria-labelledby="${q.id}-prompt" />
      <div class="code">
        ${o.code ? `<pre><code>${o.label}</code></pre>` : `<span>${escapeHtml(o.label)}</span>`}
      </div>
    </label>
  `).join('');

  const contextBlock = q.context ? `<pre><code>${escapeHtml(q.context)}</code></pre>` : '';
  return `
    <li class="q" id="${q.id}">
      <div class="badge">Pregunta ${n}</div>
      ${contextBlock}
      <p id="${q.id}-prompt" class="prompt">${q.prompt}</p>
      <div class="options">${opts}</div>
      <div class="explain" id="${q.id}-explain" hidden></div>
    </li>
  `;
}

function grade(){
  const result = document.getElementById('result');
  clearMarks();

  // Validar que estén todas respondidas
  const missing = QUESTIONS.filter(q => !getSelected(q.id));
  if (missing.length) {
    result.classList.remove('good'); result.classList.add('bad');
    result.innerHTML = `Te faltan <strong>${missing.length}</strong> pregunta(s). Completa todas antes de calificar.`;
    focusQuestion(missing[0].id);
    return;
  }

  let correct = 0;
  QUESTIONS.forEach(q => {
    const chosen = getSelected(q.id);
    const box = document.getElementById(`${q.id}-explain`);
    const isRight = chosen === q.correct;
    if (isRight) correct++;

    // Marcar visualmente
    markOption(q.id, q.correct, 'ok');
    if (chosen && chosen !== q.correct) markOption(q.id, chosen, 'ko');

    // Mostrar explicación
    box.hidden = false;
    box.innerHTML = `<strong>${isRight ? '✅ Correcto' : '❌ Incorrecto'}</strong><br>${escapeHtml(q.explain)}`;
  });

  const score = Math.round((correct / QUESTIONS.length) * 100);
  const bestPrev = Number(localStorage.getItem(STORAGE.BEST) || 0);
  localStorage.setItem(STORAGE.LAST, String(score));
  if (score > bestPrev) localStorage.setItem(STORAGE.BEST, String(score));

  result.classList.remove('good','bad');
  result.classList.add(score >= 75 ? 'good' : 'bad');
  const bestNow = Number(localStorage.getItem(STORAGE.BEST) || score);
  result.innerHTML = `Puntaje: <strong>${score}%</strong> (${correct}/${QUESTIONS.length}) · ${score>=75 ? '¡Excelente!' : 'Sigue practicando 💪'}<br><small>Mejor puntaje: ${bestNow}%</small>`;
  result.scrollIntoView({behavior:'smooth',block:'center'});
}

function resetQuiz(){
  // inputs se limpian por el botón type=reset
  document.querySelectorAll('.explain').forEach(b => { b.hidden = true; b.textContent = ''; });
  const result = document.getElementById('result');
  result.textContent = '';
  result.classList.remove('good','bad');
  clearMarks();
}

function clearMarks(){
  document.querySelectorAll('.q').forEach(li => li.classList.remove('missing'));
  document.querySelectorAll('label.option').forEach(l => l.classList.remove('ok','ko'));
}

function markOption(qId, key, cls){
  const input = document.querySelector(`#${qId} input[type="radio"][value="${key}"]`);
  if (!input) return;
  const label = input.closest('label.option');
  if (label) label.classList.add(cls);
}

function getSelected(id){
  const el = document.querySelector(`input[name="${id}"]:checked`);
  return el ? el.value : null;
}

function focusQuestion(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('missing');
  el.scrollIntoView({behavior:'smooth',block:'center'});
  const first = el.querySelector('input[type="radio"]');
  if (first) first.focus();
}

function showBestScoreHint(){
  const best = localStorage.getItem(STORAGE.BEST);
  if (!best) return;
  const result = document.getElementById('result');
  result.classList.add('good');
  result.innerHTML = `Mejor puntaje previo: <strong>${best}%</strong>`;
}

// Copiar al hacer click en bloques de código
document.addEventListener('click', (e) => {
  const code = e.target.closest('pre > code');
  if (!code) return;
  const text = code.innerText;
  navigator.clipboard?.writeText(text).then(() => toast('Copiado al portapapeles')).catch(()=>{});
});

function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.remove(); }, 1400);
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => (
    { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
  ));
}
