"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, use, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname,useRouter } from "next/navigation";
export type TUserProps = {
  userId: string;
  objectId:object | undefined,
  username: string | null;
  name: string;
  bio: string;
  image: string;
  path?: string;
  email:string
};

type TAccountProfileProps = {
  btnTitle: string;
  user: TUserProps
};

export default function AccountProfile({
  user,
  btnTitle,
}: TAccountProfileProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      bio: user?.bio || "",
      username: user?.username || "",
    },
  });
  const router = useRouter();
  const pathname = usePathname();

  function handleImage(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    const hasImageChanged = isBase64Image(values.profile_photo);
    if (hasImageChanged) {
      const imgResponse = await startUpload(files);
      if (imgResponse && imgResponse[0].url) {
        values.profile_photo = imgResponse[0].url;
      }
    }
    try {
      
      await updateUser({
        userId: user.userId,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
        email:user.email,
       
      });
  
      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("error",error)
    }
   
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="profile_photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Image
                      src="./assets/profile.svg"
                      alt="profile_photo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    placeholder="Upload a photo"
                    type="file"
                    accept="image/*"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            {btnTitle}
          </Button>
        </form>
      </Form>
    </div>
  );
}
