type IdentityInfoProps = {
  providerKey: string;
  user: any;
  token: string;
};

export function IdentityInfo({ providerKey, user, token }: IdentityInfoProps) {
  console.log(`${providerKey} user:`, JSON.stringify(user, null, 2));
  console.log(`${providerKey} token:`, token);

  const label = providerKey === 'discord' ? 'Discord' : 'Google';

  return (
    <div className="mt-2 text-left text-sm text-gray-600">
      <p><strong>{label} Email:</strong> {user.email}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Token (access):</strong> {token}</p>
    </div>
  );
}
