import factory from "../ethereum/factory";

export default async function Home() {
  const campaigns = await factory.methods.getCampaigns().call();

  if (!campaigns || campaigns.length === 0) {
    return <div>No campaigns found</div>;
  }

  return (
    <div>
      {campaigns.map((address: string) => {
        return <div>{address}</div>;
      })}
    </div>
  );
}
