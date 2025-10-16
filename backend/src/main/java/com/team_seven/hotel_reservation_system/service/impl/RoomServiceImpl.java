package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.service.RoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    private RoomDto toDto(Room r) {
        if (r == null) return null;
        return new RoomDto(r.getId(), r.getNumber(), r.getType(), r.getPrice(), r.getAvailable());
    }

    private Room toEntity(RoomDto d) {
        if (d == null) return null;
        return Room.builder()
                .id(d.getId())
                .number(d.getNumber())
                .type(d.getType())
                .price(d.getPrice())
                .available(d.getAvailable())
                .build();
    }

    @Override
    public RoomDto create(RoomDto dto) {
        Room saved = roomRepository.save(toEntity(dto));
        return toDto(saved);
    }

    @Override
    public RoomDto getById(Long id) {
        return roomRepository.findById(id).map(this::toDto).orElse(null);
    }

    @Override
    public List<RoomDto> getAll() {
        return roomRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public RoomDto update(Long id, RoomDto dto) {
        return roomRepository.findById(id).map(r -> {
            r.setNumber(dto.getNumber());
            r.setType(dto.getType());
            r.setPrice(dto.getPrice());
            r.setAvailable(dto.getAvailable());
            return toDto(roomRepository.save(r));
        }).orElse(null);
    }

    @Override
    public void delete(Long id) {
        roomRepository.deleteById(id);
    }
}
