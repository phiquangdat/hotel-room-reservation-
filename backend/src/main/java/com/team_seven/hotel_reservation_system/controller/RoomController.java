package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import com.team_seven.hotel_reservation_system.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<RoomDto> create(@RequestBody RoomDto dto) {
        RoomDto created = roomService.create(dto);
        return ResponseEntity.created(URI.create("/api/rooms/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getById(@PathVariable Long id) {
        RoomDto dto = roomService.getById(id);
        return dto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }

    @GetMapping
    public List<RoomDto> getAll() {
        return roomService.getAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDto> update(@PathVariable Long id, @RequestBody RoomDto dto) {
        RoomDto updated = roomService.update(id, dto);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
