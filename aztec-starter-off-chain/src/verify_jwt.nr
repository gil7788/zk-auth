use dep::aztec::macros::aztec;


#[aztec]
pub contract VerifyJWT {
    use dep::aztec::macros::functions;
    use aztec::macros::{functions::{initializer, private, public, utility}, storage::storage};
    #[public]
    pub fn hello_world() -> pub Field {
        42
    }
}

