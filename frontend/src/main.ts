const resPre = document.getElementById('res');

const showResText = async (res: Response) => {
  if (resPre) resPre.textContent = await res.text();
};

['a', 'b', 'c'].forEach(username =>
  document.getElementById(username)?.addEventListener('click', () =>
    fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then(showResText)
      .catch(console.error)
  )
);

document
  .getElementById('get-curr-user')
  ?.addEventListener('click', () =>
    fetch('http://localhost:3000/currUser', { credentials: 'include' })
      .then(showResText)
      .catch(console.error)
  );

document
  .getElementById('get-sensitive-data')
  ?.addEventListener('click', () =>
    fetch('http://localhost:3000/sensitiveData', { credentials: 'include' })
      .then(showResText)
      .catch(console.error)
  );

document.getElementById('delete-self')?.addEventListener('click', () =>
  fetch('http://localhost:3000/deleteSelf', {
    method: 'POST', // use `post` instead of `delete` to show vulnerability to CSRF
    credentials: 'include',
  })
    .then(showResText)
    .catch(console.error)
);

export {};
