import { getBookingsByUserId } from "@/actions/getBookingsByUserId"
import { getBookingsByHotelOwnerId } from "@/actions/getHotelsByHotelOwnerId"

const MyBookings = async () => {
    const bookingsFromVisitors = await getBookingsByHotelOwnerId()
    const bookingsIHaveMade = await getBookingsByUserId()
    return (
        <div className="flex flex-col gap-10">
            {!!bookingsIHaveMade?.length && <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">Here are bookings you have made</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {booking}

                </div>
            </div>}
        </div>);
}

export default MyBookings;
