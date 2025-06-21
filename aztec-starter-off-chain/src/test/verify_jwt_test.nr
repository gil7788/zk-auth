use crate::verify_jwt;
use dep::aztec::test::helpers::test_environment::TestEnvironment;

#[test]
unconstrained fn test_hello_world() {
    let mut env = TestEnvironment::new();
    let deployer = env.create_account(1);

    let init_interface = verify_jwt::interface();
    let contract = env.deploy_self("verify_jwt").with_public_initializer(deployer, init_interface);

    unsafe {
        let result = contract.hello_world();
        assert(result == 43, "hello_world() should return 42");
    }
}
