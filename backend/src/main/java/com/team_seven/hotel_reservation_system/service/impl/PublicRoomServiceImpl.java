package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.service.PublicRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicRoomServiceImpl implements PublicRoomService {
        @Autowired
        private RoomRepository roomRepository;

        @Override
        public List<RoomSearchResultDto> findAvailableRooms(String city;
        LocalDate checkInDate;
        LocalDate checkOutDate;
        Integer guestCapacity){
                List<Room> foundRooms = roomRepository.findAvailableRoomsByCityAndCapacity(
                        city.LowerCase(),
                        guestCapacity
                );

                return foundRooms.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        private RoomSearchResultDto mapToDto(Room room) {
                String imageUrl = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop"; 

                return new RoomSearchResultDto(
                        room.getId(),
                        imageUrl,
                        room.getRoomType().getHotel().getName(),
                        room.getRoomType().getName(),
                        room.getRoomType().getPricePerNight(),
                        room.getRoomType().getCapacity(),
                        room.getRoomNumber(),
                        room.getStatus()
                );
        }
}
