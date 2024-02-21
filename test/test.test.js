import "./../src/types.js";

import { describe, it } from "node:test";
import { parseUser } from "../src/service.js";
import assert from "node:assert";

describe("Executanto instancias de testes", () => {
  it("Should parse user", async () => {
    /** @type {IncomingUser} user */
    const user = {
      name: "tiago landim",
      email: "email@email.com",
      password: "123@asdASD",
    };

    const result = parseUser(user);
    assert.deepStrictEqual(result, {
      name: user.name.toUpperCase(),
      email: user.email,
    });
  });
});
