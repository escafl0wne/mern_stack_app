import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function fetchCommunityThreads(id: string){
    try {
        connectToDB();
    
        const communityPosts = await Community.findById(id).populate({
          path: "threads",
          model: Thread,
          populate: [
            {
              path: "author",
              model: User,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
            {
              path: "children",
              model: Thread,
              populate: {
                path: "author",
                model: User,
                select: "image _id", // Select the "name" and "_id" fields from the "User" model
              },
            },
          ],
        });
    
        return communityPosts;
      } catch (error) {
        // Handle any errors
        console.error("Error fetching community posts:", error);
        throw error;
      }
}