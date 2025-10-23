package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.service.PublicRoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicRoomServiceImpl implements PublicRoomService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public PublicRoomServiceImpl(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public List<RoomDto> searchRooms(String city, int guests) {
        List<Hotel> hotelsInCity = hotelRepository.findAll()
                .stream()
                .filter(h -> h.getCity() != null && h.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());

        List<Room> allRooms = roomRepository.findAll();

        List<Room> filtered = allRooms.stream()
                .filter(Room::getAvailable)
                .collect(Collectors.toList());


        return filtered.stream()
                .map(r -> new RoomDto(
                        r.getId(),
                        r.getNumber(),
                        r.getType(),
                        r.getPrice(),
                        r.getAvailable()
                ))
                .collect(Collectors.toList());
    }
}