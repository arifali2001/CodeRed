import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import {
  fetchUser,
  fetchUserPosts,
  fetchUsers,
} from "@/lib/actions/user.actions";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";

import { profile } from "console";
import Image from "next/image";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //fetching users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <Searchbar routeType="search" />
      <div className="mt-14 flex flex-col gap-9">
        {result.users.map((person) => (
          <UserCard
            key={person.id}
            id={person.id}
            name={person.name}
            username={person.username}
            imgUrl={person.image}
            personType="User"
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
