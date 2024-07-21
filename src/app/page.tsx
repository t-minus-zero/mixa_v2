import Link from "next/link";

import { LatestPost } from "MixaDev/app/_components/post";
import { LatestMix } from "MixaDev/app/_components/mix";
import { api, HydrateClient } from "MixaDev/trpc/server";
import {db} from '../server/db';

export const dynamic = "force-dynamic";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  const posts = await db.query.posts.findMany();
  
  console.log(posts);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Mixa Test App
          </h1>
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col gap-4">
              <Link href={`/mix/${post.id}`}>
                <h2 className="text-xl font-bold">{post.title}</h2>
              </Link>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          <LatestMix />
        </div>
      </main>
    </HydrateClient>
  );
}
