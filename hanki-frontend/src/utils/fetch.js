const username = "haikal";
const password = "password";
const credentials = btoa(`${username}:${password}`); // base64 encode

/**
 * Makes an HTTP request using fetch with basic auth.
 *
 * @param {string} endpoint - API endpoint (e.g. '/users')
 * @param {string} method - HTTP method (e.g. 'GET', 'POST')
 * @param {object} [body=null] - Optional request body for POST/PUT
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiRequest(endpoint, method, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    "http://localhost:8080/hanki/" + endpoint,
    options
  );

  return response;
}
