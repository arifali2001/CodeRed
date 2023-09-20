"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating mate: ${error.message}`);
  }
}
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();
  //calculating the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;
  // Only Parent Mate fetching
  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;
  return { posts, isNext };
}
export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    //Todo: Populate Community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching Mate: ${error.message}`);
  }
}
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Mate not found");
    }
    //creating new mate in the comment
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    //saving the new mate
    const savedCommentThread = await commentThread.save();

    //updating the parent mate to include the new comment
    originalThread.children.push(savedCommentThread._id);
    //saving the original mate
    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to mate: ${error.message}`);
  }
}
