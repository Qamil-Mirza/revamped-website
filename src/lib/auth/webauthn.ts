import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type AuthenticatorTransportFuture,
} from "@simplewebauthn/server";
import type { StoredCredential } from "@/lib/auth/credentials";

export function rpConfig() {
  return {
    rpID: process.env.RP_ID ?? "localhost",
    rpName: "Qamil Mirza",
    origin: process.env.RP_ORIGIN ?? "http://localhost:3000",
  };
}

export async function buildRegistrationOptions(
  existing: StoredCredential[],
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const { rpID, rpName } = rpConfig();
  return generateRegistrationOptions({
    rpName,
    rpID,
    userName: "owner",
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({
      id: c.credentialID,
      transports: c.transports as AuthenticatorTransportFuture[] | undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });
}

export async function verifyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string,
): Promise<{ verified: boolean; credential?: StoredCredential }> {
  const { rpID, origin } = rpConfig();
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return { verified: false };
  }
  const { credential } = verification.registrationInfo;
  return {
    verified: true,
    credential: {
      credentialID: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      transports: response.response.transports,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function buildAuthenticationOptions(
  existing: StoredCredential[],
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const { rpID } = rpConfig();
  return generateAuthenticationOptions({
    rpID,
    userVerification: "required",
    allowCredentials: existing.map((c) => ({
      id: c.credentialID,
      transports: c.transports as AuthenticatorTransportFuture[] | undefined,
    })),
  });
}

export async function verifyAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credential: StoredCredential,
): Promise<{ verified: boolean; newCounter?: number }> {
  const { rpID, origin } = rpConfig();
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: credential.credentialID,
      publicKey: Buffer.from(credential.publicKey, "base64url"),
      counter: credential.counter,
      transports: credential.transports as AuthenticatorTransportFuture[] | undefined,
    },
  });
  return {
    verified: verification.verified,
    newCounter: verification.authenticationInfo?.newCounter,
  };
}
