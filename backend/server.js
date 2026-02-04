const app = require('./src/app');
const config = require('./src/config/config');

const PORT = config.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`EnergyGrid Backend Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
