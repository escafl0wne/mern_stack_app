import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";


async function Page() {
  const user: User | null = await currentUser();
  if (!user) return redirect("/sign-in"); // to avoid typescript warnings
 
  const userInfo = await fetchUser(user.id);
  
  if (userInfo?.onboarded) return redirect("/");
  
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
    email:user.emailAddresses[0].emailAddress
  };

  return (
    <main className="mx-auto flex max-w-3x1 flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Compplete your profile now to continue wuth threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
