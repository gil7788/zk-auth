use dep::aztec::macros::aztec;


global MAX_DATA_LENGTH: u32 = 900; // max length of signed data (headerb64 + "." + payloadb64)
global MAX_NONCE_LENGTH: u32 = 32; // we are verifying `nonce` claim
use jwt::JWT;

pub fn proof_on_chain(
data: BoundedVec<u8, MAX_DATA_LENGTH>,
base64_decode_offset: u32,
pubkey_modulus_limbs: [u128; 18],
redc_params_limbs: [u128; 18],
signature_limbs: [u128; 18],
// expected_sub: pub BoundedVec<u8, MAX_NONCE_LENGTH>
) -> BoundedVec<u8, MAX_NONCE_LENGTH> {
    let jwt = JWT::init(
        data, // max length of signed data (headerb64 + "." + payloadb64)
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
    );

    jwt.verify();
    let sub = jwt.get_claim_string("sub".as_bytes());
    
    sub
}

