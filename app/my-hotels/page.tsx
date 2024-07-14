import { getHotelByUserId } from "@/actions/getHotelsByUserId"
import HotelList from "@/components/hotel/HotelList"

const MyHotels = async() => {
    const hotels=await getHotelByUserId()
    if(!hotels) return <div>No Hotels Found!</div>

    return (
        <div>
            <h2 className="text-2x1 font-semibold">Here are your Properties</h2>
            <HotelList hotels={hotels}/>
        </div>
    )
}

export default MyHotels
