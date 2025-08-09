async function getToken(code) {
  const params = new URLSearchParams();
  params.append('client_id', 'DIN_CLIENT_ID_HER');
  params.append('client_secret', 'DIN_CLIENT_SECRET_HER');
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://pghosting.dk//callback.html');
  params.append('scope', 'identify email');

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: params.toString(),
  });
  if (!response.ok) throw new Error('Token fetch fejlede');
  return response.json();
}

async function getUserData(token) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {Authorization: `Bearer ${token}`},
  });
  if (!response.ok) throw new Error('Brugerdata fetch fejlede');
  return response.json();
}

async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (!code) {
    window.location.href = 'index.html'; // Ingen kode, gå hjem
    return;
  }
  try {
    const tokenData = await getToken(code);
    const userData = await getUserData(tokenData.access_token);

    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const discordUser = {
      id: userData.id,
      username: userData.username,
      avatarUrl: avatarUrl,
    };

    localStorage.setItem('discordUser', JSON.stringify(discordUser));

    window.location.href = 'index.html'; // Redirect til forsiden
  } catch (error) {
    console.error(error);
    window.location.href = 'index.html'; // Redirect selvom fejl
  }
}

main();