"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {FileUpload} from "@/components/file-upload"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required!"
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required!"
    })
});


export const CreateServerModal = () => {
    
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "createServer";
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error){
            console.log(error);
        }
    }

    const handleClosed = () => {
        form.reset();
        onClose();
    }

    return(
        <Dialog open={isModalOpen} onOpenChange={handleClosed}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Ustvari Strežnik
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Dodaj svojemu strežniku osebnost z imenom in sliko. To lahko vedno kasneje spremeniš.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        <FileUpload endpoint="serverImage" onChange={field.onChange}></FileUpload>
                                        </FormControl>
                                    </FormItem>
                                )}></FormField>
                            </div>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Ime strežnika
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Vnesi ime strežnika" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Ustvari
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}