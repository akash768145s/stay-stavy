'use client'
import * as z from 'zod';
import { Hotel, Room } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast, useToast } from '../ui/use-toast';
import { Loader2, Pencil, PencilLine, XCircle } from 'lucide-react';
import { UploadButton } from '../uploadthing';
import { useRouter } from 'next/navigation';



interface AddRoomFormProps{
    hotel?:Hotel&{
        rooms:Room[]
    }
    room?:Room
    handleDialogueOpen:()=>void
}


const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be atleast 3 characters long'
    }),
    description: z.string().min(10, {
        message: 'Description must be atleast 10 characters long'
    }),
    bedCount: z.coerce.number().min(1, { message: 'Bed Count is Required' }),
    guestCount: z.coerce.number().min(1, { message: 'Guest Count is Required' }),
    bathroomCount: z.coerce.number().min(1, { message: 'Bathroom Count is Required' }),
    kingBed: z.coerce.number().min(0),
    queenBed: z.coerce.number().min(0),
    image: z.string().min(1, {
        message: 'Image is Required'
    }),
    breakFastPrice: z.coerce.number().optional(),
    zoomPrice: z.coerce.number().min(1, {
        message: 'Room Price Is Required'
    }),
    roomService: z.boolean().optional(),
    tv: z.boolean().optional(),
    balcony: z.boolean().optional(),
    freeWifi: z.boolean().optional(),
    cityView: z.boolean().optional(),
    oceanView: z.boolean().optional(),
    forestView: z.boolean().optional(),
    mountainView: z.boolean().optional(),
    airCondition: z.boolean().optional(),
    soundProofed: z.boolean().optional(),
})
const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
    const [image, setImage] = useState<string | undefined>(room?.image)
    const [imageIsDeleting, setImageIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router =useRouter()


    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: room || {
            title: '',
            description: '',
            bedCount: 0,
            guestCount: 0,
            bathroomCount: 0,
            kingBed: 0,
            queenBed: 0,
            image: '',
            breakFastPrice: 0,
            zoomPrice: 0,
            roomService: false,
            tv: false,
            balcony: false,
            freeWifi: false,
            cityView: false,
            oceanView: false,
            forestView: false,
            mountainView: false,
            airCondition: false,
            soundProofed: false,
        },
    })

    useEffect(()=>{
        if(typeof image ==='string'){
            form.setValue('image',image,{
                shouldDirty:true,
                shouldTouch:true,
                shouldValidate:true,
            })
        }
    },[image])

    const handleImageDelete = (image: string) => {
        setImageIsDeleting(true)
        const imageKey = image.substring(image.lastIndexOf('/') + 1)
        axios.post('/api/uploadthing/delete', { imageKey }).then((res) => {
            if (res.data.success) {
                setImage('');
                toast({
                    variant: 'success',
                    description: 'Image Removed'
                })
            }

        }).catch(() => {
            toast({
                variant: 'destructive',
                description: 'Something went wrong'
            })
        }).finally(() => {
            setImageIsDeleting(false);
        })
    }


    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        if (hotel && room) {
            axios.patch(`/api/room/${room.id}`, values).then((res) => {
                toast({
                    variant: "success",
                    description: "💥Room Updated!"
                })
                router.refresh()
                setIsLoading(false)
                handleDialogueOpen()
            }).catch((err) => {
                console.log(err)
                toast({
                    variant: "destructive",
                    description: "Something Went Wrong!"
                })
                setIsLoading(false)
            })
        } else {
            if(!hotel) return;
            axios.post('/api/room', {...values,hotelId:hotel.id}).then((res) => {
                toast({
                    variant: "success",
                    description: "💥Room Created!"
                })
                router.refresh()
                setIsLoading(false)
                handleDialogueOpen()
            }).catch((err) => {
                console.log(err)
                toast({
                    variant: "destructive",
                    description: "Something Went Wrong!"
                })
                setIsLoading(false)
            })
        }
    }
    return (<div className='max-h-[75vh] overflow-y-auto px-2'>
        <Form {...form}>
            <form className='space-y-6'>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Room Title *</FormLabel>
                            <FormDescription>
                                Provide a Room name
                            </FormDescription>
                            <FormControl>
                                <Input placeholder="Double Room" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Room Description *</FormLabel>
                            <FormDescription>
                                Is there anything special about this room?
                            </FormDescription>
                            <FormControl>
                                <Textarea placeholder="Have a beautiful view of the ocean while in this room!" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <FormLabel>Choose Room Amenities</FormLabel>
                    <FormDescription>What Makes this Room a Good Choice?</FormDescription>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <FormField
                            control={form.control}
                            name="roomService"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>24 hrs Room Services</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tv"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>TV</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="balcony"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Balcony</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="freeWifi"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Free Wifi</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cityView"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>CityView</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="oceanView"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>OceanView</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mountainView"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>MountainView</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="forestView"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>ForestView</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="airCondition"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Air Conditioned</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="soundProofed"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Sound Proofed</FormLabel>
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className='flex flex-col space-y-3'>
                            <FormLabel>Upload An Image *</FormLabel>
                            <FormDescription>Choose an image that will show-case your room nicely</FormDescription>
                            <FormControl>
                                {image ? <>
                                    <div className='relative max-w-[400px] min-w-[200px] max-h-[400px] mt-4 '>
                                        <Image fill src={image} alt='Hotel Image' className="object-contain" />
                                        <Button onClick={() => handleImageDelete(image)} type='button' size='icon'
                                            variant='ghost' className='absolute right-[-12px] top-0'>
                                            {imageIsDeleting ? <Loader2 /> : <XCircle />}
                                        </Button>
                                    </div>
                                </> : <>
                                    <div className='flex flex-col items-center max-w[400px] p-12 border-2 border-dashed
                                            border-primary/50 rounded mt-4'>
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                console.log("Files: ", res);
                                                setImage(res[0].url)
                                                toast({
                                                    variant: "success",
                                                    description: '🎉 Upload Completed'
                                                })
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast({
                                                    variant: "destructive",
                                                    description: `ERROR!${error.message}`
                                                })
                                            }}
                                        />
                                    </div>
                                </>}
                            </FormControl>
                        </FormItem>
                    )}
                />
                
                <div className='flex flex-row gap-6'>
                <div className='flex-1 flex flex-col gap-6'>
                    <FormField
                            control={form.control}
                            name="zoomPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Price in INR*</FormLabel>
                                    <FormDescription>
                                        State the price for staying in this room for 24hrs.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bed Count*</FormLabel>
                                    <FormDescription>
                                        How many bed are available in this room.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} max={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="guestCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guest Count*</FormLabel>
                                    <FormDescription>
                                        How many guests are allowed in this room.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} max={20} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathroomCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathroom Count*</FormLabel>
                                    <FormDescription>
                                        How many BathRooms are in this room.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} max={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1 flex flex-col gap-6'>
                        <FormField
                            control={form.control}
                            name="breakFastPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BreakFast Price in INR</FormLabel>
                                    <FormDescription>
                                        State the price for staying in this room for 24hrs.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kingBed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>King Beds</FormLabel>
                                    <FormDescription>
                                        How many king beds are available in this room.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} max={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="queenBed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>QueenBeds</FormLabel>
                                    <FormDescription>
                                        How many queenbeds are allowed in this room.
                                    </FormDescription>
                                    <FormControl>
                                        <Input type='number' min={0} max={20} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>   
                </div>
                <div className='pt-4 pb-2'>
                {room ? <Button onClick={form.handleSubmit(onSubmit)} type='button' className='max-w-[150px]' disabled={isLoading}>{isLoading ? <>
                <Loader2 className='mr-2 h-4 w-4' />Updating</> : <><PencilLine className='mr-2 h-4 w-4' />Update</>}</Button> : <Button
                                onClick={form.handleSubmit(onSubmit)} type='button' className='max-w-[150px]' disabled={isLoading}>
                                {isLoading ? <><Loader2 className='mr-2 h-2 w-4' />Creating</> : <><Pencil className="mr-2 h-4 w-4" />Create Room</>}
                            </Button>}

                </div>

            </form>
        </Form>

    </div>);
}

export default AddRoomForm;