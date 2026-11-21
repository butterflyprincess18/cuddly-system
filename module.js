/* ============ ENGINE HALAMAN MODUL (dipakai crust, lithosphere, outer-core, inner-core) ============
   Cara pakai: definisikan window.MODULE lalu muat file ini.
   Kolom videoId: isi dengan ID video YouTube (bagian setelah v=). Kosong = tampil placeholder. */
/* ===== PENGATURAN VIDEO (EDIT DI SINI SAJA) =====
   Isi dengan LINK LENGKAP Google Drive (boleh juga hanya ID-nya). Cara mengambil link:
   Drive > klik kanan file > Bagikan > "Siapa saja yang memiliki link" > Salin link.
   Link berbentuk https://drive.google.com/file/d/INI_ID_NYA/view  -> ambil bagian INI_ID_NYA.
   - kerak  : KERAK BUMI.mp4  (halaman Kerak)
   - mantel : MANTEL BUMI.mp4 (halaman Mantel Luar & Mantel Dalam)
   - inti   : INTI BUMI.mp4   (halaman Inti Luar & Inti Dalam) */
const VIDEO_IDS = {
  kerak: 'https://drive.google.com/file/d/1kq4Jv15yj8rvnXl_mtEAJdA0H83MIXxd/view?usp=drive_link',
  mantel: 'https://drive.google.com/file/d/1VZM7Lp9TGiLpA2BYh1EOfA5P3LJX_Rre/view?usp=drive_link',
  inti: 'https://drive.google.com/file/d/1IQg34ArPz81iLYdT6wnjJg2y-nivQUhO/view?usp=drive_link'
};

(function () {
  const M = window.MODULE;
  const svg = p => `<svg class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    materi: svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
    video: svg('<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>'),
    kuis: svg('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>'),
    proyek: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    diskusi: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')
  };
  const tabs = [
    { id: 'materi', label: 'Materi', icon: ICONS.materi, color: 'emerald' },
    { id: 'video', label: 'Video Visualisasi', icon: ICONS.video, color: 'blue' },
    { id: 'kuis', label: 'Kuis Interaktif', icon: ICONS.kuis, color: 'purple' },
    { id: 'proyek', label: 'Proyek', icon: ICONS.proyek, color: 'yellow' },
    { id: 'diskusi', label: 'Feedback Materi', icon: ICONS.diskusi, color: 'orange' }
  ];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  document.title = 'Modul: ' + M.title;
  document.body.className = 'bg-slate-900 text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-emerald-500 selection:text-white';
  document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

  const quizHTML = M.quiz.map((q, i) => `
    <div class="quiz-q bg-slate-900/50 border border-slate-700 rounded-2xl p-5" data-i="${i}">
      <p class="font-semibold mb-3">${i + 1}. ${esc(q.q)}</p>
      <div class="space-y-2">
        ${q.options.map((o, j) => `<button type="button" data-j="${j}" class="quiz-opt w-full text-left px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">${esc(o)}</button>`).join('')}
      </div>
      <p class="quiz-exp hidden mt-3 text-sm text-slate-300"></p>
    </div>`).join('');

  const projectHTML = `
    <p class="text-slate-300 mb-6">${M.project.desc}</p>
    <h3 class="text-xl font-semibold text-white mb-3 border-l-4 border-yellow-500 pl-3">Langkah Pengerjaan</h3>
    <ul id="project-steps" class="space-y-3 mb-8">
      ${M.project.steps.map((s, i) => `<li><label class="flex items-start gap-3 bg-slate-900/50 border border-slate-700 rounded-xl p-4 cursor-pointer"><input type="checkbox" data-i="${i}" class="mt-1 w-4 h-4 accent-yellow-500"><span class="text-slate-300">${esc(s)}</span></label></li>`).join('')}
    </ul>
    <div class="mb-6"><div class="flex justify-between text-sm text-slate-400 mb-1"><span>Progres proyek</span><span id="project-pct">0%</span></div>
      <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden"><div id="project-bar" class="h-full bg-yellow-500 transition-all" style="width:0%"></div></div></div>
    <h3 class="text-xl font-semibold text-white mb-3 border-l-4 border-yellow-500 pl-3">Kriteria Penilaian</h3>
    <ul class="list-disc list-inside text-slate-300 space-y-1">${M.project.rubric.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;

  const rawVideo = VIDEO_IDS[M.videoKey] || '';
  const idMatch = rawVideo.match(/\/d\/([\w-]+)/) || rawVideo.match(/[?&]id=([\w-]+)/);
  const DRIVE_ID = idMatch ? idMatch[1] : rawVideo.trim();
  const driveHTML = `<div class="relative w-full overflow-hidden rounded-2xl aspect-video bg-black shadow-2xl border border-slate-700"><iframe class="absolute top-0 left-0 w-full h-full" src="https://drive.google.com/file/d/${esc(DRIVE_ID)}/preview" title="${esc(M.title)}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><p class="mt-3 text-sm text-slate-400">Video tidak muncul? <a class="text-blue-400 underline" target="_blank" rel="noopener" href="https://drive.google.com/file/d/${esc(DRIVE_ID)}/view">Buka di Google Drive</a>.</p>`;
  const videoHTML = DRIVE_ID ? driveHTML : M.videoId
    ? `<div class="relative w-full overflow-hidden rounded-2xl aspect-video bg-black shadow-2xl border border-slate-700"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/${esc(M.videoId)}?rel=0" title="${esc(M.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    : `<div class="aspect-video rounded-2xl border-2 border-dashed border-slate-600 flex items-center justify-center text-center p-6 text-slate-400"><div>Video belum dipasang.<br>Isi ID file Google Drive pada <code class="text-emerald-400">VIDEO_IDS</code> di bagian atas file <code class="text-emerald-400">module.js</code> (kunci: <code class="text-emerald-400">${esc(M.videoKey || '')}</code>).</div></div>`;

  document.body.innerHTML = `
  <div class="fixed top-[-10%] left-[-10%] w-96 h-96 ${M.glow1} rounded-full blur-[120px] pointer-events-none z-0"></div>
  <div class="fixed bottom-[-10%] right-[-10%] w-96 h-96 ${M.glow2} rounded-full blur-[120px] pointer-events-none z-0"></div>
  <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-700 pb-6">
      <div>
        <a href="index.html#explore" class="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors mb-4 group text-sm font-semibold uppercase tracking-wider">
          <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Beranda
        </a>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-100">${esc(M.title)}</h1>
        <p class="text-slate-400 mt-2 text-lg">${esc(M.subtitle)}</p>
      </div>
      <div class="mt-4 md:mt-0"><div class="inline-flex items-center px-4 py-2 rounded-full bg-slate-800 border border-slate-700"><span class="w-3 h-3 rounded-full ${M.dot} mr-2"></span><span class="text-sm font-semibold text-slate-300">Modul Interaktif</span></div></div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 xl:col-span-9" id="contents">
        <div id="content-materi" class="tab-content glass-panel p-8 md:p-10 rounded-3xl"><h2 class="text-3xl font-bold mb-6 text-emerald-400 flex items-center gap-3"><span class="w-7 h-7 shrink-0">${ICONS.materi}</span>Materi Pembelajaran</h2><div class="text-slate-300 text-lg leading-relaxed space-y-4">${M.materi}</div>
          <div class="mt-10 pt-6 border-t border-slate-700 text-sm text-slate-400"><p class="font-semibold text-slate-300 mb-2">Referensi</p><ul class="list-disc list-inside space-y-1"><li><a class="hover:text-emerald-400 underline" href="https://www.usgs.gov/" target="_blank" rel="noopener">U.S. Geological Survey (USGS)</a></li><li><a class="hover:text-emerald-400 underline" href="https://science.nasa.gov/earth/" target="_blank" rel="noopener">NASA Earth Science</a></li><li><a class="hover:text-emerald-400 underline" href="https://www.britannica.com/science/Earth" target="_blank" rel="noopener">Encyclopaedia Britannica – Earth</a></li><li><a class="hover:text-emerald-400 underline" href="https://education.nationalgeographic.org/" target="_blank" rel="noopener">National Geographic Education</a></li></ul></div></div>
        <div id="content-video" class="tab-content glass-panel p-8 md:p-10 rounded-3xl hidden"><h2 class="text-3xl font-bold mb-6 text-blue-400 flex items-center gap-3"><span class="w-7 h-7 shrink-0">${ICONS.video}</span>Video Visualisasi</h2><p class="text-slate-300 mb-6">${M.videoIntro}</p>${videoHTML}</div>
        <div id="content-kuis" class="tab-content glass-panel p-8 md:p-10 rounded-3xl hidden"><h2 class="text-3xl font-bold mb-2 text-purple-400 flex items-center gap-3"><span class="w-7 h-7 shrink-0">${ICONS.kuis}</span>Kuis Interaktif</h2><p class="text-slate-400 mb-6">Pilih satu jawaban untuk setiap soal. Jawaban langsung diperiksa.</p><div class="space-y-5">${quizHTML}</div>
          <div id="quiz-result" class="hidden mt-6 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30"><p class="font-bold text-lg" id="quiz-score"></p><button id="quiz-reset" type="button" class="mt-3 px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-900 font-bold rounded-full">Ulangi Kuis</button></div></div>
        <div id="content-proyek" class="tab-content glass-panel p-8 md:p-10 rounded-3xl hidden"><h2 class="text-3xl font-bold mb-2 text-yellow-400 flex items-center gap-3"><span class="w-7 h-7 shrink-0">${ICONS.proyek}</span>Proyek: ${esc(M.project.title)}</h2>${projectHTML}</div>
        <div id="content-diskusi" class="tab-content glass-panel p-8 md:p-10 rounded-3xl hidden"><h2 class="text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3"><span class="w-7 h-7 shrink-0">${ICONS.diskusi}</span>Feedback & Diskusi Materi</h2>
          <p class="text-slate-300 mb-8">Ada materi yang kurang jelas? Tuliskan komentar Anda di bawah ini.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form id="comment-form" class="space-y-4">
              <div><label class="block text-sm font-medium text-slate-400 mb-1">Nama Lengkap</label><input type="text" id="username" required class="w-full bg-slate-900/50 border border-slate-600 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-orange-500"></div>
              <div><label class="block text-sm font-medium text-slate-400 mb-1">Komentar / Feedback</label><textarea id="comment-text" required rows="4" class="w-full bg-slate-900/50 border border-slate-600 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-orange-500 custom-scrollbar"></textarea></div>
              <button type="submit" class="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all">Kirim Komentar</button>
            </form>
            <div class="bg-slate-900/60 rounded-xl p-4 border border-slate-700 h-[300px] overflow-y-auto custom-scrollbar"><h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Diskusi Live</h3><div id="comments-list" class="space-y-4"></div></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4 xl:col-span-3"><div class="glass-panel p-6 rounded-3xl sticky top-10">
        <h3 class="text-lg font-bold text-slate-100 mb-4 border-b border-slate-700 pb-3">Daftar Isi Modul</h3>
        <ul class="space-y-3">${tabs.map((t, i) => `<li><button type="button" data-tab="${t.id}" id="btn-${t.id}" class="tab-btn w-full text-left px-5 py-4 rounded-xl font-semibold transition-all duration-300"><span class="flex items-center gap-3"><span class="w-5 h-5 shrink-0">${t.icon}</span><span>${i + 1}. ${t.label}</span></span></button></li>`).join('')}</ul>
        <div class="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700 text-xs text-slate-400 text-center">Selesaikan semua tahapan di atas secara berurutan untuk pemahaman yang maksimal.</div>
      </div></div>
    </div>
  </div>`;

  /* ---- Tab ---- */
  const activeCls = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', purple: 'bg-purple-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500' };
  const base = 'tab-btn w-full text-left px-5 py-4 rounded-xl font-semibold transition-all duration-300 ';
  function changeTab(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('content-' + name).classList.remove('hidden');
    tabs.forEach(t => {
      const b = document.getElementById('btn-' + t.id);
      b.className = base + (t.id === name ? activeCls[t.color] + ' text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700');
    });
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => changeTab(b.dataset.tab)));
  changeTab('materi');

  /* ---- Kuis ---- */
  let answered = 0, correct = 0;
  const total = M.quiz.length;
  document.querySelectorAll('.quiz-q').forEach(box => {
    const q = M.quiz[+box.dataset.i];
    box.querySelectorAll('.quiz-opt').forEach(btn => btn.addEventListener('click', () => {
      if (box.dataset.done) return;
      box.dataset.done = '1'; answered++;
      const j = +btn.dataset.j;
      box.querySelectorAll('.quiz-opt').forEach(o => { o.disabled = true; o.classList.remove('hover:bg-slate-700'); });
      const opts = box.querySelectorAll('.quiz-opt');
      opts[q.answer].classList.add('bg-emerald-600/40', 'border-emerald-400');
      if (j === q.answer) correct++; else btn.classList.add('bg-red-600/40', 'border-red-400');
      const exp = box.querySelector('.quiz-exp');
      exp.textContent = (j === q.answer ? 'Benar. ' : 'Kurang tepat. ') + q.explain;
      exp.classList.remove('hidden');
      if (answered === total) {
        document.getElementById('quiz-score').textContent = `Skor Anda: ${correct} / ${total} (${Math.round(correct / total * 100)}%)`;
        document.getElementById('quiz-result').classList.remove('hidden');
        safeSet('score_' + M.key, correct + '/' + total);
      }
    }));
  });
  document.getElementById('quiz-reset').addEventListener('click', () => {
    answered = 0; correct = 0;
    document.querySelectorAll('.quiz-q').forEach(box => {
      delete box.dataset.done;
      box.querySelectorAll('.quiz-opt').forEach(o => { o.disabled = false; o.classList.remove('bg-emerald-600/40', 'border-emerald-400', 'bg-red-600/40', 'border-red-400'); o.classList.add('hover:bg-slate-700'); });
      box.querySelector('.quiz-exp').classList.add('hidden');
    });
    document.getElementById('quiz-result').classList.add('hidden');
  });

  /* ---- Proyek (centang tersimpan) ---- */
  const PKEY = 'project_' + M.key;
  const checks = document.querySelectorAll('#project-steps input');
  const savedChecks = safeGet(PKEY, []);
  function updateBar() {
    const n = [...checks].filter(c => c.checked).length;
    const pct = Math.round(n / checks.length * 100);
    document.getElementById('project-pct').textContent = pct + '%';
    document.getElementById('project-bar').style.width = pct + '%';
    safeSet(PKEY, [...checks].map(c => c.checked));
  }
  checks.forEach((c, i) => { c.checked = !!savedChecks[i]; c.addEventListener('change', updateBar); });
  updateBar();

  /* ---- Komentar (aman dari XSS) ---- */
  const CKEY = M.key + '_comments';
  const list = document.getElementById('comments-list');
  const time = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  function renderComment(name, text, t) {
    list.insertAdjacentHTML('afterbegin', `<div class="bg-slate-800 p-3 rounded-xl border border-slate-600"><div class="flex justify-between items-center mb-1"><span class="font-bold text-orange-400 text-sm">${esc(name)}</span><span class="text-xs text-slate-500">${esc(t)}</span></div><p class="text-slate-300 text-sm leading-relaxed">${esc(text)}</p></div>`);
  }
  const saved = safeGet(CKEY, []);
  if (!saved.length) renderComment('Admin Edukasi', 'Silakan tinggalkan umpan balik atau pertanyaan mengenai materi ini.', time());
  else [...saved].reverse().forEach(c => renderComment(c.name, c.text, c.time));
  document.getElementById('comment-form').addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('username'), t = document.getElementById('comment-text');
    const c = { name: n.value, text: t.value, time: time() };
    const arr = safeGet(CKEY, []); arr.unshift(c); safeSet(CKEY, arr);
    renderComment(c.name, c.text, c.time); t.value = '';
  });
})();
