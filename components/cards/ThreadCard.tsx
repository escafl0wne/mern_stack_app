import Image from "next/image";
import Link from "next/link";

export type TAuthor = {
  name: string;
  image: string;
  id: string;
};
export type TCommunity = TAuthor;
type TPostThreadProps = {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: TAuthor;
  community: TCommunity | null;
  createdAt: string;
  children: {
    author: TAuthor["image"];
  }[];
  isComment?: boolean;
};

export default function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  children,
  isComment,
}: TPostThreadProps) {
  return (
    <article className={`flex w-full flex-col rounded- ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
      <div className="flex itmes-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col itmes-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={`${author.image}`}
                alt="Profile Image"
                fill
                className="cursor-pointer"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2"> {content}</p>
            <div className="flex mt-5 flex-col gap-3">
              <div className="flex gap-3.5 ">
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/heart-gray.svg"
                    alt="heart"
                    height={24}
                    width={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  height={24}
                  width={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {children?.length >0 && (
                <Link href={`/thread/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                        {children.length} replies
                    </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
