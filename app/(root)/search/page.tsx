import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //Fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType='search' />
      <div className="mt-34 flex flex-col gap-9">
        {result.users.length === 0 ? (<p className="no-result">No users</p>):(
            <>
            {result.users.map((user) => (
              <UserCard key={user.id} id={user.id} name={user.name} username={user.username} imgUrl={user.image} personType="User"  />
            ))}
            
            </>
        )}
      </div>
    </section>
  );
}
