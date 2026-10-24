(() => {
  const form = document.querySelector('#brief-form');
  if (form) {
    const result = document.querySelector('#brief-result');
    const output = document.querySelector('#brief-output');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const brief = [
        'VEXORA WEBSITE PROJECT BRIEF',
        'Brand: ' + (data.get('brand') || 'To be confirmed'),
        'Business type: ' + data.get('industry'),
        'Primary goal: ' + data.get('goal'),
        'Visual direction: ' + data.get('style'),
        'Must-have features: ' + (data.get('features') || 'To be discussed'),
        'Additional notes: ' + (data.get('notes') || 'None provided'),
        '',
        'Next step: confirm scope, pages, content, integrations, timeline and budget with VEXORA.',
        'Note: third-party bookings, payments, ecommerce and authentication require appropriate integrations.'
      ].join('\n');
      output.value = brief;
      result.hidden = false;
      result.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
    document.querySelector('#copy-brief').addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      try { await navigator.clipboard.writeText(output.value); status.textContent = 'Brief copied.'; }
      catch { output.focus(); output.select(); status.textContent = 'Select the text and copy it with Ctrl+C.'; }
    });
  }
  document.querySelectorAll('.show-password').forEach(button => button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const show = input.type === 'password'; input.type = show ? 'text' : 'password';
    button.textContent = show ? 'HIDE' : 'SHOW'; button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }));

})();
