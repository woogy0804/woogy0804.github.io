(() => {
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-layer');
  const languageButton = document.getElementById('lang-current');
  const languageOptions = document.getElementById('lang-options');
  const languageLabel = document.getElementById('lang-label');

  function closeLanguage() {
    languageOptions.hidden = true;
    languageButton.setAttribute('aria-expanded', 'false');
  }

  function setMenu(open) {
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) closeLanguage();
  }

  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      closeLanguage();
    }
  });

  languageButton.addEventListener('click', () => {
    languageOptions.hidden = !languageOptions.hidden;
    languageButton.setAttribute('aria-expanded', String(!languageOptions.hidden));
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.lang')) closeLanguage();
  });
  function setLanguage(language) {
    const key = language === 'ja' ? 'ja' : 'ko';
    document.documentElement.lang = key;
    languageLabel.textContent = key === 'ja' ? 'JP' : 'KR';
    document.querySelectorAll('[data-ko][data-ja]').forEach((element) => {
      element.textContent = element.dataset[key];
    });
    languageOptions.querySelectorAll('[data-lang]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === key));
    });
    try { localStorage.setItem('eito-language', key); } catch { /* storage may be unavailable in a local preview */ }
    closeLanguage();
  }
  languageOptions.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  let savedLanguage = 'ko';
  try { savedLanguage = localStorage.getItem('eito-language') || 'ko'; } catch { /* use Korean */ }
  setLanguage(savedLanguage);

  const search = document.getElementById('post-search');
  if (search) {
    const rows = [...document.querySelectorAll('#post-list .post-row')];
    const empty = document.getElementById('search-empty');
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      let matches = 0;
      rows.forEach((row) => {
        const visible = row.dataset.search.toLocaleLowerCase().includes(query);
        row.hidden = !visible;
        if (visible) matches += 1;
      });
      empty.hidden = matches > 0 || rows.length === 0;
    });
  }
})();
