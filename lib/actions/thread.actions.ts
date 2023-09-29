"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

type ThreadProps = {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
};

export async function createThread({
  text,
  author,
  communityId,
  path,
}: ThreadProps) {
  //connect to the database

  connectToDB();
  try {
    //create a new thread

    const thread = await Thread.create({
      text,
      author,
      community: communityId,
    });
    console.log("Thread has been created");
    //Update user model with the thread
    await User.findByIdAndUpdate(author, { $push: { threads: thread._id } });

    revalidatePath(path);
  } catch (err: any) {
    console.log(err);
    throw new Error("Error while creating a thread", { cause: err });
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  //calculate the number of pages
  const skipPages = (pageNumber - 1) * pageSize;

  //Fetch threads with no parents
  const threadsQuery = Thread.find({ parentId: null })
    .sort({ createdAt: "desc" })
    .skip(skipPages)
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
  //Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalThreadsCount = await Thread.countDocuments({ parentId: null });

  //Run the query
  const threads = await threadsQuery.exec();

  //Calculate the next page
  const isNext = totalThreadsCount > skipPages + threads.length;
  return { threads, isNext };
}
export async function fetchThreadById(id: string) {
  connectToDB();

  try {
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
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id name parentId image",
            },
          },
        ],
      }).exec();
      return thread
  } catch (error:any) {
    throw new Error("Error while fetching thread", { cause: error });
  
  }
}

type TCommentProps = {
  

}
export async function addCommentToThread(threadId:string,
  commentText:string,
  currentUserId:string,
  pathname:string){
  connectToDB();
  try {
    //adding a comment to a thread
    //Find the original thread by its id

    const orThread = await Thread.findById(threadId);
   
    if(!orThread) throw new Error("Thread not found");
    //Create a new comment
    const newThreadComment = new Thread({
      text:commentText,
      author:currentUserId,
      parentId:threadId
    })
    console.log({newThreadComment},{currentUserId})
    //save the new thread
    const savedThread = await newThreadComment.save()

    orThread.children.push(savedThread._id)

    //save the original thread with the new comment thread
    await orThread.save()

    revalidatePath(pathname)
  
  }
   catch (error) {
    console.log(error)
    throw new Error("Error while adding comment to thread", { cause: error });
   }
}