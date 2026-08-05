const baseUrl = required('UMAMI_INTERNAL_URL').replace(/\/$/, '')
const adminPassword = required('UMAMI_ADMIN_PASSWORD')
const websiteId = required('UMAMI_WEBSITE_ID')

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

async function request(path, options = {}) {
  const response = await fetch(baseUrl + path, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const text = await response.text()
  let body
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  return { response, body }
}

async function login(password) {
  const { response, body } = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password }),
  })
  return response.ok ? body : null
}

async function authorized(path, token, options = {}) {
  const result = await request(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (!result.response.ok) {
    throw new Error(
      `${options.method || 'GET'} ${path} failed with ${result.response.status}: ${JSON.stringify(result.body)}`,
    )
  }
  return result.body
}

let auth = await login(adminPassword)
if (!auth) {
  const initialAuth = await login('umami')
  if (!initialAuth) {
    throw new Error(
      'Could not authenticate with the configured or initial Umami admin password',
    )
  }

  await authorized(`/api/users/${initialAuth.user.id}`, initialAuth.token, {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    }),
  })
  auth = await login(adminPassword)
  if (!auth) throw new Error('Umami admin password update did not take effect')
  console.log('Umami admin password initialized')
}

const websites = await authorized('/api/websites?pageSize=100', auth.token)
const website = websites.data.find((candidate) => candidate.id === websiteId)

if (!website) {
  await authorized('/api/websites', auth.token, {
    method: 'POST',
    body: JSON.stringify({
      id: websiteId,
      name: 'Hägvall Labs',
      domain: 'hagvall-labs.com',
    }),
  })
  console.log('Umami website initialized')
}

await authorized(`/api/websites/${websiteId}`, auth.token, {
  method: 'POST',
  body: JSON.stringify({
    name: 'Hägvall Labs',
    domain: 'hagvall-labs.com',
    replayConfig: {
      replayEnabled: false,
      heatmapEnabled: false,
      sampleRate: 0,
      heatmapSampleRate: 0,
      maskLevel: 'strict',
    },
  }),
})

console.log(`Umami ready for website ${websiteId}; replay and heatmaps disabled`)
