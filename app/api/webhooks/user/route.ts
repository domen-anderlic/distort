import { db } from "@/lib/db";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";


type EventType = "user.updated" | "user.deleted";

type Event = {
    data: Record<string, string | number>;
    type: EventType;
    object: "event";
};

async function handler(request: Request)
{
    const payload = await request.json();
    const headersList = headers();
    const heads = {
        "svix-id": headersList.get("svix-id"),
        "svix-signature": headersList.get("svix-signature"),
        "svix-timestamp": headersList.get("svix-timestamp"),
    }
    const wh = new Webhook(process.env.WEBHOOK_SECRET || "");
    let evt: Event | null = null;
    try {
        evt = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Invalid Signature"}, {status: 401})
    }
    
    const eventType : EventType = evt.type;


    if(eventType === "user.updated")
    {
        const { id, image_url, username, email_addresses} = evt.data;
        await db.profile.update({
            where: {
                userId: `${id}`
            },
            data: {
                imageUrl: `${image_url}`,
                username: `${username}`,
                email: (email_addresses as unknown as { email_address: string }[])[0]?.email_address || null
            }
        });
    }
    else if(eventType === "user.deleted")
    {
        const {id} = evt.data;
        await db.profile.delete({
            where:{
                userId: `${id}`
            }
        });
    }
    return NextResponse.json({success: true});
}   

export const GET = handler;
export const POST = handler;
export const PUT = handler;