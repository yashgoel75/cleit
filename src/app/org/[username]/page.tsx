import Account from "./account";

export default function Page({ params }: { params: { username: string } }) {
  return <Account username={params.username} />;
}
