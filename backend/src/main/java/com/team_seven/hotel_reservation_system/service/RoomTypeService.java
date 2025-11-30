package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RoomTypeDto;
import com.team_seven.hotel_reservation_system.models.RoomType;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.repositories.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    public List<RoomTypeDto> getAll() {
        return roomTypeRepository.findAll().stream()
            .map(rt -> {
                Hotel hotel = rt.getHotel();
                hotel.getName(); 
                return toDto(rt);
            })
            .collect(Collectors.toList());
    }

    private RoomTypeDto toDto(RoomType rt) {
        if (rt == null) return null;

        return RoomTypeDto.builder()
                .id(rt.getId())
                .name(rt.getName())
                .imageUrl(rt.getImageUrl())
                .description(rt.getDescription())
                .pricePerNight(rt.getPricePerNight())
                .capacity(rt.getCapacity())
                .hotelId(rt.getHotel().getId())
                .hotelName(rt.getHotel().getName())
                .build();
    }
}
