package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import java.util.List;

public interface RoomService {
    RoomDto create(RoomDto dto);
    RoomDto getById(Long id);
    List<RoomDto> getAll();
    RoomDto update(Long id, RoomDto dto);
    void delete(Long id);
}
