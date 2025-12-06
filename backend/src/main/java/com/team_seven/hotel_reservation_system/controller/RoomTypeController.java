package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RoomTypeDto;
import com.team_seven.hotel_reservation_system.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@CrossOrigin(origins = "*")
public class RoomTypeController {
    private final RoomTypeService roomTypeService;

    public RoomTypeController(RoomTypeService roomTypeService){
        this.roomTypeService = roomTypeService;
    }

    @GetMapping
    public List<RoomTypeDto> getAllRoomTypes() {
        return roomTypeService.getAll();
    }
    @GetMapping("/{id}")
    public RoomTypeDto getRoomTypeById(@PathVariable Long id) {
        return roomTypeService.getById(id);
    }

    @PostMapping
    public RoomTypeDto createRoomType(@RequestBody RoomTypeDto roomTypeDto) {
        return roomTypeService.create(roomTypeDto);
    }

    @PutMapping("/{id}")
    public RoomTypeDto updateRoomType(@PathVariable Long id, @RequestBody RoomTypeDto roomTypeDto) {
        return roomTypeService.update(id, roomTypeDto);
    }

    @DeleteMapping("/{id}")
    public void deleteRoomType(@PathVariable Long id) {
        roomTypeService.delete(id);
    }
}
