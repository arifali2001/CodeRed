import { fetchUser, getActivity } from "@/lib/actions/user.actions";

import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //getting activities of current user
  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activities</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile Pic"
                    width={20}
                    height={20}
                    className="rounded-full object-contain"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 font-mono text-base-regular text-red-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your mate
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-slate-300 ">No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
