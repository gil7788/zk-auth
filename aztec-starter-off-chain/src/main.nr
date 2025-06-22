// mod test;
// use dep::aztec::macros::aztec;
// mod verify_jwt;

// #[aztec]
// pub contract EasyPrivateVoting {
//     use dep::aztec::{
//         keys::getters::get_public_keys,
//         macros::{functions::{initializer, internal, private, public, utility}, storage::storage},
//     };
//     use dep::aztec::prelude::{AztecAddress, Map, PublicImmutable, PublicMutable};
//     use dep::aztec::protocol_types::traits::{Hash, ToField};

//     #[storage]
//     struct Storage<Context> {
//         admin: PublicMutable<AztecAddress, Context>, // admin can end vote
//         tally: Map<Field, PublicMutable<Field, Context>, Context>, // we will store candidate as key and number of votes as value
//         vote_ended: PublicMutable<bool, Context>, // vote_ended is boolean
//         active_at_block: PublicImmutable<u32, Context>, // when people can start voting
//     }

//     #[public]
//     #[initializer]
//     // annotation to mark function as a constructor
//     fn constructor(admin: AztecAddress) {
//         storage.admin.write(admin);
//         storage.vote_ended.write(false);
//         storage.active_at_block.initialize(context.block_number() as u32);
//     }

//     #[private]
//     // annotation to mark function as private and expose private context
//     fn cast_vote(candidate: Field) {
//         let msg_sender_npk_m_hash = get_public_keys(context.msg_sender()).npk_m.hash();

//         let secret = context.request_nsk_app(msg_sender_npk_m_hash); // get secret key of caller of function
//         let nullifier = std::hash::pedersen_hash([context.msg_sender().to_field(), secret]); // derive nullifier from sender and secret
//         context.push_nullifier(nullifier);
//         EasyPrivateVoting::at(context.this_address()).add_to_tally_public(candidate).enqueue(
//             &mut context,
//         );
//     }

//     #[public]
//     #[internal]
//     fn add_to_tally_public(candidate: Field) {
//         assert(storage.vote_ended.read() == false, "Vote has ended"); // assert that vote has not ended
//         let new_tally = storage.tally.at(candidate).read() + 1;
//         storage.tally.at(candidate).write(new_tally);
//     }

//     #[public]
//     fn end_vote() {
//         assert(storage.admin.read().eq(context.msg_sender()), "Only admin can end votes"); // assert that caller is admin
//         storage.vote_ended.write(true);
//     }
//     #[utility]
//     unconstrained fn get_vote(candidate: Field) -> Field {
//         storage.tally.at(candidate).read()
//     }
// }

// ============================================================================

// use dep::aztec::macros::aztec;


// #[aztec]
// pub contract VerifyJWT {
//     use dep::aztec::macros::functions;
//     use aztec::macros::{functions::{initializer, private, public, utility}, storage::storage};
//     #[public]
//     pub fn hello_world() -> pub Field {
//         42
//     }
// }


// use jwt::JWT;
// global MAX_DATA_LENGTH: u32 = 900;
global MAX_JWT_PAYLOAD_LENGTH: u32 = 900;


use dep::aztec::macros::aztec;
use dep::std::hash::sha256;

 // Store known public key and exponent for Google (as strings)
GOOGLE_PUB_KEY = "sSSDYs52SUnYehxOV-G_eQ47SmM8m9ubTUU0K24LpNHk7j4ICM-PreBi_npBfxy7kAoBr5KS_Dp2FAR32ji7ey42JtzE-xrkzAI1FmbL5VmxR2D3JtK4S9Kytd5d8xcNdsBdAHEmoQyjjAafLBnx-HwGJe0C7G3VJZXOu4-kKVv4rqwln-PuMlwFz9DNr4uBUgvtqmBPSXdAjRskbMJCo4eWrRXczQerd5noQAQoZmRNFS18FccDct4efuT49pH7BAhy5YHfAFv8vMgCpRhqd2VADYJfBVlJ8wKMCC-8yzckLj9V2UQZSOmJ3IoBovnF02EN0uL0bYMunVvm0YWPrQ";
GOOGLE_EXP = "AQAB";


#[aztec]
pub contract VerifyJWT {
    #[storage]
    struct Storage<Context> {
        jwt_payload: String<MAX_JWT_PAYLOAD_LENGTH>,
        jwt_payload_hash: Field,
        jwt_sig: Array<u8, 256>,
    }

    #[public]
    #[initializer]
    fn constructor(
        jwt_payload: String<MAX_JWT_PAYLOAD_LENGTH>,
        jwt_sig: Array<u8, 256>,
        jwt_payload_hash: Field,
    ) {
       
        // Initialize state
        storage.jwt_payload = jwt_payload;
        storage.jwt_sig = jwt_sig;
        storage.jwt_payload_hash = jwt_payload_hash;
        assert()
    }

    #[private]
    fn is_valid_jwt() -> bool {
        is_valid_hash() && is_valid_google_sig()
    }

    #[private]
    fn is_valid_hash() -> bool {
        // Evaluate SHA256 hash of the stored payload string (as per JWT validation)
        let payload_bytes = storage.jwt_payload.to_bytes();
        let evaluated_hash: Field = sha256(payload_bytes);
        storage.jwt_payload_hash == evaluated_hash
    }

    #[private]
    fn is_valid_google_sig() -> bool {
        // Verify JWT signature using the public key and exponent
        JWT::verify_signature(
            storage.jwt_payload.to_bytes(),
            storage.jwt_sig,
            storage.GOOGLE_PUB_KEY.to_bytes(),
            storage.GOOGLE_EXP.to_bytes(),
        )
    }
}

