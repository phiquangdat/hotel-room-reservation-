package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;
import java.util.LocalDate;
import java.util.List;

public interface PublicRoomService {
    List<RoomSearchResultDto> findAvailableRooms(
        String city;
        LocalDate checkInDate;
        LocalDate checkOutDate;
        Integer guestCapacity;
    );
}
