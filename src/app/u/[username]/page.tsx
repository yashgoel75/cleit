export default function UserPage({ params }: { params: { username: string } }) {
  const { username } = params;

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, @{username}!</h1>
      <p>This is your profile page.</p>
    </div>
  );
}
