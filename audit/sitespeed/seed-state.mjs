/**
 * Prepares Bonga's browser state before sitespeed.io measures any URL.
 * This runs outside the measurement, so onboarding/localStorage setup does not
 * pollute the performance metrics.
 */
import fs from 'node:fs/promises';

export default async function (context, commands) {
  const origin = context.options.my?.origin || 'http://host.docker.internal:4173';

  await commands.navigate(origin);
  await commands.js.run(`
    localStorage.setItem('bonga-selected-city', 'مشهد');
    localStorage.setItem('bonga-selected-city-id', '000000000000000000000101');
    localStorage.setItem('bonga-selected-city-lat', '36.2605');
    localStorage.setItem('bonga-selected-city-lng', '59.5986');
  `);

  try {
    const authSession = JSON.parse(
      await fs.readFile('/sitespeed.io/audit/auth-session.json', 'utf8'),
    );

    await commands.js.run(
      `localStorage.setItem('bonga-auth-session', ${JSON.stringify(JSON.stringify(authSession))});`,
    );
    context.log.info('Loaded audit/auth-session.json for authenticated route testing.');
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      context.log.warn(`Could not load audit auth session: ${error.message}`);
    }
  }
}
