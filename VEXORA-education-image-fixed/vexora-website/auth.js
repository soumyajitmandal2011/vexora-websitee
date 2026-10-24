(() => {
  const config = window.VEXORA_SUPABASE_CONFIG || {};
  const configured = config.url && config.anonKey &&
    !config.url.includes('YOUR-PROJECT-REF') &&
    !config.anonKey.includes('YOUR_SUPABASE_');
  const form = document.querySelector('[data-auth-form]');
  const status = form?.querySelector('.form-message');
  const submit = form?.querySelector('button[type="submit"]');
  const say = (message, kind = 'info') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
    status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  };
  const setBusy = (busy, label) => {
    if (!submit) return;
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    if (!submit.dataset.originalLabel) submit.dataset.originalLabel = submit.textContent;
    submit.textContent = busy ? label : submit.dataset.originalLabel;
  };

  if (!window.supabase || !configured) {
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        say('Authentication setup is incomplete. Add your Supabase Project URL and publishable/anon key to supabase-config.js, then reload this page.', 'error');
      });
    }
    const note = document.querySelector('[data-auth-note]');
    if (note) note.textContent = 'Setup required: connect a Supabase project before using real accounts.';
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.vexoraAuth = client;

  if (form) form.addEventListener('submit', async event => {
    event.preventDefault();
    const type = form.dataset.authForm;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    say('');
    if (type === 'register') {
      const confirm = String(data.get('confirm') || '');
      if (password !== confirm) return say('Passwords do not match. Please try again.', 'error');
      if (password.length < 8) return say('Use a password with at least 8 characters.', 'error');
    }
    setBusy(true, type === 'register' ? 'CREATING ACCOUNT…' : 'LOGGING IN…');
    try {
      if (type === 'register') {
        const name = String(data.get('name') || '').trim();
        const { data: result, error } = await client.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${location.origin}${location.pathname.replace(/register\.html?$/i, 'login.html')}` }
        });
        if (error) throw error;
        if (result.session) {
          say('Account created successfully. Opening your client space…', 'success');
          location.href = 'dashboard.html';
        } else {
          say('Account request received. Check your email for a verification link, then log in.', 'success');
          form.reset();
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        say('Login successful. Opening your client space…', 'success');
        location.href = 'dashboard.html';
      }
    } catch (error) {
      const message = error?.message || 'Something went wrong. Please try again.';
      say(message, 'error');
    } finally {
      setBusy(false);
    }
  });

  const signOut = document.querySelector('[data-sign-out]');
  if (signOut) signOut.addEventListener('click', async () => {
    signOut.disabled = true;
    const { error } = await client.auth.signOut();
    if (error) { signOut.disabled = false; alert(error.message); return; }
    location.href = 'index.html';
  });

  if (document.body.dataset.protectedPage === 'true') {
    client.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) { location.replace('login.html'); return; }
      const user = data.session.user;
      const name = user.user_metadata?.full_name || user.email || 'VEXORA client';
      const nameNode = document.querySelector('[data-client-name]');
      const emailNode = document.querySelector('[data-client-email]');
      if (nameNode) nameNode.textContent = name;
      if (emailNode) emailNode.textContent = user.email || '';
    });
  }
})();
