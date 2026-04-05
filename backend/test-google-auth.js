const { OAuth2Client } = require('google-auth-library');
console.log('OAuth2Client:', OAuth2Client);
try {
  const client = new OAuth2Client('dummy');
  console.log('Client created successfully');
} catch (e) {
  console.error('Error creating client:', e);
}
