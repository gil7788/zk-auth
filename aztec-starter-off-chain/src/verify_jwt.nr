// use dep::aztec::macros::aztec;
// use jwt::JWT;
// use dep::std::hash::sha256;

// global MAX_DATA_LENGTH: u32 = 900;
// global MAX_JWT_PAYLOAD_LENGTH: u32 = 900;

// #[aztec]
// pub contract VerifyJWT {
//     #[storage]
//     struct Storage<Context> {
//         google_pub_key: String<MAX_DATA_LENGTH>,
//         google_exp: String<MAX_DATA_LENGTH>,
//         jwt_payload: String<MAX_JWT_PAYLOAD_LENGTH>,
//         jwt_payload_hash: Field,
//         jwt_sig: Array<u8, 256>,
//     }

//     #[public]
//     #[initializer]
//     fn constructor(
//         jwt_payload: String<MAX_JWT_PAYLOAD_LENGTH>,
//         jwt_sig: Array<u8, 256>,
//         jwt_payload_hash: Field,
//     ) {
//         // Store known public key and exponent for Google (as strings)
//         google_pub_key = "sSSDYs52SUnYehxOV-G_eQ47SmM8m9ubTUU0K24LpNHk7j4ICM-PreBi_npBfxy7kAoBr5KS_Dp2FAR32ji7ey42JtzE-xrkzAI1FmbL5VmxR2D3JtK4S9Kytd5d8xcNdsBdAHEmoQyjjAafLBnx-HwGJe0C7G3VJZXOu4-kKVv4rqwln-PuMlwFz9DNr4uBUgvtqmBPSXdAjRskbMJCo4eWrRXczQerd5noQAQoZmRNFS18FccDct4efuT49pH7BAhy5YHfAFv8vMgCpRhqd2VADYJfBVlJ8wKMCC-8yzckLj9V2UQZSOmJ3IoBovnF02EN0uL0bYMunVvm0YWPrQ";
//         google_exp = "AQAB";

//         // Initialize state
//         storage.jwt_payload = jwt_payload;
//         storage.jwt_sig = jwt_sig;
//         storage.jwt_payload_hash = jwt_payload_hash;
//     }

//     #[view]
//     #[public]
//     fn is_valid_jwt() -> bool {
//         is_valid_hash() && is_valid_google_sig()
//     }

//     #[view]
//     #[public]
//     fn is_valid_hash() -> bool {
//         // Evaluate SHA256 hash of the stored payload string (as per JWT validation)
//         let payload_bytes = storage.jwt_payload.to_bytes();
//         let evaluated_hash: Field = sha256(payload_bytes);
//         storage.jwt_payload_hash == evaluated_hash
//     }

//     #[view]
//     #[public]
//     fn is_valid_google_sig() -> bool {
//         // Verify JWT signature using the public key and exponent
//         JWT::verify_signature(
//             storage.jwt_payload.to_bytes(),
//             storage.jwt_sig,
//             storage.google_pub_key.to_bytes(),
//             storage.google_exp.to_bytes(),
//         )
//     }
// }
