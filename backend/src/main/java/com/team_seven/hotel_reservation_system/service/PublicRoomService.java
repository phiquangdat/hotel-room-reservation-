package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import java.util.List;

public interface PublicRoomService {
    List<RoomDto> searchRooms(String city, int guests);
}