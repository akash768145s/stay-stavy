import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"

export const getBookingsByUserId=async()=>{
    try{
        const {userId}=auth()

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings=await prismadb.booking.findMany({
            where:{
                hotelOwnerId:userId
            },
            include:{
                Room:true,
                Hotel:true
            },
            orderBy:{
                bookedAt:'desc'
            }
        })
    } catch(error:any){
        console.log(error);
        throw new Error(error)
    }
}