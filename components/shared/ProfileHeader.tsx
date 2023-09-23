import Image from "next/image";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile Pic"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            {accountId == "user_2UrqsiTk5cnLCGTNxZILZXpSlYQ" ||
            accountId == "user_2VWW0KXaVpaF7JokveF2VpsHgpm" ? (
              <div className="flex flex-row items-center gap-3">
                <h2 className="flex-1 text-left font-mono text-heading3-bold text-light-1">
                  {name}{" "}
                </h2>
                <p className="flex-1 text-base-regular font-mono font-semibold bg-red-500 rounded-xl px-2 text-slate-900">
                  Dev{" "}
                </p>
                <span className="flex-1 text-base-regular px-3 bg-blue text-white rounded-full">
                  ✔
                </span>
              </div>
            ) : (
              <h2 className="text-left text-heading3-bold text-light-1">
                {name}
              </h2>
            )}
            <p className="text-base-medium font-sans text-gray-1">
              @{username}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-2 h-0.5 w-full bg-dark-3" />
    </div>
  );
};
export default ProfileHeader;
