import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function Page() {
  const user = await currentUser();
 
  if (!user) return redirect("/sign-in");
  try {
   
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect("/onboarding");
    
    return (
      <>
        <h1 className='head-text'>Create Thread</h1>
        <PostThread userId={userInfo?._id.toString()}/>
      </>
    );
  } catch (error) {
    console.log(error)
    return <h1> somethng went wrong</h1>;
  }
}
