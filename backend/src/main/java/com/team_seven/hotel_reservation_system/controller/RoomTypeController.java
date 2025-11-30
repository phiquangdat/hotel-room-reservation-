package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RoomTypeDto;
import com.team_seven.hotel_reservation_system.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping
    public List<RoomTypeDto> getAllRoomTypes() {
        return roomTypeService.getAll();
    }
}
