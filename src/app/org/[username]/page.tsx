import {Account} from "@/componets/account";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <Account username={username} />;
}

export default Page;