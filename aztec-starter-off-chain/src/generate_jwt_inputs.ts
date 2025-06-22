// import { generateInputs } from 'noir-jwt';


// export async function fetchGooglePublicKey(keyId: string) {
//   if (!keyId) {
//     return null;
//   }

//   const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
//   const keys = await response.json();

//   const key = keys.keys.find((key: { kid: string }) => key.kid === keyId);
//   if (!key) {
//     console.error(`Google public key with id ${keyId} not found`);
//     return null;
//   }

//   return key;
// }


/*
eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..OywRB1HchI4QGCc9.D6eZRr6_tcq_2xcIkEa78uQvSC7bgu2VX1bCHJ9Op3ASoOhJmTmaxiRWaQRmUTfqi0C9ir4wBn2C3bx3y6F6baRy0VhOkB2MOvhubNr1EJGKtP1wgVYR69AMYIUG-D20Y8Vllbbd2X8uiuE8sfQ-vy0rx0Nc7YZGGHbXdLv5Qq5dG6jZzrqh7tuRHB3YLmkY10RTQK4I6WoglyzB8bm7uOl047paMXAt-3N_w6itj7DXksXh9BFU24rypTbH3WKQLj9fytY5z_5yvCUH-8mRm-kainevac0AVqWQ6cxuUgNlNTJrOAr1eUGbM06MclOP1J-nnwbDOYLG2vXIn-iXvOUd7XfbDIISfk1k73reAJdnk5ynLlU8k5M9yiTvy88e0jH_rAZidXmxkyyL1RP31Xx3QjJlaaV_GRIWPb0qd0fbrXRlQUoJ8cts0COOIi3lfSliOPQTFWaC7-Ir8lO5Cw_9p40ZrqdtAd-1FKx784njjh2GZgyP_gmNnVArBrLD4D2HatBo91cRVqOJeHM43VOd57rJsqXc3ie9NjIPqroveEtQh461EKL6jbJBCF3USbIiMekvqN019JJF_doORhbhLwo6y2T4cz1zg-magDsgOTXMjH8NFHXwibWbGjJxGDIZXyY-XETCBErj84nNyWmMLoGVIJqarJBECAtoef2rcXBFKveUhIG2KmsDK-VmG-ySTVFLYq8.5njV20Xz2IlQHkxoDt11Dg

*/


// export async function fetchGooglePublicKey() {
// //   if (!keyId) {
// //     return null;
// //   }

//   const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
//   const keys = await response.json();

//   const key = keys.keys.find((key: { kid: string }) => key.kid === keyId);
//   if (!key) {
//     console.error(`Google public key with id ${keyId} not found`);
//     return null;
//   }

//   return key;
// }


import { AnonGroupProvider, EphemeralKey } from './types.js';
import { pubkeyModulusFromJWK, fetchGooglePublicKey, splitBigIntToLimbs } from './utils.js';
import { generateInputs } from 'noir-jwt';
import { InputMap, type CompiledCircuit } from '@noir-lang/noir_js';
import Component from './component.js';

const MAX_DOMAIN_LENGTH = 64;


// const jwt: string = 'your_jwt_token_here';
// const pubkey: JsonWebKey = await fetchGooglePublicKey();
// const maxSignedDataLength: number = 512; // or whatever value you need
// const shaPrecomputeTillKeys: string[] = ['alg', 'typ']; // example keys

// const inputs = generateInputs({
//   jwt,
//   pubkey,
//   maxSignedDataLength,
//   shaPrecomputeTillKeys,
// });


/**
 * GoogleOAuth AnonGroupProvider for people in a company (using company domain in Google Workspace account)
 */
const GoogleOAuthProvider: AnonGroupProvider = {
  //
  name: () => 'organization-google-jwt',
  //
  getSlug: () => 'domain',
  //
  getComponent: () => Component,
  //
  generateProof: async (ephemeralKey: EphemeralKey, { idToken }: { idToken: string }) => {
    const [headersB64, payloadB64] = idToken.split('.');
    const headers = JSON.parse(atob(headersB64));
    const payload = JSON.parse(atob(payloadB64));

    const domain = payload.hd;
    if (!domain) {
      throw new Error('You can use this app with a Google account that is part of an organization.');
    }

    // Get Google pubkey
    const keyId = headers.kid;
    const jwtPubkey = await fetchGooglePublicKey(keyId);

    if (!idToken || !jwtPubkey) {
      throw new Error('[JWT Circuit] Proof generation failed: idToken and jwtPubkey are required');
    }

    const jwtInputs = await generateInputs({
      jwt: idToken,
      pubkey: jwtPubkey,
      shaPrecomputeTillKeys: ['email', 'email_verified', 'nonce'],
      maxSignedDataLength: 640,
    });

    const domainUint8Array = new Uint8Array(MAX_DOMAIN_LENGTH);
    domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));

    const inputs = {
      partial_data: jwtInputs.partial_data,
      partial_hash: jwtInputs.partial_hash,
      full_data_length: jwtInputs.full_data_length,
      base64_decode_offset: jwtInputs.base64_decode_offset,
      jwt_pubkey_modulus_limbs: jwtInputs.pubkey_modulus_limbs,
      jwt_pubkey_redc_params_limbs: jwtInputs.redc_params_limbs,
      jwt_signature_limbs: jwtInputs.signature_limbs,
      ephemeral_pubkey: (ephemeralKey.publicKey >> 3n).toString(),
      ephemeral_pubkey_salt: ephemeralKey.salt.toString(),
      ephemeral_pubkey_expiry: Math.floor(ephemeralKey.expiry.getTime() / 1000).toString(),
      domain: {
        storage: Array.from(domainUint8Array),
        len: domain.length,
      },
    };

    console.log('JWT circuit inputs', inputs);

    const { Noir } = await import('@noir-lang/noir_js');
    const { UltraHonkBackend } = await import('@aztec/bb.js');

    const circuitArtifact = await import(`../nr/artifacts/circuit.json`);
    const backend = new UltraHonkBackend(circuitArtifact.bytecode, { threads: 8 });
    const noir = new Noir(circuitArtifact as CompiledCircuit);

    // Generate witness and prove
    const startTime = performance.now();
    const { witness } = await noir.execute(inputs as InputMap);
    const proof = await backend.generateProof(witness);
    const provingTime = performance.now() - startTime;

    console.log(`Proof generated in ${provingTime}ms`);

    const anonGroup = GoogleOAuthProvider.getAnonGroup(domain);

    const proofArgs = {
      keyId,
      jwtCircuitVersion: '0.3.1',
    };

    return {
      proof: proof.proof,
      anonGroup,
      proofArgs,
    };
  },
  //
  verifyProof: async (
    proof: Uint8Array,
    anonGroupId: string,
    ephemeralPubkey: bigint,
    ephemeralPubkeyExpiry: Date,
    proofArgs: { keyId: string; jwtCircuitVersion: string },
  ) => {
    if (proofArgs.jwtCircuitVersion !== '0.3.1') {
      throw new Error(
        'This proof was generated with an older version of StealthNote JWT circuit and ' +
          'cannot be verified at this time. You can run an older version of the app to verify this proof.',
      );
    }

    // Verify the pubkey belongs to Google
    const googlePubkeyJWK = await fetchGooglePublicKey(proofArgs.keyId);
    if (!googlePubkeyJWK) {
      throw new Error('[Google OAuth] Proof verification failed: could not validate Google public key.');
    }
    const googleJWTPubkeyModulus = await pubkeyModulusFromJWK(googlePubkeyJWK);
    const domain = anonGroupId;

    if (!domain || !googleJWTPubkeyModulus || !ephemeralPubkey || !ephemeralPubkeyExpiry) {
      throw new Error('[JWT Circuit] Proof verification failed: invalid public inputs');
    }

    const { BarretenbergVerifier } = await import('@aztec/bb.js');

    const vkey = await import('../nr/artifacts/vkey.json');

    // Public Inputs = pubkey_limbs(18) + domain(64) + ephemeral_pubkey(1) + ephemeral_pubkey_expiry(1) = 84
    const publicInputs: string[] = [];

    // Push modulus limbs as 64 char hex strings (18 Fields)
    const modulusLimbs = splitBigIntToLimbs(googleJWTPubkeyModulus, 120, 18);
    publicInputs.push(...modulusLimbs.map((s) => '0x' + s.toString(16).padStart(64, '0')));

    // Push domain + domain length (BoundedVec of 64 bytes)
    const domainUint8Array = new Uint8Array(64);
    domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));
    publicInputs.push(...Array.from(domainUint8Array).map((s) => '0x' + s.toString(16).padStart(64, '0')));
    publicInputs.push('0x' + domain.length.toString(16).padStart(64, '0'));

    // Push ephemeral pubkey (1 Field)
    publicInputs.push('0x' + (ephemeralPubkey >> 3n).toString(16).padStart(64, '0'));

    // Push ephemeral pubkey expiry (1 Field)
    publicInputs.push(
      '0x' +
        Math.floor(ephemeralPubkeyExpiry.getTime() / 1000)
          .toString(16)
          .padStart(64, '0'),
    );

    const proofData = {
      proof: proof,
      publicInputs,
    };

    const verifier = new BarretenbergVerifier({
      crsPath: process.env.TEMP_DIR,
    });
    const result = await verifier.verifyUltraHonkProof(proofData, Uint8Array.from(vkey));

    return result;
  },
  //
  getAnonGroup: (anonGroupId: string) => {
    return {
      id: anonGroupId,
      title: anonGroupId,
      logoUrl: `https://img.logo.dev/${anonGroupId}?token=pk_SqdEexoxR3akcyJz7PneXg`,
    };
  },
};

export default GoogleOAuthProvider;
