
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function Home() {
  const result = await fetchThreads(1,30)
  const user = await currentUser();
  
  if (!user) return null;
  const mongoUser = await fetchUser(user.id);
  if(!mongoUser)return redirect("/onboarding")
  return (
    <div>
      <h1 className="head-text text-left">Home Page</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length > 0 ? result.threads.map((thread) => (
          <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                children={thread.children}
              />
        )): <p className="no-result">No threads found</p>}

      </section>
    </div>
  );
}
