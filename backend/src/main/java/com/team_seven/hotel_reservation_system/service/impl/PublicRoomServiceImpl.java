package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomTypeRepository;
import com.team_seven.hotel_reservation_system.service.PublicRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicRoomServiceImpl implements PublicRoomService {
        @Autowired
        private RoomTypeRepository roomTypeRepository;

        @Override
        public List<RoomSearchResultDto> findAvailableRooms(String city,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int guestCapacity){
                return roomTypeRepository.findAvailableRoomTypes(
                        city,
                        checkInDate,
                        checkOutDate,
                        guestCapacity
                );
        }
}
