import "./types.js";
/**
 * @param {IncomingUser} user
 * @returns {OutcomingUser}
 */
function parseUser(user) {
  /** @type { OutcomingUser}  */
  const result = {
    name: user.name.toUpperCase(),
    email: user.email,
  };

  return result;
}

export { parseUser };
