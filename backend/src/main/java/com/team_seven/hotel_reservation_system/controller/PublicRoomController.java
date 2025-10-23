package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;
import com.team_seven.hotel_reservation_system.service.PublicRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/rooms")
public class PublicRoomController {

    @Autowired
    private PublicRoomService publicRoomService;

    @GetMapping("/search")
    public ResponseEntity<List<RoomSearchResultDto>> searchRooms(
        @RequestParam String city,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
        @RequestParam Integer guestCapacity
    ) {
        List<RoomSearchResultDto> rooms = publicRoomService.findAvailableRooms(
            city, checkInDate, checkOutDate, guestCapacity
        );

        return ResponseEntity.ok(rooms);
    }
}
