(async () => {
  const page = window.location.pathname.replace('/', '') || 'home';
  try {
    await fetch(`${window.FUNCTION_URL || ''}/api/track`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ page })
    });
  } catch (err) {
    console.error('Erro ao registar visita', err);
  }
})();
