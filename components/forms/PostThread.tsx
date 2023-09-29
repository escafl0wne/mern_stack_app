"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from "@/lib/validations/thread";
import * as z from "zod";

import { Textarea } from "../ui/textarea";

import { usePathname, useRouter } from "next/navigation";
import {createThread} from "@/lib/actions/thread.actions";

// type TAccountProfileProps = {
//   btnTitle: string;
//   user: {
//     id: string;
//     objectId: string;
//     username: string;
//     name: string;
//     bio: string;
//     image: string;
//   };
// };

export default function PostThread({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

   const onSubmit =async (values:z.infer<typeof ThreadValidation>)=>{

    try {
      
      await createThread({text: values.thread, author:userId,communityId:null,path:pathname})

    ;
    router.push("/")
    } catch (error:any) {
      console.log(error)
      throw new Error(`Error while creating a thread`, { cause: error });
    }
    
  
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
         <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea
                   rows={15}
                   {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    <Button  className="bg-primary-500"  type="submit">
                Post Thread

    </Button>
      </form>
    </Form>
  );
}
