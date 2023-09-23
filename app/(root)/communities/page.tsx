import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchCommunities } from "@/lib/actions/community.actions";
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

  //fetching existing communities
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>
      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>
      <div className="mt-14 flex flex-col gap-9">
        {result.communities.map((community) => (
          <CommunityCard
            key={community.id}
            id={community.id}
            name={community.name}
            username={community.username}
            imgUrl={community.image}
            bio={community.bio}
            members={community.members}
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
