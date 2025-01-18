const encoder = new TextEncoder();
const key = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

export const hash = async (plainPass: string) => {
  const pass = encoder.encode(plainPass);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: { name: "SHA_256" } },
    false,
    ["sign", "verify"]
  );
  const hashBuffer = await crypto.subtle.sign("HMAC", cryptoKey, pass);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const compare = async (plainPass: string, hashPass: string) => {
  const hashed = await hash(plainPass);
  return hashed === hashPass;
};
