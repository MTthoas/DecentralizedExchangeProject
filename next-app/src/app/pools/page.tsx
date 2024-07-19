"use client";
import Layout from "@/components/liquidityPool/Layout";
import { getPools } from "@/hook/pools.hook";
import { getTokens } from "@/hook/tokens.hook";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  // Connect pools in to doo to display in the UI

  const { data: tokens } = useQuery({
    queryKey: ["tokens"],
    queryFn: getTokens,
  });

  // Use tanstack/react-query to fetch data from the server
  const { data: pools } = useQuery({
    queryKey: ["pools"],
    queryFn: getPools,
  });

  console.log(pools);

  return (
    <div className="w-screen mb-20">
      <Layout tokens />
    </div>
  );
}
