import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { isSet } from "util/types";

export const initialProfile = async () => {
    const user = await currentUser();

    if(!user){
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if(profile) return profile;

    return(
        await db.profile.create({
            data: {
                userId: user.id,
                imageUrl: user.imageUrl,
                email: (user.emailAddresses[0])?(user.emailAddresses[0].emailAddress):null,
                username: `${user.username}`
            }
        })
    );
}