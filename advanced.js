(() => {
  const nav = document.getElementById('advanced-nav');
  const topics = Array.from(document.querySelectorAll('.advanced-topic'));
  if (!nav || topics.length === 0) return;

  const pages = topics.map((topic, index) => {
    const button = document.createElement('button');
    const label = topic.dataset.pageLabel || topic.querySelector('h2')?.textContent.trim() || `Topic ${index + 1}`;
    button.type = 'button';
    button.id = `advanced-tab-${index}`;
    button.dataset.page = String(index);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', topic.id);
    button.textContent = `${String(index + 1).padStart(2, '0')} · ${label}`;
    nav.append(button);
    topic.setAttribute('role', 'tabpanel');
    topic.setAttribute('aria-labelledby', button.id);
    topic.tabIndex = 0;

    const controls = document.createElement('div');
    controls.className = 'chapter-controls';
    controls.innerHTML = `<button type="button" data-previous>← Previous</button><span class="step-count" aria-live="polite"></span><button type="button" data-next>Next section →</button>`;
    topic.append(controls);
    return { topic, button, controls };
  });

  let current = 0;
  const chooseFromHash = () => {
    const index = topics.findIndex(topic => topic.id === location.hash.slice(1));
    return index < 0 ? 0 : index;
  };

  function showPage(index, { scroll = false, scrollToNav = false, updateHash = true } = {}) {
    current = Math.max(0, Math.min(topics.length - 1, index));
    pages.forEach(({ topic, button, controls }, i) => {
      const active = i === current;
      topic.hidden = !active;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      controls.querySelector('.step-count').textContent = `${String(i + 1).padStart(2, '0')} / ${String(topics.length).padStart(2, '0')}`;
      controls.querySelector('[data-previous]').disabled = i === 0;
      controls.querySelector('[data-next]').disabled = i === topics.length - 1;
    });
    if (updateHash && location.hash !== `#${topics[current].id}`) history.replaceState(null, '', `#${topics[current].id}`);
    if (scrollToNav) document.querySelector('.advanced-nav-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (scroll) topics[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  nav.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (button) showPage(Number(button.dataset.page), { scrollToNav: true });
  });
  nav.addEventListener('keydown', event => {
    let next = current;
    if (event.key === 'ArrowRight') next = Math.min(topics.length - 1, current + 1);
    else if (event.key === 'ArrowLeft') next = Math.max(0, current - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = topics.length - 1;
    else return;
    event.preventDefault();
    showPage(next, { scrollToNav: true });
    pages[next].button.focus();
  });
  pages.forEach(({ topic, controls }) => {
    controls.querySelector('[data-previous]').addEventListener('click', () => showPage(current - 1, { scroll: true }));
    controls.querySelector('[data-next]').addEventListener('click', () => showPage(current + 1, { scroll: true }));
  });
  window.addEventListener('hashchange', () => showPage(chooseFromHash(), { scroll: true, updateHash: false }));
  showPage(chooseFromHash(), { updateHash: !location.hash, scroll: Boolean(location.hash) });
})();