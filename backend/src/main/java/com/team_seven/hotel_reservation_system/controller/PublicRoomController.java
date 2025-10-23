package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import com.team_seven.hotel_reservation_system.service.PublicRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/rooms")
@CrossOrigin(origins = "*")
public class PublicRoomController {

    @Autowired
    private PublicRoomService publicRoomService;

    // GET /api/public/rooms/search?city=Vaasa&checkIn=2025-10-16&checkOut=2025-10-31&guests=2
    @GetMapping("/search")
    public List<RoomDto> searchRooms(
            @RequestParam String city,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam int guests
    ) {
        return publicRoomService.searchRooms(city, guests);
    }
}